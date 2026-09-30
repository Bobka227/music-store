import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Domů' },
  { to: '/catalog', label: 'Katalog' },
  { to: '/cart', label: 'Košík' },
  { to: '/profile', label: 'Profil' },
]

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4 flex gap-4">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => (isActive ? 'font-bold underline' : '')}
          >
            {l.label}
          </NavLink>
        ))}
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}