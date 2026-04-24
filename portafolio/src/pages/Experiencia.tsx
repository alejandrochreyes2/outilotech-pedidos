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
          <span className="material-symbols-outlined text-blue-200 text-3xl">terminal</span>
          <span className="font-['Space_Grotesk'] font-bold text-2xl uppercase tracking-tighter text-blue-100">Alejandro Chaparro</span>
        </div>
        <nav className="hidden md:flex gap-12">
          <Link className="font-['Manrope'] font-medium text-lg transition-colors text-blue-300" to="/experiencia">Experiencia</Link>
          <Link className="font-['Manrope'] font-medium text-lg transition-colors text-slate-400 hover:text-blue-200" to="/habilidades">Habilidades</Link>
          <Link className="font-['Manrope'] font-medium text-lg transition-colors text-slate-400 hover:text-blue-200" to="/#proyectos">Proyectos</Link>
        </nav>
      </header>

      {/* NavigationDrawer (Desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-80 z-[60] py-8 flex-col bg-[#131b2e] shadow-2xl">
        <div className="px-8 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-highest cursor-pointer flex items-center justify-center" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined text-primary text-[3.2rem]">person</span>
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-blue-100 text-xl font-bold">Alejandro Chaparro</h2>
              <p className="font-['Manrope'] text-sm text-slate-400">Líder Técnico Cloud Backend</p>
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
          <p className="text-xs text-slate-500 font-['Inter']">v1.0.0</p>
        </div>
      </aside>

      <main className="lg:ml-80 pt-32 pb-20 px-8 md:px-16 max-w-[1400px]">
        {/* Hero Title Section */}
        <section className="mb-24">
          <h1 className="font-headline font-bold text-[5.6rem] leading-none tracking-tighter text-primary mb-8 md:ml-[10%]">
            Experiencia<span className="text-on-surface-variant">.</span>
          </h1>
          <p className="font-body text-[1.8rem] text-on-surface-variant max-w-[65ch] md:ml-[10%] leading-relaxed">
            Trayectoria en arquitectura cloud backend, liderazgo técnico y desarrollo de microservicios en entornos corporativos de alta demanda. Más de 6 años construyendo soluciones escalables y seguras.
          </p>
        </section>

        {/* Experience Timeline */}
        <section className="editorial-grid">

          {/* Entry 1: Control Online International */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 relative">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">Mayo 2025 — Jul 2025</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">Control Online International</h3>
                <span className="font-label text-xs text-slate-500 uppercase tracking-widest">COI · Colombia</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Coordinador de Proyectos TI / Líder Técnico Backend</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Lideré la coordinación de equipos de desarrollo backend para implementación de soluciones en la nube enfocadas en tablas de retención documental (software ControlDoc).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Logros Clave</h4>
                      <ul className="space-y-3 font-body text-base text-on-surface-variant">
                        <li className="flex gap-3"><span className="text-primary">/</span> Microservicios en .NET 8 y C# con alta disponibilidad.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Pipelines CI/CD con Azure DevOps automatizados.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> WAF con reglas OWASP: mitigación SQL injection, XSS, CSRF.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Migración de componentes a Docker y Kubernetes.</li>
                      </ul>
                    </div>
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Tecnologías</h4>
                      <div className="flex flex-wrap gap-3">
                        {['.NET 8', 'C#', 'Azure DevOps', 'Docker', 'Kubernetes', 'WAF OWASP', 'SonarCloud'].map(t => (
                          <span key={t} className="px-3 py-1 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Entry 2: Global Hitss (Claro) */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 pt-16 border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">Mayo 2024 — Feb 2025</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">Global Hitss (Claro)</h3>
                <span className="font-label text-xs text-slate-500 uppercase tracking-widest">Colombia</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Líder Técnico Senior Cloud Backend</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Diseñé arquitecturas escalables en Microsoft Azure (AKS, Functions, SQL Database) para soluciones de e-commerce y B2B. Lideré la migración de aplicaciones monolíticas a microservicios con patrones CQRS y MVC.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Logros Clave</h4>
                      <ul className="space-y-3 font-body text-base text-on-surface-variant">
                        <li className="flex gap-3"><span className="text-primary">/</span> Pipelines CI/CD con Azure DevOps y GitHub Actions.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Azure Application Gateway + WAF en modo prevención.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Gerente de proyectos WhatsApp e IA, aprobando HLS.</li>
                        <li className="flex gap-3"><span className="text-primary">/</span> Ceremonias Scrum con Jira y Azure Boards.</li>
                      </ul>
                    </div>
                    <div className="p-8 bg-surface-container-low rounded-xl">
                      <h4 className="font-label text-sm text-blue-300 uppercase tracking-widest mb-4">Tecnologías</h4>
                      <div className="flex flex-wrap gap-3">
                        {['Azure AKS', 'Java', '.NET', 'GitHub Actions', 'CQRS', 'MVC', 'WAF', 'Jira', 'Scrum'].map(t => (
                          <span key={t} className="px-3 py-1 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Entry 3: Tim We Colombia */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 pt-16 border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">Jun 2022 — Nov 2023</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">Tim We Colombia Ltda</h3>
                <span className="font-label text-xs text-slate-500 uppercase tracking-widest">Telecomunicaciones</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Especialista en Tecnologías Cloud</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Lideré diseño e implementación de soluciones backend en AWS y Oracle Cloud para operadores de telecomunicaciones ENTEL Chile y Perú. Microservicios Java (Spring Boot) orquestados con Kubernetes y OpenShift.
                  </p>
                  <div className="flex gap-4 flex-wrap mt-6">
                    {['Java Spring Boot', 'AWS', 'Oracle Cloud', 'Kubernetes', 'OpenShift', 'SonarCloud', 'Jest', 'React Testing Library'].map(t => (
                      <span key={t} className="px-4 py-2 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Entry 4: Migración Colombia */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 pt-16 border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">Feb 2021 — Dic 2021</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">Migración Colombia</h3>
                <span className="font-label text-xs text-slate-500 uppercase tracking-widest">Entidad Pública</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Ingeniero de Sistemas – Desarrollador Backend</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Líder técnico en el desarrollo del sistema web CDI (Control Disciplinario Interno). APIs RESTful en Java Spring Boot y .NET Core, integración de Azure Application Gateway con WAF y Azure Sentinel para seguridad.
                  </p>
                  <div className="mt-8 p-1 bg-gradient-to-r from-primary to-primary-container rounded-xl">
                    <div className="bg-surface rounded-[0.5rem] p-8">
                      <blockquote className="italic text-on-surface-variant font-body text-xl">
                        "Optimicé aplicaciones SOA mejorando la eficiencia de los servicios backend y apoyé la migración de aplicaciones legacy a entornos cloud."
                      </blockquote>
                      <cite className="block mt-4 text-primary font-label text-sm uppercase tracking-wider">— Proyecto CDI · Migración Colombia</cite>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Entry 5: Grupo TSM */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 pt-16 border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">Ago 2019 — Nov 2020</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">Grupo TSM</h3>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Programador Junior</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Desarrollé servicios web (SOAP y REST) en Java y ASP.NET, y APIs para integración de aplicaciones. Administré bases de datos MySQL, incluyendo triggers y procedimientos almacenados.
                  </p>
                  <div className="flex gap-4 flex-wrap mt-6">
                    {['Java', 'ASP.NET', 'SOAP', 'REST', 'MySQL', 'Stored Procedures'].map(t => (
                      <span key={t} className="px-4 py-2 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Entry 6: Rhinoarts */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 pt-16 border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">Jul 2017 — Jul 2020</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">Rhinoarts</h3>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Desarrollador Web</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Desarrollé y mantuve aplicaciones web con enfoque backend en PHP y MySQL. Colaboré en el diseño de bases de datos y la implementación de funcionalidades del lado del servidor.
                  </p>
                  <div className="flex gap-4 flex-wrap mt-6">
                    {['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'].map(t => (
                      <span key={t} className="px-4 py-2 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Entry 7: XCELUX */}
          <article className="col-span-12 lg:col-span-10 lg:col-start-2 mb-16 pt-16 border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/4 shrink-0">
                <span className="font-label text-blue-400 text-lg font-bold tracking-widest uppercase">Ene 2010 — May 2017</span>
                <h3 className="font-headline text-3xl text-blue-100 mt-2">XCELUX</h3>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-4xl text-primary font-bold mb-6">Ingeniero de Desarrollo</h2>
                <div className="space-y-6">
                  <p className="font-body text-lg text-on-surface leading-relaxed max-w-[70ch]">
                    Desarrollé aplicaciones móviles y web con Java para smartphones. Configuré Azure Application Gateway con WAF y Azure Sentinel para proyectos internos. Gestioné proyectos de desarrollo de software y soporte técnico.
                  </p>
                  <div className="flex gap-4 flex-wrap mt-6">
                    {['Java', 'Android', 'Azure WAF', 'Azure Sentinel', 'Soporte TI'].map(t => (
                      <span key={t} className="px-4 py-2 bg-surface-container-highest text-primary-fixed-dim font-label text-xs tracking-widest uppercase rounded-sm">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

        </section>
      </main>

      {/* Footer */}
      <footer className="relative w-full py-12 bg-[#0b1326] flex flex-col items-center gap-6 px-10">
        <div className="flex gap-8">
          <a className="text-slate-500 hover:text-blue-300 transition-opacity font-['Inter'] text-sm tracking-wide" href="https://linkedin.com/in/alejandro-chaparro" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="text-slate-500 hover:text-blue-300 transition-opacity font-['Inter'] text-sm tracking-wide" href="https://github.com/alejandrochreyes2" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="text-slate-500 hover:text-blue-300 transition-opacity font-['Inter'] text-sm tracking-wide" href="mailto:alejandrochreyes2@gmail.com">Email</a>
        </div>
        <p className="text-slate-500 font-['Inter'] text-sm tracking-wide opacity-80">© 2025 Alejandro Chaparro. Todos los derechos reservados.</p>
        <div className="font-['Space_Grotesk'] text-blue-100 text-lg font-bold tracking-widest">ACR</div>
      </footer>
    </motion.div>
  );
}
