export interface NavItem {
  to: string
  label: string
}

export const authNavItems = [
  { to: "/profile", label: "My profile" },
  { to: "/logout", label: "Sign out", isButton: true },
  { to: "/cart", label: "Cart" }
  // { to: "/orders", label: "My orders" },
]

export const guestNavItems = [
  { to: "/auth/login", label: "Sign in" },
  { to: "/auth/register", label: "Register" },
]
