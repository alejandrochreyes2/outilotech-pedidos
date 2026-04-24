import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Inicio from './pages/Inicio';
import Experiencia from './pages/Experiencia';
import Habilidades from './pages/Habilidades';
import Contacto from './pages/Contacto';
import Admin from './pages/Admin';
import Login from './pages/Login';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore - React Router v6 Routes does accept key but types might be outdated */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Inicio />} />
        <Route path="/experiencia" element={<Experiencia />} />
        <Route path="/habilidades" element={<Habilidades />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/mi-logincito-bonito" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
