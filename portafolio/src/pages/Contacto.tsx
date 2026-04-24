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
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/70 backdrop-blur-md shadow-2xl shadow-black/20 h-20 flex items-center justify-between px-8 max-w-full mx-auto tonal-transition no-border">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined text-blue-200" style={{ fontSize: '2.4rem' }}>terminal</span>
          <span className="font-['Space_Grotesk'] font-bold text-2xl uppercase tracking-tighter text-blue-100">Alejandro Chaparro</span>
        </div>
        <nav className="hidden md:flex gap-12 items-center">
          <Link className="font-['Inter'] text-sm tracking-wide text-slate-400 hover:text-blue-200 transition-colors" to="/experiencia">Experiencia</Link>
          <Link className="font-['Inter'] text-sm tracking-wide text-slate-400 hover:text-blue-200 transition-colors" to="/habilidades">Habilidades</Link>
          <Link className="font-['Inter'] text-sm tracking-wide text-slate-400 hover:text-blue-200 transition-colors" to="/#proyectos">Proyectos</Link>
          <Link className="font-['Inter'] text-sm tracking-wide text-blue-300 transition-colors" to="/admin">Administración</Link>
        </nav>
        <div className="md:hidden">
          <span className="material-symbols-outlined text-blue-200">menu</span>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <section className="max-w-7xl mx-auto mb-20">
          <div className="flex flex-col gap-4 ml-[5%]">
            <span className="font-label text-primary tracking-[0.3em] uppercase text-xl font-medium">Contacto</span>
            <h1 className="font-headline display-lg font-bold text-on-surface tracking-tighter">¿Tienes un proyecto en mente?</h1>
            <p className="font-body body-md text-outline max-w-[60ch] mt-4">
              Colaboremos para transformar tus ideas en arquitecturas digitales de alto impacto. Diseño, código y estrategia centrados en la excelencia.
            </p>
          </div>
        </section>

        {/* Main Contact Layout (Asymmetric) */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Information & Links Area (4/12) */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            {/* Contact Methods */}
            <div className="bg-surface-container-low p-10 rounded-xl ambient-card ghost-border">
              <h3 className="font-headline headline-md text-primary-fixed-dim mb-8">Canales directos</h3>
              <div className="flex flex-col gap-8">
                <a className="group flex items-center gap-6" href="mailto:alejandrochreyes2@gmail.com">
                  <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center rounded-lg group-hover:bg-primary-container transition-all duration-300">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container">mail</span>
                  </div>
                  <div>
                    <p className="font-label text-outline text-xs uppercase tracking-widest">Email</p>
                    <p className="font-body body-md font-semibold">alejandrochreyes2@gmail.com</p>
                  </div>
                </a>
                <a className="group flex items-center gap-6" href="https://wa.me/573133082905" target="_blank" rel="noopener noreferrer">
                  <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center rounded-lg group-hover:bg-primary-container transition-all duration-300">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container">phone_iphone</span>
                  </div>
                  <div>
                    <p className="font-label text-outline text-xs uppercase tracking-widest">WhatsApp / Celular</p>
                    <p className="font-body body-md font-semibold">+57 313 308 2905</p>
                  </div>
                </a>
                <a className="group flex items-center gap-6" href="https://linkedin.com/in/raul-alejandro-chaparro-reyes/" target="_blank" rel="noopener noreferrer">
                  <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center rounded-lg group-hover:bg-primary-container transition-all duration-300">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container">link</span>
                  </div>
                  <div>
                    <p className="font-label text-outline text-xs uppercase tracking-widest">LinkedIn</p>
                    <p className="font-body body-md font-semibold">alejandro-chaparro</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Map / Location Placeholder */}
            <div className="relative h-64 w-full bg-surface-container rounded-xl overflow-hidden ghost-border">
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10"></div>
              <div className="absolute bottom-6 left-6 z-20">
                <p className="font-label text-primary text-xs uppercase tracking-widest">Localización</p>
                <p className="font-body body-md font-bold">Bogotá D.C., Kennedy, Colombia</p>
              </div>
              <img className="w-full h-full object-cover opacity-40 mix-blend-luminosity" data-alt="abstract dark satellite map of a modern metropolitan city with blue glowing tech lines and points of interest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBicjnhxz4qn93FFvA8Jeixfn7w4DRdqJazY8eMtJYs11eKV9yFVk896zDqjHwvVcWgpkORt4OpTGUpUO5k-ycDH5t1ZrbGbTnnJNAiX7z3YiqI_p-wtdEvtSXVDaqeDKMjDS0FNg_i0qTfqLzI1N16xYIaD94oCQV0YeKAo8aK6T71PeRbNt0XoRHLaCMbM9TSqqLXBRR5AezTVy6ZjWIjEU-EbricK4SbsrNI9zQ4lcLbo2qGnvaPGNyQrzq5BEV3VLwUzFIukdHU" />
            </div>
          </div>

          {/* Form Area (7/12) */}
          <div className="lg:col-span-7">
            <form className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Name Field */}
                <div className="relative group">
                  <label className="font-label text-outline-variant text-xs uppercase tracking-[0.2em] mb-2 block group-focus-within:text-primary transition-colors" htmlFor="name">Nombre completo</label>
                  <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-4 px-0 font-body body-md text-on-surface focus:ring-0 input-focus transition-all placeholder:text-surface-variant" id="name" name="name" placeholder="Escribe tu nombre aquí..." type="text" />
                </div>
                {/* Email Field */}
                <div className="relative group">
                  <label className="font-label text-outline-variant text-xs uppercase tracking-[0.2em] mb-2 block group-focus-within:text-primary transition-colors" htmlFor="email">Correo electrónico</label>
                  <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-4 px-0 font-body body-md text-on-surface focus:ring-0 input-focus transition-all placeholder:text-surface-variant" id="email" name="email" placeholder="tu@email.com" type="email" />
                </div>
              </div>
              {/* Message Field */}
              <div className="relative group">
                <label className="font-label text-outline-variant text-xs uppercase tracking-[0.2em] mb-2 block group-focus-within:text-primary transition-colors" htmlFor="message">Mensaje</label>
                <textarea className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-4 px-0 font-body body-md text-on-surface focus:ring-0 input-focus transition-all resize-none placeholder:text-surface-variant" id="message" name="message" placeholder="Cuéntame sobre tu proyecto, objetivos y plazos..." rows={5}></textarea>
              </div>
              {/* CTA Button */}
              <div className="flex justify-start md:justify-end mt-4">
                <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed px-12 py-5 rounded-xl font-headline font-bold text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20" type="submit">
                  Enviar Propuesta
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative w-full py-12 bg-[#0b1326] flex flex-col items-center gap-6 px-10 tonal-shift-bg border-0">
        <div className="flex gap-8">
          <a className="font-['Inter'] text-sm tracking-wide text-slate-500 hover:text-blue-300 transition-opacity opacity-80 hover:opacity-100" href="#">LinkedIn</a>
          <a className="font-['Inter'] text-sm tracking-wide text-slate-500 hover:text-blue-300 transition-opacity opacity-80 hover:opacity-100" href="#">GitHub</a>
          <a className="font-['Inter'] text-sm tracking-wide text-slate-500 hover:text-blue-300 transition-opacity opacity-80 hover:opacity-100" href="#">Twitter</a>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-['Space_Grotesk'] text-blue-100 font-bold tracking-widest uppercase">Alejandro Chaparro</span>
          <p className="font-['Inter'] text-sm tracking-wide text-slate-500">© 2025 Alejandro Chaparro · Bogotá D.C., Colombia. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* NavigationDrawer (Mobile Only Suppression Logic) */}
      <aside className="fixed left-0 top-0 w-80 z-[60] py-8 flex flex-col bg-[#131b2e] shadow-2xl rounded-r-none h-full md:hidden translate-x-[-100%] transition-transform duration-300">
        <div className="px-8 mb-12 flex flex-col gap-2">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-primary">
            <img className="w-full h-full object-cover" data-alt="professional headshot of a digital architect in a dark studio setting with cinematic blue edge lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgp4vpGEtkA5c1XwJjsVLdD7c72GH35Kw_hCTfH1e_5GmbdF3IbAfNxc7zBqvx2wd7407yzldi7k_pGM5UWheCDoO6u9vWJzqYnYb5czM2QB_FgL8r-0cVfNofNERQPBSYvOyoYQ99pOwBw_xRVZcGbCYumoBSGFdqfK8y3-9GaSqdBwVpWL2m2qJh8MUQJA6pLVZPPlBoPDcoqR0nNrB2MM4Z9DLtKpEFUdVokdWFRDJ9c-L_9z9c7pS8KMtiRuntxkAZonj7reQ7" />
          </div>
          <h2 className="font-['Space_Grotesk'] text-blue-100 font-bold text-xl">Alejandro Chaparro</h2>
          <p className="font-['Manrope'] font-medium text-slate-400 text-sm">Arquitecto Digital</p>
        </div>
        <nav className="flex flex-col gap-2">
          <Link className="font-['Manrope'] font-medium text-lg text-slate-400 pl-8 py-4 hover:text-white transition-all" to="/experiencia">Experiencia</Link>
          <Link className="font-['Manrope'] font-medium text-lg text-slate-400 pl-8 py-4 hover:text-white transition-all" to="/habilidades">Habilidades</Link>
          <Link className="font-['Manrope'] font-medium text-lg text-slate-400 pl-8 py-4 hover:text-white transition-all" to="/#proyectos">Proyectos</Link>
          <Link className="font-['Manrope'] font-bold text-lg text-blue-200 border-l-4 border-blue-400 pl-8 py-4 bg-blue-900/20" to="/admin">Administración</Link>
        </nav>
        <div className="mt-auto px-8 pt-8 border-t border-outline-variant/20">
          <p className="font-['Inter'] text-xs text-slate-600 tracking-widest uppercase">v1.0.0</p>
        </div>
      </aside>
    </motion.div>
  );
}
