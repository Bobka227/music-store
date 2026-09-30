import { NavLink, Outlet } from "react-router-dom";
import { useCartStore, getTotalCount } from "../store/cartStore";

const links = [
  { to: "/", label: "Domů" },
  { to: "/catalog", label: "Katalog" },
  { to: "/cart", label: "Košík" },
  { to: "/profile", label: "Profil" },
];

export default function Layout() {
  const count = useCartStore((s) => getTotalCount(s.items));

  return (
    <div className="min-h-screen">
      <header className="border-b p-4 flex gap-4">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              isActive ? "font-bold underline" : ""
            }
          >
            {l.label}
            {l.to === "/cart" && count > 0 && ` (${count})`}
          </NavLink>
        ))}
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
