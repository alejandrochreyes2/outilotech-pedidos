import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase, Proyecto } from '../lib/supabase';
import ProyectoCard from '../components/ProyectoCard';

export default function Inicio() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  useEffect(() => {
    async function fetchProyectos() {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .eq('estado', 'ONLINE')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Para cambiar el enlace de un proyecto edita este objeto:
        // 'Nombre exacto del proyecto': 'https://la-url-que-quieras.com'
        const enlacesPersonalizados: Record<string, string> = {
          'outiltech.co': 'https://outiltech.co/',
        };
        const proyectosConEnlaces = data.map(p => ({
          ...p,
          enlace: enlacesPersonalizados[p.nombre] ?? p.enlace,
        }));
        setProyectos(proyectosConEnlaces);
      }
    }
    fetchProyectos();
  }, []);

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
        <div className="flex justify-between items-center max-w-[1440px] mx-auto px-[4.8rem] h-[8rem]">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-blue-400 dark:text-blue-300 text-[2.4rem]">terminal</span>
            <span className="text-[2.4rem] font-bold text-slate-100 uppercase tracking-tighter font-headline">Alejandro Chaparro</span>
          </div>
          <nav className="hidden md:flex gap-[3.2rem] items-center">
            <Link className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" to="/">Inicio</Link>
            <Link className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" to="/experiencia">Experiencia</Link>
            <Link className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" to="/habilidades">Habilidades</Link>
            <a className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" href="#proyectos">Proyectos</a>
            <a className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" href="#formacion">Formación</a>
            <Link className="text-slate-400 font-['Manrope'] text-[1.4rem] hover:text-slate-100 transition-colors" to="/contacto">Sobre Mí</Link>
            <a
              href="/HV2026C.pdf"
              download="HV-Alejandro-Chaparro.pdf"
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
        <section className="min-h-screen flex items-center px-[4.8rem] pt-[8rem] max-w-[1440px] mx-auto overflow-hidden">
          {/* Glow ambiental */}
          <div className="absolute top-[15%] right-[5%] w-[55rem] h-[55rem] rounded-full bg-primary-container/15 blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-[6rem] items-center">
            {/* Columna izquierda: texto */}
            <div>
              {/* Badge disponibilidad */}
              <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full mb-10">
                <span className="w-[1rem] h-[1rem] rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
                <span className="font-label text-[1.3rem] uppercase tracking-[0.2rem] text-primary">Disponible para trabajar</span>
              </div>

              {/* Nombre */}
              <p className="font-label text-[1.8rem] tracking-[0.3rem] uppercase text-on-surface-variant mb-4">Alejandro Chaparro</p>

              {/* Título principal */}
              <h1 className="font-headline font-bold text-[6.4rem] md:text-[9.6rem] leading-[0.95] tracking-tighter text-on-background mb-12">
                Desarrollador<br />
                <span style={{ background: 'linear-gradient(135deg, #adc7ff 0%, #4a8eff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Full-Stack Senior</span>
              </h1>

              <p className="font-body text-[1.8rem] text-on-surface-variant max-w-[55ch] leading-relaxed mb-[4.8rem]">
                Ayudo a empresas a construir soluciones cloud escalables y modernas. Con más de 6 años de experiencia dominando el ecosistema cloud backend, microservicios y DevOps.
              </p>

              <div className="flex flex-wrap gap-8">
                <a className="editorial-gradient text-on-primary-fixed px-12 py-6 rounded-xl font-bold text-[1.6rem] transition-transform hover:scale-105 active:scale-95" href="#proyectos">Ver Mis Proyectos</a>
                <Link className="ghost-border text-on-surface px-12 py-6 rounded-xl font-bold text-[1.6rem] hover:bg-surface-container-low transition-colors" to="/contacto">Contactar</Link>
              </div>
            </div>

            {/* Columna derecha: foto */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="relative w-[38rem] h-[48rem] rounded-[3.2rem] overflow-hidden shadow-2xl shadow-primary/20 bg-surface-container-low">
                <img
                  src="/img/foto-alejandro2.png"
                  alt="Alejandro Chaparro - Desarrollador Full-Stack Senior"
                  className="w-full h-full object-contain object-top grayscale-[10%] hover:grayscale-0 transition-all duration-600"
                />
                {/* Overlay de gradiente sutil en bordes */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none"></div>
              </div>
              {/* Badge flotante inferior */}
              <div className="absolute bottom-[3rem] left-[-2rem] bg-surface-container p-6 rounded-2xl ghost-border shadow-xl">
                <p className="font-label text-[1.1rem] text-outline uppercase tracking-widest mb-1">Experiencia</p>
                <p className="font-headline font-bold text-[2.4rem] text-primary">+6 Años</p>
              </div>
              {/* Badge flotante superior */}
              <div className="absolute top-[3rem] right-[-2rem] bg-surface-container p-6 rounded-2xl ghost-border shadow-xl">
                <p className="font-label text-[1.1rem] text-outline uppercase tracking-widest mb-1">Nivel</p>
                <p className="font-headline font-bold text-[1.8rem] text-on-surface">PhD. · MSc.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Experiencia Section */}
        <section className="py-[12rem] px-[4.8rem] bg-surface-container-low relative" id="experiencia">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-[8rem] ml-[5%]">Experiencia</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[4.8rem]">
              {/* Role 1 */}
              <article className="lg:col-span-8 group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Coordinador de Proyectos TI / Líder Backend</h3>
                  <span className="font-label text-[1.4rem] text-outline">Mayo 2025 — Jul 2025</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-6 italic">Control Online International (COI)</p>
                <p className="font-body text-[1.6rem] text-on-surface-variant max-w-[70ch] leading-relaxed">
                  Lideré equipos de desarrollo backend para implementación de soluciones en la nube (ControlDoc). Diseñé microservicios en .NET 8 y C#, configuré pipelines CI/CD con Azure DevOps e implementé controles WAF con reglas OWASP personalizadas.
                </p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 flex items-center">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">01</span>
              </div>
              {/* Role 2 */}
              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Líder Técnico Senior Cloud Backend</h3>
                  <span className="font-label text-[1.4rem] text-outline">Mayo 2024 — Feb 2025</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-6 italic">Global Hitss (Claro Colombia)</p>
                <p className="font-body text-[1.6rem] text-on-surface-variant max-w-[70ch] leading-relaxed">
                  Diseñé arquitecturas escalables en Microsoft Azure (AKS, Functions, SQL Database) para soluciones e-commerce y B2B. Migré aplicaciones monolíticas a microservicios con patrones CQRS y MVC. Referente técnico con mentoría a equipos junior.
                </p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 flex items-center pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">02</span>
              </div>
              {/* Role 3 */}
              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Especialista en Tecnologías Cloud</h3>
                  <span className="font-label text-[1.4rem] text-outline">Jun 2022 — Nov 2023</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-6 italic">Tim We Colombia Ltda</p>
                <p className="font-body text-[1.6rem] text-on-surface-variant max-w-[70ch] leading-relaxed">
                  Diseñé soluciones backend en AWS y Oracle Cloud para operadores de telecomunicaciones (ENTEL Chile y Perú). Desarrollé microservicios Java (Spring Boot) orquestados con Kubernetes y OpenShift, integrando CI/CD con SonarCloud.
                </p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 flex items-center pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">03</span>
              </div>
            </div>
          </div>
        </section>

        {/* Habilidades Section */}
        <section className="py-[12rem] px-[4.8rem] bg-surface" id="habilidades">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[8rem] items-center">
            <div>
              <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-[4.8rem]">Habilidades</h2>
              <p className="font-body text-[1.8rem] text-on-surface-variant mb-[6.4rem] max-w-[50ch]">
                Stack técnico orientado a la escalabilidad, seguridad y excelencia en entornos cloud empresariales.
              </p>
            </div>
            <div className="space-y-[4rem]">
              <div>
                <div className="flex justify-between mb-4 font-label text-[1.4rem] uppercase tracking-widest text-secondary">
                  <span>Microservicios &amp; APIs REST</span>
                  <span>95%</span>
                </div>
                <div className="h-[0.8rem] w-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full editorial-gradient" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-4 font-label text-[1.4rem] uppercase tracking-widest text-secondary">
                  <span>Arquitectura Cloud (AWS / Azure)</span>
                  <span>92%</span>
                </div>
                <div className="h-[0.8rem] w-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full editorial-gradient" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-4 font-label text-[1.4rem] uppercase tracking-widest text-secondary">
                  <span>Desarrollo Backend (Java / .NET Core)</span>
                  <span>90%</span>
                </div>
                <div className="h-[0.8rem] w-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full editorial-gradient" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-4 font-label text-[1.4rem] uppercase tracking-widest text-secondary">
                  <span>DevOps &amp; CI/CD</span>
                  <span>88%</span>
                </div>
                <div className="h-[0.8rem] w-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full editorial-gradient" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos Section */}
        <section className="py-[12rem] px-[4.8rem] bg-surface-container-lowest" id="proyectos">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-[8rem] gap-8">
              <h2 className="font-headline font-bold text-[4.8rem] tracking-tight">Proyectos <span className="text-primary">Destacados</span></h2>
              <p className="font-label text-outline text-[1.4rem] border-b border-primary-fixed-dim pb-2">Soluciones cloud, backend y DevOps</p>
            </div>
            {proyectos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-on-surface-variant text-[1.8rem]">Los proyectos se gestionan desde el panel de administración.</p>
                <p className="text-outline text-[1.4rem] mt-4">Accede al admin para añadir proyectos de tu portafolio cloud y backend.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3.2rem]">
                {proyectos.map((proyecto) => (
                  <ProyectoCard key={proyecto.id} proyecto={proyecto} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Formación Académica Section */}
        <section className="py-[12rem] px-[4.8rem] bg-surface-container-low" id="formacion">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-[8rem] ml-[5%]">Formación <span className="text-primary">Académica</span></h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[4.8rem]">
              {/* PhD */}
              <article className="lg:col-span-8 group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">PhD. en Gestión e Innovación Tecnológica</h3>
                  <span className="font-label text-[1.4rem] text-outline">2023 — 2025</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">Universidad UTEL — México</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Doctorado</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">Dr.</span>
              </div>
              {/* Maestría */}
              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Magíster en Dirección e Ingeniería de Software</h3>
                  <span className="font-label text-[1.4rem] text-outline">2021 — 2022</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">Universidad UTEL — México</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Maestría</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">MSc.</span>
              </div>
              {/* Especialización Ingeniería */}
              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Especialista en Ingeniería de Software</h3>
                  <span className="font-label text-[1.4rem] text-outline">2019 — 2020</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">Universidad Distrital Francisco José de Caldas</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Especialización</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">Esp.</span>
              </div>
              {/* Especialización Gerencia */}
              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Especialista en Gerencia de Proyectos</h3>
                  <span className="font-label text-[1.4rem] text-outline">2019</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">UNINPAHU — Bogotá</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Especialización</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">Esp.</span>
              </div>
              {/* Pregrado */}
              <article className="lg:col-span-8 group pt-[4.8rem] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="font-headline text-[2.8rem] text-primary">Ingeniero de Sistemas</h3>
                  <span className="font-label text-[1.4rem] text-outline">2011 — 2017</span>
                </div>
                <p className="font-headline text-[2.2rem] text-on-surface mb-2 italic">Universidad Autónoma de Colombia</p>
                <p className="font-label text-[1.2rem] text-outline uppercase tracking-widest">Pregrado · Mat. Prof. 25255-393379 CND</p>
              </article>
              <div className="hidden lg:block lg:col-span-4 border-l border-outline-variant/30 px-8 pt-[4.8rem]">
                <span className="text-[6.4rem] font-headline font-bold text-surface-container-highest">Ing.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Mí Section */}
        <section className="py-[12rem] px-[4.8rem] bg-surface" id="sobre-mi">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[8rem]">
            <div className="lg:col-span-5 relative">
              <div className="aspect-[3/4] bg-surface-container-low rounded-xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
                <img alt="Alejandro Chaparro - Líder Técnico Cloud Backend" className="w-full h-full object-cover" src="https://d5tnfl9agh5vb.cloudfront.net/uploads/2024/02/que-hace-un-ingeniero-de-sistemas-1-570x363.jpg" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-[4rem] -right-[4rem] bg-primary-container p-8 rounded-full hidden md:block">
                <span className="font-headline text-[3.2rem] text-on-primary-container font-bold">+6</span>
                <p className="font-label text-[1rem] text-on-primary-container uppercase font-bold">Años Exp.</p>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-[4.8rem]">Sobre <span className="text-primary">Mí</span></h2>
              <div className="space-y-[3.2rem] font-body text-[1.8rem] text-on-surface-variant leading-[1.8]">
                <p>
                  Soy Raúl Alejandro Chaparro Reyes, Ingeniero de Sistemas con más de 6 años de experiencia en desarrollo de software, especializado en arquitecturas cloud backend y liderazgo técnico de equipos ágiles. Bogotá D.C., Colombia.
                </p>
                <p>
                  Ph.D. en Gestión e Innovación Tecnológica, Magíster en Dirección e Ingeniería de Software y Especialista en Gerencia de Proyectos TI. Experto en diseño, construcción y despliegue de microservicios y APIs resilientes en entornos cloud (AWS, Azure, Oracle Cloud), con sólidos conocimientos en Java (programación reactiva), .NET Core, contenedores Docker, Kubernetes y prácticas DevOps con Azure DevOps y GitHub Actions.
                </p>
                <p>
                  Apasionado por la mejora continua, la calidad del código y la adopción de herramientas de IA (GitHub Copilot) para optimizar el desarrollo. Capacidad probada para liderar equipos técnicos, interpretar arquitecturas complejas y garantizar la entrega de soluciones escalables, seguras y de alto rendimiento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto Section */}
        <section className="py-[12rem] px-[4.8rem] bg-surface-container-low" id="contacto">
          <div className="max-w-[1440px] mx-auto text-center mb-[8rem]">
            <h2 className="font-headline font-bold text-[4.8rem] tracking-tight mb-4">¿Tienes un proyecto en mente?</h2>
            <p className="font-body text-[2rem] text-on-surface-variant">Construyamos soluciones cloud escalables y de alto rendimiento juntos.</p>
          </div>
          <div className="max-w-[80rem] mx-auto glass-panel p-[4rem] md:p-[6.4rem] rounded-xl shadow-2xl">
            <form action="#" className="space-y-[4rem]" method="POST">
              <div className="relative group">
                <input className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-0 text-[1.8rem] font-body focus:ring-0 focus:border-primary transition-all placeholder:text-outline/50" id="nombre" name="nombre" placeholder="Nombre completo" required type="text" />
                <label className="absolute -top-4 left-0 text-[1.2rem] font-label text-primary uppercase opacity-0 group-focus-within:opacity-100 transition-all" htmlFor="nombre">Nombre completo</label>
              </div>
              <div className="relative group">
                <input className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-0 text-[1.8rem] font-body focus:ring-0 focus:border-primary transition-all placeholder:text-outline/50" id="email" name="email" placeholder="Email profesional" required type="email" />
                <label className="absolute -top-4 left-0 text-[1.2rem] font-label text-primary uppercase opacity-0 group-focus-within:opacity-100 transition-all" htmlFor="email">Email profesional</label>
              </div>
              <div className="relative group">
                <textarea className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-0 text-[1.8rem] font-body focus:ring-0 focus:border-primary transition-all placeholder:text-outline/50 resize-none" id="mensaje" name="mensaje" placeholder="Tu mensaje" required rows={4}></textarea>
                <label className="absolute -top-4 left-0 text-[1.2rem] font-label text-primary uppercase opacity-0 group-focus-within:opacity-100 transition-all" htmlFor="mensaje">Tu mensaje</label>
              </div>
              <button className="w-full editorial-gradient py-6 rounded-xl text-on-primary-fixed font-headline font-bold text-[1.8rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(173,199,255,0.2)]" type="submit">
                Enviar Propuesta
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1326] w-full mt-[8rem] border-t border-slate-800/30">
        <div className="flex flex-col md:flex-row justify-between items-center py-[6.4rem] px-[4.8rem] max-w-[1440px] mx-auto">
          <p className="font-['Manrope'] text-[1.4rem] text-slate-400 mb-8 md:mb-0">© 2025 Alejandro Chaparro · Líder Técnico Cloud Backend · Bogotá D.C., Colombia</p>
          <div className="flex gap-[3.2rem]">
            <a className="font-['Manrope'] text-[1.4rem] text-slate-500 hover:text-blue-400 transition-colors" href="https://linkedin.com/in/alejandro-chaparro" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="font-['Manrope'] text-[1.4rem] text-slate-500 hover:text-blue-400 transition-colors" href="https://github.com/alejandrochreyes2" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="font-['Manrope'] text-[1.4rem] text-slate-500 hover:text-blue-400 transition-colors" href="mailto:alejandrochreyes2@gmail.com">Email</a>
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
      </div>
    </motion.div>
  );
}
