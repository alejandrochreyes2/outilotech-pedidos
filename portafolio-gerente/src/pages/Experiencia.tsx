import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Experiencia() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="bg-surface text-on-surface"
    >
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/70 backdrop-blur-md shadow-2xl shadow-black/20 flex items-center justify-between px-8 h-20 max-w-full mx-auto">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined text-blue-200 text-3xl">shield</span>
          <span className="font-['Space_Grotesk'] font-bold text-2xl uppercase tracking-tighter text-blue-100">Jhonnathan Hernández</span>
        </div>
        <nav className="hidden md:flex gap-12">
          <Link className="font-['Manrope'] font-medium text-lg transition-colors text-blue-300" to="/experiencia">Experiencia</Link>
          <Link className="font-['Manrope'] font-medium text-lg transition-colors text-slate-400 hover:text-blue-200" to="/habilidades">Habilidades</Link>
          <Link className="font-['Manrope'] font-medium text-lg transition-colors text-slate-400 hover:text-blue-200" to="/#proyectos">Proyectos</Link>
        </nav>
      </header>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-80 z-[60] py-8 flex-col bg-[#131b2e] shadow-2xl">
        <div className="px-8 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-highest cursor-pointer flex items-center justify-center" onClick={() => navigate('/')}>
              <img src="/foto-jhonnathan.PNG" alt="Jhonnathan" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-blue-100 text-xl font-bold">Jhonnathan Hernández</h2>
              <p className="font-['Manrope'] text-sm text-slate-400">Gerente OutilTech</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link className="flex items-center gap-4 py-4 text-blue-200 font-bold border-l-4 border-blue-400 pl-4 bg-blue-900/20 font-['Manrope'] text-lg" to="/experiencia">
              <span className="material-symbols-outlined">work</span>
              <span>Experiencia</span>
            </Link>
            <Link className="flex items-center gap-4 py-4 text-slate-400 pl-4 hover:text-white hover:bg-[#2d3449] transition-all font-['Manrope'] text-lg" to="/habilidades">
              <span className="material-symbols-outlined">bolt</span>
              <span>Habilidades</span>
            </Link>
            <Link className="flex items-center gap-4 py-4 text-slate-400 pl-4 hover:text-white hover:bg-[#2d3449] transition-all font-['Manrope'] text-lg" to="/#proyectos">
              <span className="material-symbols-outlined">layers</span>
              <span>Proyectos</span>
            </Link>
            <Link className="flex items-center gap-4 py-4 text-slate-400 pl-4 hover:text-white hover:bg-[#2d3449] transition-all font-['Manrope'] text-lg" to="/contacto">
              <span className="material-symbols-outlined">person</span>
              <span>Sobre Mí</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto px-8">
          <p className="text-xs text-slate-500 font-['Inter']">OutilTech · 2026</p>
        </div>
      </aside>

      <main className="lg:ml-80 pt-32 pb-20 px-8 md:px-16 max-w-[1400px]">
        <section className="mb-24">
          <h1 className="font-headline font-bold text-[5.6rem] leading-none tracking-tighter text-primary mb-8 md:ml-[10%]">
            Experiencia<span className="text-on-surface-variant">.</span>
          </h1>
          <p className="font-body text-[1.8rem] text-on-surface-variant max-w-[65ch] md:ml-[10%] leading-relaxed">
            Más de 20 años de trayectoria en diagnóstico electrónico, reparación especializada y gestión de empresas tecnológicas en Bogotá, Colombia.
          </p>
        </section>

        <section className="editorial-grid">

          {/* Entry 1: OutilTech Gerente */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 relative">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">2017 — Actualmente</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">OutilTech</h3>
                <span className="font-label text-xs text-slate-500 uppercase tracking-widest">Colombia · Bogotá</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Gerente & Propietario</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Dirección y gestión integral de <strong>OutilTech</strong>, empresa especializada en la comercialización de dispositivos tecnológicos de última generación en Bogotá.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Logros Clave</h4>
                      <ul className="space-y-3 font-body text-base text-on-surface-variant">
                        <li className="flex gap-3"><span className="text-primary">/</span> Fundación y consolidación de OutilTech en el mercado tecnológico de Bogotá.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Gestión de relaciones con proveedores nacionales e internacionales.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Supervisión de la plataforma e-commerce outiltech.co.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Atención al cliente personalizada y soporte postventa.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Gestión de inventario y logística de distribución.</li>
                      </ul>
                    </div>
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Áreas</h4>
                      <div className="flex flex-wrap gap-3">
                        {['Gestión Empresarial', 'E-Commerce', 'Logística', 'Atención al Cliente', 'Proveedores', 'Tecnología', 'Ventas'].map(t => (
                          <span key={t} className="px-3 py-1 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Entry 2: OutilTech Técnico */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 pt-16 border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">2017 — 2023</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">OutilTech</h3>
                <span className="font-label text-xs text-slate-500 uppercase tracking-widest">Colombia · Bogotá</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Técnico en Microsoldadura</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Diagnóstico y reparación de fallas electrónicas complejas en dispositivos de alta gama. Lectura e interpretación de planos electrónicos y mantenimiento especializado de equipos Apple y PC.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Logros Clave</h4>
                      <ul className="space-y-3 font-body text-base text-on-surface-variant">
                        <li className="flex gap-3"><span className="text-primary">/</span> Diagnóstico y reparación avanzada de MacBook (GPU, placa lógica).</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Microsoldadura de componentes SMD en circuitos de alta densidad.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Lectura e interpretación de esquemas electrónicos complejos.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Análisis técnico de componentes electrónicos defectuosos.</li>
                      </ul>
                    </div>
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Tecnologías</h4>
                      <div className="flex flex-wrap gap-3">
                        {['Microsoldadura SMD', 'MacBook', 'Planos electrónicos', 'Diagnóstico hardware', 'Osciloscopio', 'Multímetro', 'BGA Rework'].map(t => (
                          <span key={t} className="px-3 py-1 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Entry 3: Seguridad Informática */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 pt-16 border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">2025 — 2026</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">UNIMINUTO</h3>
                <span className="font-label text-xs text-slate-500 uppercase tracking-widest">En Formación</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Especialización en Seguridad Informática</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Formación en ciberseguridad, análisis forense digital y gestión de la seguridad de la información bajo estándares internacionales.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Competencias en Desarrollo</h4>
                      <ul className="space-y-3 font-body text-base text-on-surface-variant">
                        <li className="flex gap-3"><span className="text-primary">/</span> Implementación de controles basados en ISO 27001.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Identificación y análisis de riesgos en sistemas de información.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Análisis forense digital básico.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Apoyo en gestión de incidentes de seguridad.</li>
                      </ul>
                    </div>
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Áreas de Estudio</h4>
                      <div className="flex flex-wrap gap-3">
                        {['ISO 27001', 'Análisis Forense', 'Gestión de Riesgos', 'Ciberseguridad', 'Incidentes TI', 'C#', 'Fundamentos IA'].map(t => (
                          <span key={t} className="px-3 py-1 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 p-1 bg-gradient-to-r from-primary to-primary-container rounded-xl">
                    <div className="bg-surface rounded-[0.5rem] p-8">
                      <blockquote className="italic text-on-surface-variant font-body text-xl">
                        "La seguridad informática no es solo software: es la convergencia entre el conocimiento técnico del hardware y la protección integral de los sistemas de información."
                      </blockquote>
                      <cite className="block mt-4 text-primary font-label text-sm uppercase tracking-wider">— Jhonnathan Hernández · OutilTech</cite>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Entry 4: Softhard PC */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 pt-16 border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">2002 — 2013</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">Softhard PC</h3>
                <span className="font-label text-xs text-slate-500 uppercase tracking-widest">Colombia · Bogotá</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Propietario / Técnico en Soporte</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Fundación y operación de empresa de soporte técnico. Diagnóstico y reparación de equipos electrónicos, venta de productos tecnológicos y atención personalizada al cliente.
                  </p>
                  <div className="flex gap-4 flex-wrap mt-6">
                    {['Reparación PC', 'Soporte técnico', 'Venta tecnología', 'Atención al cliente', 'Gestión comercial', 'Fidelización'].map(t => (
                      <span key={t} className="px-4 py-2 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

        </section>
      </main>

      <footer className="relative w-full py-12 bg-[#0b1326] flex flex-col items-center gap-6 px-10">
        <div className="flex gap-8">
          <a className="text-slate-500 hover:text-blue-300 transition-opacity font-['Inter'] text-sm tracking-wide" href="https://outiltech.co" target="_blank" rel="noopener noreferrer">OutilTech</a>
          <a className="text-slate-500 hover:text-blue-300 transition-opacity font-['Inter'] text-sm tracking-wide" href="mailto:softhardgsm@gmail.com">Email</a>
          <a className="text-slate-500 hover:text-blue-300 transition-opacity font-['Inter'] text-sm tracking-wide" href="https://wa.me/573045928793" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
        <p className="text-slate-500 font-['Inter'] text-sm tracking-wide opacity-80">© 2026 Jhonnathan Hernández Medina · Gerente OutilTech · Bogotá D.C., Colombia</p>
        <div className="font-['Space_Grotesk'] text-blue-100 text-lg font-bold tracking-widest">JHM</div>
      </footer>
    </motion.div>
  );
}
