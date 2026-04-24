import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [secretWord, setSecretWord] = useState('');
  const [errorSecret, setErrorSecret] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // btoa('PEPINO') === 'UEVQSU5P'
  const handleSecretSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (btoa(secretWord.toUpperCase()) === 'UEVQSU5P') {
      setUnlocked(true);
      setErrorSecret('');
    } else {
      setErrorSecret('Palabra secreta incorrecta.');
    }
  };

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registro exitoso. Revisa tu email para confirmar (si aplica) o inicia sesión.');
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Obtenemos la sesion o usuario para confirmar
        navigate('/admin');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[40rem] h-[40rem] rounded-full bg-primary-container/5 blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-12 rounded-2xl w-full max-w-[50rem] relative z-10 ghost-border"
      >
        <div className="flex items-center gap-4 mb-10 justify-center">
          <span className="material-symbols-outlined text-admin-accent text-[3.2rem]" data-icon="lock_person">lock_person</span>
          <h1 className="font-headline font-bold text-[3.2rem] text-on-surface">Area Segura</h1>
        </div>

        {!unlocked ? (
          <form onSubmit={handleSecretSubmit} className="space-y-8">
            <p className="font-body text-[1.6rem] text-slate-400 text-center mb-6">
              Para continuar, introduce la palabra secreta del sistema.
            </p>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-0 text-[1.8rem] font-body focus:ring-0 focus:border-admin-accent transition-all text-white placeholder:text-outline/50" 
                type="password" 
                placeholder="Palabra secreta" 
                value={secretWord}
                onChange={(e) => setSecretWord(e.target.value)}
                required 
              />
            </div>
            {errorSecret && <p className="text-error font-label text-[1.4rem]">{errorSecret}</p>}
            <button 
              className="w-full bg-admin-accent/20 text-admin-accent border border-admin-accent/50 py-4 rounded-xl font-bold font-headline text-[1.6rem] hover:bg-admin-accent hover:text-surface transition-all"
              type="submit"
            >
              Desbloquear
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-8 animate-fade-in">
            <p className="font-body text-[1.6rem] text-slate-400 text-center mb-6">
              {isRegistering ? 'Crear una nueva cuenta' : 'Iniciar sesión en el dashboard'}
            </p>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-0 text-[1.8rem] font-body focus:ring-0 focus:border-admin-accent transition-all text-white placeholder:text-outline/50" 
                type="email" 
                placeholder="Correo electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-0 text-[1.8rem] font-body focus:ring-0 focus:border-admin-accent transition-all text-white placeholder:text-outline/50" 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            {authError && <p className="text-error font-label text-[1.4rem]">{authError}</p>}
            <button 
              className="w-full bg-gradient-to-r from-admin-accent to-[#84cc16] text-surface py-4 rounded-xl font-bold font-headline text-[1.6rem] hover:scale-[1.02] transition-transform"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Entrar')}
            </button>
            <div className="text-center mt-6">
              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-slate-400 hover:text-admin-accent font-label text-[1.4rem] transition-colors"
              >
                {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
