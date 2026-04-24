import { useEffect, useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase, Proyecto } from '../lib/supabase';

export default function Admin() {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Proyecto> | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/mi-logincito-bonito');
      } else {
        fetchProyectos();
      }
    };
    checkUser();
  }, [navigate]);

  const fetchProyectos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setProyectos(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    // Custom visual confirm missing, simplified for brevity here
    const { error } = await supabase.from('proyectos').delete().eq('id', id);
    if (!error) {
      fetchProyectos();
    }
  };

  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (currentProject?.id) {
      // Update
      const { error } = await supabase
        .from('proyectos')
        .update(currentProject)
        .eq('id', currentProject.id);
      if (!error) {
        setShowModal(false);
        fetchProyectos();
      }
    } else {
      // Insert
      const { error } = await supabase
        .from('proyectos')
        .insert([currentProject]);
      if (!error) {
        setShowModal(false);
        fetchProyectos();
      }
    }
  };

  const openForm = (project: Partial<Proyecto> | null = null) => {
    setCurrentProject(project || {
      nombre: '', descripcion: '', tecnologias: [], enlace: '', imagen: '', categoria: 'Web Application', estado: 'ONLINE'
    });
    setShowModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-hidden min-h-screen bg-surface"
    >
      {/* NavigationDrawer */}
      <aside className="fixed left-0 top-0 h-full w-[32rem] z-[60] py-8 flex flex-col admin-sidebar shadow-2xl transition-all duration-300">
        <div className="px-8 mb-12 flex items-center gap-4">
          <span className="material-symbols-outlined text-[3.2rem] text-admin-accent">terminal</span>
          <div>
            <h1 className="font-headline font-bold text-[2rem] tracking-widest text-blue-100 uppercase">Alejandro Chaparro</h1>
            <p className="font-label text-[1.2rem] text-slate-400 tracking-tighter">ADMIN PANEL v1.0.0</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <Link className="flex items-center gap-6 text-blue-200 font-bold border-l-4 border-admin-accent pl-8 py-4 bg-blue-900/20 tonal-transition" to="/admin">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span className="text-[1.8rem]">Administración</span>
          </Link>
          <Link className="flex items-center gap-6 text-slate-400 pl-8 py-4 hover:text-white hover:bg-[#2d3449] transition-all" to="/">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[1.8rem]">Ver Portafolio</span>
          </Link>
        </nav>
        <div className="mt-auto px-8 py-8 border-t border-outline-variant/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-white">person</span>
            </div>
            <div>
              <p className="font-headline font-medium text-[1.4rem] text-on-surface">Admin</p>
              <p className="font-label text-[1.1rem] text-slate-500">Sesión Activa</p>
            </div>
            <button className="ml-auto text-slate-400 hover:text-error transition-colors" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[32rem] min-h-screen p-12 bg-surface">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-headline font-bold text-[4.8rem] text-on-surface tracking-tighter mb-2">Dashboard</h2>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-admin-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-admin-accent"></span>
              </span>
              <span className="font-label text-[1.4rem] text-admin-accent font-medium uppercase tracking-widest">Database Connected</span>
            </div>
          </div>
          <button 
            onClick={() => openForm()}
            className="bg-gradient-to-r from-admin-accent to-[#84cc16] text-surface font-bold py-4 px-8 rounded-xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
          >
            <span className="material-symbols-outlined font-bold">add</span>
            <span className="text-[1.4rem]">Nuevo Proyecto</span>
          </button>
        </header>

        {/* Projects Table */}
        <section className="bg-surface-container-low rounded-3xl overflow-hidden ghost-border">
          <div className="p-10 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-headline text-[2.4rem] font-bold text-on-surface">Gestión de Proyectos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-lowest/50 font-label text-[1.2rem] uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-10 py-6 font-medium">Proyecto</th>
                  <th className="px-10 py-6 font-medium">Categoría</th>
                  <th className="px-10 py-6 font-medium">Status</th>
                  <th className="px-10 py-6 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-[1.4rem]">
                {loading ? (
                  <tr><td colSpan={4} className="px-10 py-8 text-center text-slate-400">Cargando...</td></tr>
                ) : proyectos.length === 0 ? (
                  <tr><td colSpan={4} className="px-10 py-8 text-center text-slate-400">No hay proyectos.</td></tr>
                ) : (
                  proyectos.map((proy) => (
                    <tr key={proy.id} className="border-b border-outline-variant/5 hover:bg-white/5 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg bg-surface-container-highest overflow-hidden">
                            {proy.imagen && <img src={proy.imagen} alt={proy.nombre} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-bold text-blue-100">{proy.nombre}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-slate-400">{proy.categoria}</td>
                      <td className="px-10 py-8">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[1.2rem] font-bold ${proy.estado === 'ONLINE' ? 'bg-admin-accent/10 text-admin-accent' : 'bg-blue-400/10 text-blue-400'}`}>
                          <span className={`w-2 h-2 rounded-full ${proy.estado === 'ONLINE' ? 'bg-admin-accent' : 'bg-blue-400'}`}></span>
                          {proy.estado}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openForm(proy)} className="p-2 text-slate-400 hover:text-admin-accent transition-colors"><span className="material-symbols-outlined">edit</span></button>
                          <button onClick={() => handleDelete(proy.id)} className="p-2 text-slate-400 hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center">
          <form onSubmit={handleSaveProject} className="glass-panel p-8 rounded-2xl w-full max-w-[60rem] max-h-[90vh] overflow-y-auto m-4 border border-outline-variant text-on-surface">
            <h3 className="font-headline text-[3rem] font-bold mb-6">{currentProject?.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[1.4rem] text-slate-400 mb-2">Nombre</label>
                <input required className="w-full bg-surface-container-lowest border border-outline-variant p-3 text-[1.6rem] rounded-lg" value={currentProject?.nombre || ''} onChange={(e) => setCurrentProject({...currentProject, nombre: e.target.value})} />
              </div>
              <div>
                <label className="block text-[1.4rem] text-slate-400 mb-2">Descripción</label>
                <textarea required className="w-full bg-surface-container-lowest border border-outline-variant p-3 text-[1.6rem] rounded-lg h-32" value={currentProject?.descripcion || ''} onChange={(e) => setCurrentProject({...currentProject, descripcion: e.target.value})} />
              </div>
              <div>
                <label className="block text-[1.4rem] text-slate-400 mb-2">Tecnologías (separadas por coma)</label>
                <input required className="w-full bg-surface-container-lowest border border-outline-variant p-3 text-[1.6rem] rounded-lg" value={currentProject?.tecnologias?.join(', ') || ''} onChange={(e) => setCurrentProject({...currentProject, tecnologias: e.target.value.split(',').map(s => s.trim())})} />
              </div>
              <div>
                <label className="block text-[1.4rem] text-slate-400 mb-2">URL Imagen (ej: /img/outiltech.PNG)</label>
                <input type="text" className="w-full bg-surface-container-lowest border border-outline-variant p-3 text-[1.6rem] rounded-lg" value={currentProject?.imagen || ''} onChange={(e) => setCurrentProject({...currentProject, imagen: e.target.value})} />
              </div>
              <div>
                <label className="block text-[1.4rem] text-slate-400 mb-2">Enlace Proyecto</label>
                <input type="url" className="w-full bg-surface-container-lowest border border-outline-variant p-3 text-[1.6rem] rounded-lg" value={currentProject?.enlace || ''} onChange={(e) => setCurrentProject({...currentProject, enlace: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[1.4rem] text-slate-400 mb-2">Categoría</label>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant p-3 text-[1.6rem] rounded-lg" value={currentProject?.categoria || ''} onChange={(e) => setCurrentProject({...currentProject, categoria: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-[1.4rem] text-slate-400 mb-2">Estado</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant p-3 text-[1.6rem] rounded-lg" value={currentProject?.estado || 'ONLINE'} onChange={(e) => setCurrentProject({...currentProject, estado: e.target.value as any})}>
                    <option value="ONLINE">ONLINE</option>
                    <option value="ARCHIVADO">ARCHIVADO</option>
                    <option value="EN_DESARROLLO">EN_DESARROLLO</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8 justify-end">
              <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-[1.4rem] text-slate-400 hover:text-white">Cancelar</button>
              <button type="submit" className="bg-admin-accent text-surface px-8 py-3 rounded-lg font-bold text-[1.4rem]">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}
