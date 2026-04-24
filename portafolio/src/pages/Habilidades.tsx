import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Habilidades() {
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
          <span className="material-symbols-outlined text-blue-200">terminal</span>
          <h1 className="font-['Space_Grotesk'] font-bold text-2xl uppercase tracking-tighter text-blue-100">Alejandro Chaparro</h1>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link className="font-['Manrope'] font-medium text-lg text-slate-400 hover:text-blue-200 transition-colors" to="/experiencia">Experiencia</Link>
          <Link className="font-['Manrope'] font-medium text-lg text-blue-300" to="/habilidades">Habilidades</Link>
          <Link className="font-['Manrope'] font-medium text-lg text-slate-400 hover:text-blue-200 transition-colors" to="/#proyectos">Proyectos</Link>
          <Link className="font-['Manrope'] font-medium text-lg text-slate-400 hover:text-blue-200 transition-colors" to="/contacto">Contacto</Link>
        </nav>
      </header>

      <main className="pt-32 pb-20 min-h-screen max-w-[144rem] mx-auto px-6 md:px-20 lg:px-40">
        {/* Section Header */}
        <div className="mb-24 ml-[5%]">
          <span className="font-label text-primary uppercase tracking-[0.4rem] text-sm mb-4 block">Especialización Técnica</span>
          <h2 className="font-headline text-[5.6rem] font-bold leading-tight tracking-tighter text-on-surface max-w-[20ch]">
            Habilidades
          </h2>
          <p className="font-body text-outline text-[1.8rem] mt-8 max-w-[65ch]">
            Stack técnico orientado a arquitecturas cloud backend, microservicios, DevOps y seguridad en entornos corporativos de alta disponibilidad.
          </p>
        </div>

        {/* Skills Grid (Asymmetric Bento) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Core Stack: Progress Bars */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-12 ghost-border">
            <h3 className="font-headline text-[2.8rem] font-bold mb-12 text-blue-100">Core Stack</h3>
            <div className="space-y-12">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="font-body text-[1.6rem] font-bold text-on-surface">Microservicios &amp; APIs REST</span>
                  <span className="font-label text-[1.4rem] text-primary">95%</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-none">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="font-body text-[1.6rem] font-bold text-on-surface">Arquitectura Cloud (AWS / Azure / OCI)</span>
                  <span className="font-label text-[1.4rem] text-primary">92%</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-none">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="font-body text-[1.6rem] font-bold text-on-surface">Desarrollo Backend (Java / .NET Core)</span>
                  <span className="font-label text-[1.4rem] text-primary">90%</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-none">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="font-body text-[1.6rem] font-bold text-on-surface">DevOps &amp; CI/CD</span>
                  <span className="font-label text-[1.4rem] text-primary">88%</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-none">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="font-body text-[1.6rem] font-bold text-on-surface">Contenedores (Docker / Kubernetes)</span>
                  <span className="font-label text-[1.4rem] text-primary">88%</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-none">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="font-body text-[1.6rem] font-bold text-on-surface">Frontend (Angular / React)</span>
                  <span className="font-label text-[1.4rem] text-primary">75%</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-none">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Languages & Tools Cluster */}
          <div className="lg:col-span-5 flex flex-col gap-12">

            {/* Languages Card */}
            <div className="bg-surface-container-highest p-12 rounded-xl flex-1 relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[16rem]">code</span>
              </div>
              <h4 className="font-headline text-[2.2rem] font-bold mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">terminal</span>
                Lenguajes
              </h4>
              <div className="flex flex-wrap gap-4">
                {['Java (Reactivo)', 'C# / .NET Core', 'JavaScript (ES6+)', 'TypeScript', 'SQL', 'Python (básico)', 'Go (básico)', 'PHP'].map(lang => (
                  <span key={lang} className="px-6 py-3 bg-surface-container-low ghost-border text-on-surface-variant font-label text-[1.4rem]">{lang}</span>
                ))}
              </div>
            </div>

            {/* Frameworks & Tools Card */}
            <div className="bg-surface-container-low p-12 rounded-xl flex-1 border-l-4 border-primary">
              <h4 className="font-headline text-[2.2rem] font-bold mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">layers</span>
                Frameworks &amp; Herramientas
              </h4>
              <ul className="space-y-6">
                {[
                  'Spring Boot / ASP.NET Core',
                  'Docker / Kubernetes / OpenShift',
                  'Azure DevOps / GitHub Actions',
                  'Angular / React / Next.js',
                  'PostgreSQL / SQL Server / Oracle',
                  'SonarCloud / JUnit / xUnit',
                  'Azure WAF / Azure Sentinel',
                  'GitHub Copilot (IA)',
                ].map(item => (
                  <li key={item} className="flex items-center justify-between group">
                    <span className="font-body text-[1.6rem] text-on-surface">{item}</span>
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cloud Platforms Full Width */}
          <div className="lg:col-span-12 bg-surface-container-low rounded-xl p-12 ghost-border mt-4">
            <h3 className="font-headline text-[2.8rem] font-bold mb-10 text-blue-100 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">cloud</span>
              Plataformas Cloud &amp; Agilidad
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: 'cloud', label: 'AWS', desc: 'Lambda, EKS, S3' },
                { icon: 'cloud_circle', label: 'Microsoft Azure', desc: 'AKS, Functions, SQL DB, App Gateway' },
                { icon: 'storage', label: 'Oracle Cloud', desc: 'Infraestructura cloud OCI' },
                { icon: 'bolt', label: 'Metodologías Ágiles', desc: 'Scrum · Jira · Azure Boards' },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center text-center p-8 bg-surface-container-highest rounded-xl hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-primary text-[4rem] mb-4">{item.icon}</span>
                  <p className="font-headline font-bold text-[1.8rem] text-on-surface mb-2">{item.label}</p>
                  <p className="font-body text-[1.3rem] text-outline">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Quote */}
        <div className="mt-40 border-l-2 border-outline-variant pl-12 py-8 ml-[10%]">
          <p className="font-headline text-[3.2rem] italic text-outline leading-tight font-light max-w-[30ch]">
            "La arquitectura cloud no es un destino, sino la infraestructura sobre la cual construimos soluciones resilientes y escalables."
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full py-12 bg-[#0b1326] flex flex-col items-center gap-6 px-10">
        <div className="flex gap-8">
          <a className="font-['Inter'] text-sm tracking-wide text-slate-500 hover:text-blue-300 transition-opacity opacity-80 hover:opacity-100" href="https://www.linkedin.com/in/raul-alejandro-chaparro-reyes/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="font-['Inter'] text-sm tracking-wide text-slate-500 hover:text-blue-300 transition-opacity opacity-80 hover:opacity-100" href="https://github.com/alejandrochreyes2" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="font-['Inter'] text-sm tracking-wide text-slate-500 hover:text-blue-300 transition-opacity opacity-80 hover:opacity-100" href="mailto:alejandrochreyes2@gmail.com">Email</a>
        </div>
        <p className="font-['Inter'] text-sm tracking-wide text-slate-500">
          © 2025 Alejandro Chaparro. Todos los derechos reservados.
        </p>
      </footer>
    </motion.div>
  );
}
