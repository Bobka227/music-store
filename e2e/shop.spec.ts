import { test, expect } from '@playwright/test'

test('kompletní nákup: katalog → detail → košík → objednávka → profil', async ({ page }) => {
  // Katalog + vyhledávání
  await page.goto('/catalog')
  await page.getByLabel('Hledat').fill('Pacifica')
  await expect(page.getByText('Nalezeno: 1')).toBeVisible()

  // Detail produktu
  await page.getByRole('link', { name: /Pacifica/ }).click()
  await expect(page).toHaveURL(/\/product\/3/)
  await page.getByRole('button', { name: 'Do košíku' }).click()
  await expect(page.getByText('V košíku: 1 ks')).toBeVisible()

  // Košík
  await page.getByRole('link', { name: 'Košík (1)' }).click()
  await expect(page.getByRole('heading', { name: 'Košík' })).toBeVisible()
  await page.getByRole('link', { name: 'Pokračovat k objednávce' }).click()

  // Validace prázdného formuláře
  await page.getByRole('button', { name: 'Odeslat objednávku' }).click()
  await expect(page.getByText('Neplatný e-mail')).toBeVisible()
  await expect(page.getByText('Musíte souhlasit s podmínkami')).toBeVisible()

  // Vyplnění formuláře
  await page.getByLabel('Jméno a příjmení').fill('Jan Novák')
  await page.getByLabel('E-mail').fill('jan@example.com')
  await page.getByLabel('Telefon').fill('+420 123 456 789')
  await page.getByLabel('Ulice a číslo').fill('Studentská 95')
  await page.getByLabel('Město').fill('Pardubice')
  await page.getByLabel('PSČ').fill('532 10')
  await page.getByLabel('Souhlasím s obchodními podmínkami').check()
  await page.getByRole('button', { name: 'Odeslat objednávku' }).click()

  // Profil s objednávkou, košík prázdný
  await expect(page).toHaveURL('/profile')
  await expect(page.getByText(/1× Yamaha Pacifica 112V/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Košík', exact: true })).toBeVisible()
})

test('produkt mimo sklad nelze přidat do košíku', async ({ page }) => {
  await page.goto('/product/8')
  await expect(page.getByRole('button', { name: 'Není skladem' })).toBeDisabled()
})

test('neexistující stránka zobrazí 404', async ({ page }) => {
  await page.goto('/neexistuje')
  await expect(page.getByText('Stránka nenalezena')).toBeVisible()
})