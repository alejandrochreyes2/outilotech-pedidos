import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Inicio from './pages/Inicio';
import Experiencia from './pages/Experiencia';
import Habilidades from './pages/Habilidades';
import Contacto from './pages/Contacto';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Inicio />} />
        <Route path="/experiencia" element={<Experiencia />} />
        <Route path="/habilidades" element={<Habilidades />} />
        <Route path="/contacto" element={<Contacto />} />
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
