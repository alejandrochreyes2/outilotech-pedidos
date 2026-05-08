import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import ProyectoCard, { type Proyecto } from '../components/ProyectoCard';

const proyectos: Proyecto[] = [
  {
    id: '1',
    nombre: 'OutilTech Store',
    descripcion: 'Dirección y gestión de tienda especializada en tecnología: smartphones, laptops, tablets y accesorios de última generación. Plataforma e-commerce con atención personalizada.',
    tecnologias: ['Gestión Empresarial', 'E-Commerce', 'Tecnología', 'Logística'],
    enlace: 'https://outiltech.co',
    imagen: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    categoria: 'Empresa',
  },
  {
    id: '2',
    nombre: 'Seguridad ISO 27001',
    descripcion: 'Implementación de controles de seguridad informática bajo la norma ISO 27001. Análisis de riesgos tecnológicos, gestión de incidentes y aplicación de buenas prácticas en ciberseguridad.',
    tecnologias: ['ISO 27001', 'Ciberseguridad', 'Análisis Forense', 'Gestión de Riesgos'],
    enlace: '#',
    imagen: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop',
    categoria: 'Seguridad',
  },
  {
    id: '3',
    nombre: 'Laboratorio Técnico',
    descripcion: 'Servicio especializado de diagnóstico y reparación de equipos electrónicos: MacBook, smartphones, computadoras y dispositivos de alta complejidad con microsoldadura.',
    tecnologias: ['Microsoldadura', 'Diagnóstico', 'Reparación MacBook', 'Hardware'],
    enlace: '#',
    imagen: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    categoria: 'Técnico',
  },
];

