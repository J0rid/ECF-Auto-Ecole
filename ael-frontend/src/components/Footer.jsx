import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="main-footer">
      © 2025 Auto-École du Lycée — Tous droits réservés.&nbsp;&nbsp;
      <Link to="/mentions-legales">Mentions légales</Link>
      &nbsp;·&nbsp;
      <Link to="/aide">Aide</Link>
      &nbsp;·&nbsp;
      <Link to="/contact">Contact</Link>
      &nbsp;·&nbsp;v1.0
    </footer>
  )
}
