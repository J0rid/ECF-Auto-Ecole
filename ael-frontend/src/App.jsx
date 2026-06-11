import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Eleves from './pages/Eleves'
import FicheEleve from './pages/FicheEleve'
import Lecons from './pages/Lecons'
import Moniteurs from './pages/Moniteurs'
import Vehicules from './pages/Vehicules'
import Modeles from './pages/Modeles'
import MentionsLegales from './pages/MentionsLegales'
import Aide from './pages/Aide'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/aide" element={<Aide />} />
      <Route path="/contact" element={<Contact />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/eleves" element={<Eleves />} />
          <Route path="/eleves/:id" element={<FicheEleve />} />
          <Route path="/lecons" element={<Lecons />} />
          <Route path="/moniteurs" element={<Moniteurs />} />
          <Route path="/vehicules" element={<Vehicules />} />
          <Route path="/modeles" element={<Modeles />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