export default function Inicio() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="selection:bg-primary-container selection:text-on-primary-container"
    >
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl dark:bg-slate-950/70 shadow-[0_10px_40px_rgba(0,0,0,0.2)] tonal-transition">
        <div className="flex justify-between items-center max-w-[1440px] mx-auto px-[2rem] md:px-[4.8rem] h-[6rem] md:h-[8rem]">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-blue-400 dark:text-blue-300 text-[2.4rem]">shield</span>
            <span className="text-[2.4rem] font-bold text-slate-100 uppercase tracking-tighter font-headline">Jhonnathan Hernández</span>
          </div>
          <nav className="hidden md:flex gap-[3.2rem] items-center">
            <Link className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" to="/">Inicio</Link>
            <Link className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" to="/experiencia">Experiencia</Link>
            <Link className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" to="/habilidades">Habilidades</Link>
            <a className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" href="#proyectos">Proyectos</a>
            <a className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" href="#formacion">Formación</a>
            <Link className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" to="/contacto">Sobre Mí</Link>
            <a
              href="/HV-Jhonnathan-Hernandez.pdf"
              download="HV-Jhonnathan-Hernandez.pdf"
              className="inline-flex items-center gap-2 border border-blue-400 text-blue-300 font-['Manrope'] text-[1.3rem] font-bold px-5 py-2 rounded-xl hover:bg-blue-400/10 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.8rem' }}>download</span>
              Descargar HV
            </a>
          </nav>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center px-[2rem] md:px-[4.8rem] pt-[6rem] md:pt-[8rem] pb-[8rem] md:pb-0 max-w-[1440px] mx-auto overflow-hidden">
          <div className="absolute top-[15%] right-[5%] w-[55rem] h-[55rem] rounded-full bg-primary-container/15 blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-[3rem] lg:gap-[6rem] items-center">

            {/* Foto */}
            <div className="flex justify-center items-center relative order-1 lg:order-2">
              <div className="relative w-[20rem] h-[26rem] sm:w-[26rem] sm:h-[33rem] lg:w-[38rem] lg:h-[48rem] rounded-[2.4rem] lg:rounded-[3.2rem] overflow-hidden shadow-2xl shadow-primary/20 bg-surface-container-low">
                <img
                  src="/img/foto-jhonnathan.png"
                  alt="Jhonnathan Hernández Medina - Gerente OutilTech"
                  className="w-full h-full object-contain object-top grayscale-[10%] hover:grayscale-0 transition-all duration-600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none"></div>
              </div>
              <div className="hidden lg:block absolute bottom-[3rem] left-[-2rem] bg-surface-container p-6 rounded-2xl ghost-border shadow-xl">
                <p className="font-label text-[1.1rem] text-outline uppercase tracking-widest mb-1">Experiencia</p>
                <p className="font-headline font-bold text-[2.4rem] text-primary">+20 Años</p>
              </div>
              <div className="hidden lg:block absolute top-[3rem] right-[-2rem] bg-surface-container p-6 rounded-2xl ghost-border shadow-xl">
                <p className="font-label text-[1.1rem] text-outline uppercase tracking-widest mb-1">Nivel</p>
                <p className="font-headline font-bold text-[1.8rem] text-on-surface">Ing. · Esp.</p>
              </div>
            </div>

            {/* Texto */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full mb-8">
                <span className="w-[1rem] h-[1rem] rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
                <span className="font-label text-[1.1rem] md:text-[1.3rem] uppercase tracking-[0.2rem] text-primary">Disponible para consultoría</span>
              </div>

              <p className="font-label text-[1.4rem] md:text-[1.8rem] tracking-[0.3rem] uppercase text-on-surface-variant mb-4">Jhonnathan Hernández Medina</p>

              <h1 className="font-headline font-bold text-[4.8rem] md:text-[7rem] lg:text-[9.6rem] leading-[0.95] tracking-tighter text-on-background mb-8 md:mb-12">
                Gerente &<br />
                <span style={{ background: 'linear-gradient(135deg, #adc7ff 0%, #4a8eff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Técnico Especialista</span>
              </h1>

              <p className="font-body text-[1.5rem] md:text-[1.8rem] text-on-surface-variant max-w-[55ch] leading-relaxed mb-[3rem] md:mb-[4.8rem]">
                Ingeniero Industrial con más de 20 años de experiencia en diagnóstico, reparación y comercialización de equipos tecnológicos. Gerente de OutilTech y especialista en microsoldadura y seguridad informática.
              </p>

              <div className="flex flex-wrap gap-6">
                <a className="editorial-gradient text-on-primary-fixed px-8 md:px-12 py-4 md:py-6 rounded-xl font-bold text-[1.4rem] md:text-[1.6rem] transition-transform hover:scale-105 active:scale-95" href="#proyectos">Ver Mi Experiencia</a>
                <Link className="ghost-border text-on-surface px-8 md:px-12 py-4 md:py-6 rounded-xl font-bold text-[1.4rem] md:text-[1.6rem] hover:bg-surface-container-low transition-colors" to="/contacto">Contactar</Link>
              </div>
            </div>

          </div>
        </section>

        {/* Experiencia Section */}
        <section className="py-[8rem] md:py-[12rem] px-[2rem] md:px-[4.8rem] bg-surface-container-low relative" id="experiencia">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-[8rem] ml-[5%]">Experiencia</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[4.8rem]">

              <article className="lg:col-span-8 group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Gerente & Propietario</h3>
                  <span className="font-label text-[1.4rem] text-outline">2017 — Actualmente</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-6 italic">OutilTech · Bogotá, Colombia</p>
                <p className="font-body text-[1.6rem] text-on-surface-variant max-w-[70ch] leading-relaxed">
                  Dirección y gestión integral de la empresa de comercialización de tecnología. Supervisión de operaciones, atención al cliente, gestión de inventario y relaciones con proveedores. Implementación de plataforma e-commerce outiltech.co.
                </p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 flex items-center">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">01</span>
              </div>

              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Técnico en Microsoldadura</h3>
                  <span className="font-label text-[1.4rem] text-outline">2017 — 2023</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-6 italic">OutilTech · Bogotá, Colombia</p>
                <p className="font-body text-[1.6rem] text-on-surface-variant max-w-[70ch] leading-relaxed">
                  Diagnóstico y reparación de fallas electrónicas, lectura e interpretación de planos electrónicos, mantenimiento de computadores y dispositivos tecnológicos complejos incluyendo MacBook.
                </p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 flex items-center pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">02</span>
              </div>

              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">En Formación — Seguridad Informática</h3>
                  <span className="font-label text-[1.4rem] text-outline">2025 — 2026</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-6 italic">UNIMINUTO · Bogotá, Colombia</p>
                <p className="font-body text-[1.6rem] text-on-surface-variant max-w-[70ch] leading-relaxed">
                  Especialización en Seguridad Informática con enfoque en ciberseguridad, análisis forense digital y aplicación de controles bajo la norma ISO 27001.
                </p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 flex items-center pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">03</span>
              </div>

              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Propietario / Técnico en Soporte</h3>
                  <span className="font-label text-[1.4rem] text-outline">2002 — 2013</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-6 italic">Softhard PC · Bogotá, Colombia</p>
                <p className="font-body text-[1.6rem] text-on-surface-variant max-w-[70ch] leading-relaxed">
                  Diagnóstico y reparación de equipos electrónicos, venta de productos tecnológicos, atención al cliente, soporte postventa y gestión comercial con fidelización de clientes.
                </p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 flex items-center pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">04</span>
              </div>

            </div>
          </div>
        </section>

        {/* Habilidades Section */}
        <section className="py-[8rem] md:py-[12rem] px-[2rem] md:px-[4.8rem] bg-surface" id="habilidades">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[8rem] items-center">
            <div>
              <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-[4.8rem]">Habilidades</h2>
              <p className="font-body text-[1.8rem] text-on-surface-variant mb-[6.4rem] max-w-[50ch]">
                Stack técnico orientado al diagnóstico electrónico, seguridad informática y gestión empresarial tecnológica.
              </p>
            </div>
            <div className="space-y-[4rem]">
              {[
                { label: 'Diagnóstico Electrónico Avanzado', pct: '95%', w: '95%' },
                { label: 'Microsoldadura', pct: '95%', w: '95%' },
                { label: 'Reparación de Equipos (MacBook/PC)', pct: '90%', w: '90%' },
                { label: 'Seguridad Informática (ISO 27001)', pct: '82%', w: '82%' },
                { label: 'Análisis Forense Digital', pct: '75%', w: '75%' },
                { label: 'Programación Básica (C#)', pct: '65%', w: '65%' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-4 font-label text-[1.4rem] uppercase tracking-widest text-secondary">
                    <span>{s.label}</span>
                    <span>{s.pct}</span>
                  </div>
                  <div className="h-[0.8rem] w-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full editorial-gradient" style={{ width: s.w }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proyectos Section */}
        <section className="py-[8rem] md:py-[12rem] px-[2rem] md:px-[4.8rem] bg-surface-container-lowest" id="proyectos">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-[8rem] gap-8">
              <h2 className="font-headline font-bold text-[4.8rem] tracking-tight">Proyectos <span className="text-primary">Destacados</span></h2>
              <p className="font-label text-outline text-[1.4rem] border-b border-primary-fixed-dim pb-2">Tecnología, seguridad y soporte técnico</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3.2rem]">
              {proyectos.map((proyecto) => (
                <ProyectoCard key={proyecto.id} proyecto={proyecto} />
              ))}
            </div>
          </div>
        </section>

        {/* Formación Académica Section */}
        <section className="py-[8rem] md:py-[12rem] px-[2rem] md:px-[4.8rem] bg-surface-container-low" id="formacion">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-[8rem] ml-[5%]">Formación <span className="text-primary">Académica</span></h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[4.8rem]">

              <article className="lg:col-span-8 group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Especialización en Seguridad Informática</h3>
                  <span className="font-label text-[1.4rem] text-outline">2025 — 2026 (En curso)</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">UNIMINUTO — Bogotá</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Especialización</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">Esp.</span>
              </div>

              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Ingeniería Industrial</h3>
                  <span className="font-label text-[1.4rem] text-outline">2017</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">Universitaria de Colombia — Bogotá</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Pregrado</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">Ing.</span>
              </div>

              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Especialización en Instrumentación Industrial</h3>
                  <span className="font-label text-[1.4rem] text-outline">2012</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">Técnico Central La Salle — Bogotá</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Especialización Técnica</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">Esp.</span>
              </div>

              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Técnico en Electromecánica</h3>
                  <span className="font-label text-[1.4rem] text-outline">2010</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">Técnico Central La Salle — Bogotá</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Técnico</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">Téc.</span>
              </div>

              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Programación con C#</h3>
                  <span className="font-label text-[1.4rem] text-outline">2023</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">Platzi — Online</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Curso Certificado</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">C#</span>
              </div>

            </div>
          </div>
        </section>

        {/* Sobre Mí Section */}
        <section className="py-[8rem] md:py-[12rem] px-[2rem] md:px-[4.8rem] bg-surface" id="sobre-mi">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[8rem]">
            <div className="lg:col-span-5 relative">
              <div className="aspect-[3/4] bg-surface-container-low rounded-xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
                <img alt="Jhonnathan Hernández - Gerente OutilTech" className="w-full h-full object-cover" src="/img/foto-jhonnathan.png" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-[4rem] -right-[4rem] bg-primary-container p-8 rounded-full hidden md:block">
                <span className="font-headline text-[3.2rem] text-on-primary-container font-bold">+20</span>
                <p className="font-label text-[1rem] text-on-primary-container uppercase font-bold">Años Exp.</p>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-[4.8rem]">Sobre <span className="text-primary">Mí</span></h2>
              <div className="space-y-[3.2rem] font-body text-[1.8rem] text-on-surface-variant leading-[1.8]">
                <p>
                  Soy Jhonnathan Hernández Medina, Ingeniero Industrial con especialización en Instrumentación Industrial y más de 20 años de experiencia en el sector tecnológico. Fundé y dirijo OutilTech, empresa especializada en la comercialización de dispositivos tecnológicos en Bogotá, Colombia.
                </p>
                <p>
                  Mi trayectoria técnica abarca el diagnóstico electrónico avanzado, microsoldadura de alta precisión y reparación de dispositivos complejos como MacBook, smartphones y computadoras. Complemento este perfil con formación en programación con C# y fundamentos de inteligencia artificial.
                </p>
                <p>
                  Actualmente en formación en Seguridad Informática con enfoque en ciberseguridad, análisis forense digital y controles ISO 27001. Profesional con pensamiento analítico, capacidad de aprendizaje continuo y orientación a resultados tecnológicos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto Section */}
        <section className="py-[8rem] md:py-[12rem] px-[2rem] md:px-[4.8rem] bg-surface-container-low" id="contacto">
          <div className="max-w-[1440px] mx-auto text-center mb-[8rem]">
            <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-4">¿Necesitas soporte técnico?</h2>
            <p className="font-body text-[2rem] text-on-surface-variant">Diagnóstico, reparación y soluciones tecnológicas a tu medida.</p>
          </div>
          <div className="max-w-[80rem] mx-auto glass-panel p-[4rem] md:p-[6.4rem] rounded-xl shadow-2xl">
            <form action="https://formspree.io/f/softhardgsm@gmail.com" className="space-y-[4rem]" method="POST">
              <div className="relative group">
                <input className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-0 text-[1.8rem] font-body focus:ring-0 focus:border-primary transition-all placeholder:text-outline/50" id="nombre" name="nombre" placeholder="Nombre completo" required type="text" />
                <label className="absolute -top-4 left-0 text-[1.2rem] font-label text-primary uppercase opacity-0 group-focus-within:opacity-100 transition-all" htmlFor="nombre">Nombre completo</label>
              </div>
              <div className="relative group">
                <input className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-0 text-[1.8rem] font-body focus:ring-0 focus:border-primary transition-all placeholder:text-outline/50" id="email" name="email" placeholder="Email" required type="email" />
                <label className="absolute -top-4 left-0 text-[1.2rem] font-label text-primary uppercase opacity-0 group-focus-within:opacity-100 transition-all" htmlFor="email">Email</label>
              </div>
              <div className="relative group">
                <textarea className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-0 text-[1.8rem] font-body focus:ring-0 focus:border-primary transition-all placeholder:text-outline/50 resize-none" id="mensaje" name="mensaje" placeholder="Tu mensaje" required rows={4}></textarea>
                <label className="absolute -top-4 left-0 text-[1.2rem] font-label text-primary uppercase opacity-0 group-focus-within:opacity-100 transition-all" htmlFor="mensaje">Mensaje</label>
              </div>
              <button className="w-full editorial-gradient py-6 rounded-xl text-on-primary-fixed font-headline font-bold text-[1.8rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(173,199,255,0.2)]" type="submit">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1326] w-full mt-[8rem] border-t border-slate-800/30">
        <div className="flex flex-col md:flex-row justify-between items-center py-[4rem] md:py-[6.4rem] px-[2rem] md:px-[4.8rem] max-w-[1440px] mx-auto pb-[10rem] md:pb-[6.4rem]">
          <p className="font-['Manrope'] text-[1.4rem] text-slate-400 mb-8 md:mb-0">© 2026 Jhonnathan Hernández · Gerente OutilTech · Bogotá D.C., Colombia</p>
          <div className="flex gap-[3.2rem]">
            <a className="font-['Manrope'] text-[1.4rem] text-slate-500 hover:text-blue-400 transition-colors" href="https://outiltech.co" target="_blank" rel="noopener noreferrer">OutilTech</a>
            <a className="font-['Manrope'] text-[1.4rem] text-slate-500 hover:text-blue-400 transition-colors" href="mailto:softhardgsm@gmail.com">Email</a>
            <a className="font-['Manrope'] text-[1.4rem] text-slate-500 hover:text-blue-400 transition-colors" href="https://wa.me/573045928793" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </footer>

      {/* NavigationDrawer (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full glass-panel h-[8rem] flex justify-around items-center z-[60] px-2 border-t border-outline-variant/10">
        <Link className="flex flex-col items-center text-slate-400" to="/">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[1rem] font-label">Inicio</span>
        </Link>
        <Link className="flex flex-col items-center text-slate-400" to="/experiencia">
          <span className="material-symbols-outlined">work</span>
          <span className="text-[1rem] font-label">Experiencia</span>
        </Link>
        <Link className="flex flex-col items-center text-slate-400" to="/habilidades">
          <span className="material-symbols-outlined">bolt</span>
          <span className="text-[1rem] font-label">Habilidades</span>
        </Link>
        <a className="flex flex-col items-center text-slate-400" href="#proyectos">
          <span className="material-symbols-outlined">layers</span>
          <span className="text-[1rem] font-label">Proyectos</span>
        </a>
        <a className="flex flex-col items-center text-slate-400" href="#formacion">
          <span className="material-symbols-outlined">school</span>
          <span className="text-[1rem] font-label">Formación</span>
        </a>
        <Link className="flex flex-col items-center text-slate-400" to="/contacto">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[1rem] font-label">Sobre Mí</span>
        </Link>
        <a
          href="/HV-Jhonnathan-Hernandez.pdf"
          download="HV-Jhonnathan-Hernandez.pdf"
          className="flex flex-col items-center text-blue-400"
        >
          <span className="material-symbols-outlined">download</span>
          <span className="text-[1rem] font-label">Descargar HV</span>
        </a>
      </div>
    </motion.div>
  );
}
