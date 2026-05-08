import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Contacto() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container"
    >
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/70 backdrop-blur-md shadow-2xl shadow-black/20 h-20 flex items-center justify-between px-8 max-w-full mx-auto tonal-transition">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined text-blue-200" style={{ fontSize: '2.4rem' }}>shield</span>
          <span className="font-['Space_Grotesk'] font-bold text-2xl uppercase tracking-tighter text-blue-100">Jhonnathan Hernández</span>
        </div>
        <nav className="hidden md:flex gap-12 items-center">
          <Link className="font-['Inter'] text-sm tracking-wide text-slate-400 hover:text-blue-200 transition-colors" to="/experiencia">Experiencia</Link>
          <Link className="font-['Inter'] text-sm tracking-wide text-slate-400 hover:text-blue-200 transition-colors" to="/habilidades">Habilidades</Link>
          <Link className="font-['Inter'] text-sm tracking-wide text-blue-300 transition-colors" to="/contacto">Sobre Mí</Link>
        </nav>
      </header>

      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <section className="max-w-7xl mx-auto mb-20">
          <div className="flex flex-col gap-4 ml-[5%]">
            <span className="font-label text-primary tracking-[0.3em] uppercase text-xl font-medium">Sobre Mí & Contacto</span>
            <h1 className="font-headline display-lg font-bold text-on-surface tracking-tighter">Jhonnathan Hernández Medina</h1>
            <p className="font-body body-md text-outline max-w-[60ch] mt-4">
              Ingeniero Industrial · Técnico Especialista en Electrónica · Gerente OutilTech · En formación en Seguridad Informática
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Info */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div className="bg-surface-container-low p-10 rounded-xl ghost-border">
              <h3 className="font-headline headline-md text-primary-fixed-dim mb-8">Canales directos</h3>
              <div className="flex flex-col gap-8">
                <a className="group flex items-center gap-6" href="mailto:softhardgsm@gmail.com">
                  <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center rounded-lg group-hover:bg-primary-container transition-all duration-300">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container">mail</span>
                  </div>
                  <div>
                    <p className="font-label text-outline text-xs uppercase tracking-widest">Email</p>
                    <p className="font-body body-md font-semibold">softhardgsm@gmail.com</p>
                  </div>
                </a>
                <a className="group flex items-center gap-6" href="https://wa.me/573045928793" target="_blank" rel="noopener noreferrer">
                  <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center rounded-lg group-hover:bg-primary-container transition-all duration-300">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container">phone_iphone</span>
                  </div>
                  <div>
                    <p className="font-label text-outline text-xs uppercase tracking-widest">WhatsApp / Celular</p>
                    <p className="font-body body-md font-semibold">+57 304 592 8793</p>
                  </div>
                </a>
                <a className="group flex items-center gap-6" href="https://outiltech.co" target="_blank" rel="noopener noreferrer">
                  <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center rounded-lg group-hover:bg-primary-container transition-all duration-300">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container">store</span>
                  </div>
                  <div>
                    <p className="font-label text-outline text-xs uppercase tracking-widest">Empresa</p>
                    <p className="font-body body-md font-semibold">outiltech.co</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Foto */}
            <div className="relative h-80 w-full bg-surface-container rounded-xl overflow-hidden ghost-border">
              <img className="w-full h-full object-cover object-top opacity-80" src="/img/foto-jhonnathan.png" alt="Jhonnathan Hernández" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10"></div>
              <div className="absolute bottom-6 left-6 z-20">
                <p className="font-label text-primary text-xs uppercase tracking-widest">Localización</p>
                <p className="font-body body-md font-bold">Bogotá D.C., Colombia</p>
              </div>
            </div>
          </div>

          {/* Perfil & Formulario */}
          <div className="lg:col-span-7 flex flex-col gap-16">
            <div className="bg-surface-container-low p-10 rounded-xl ghost-border">
              <h3 className="font-headline headline-md text-primary-fixed-dim mb-6">Perfil Profesional</h3>
              <div className="space-y-6 font-body text-[1.6rem] text-on-surface-variant leading-relaxed">
                <p>
                  Ingeniero Industrial con especialización en Instrumentación Industrial y más de 20 años de experiencia en el sector tecnológico. Fundé y dirijo <strong className="text-on-surface">OutilTech</strong>, empresa de comercialización de tecnología en Bogotá.
                </p>
                <p>
                  Amplios conocimientos en electrónica, microsoldadura y reparación de dispositivos complejos incluyendo MacBook y equipos Apple. Actualmente en formación en <strong className="text-on-surface">Seguridad Informática</strong> con enfoque en ISO 27001 y análisis forense digital.
                </p>
                <p>
                  Profesional con pensamiento analítico, capacidad de aprendizaje continuo y orientación a resultados tecnológicos. Intereses en ciberseguridad, inteligencia artificial, automatización y deporte.
                </p>
              </div>
            </div>

            <form className="flex flex-col gap-10">
              <h3 className="font-headline headline-md text-primary-fixed-dim">Enviar mensaje</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative group">
                  <label className="font-label text-outline-variant text-xs uppercase tracking-[0.2em] mb-2 block group-focus-within:text-primary transition-colors" htmlFor="name">Nombre completo</label>
                  <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-4 px-0 font-body body-md text-on-surface focus:ring-0 input-focus transition-all placeholder:text-surface-variant" id="name" name="name" placeholder="Tu nombre..." type="text" />
                </div>
                <div className="relative group">
                  <label className="font-label text-outline-variant text-xs uppercase tracking-[0.2em] mb-2 block group-focus-within:text-primary transition-colors" htmlFor="email">Correo electrónico</label>
                  <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-4 px-0 font-body body-md text-on-surface focus:ring-0 input-focus transition-all placeholder:text-surface-variant" id="email" name="email" placeholder="tu@email.com" type="email" />
                </div>
              </div>
              <div className="relative group">
                <label className="font-label text-outline-variant text-xs uppercase tracking-[0.2em] mb-2 block group-focus-within:text-primary transition-colors" htmlFor="message">Mensaje</label>
                <textarea className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-4 px-0 font-body body-md text-on-surface focus:ring-0 input-focus transition-all resize-none placeholder:text-surface-variant" id="message" name="message" placeholder="¿En qué te puedo ayudar?..." rows={5}></textarea>
              </div>
              <div className="flex justify-start md:justify-end mt-4">
                <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed px-12 py-5 rounded-xl font-headline font-bold text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20" type="submit">
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="relative w-full py-12 bg-[#0b1326] flex flex-col items-center gap-6 px-10 border-0">
        <div className="flex gap-8">
          <a className="font-['Inter'] text-sm tracking-wide text-slate-500 hover:text-blue-300 transition-opacity opacity-80 hover:opacity-100" href="https://outiltech.co" target="_blank" rel="noopener noreferrer">OutilTech</a>
          <a className="font-['Inter'] text-sm tracking-wide text-slate-500 hover:text-blue-300 transition-opacity opacity-80 hover:opacity-100" href="mailto:softhardgsm@gmail.com">Email</a>
          <a className="font-['Inter'] text-sm tracking-wide text-slate-500 hover:text-blue-300 transition-opacity opacity-80 hover:opacity-100" href="https://wa.me/573045928793" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-['Space_Grotesk'] text-blue-100 font-bold tracking-widest uppercase">Jhonnathan Hernández</span>
          <p className="font-['Inter'] text-sm tracking-wide text-slate-500">© 2026 Jhonnathan Hernández Medina · Gerente OutilTech · Bogotá D.C., Colombia</p>
        </div>
      </footer>
    </motion.div>
  );
}
