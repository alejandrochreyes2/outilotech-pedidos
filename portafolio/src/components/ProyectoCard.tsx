import { Proyecto } from '../lib/supabase';

interface Props {
  proyecto: Proyecto;
}

export default function ProyectoCard({ proyecto }: Props) {
  return (
    <div className="bg-surface-container-low p-[4rem] group transition-all hover:bg-surface-container-high rounded-xl relative overflow-hidden flex flex-col h-full">
      <a href={proyecto.enlace} target="_blank" rel="noopener noreferrer" className="mb-6 h-[20rem] rounded-xl overflow-hidden bg-surface-container-highest block">
        <img
          src={proyecto.imagen || 'https://via.placeholder.com/600x400?text=Proyecto'}
          alt={proyecto.nombre}
          className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
      </a>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-headline text-[2.8rem] text-on-surface">{proyecto.nombre}</h3>
          <span className="font-label text-[1.2rem] bg-surface-container-highest px-3 py-1 rounded-full text-primary uppercase border border-outline-variant/30">{proyecto.categoria}</span>
        </div>
        <p className="font-body text-[1.6rem] text-on-surface-variant mb-8 flex-1">
          {proyecto.descripcion}
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          {proyecto.tecnologias.map((tech, i) => (
            <span key={i} className="bg-surface-container-highest px-4 py-1 text-[1.2rem] font-label text-primary uppercase rounded-md border border-outline-variant/20">{tech}</span>
          ))}
        </div>
        <div>
          <a 
            href={proyecto.enlace} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 text-primary font-bold text-[1.6rem] group-hover:text-primary-container transition-colors"
          >
            Explorar Proyecto <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  );
}
