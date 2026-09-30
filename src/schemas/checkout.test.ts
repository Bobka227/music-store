import { describe, it, expect } from 'vitest'
import { checkoutSchema } from './checkout'

const valid = {
  name: 'Jan Novák',
  email: 'jan@example.com',
  phone: '+420 123 456 789',
  street: 'Studentská 95',
  city: 'Pardubice',
  zip: '532 10',
  delivery: 'courier',
  payment: 'card',
  note: '',
  consent: true,
}

describe('checkoutSchema', () => {
  it('přijme platná data', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true)
  })

  it.each([
    ['email', 'neplatny-email'],
    ['phone', '12345'],
    ['zip', '5321'],
    ['name', 'J'],
  ])('odmítne neplatné pole %s', (field, value) => {
    expect(checkoutSchema.safeParse({ ...valid, [field]: value }).success).toBe(false)
  })

  it('vyžaduje souhlas s podmínkami', () => {
    expect(checkoutSchema.safeParse({ ...valid, consent: false }).success).toBe(false)
  })

  it('ořízne mezery', () => {
    const result = checkoutSchema.parse({ ...valid, name: '  Jan Novák  ' })
    expect(result.name).toBe('Jan Novák')
  })
})