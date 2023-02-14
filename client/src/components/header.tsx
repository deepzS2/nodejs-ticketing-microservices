import Link from "next/link"

interface Props {
  currentUser: any
}

export default function Header({ currentUser }: Props) {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' }
  ].filter(linkConfig => linkConfig).map(({ label, href }) => (
    <li key={href}>
      <Link className="nav-link" href={href}>
        {label}
      </Link>
    </li>
  ))

  return <nav className="navbar navbar-light bg-light">
    <Link className="navbar-brand" href="/">
      GitTix
    </Link>

    <div className="d-flex justify-content-end">
      <ul className="nav d-flex align-items-center">
        {links}
      </ul>
    </div>
  </nav>
}

