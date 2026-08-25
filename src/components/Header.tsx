import { Microscope, ShieldCheck, Sparkles, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  theme?: 'dark' | 'pastel';
  selectedClassroom?: 'DIGI' | 'TICO';
}

export default function Header({ theme = "dark", selectedClassroom = "TICO" }: HeaderProps) {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-6 md:p-8 shadow-lg mb-8 transition-colors duration-300 ${
        isDark
          ? "bg-slate-900 border-slate-700 shadow-slate-950/20"
          : "bg-white border-slate-200 shadow-slate-200/50"
      }`}
      id="app-header-container"
    >
      <div className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-2.5 py-1 text-xs font-mono font-bold tracking-wider rounded-sm flex items-center gap-1.5 border ${
            isDark
              ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/40"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}>
            <Microscope className="w-3.5 h-3.5" /> UNIDAD DIDÁCTICA
          </span>
          <span className={`px-2.5 py-1 text-xs font-mono font-bold tracking-wider rounded-sm flex items-center gap-1.5 border ${
            isDark
              ? "bg-cyan-950/50 text-cyan-400 border-cyan-500/40"
              : "bg-cyan-50 text-cyan-700 border-cyan-200"
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" /> SOCIEDAD DE LA INFORMACIÓN Y STEM
          </span>
          <span className={`px-2.5 py-1 text-xs font-mono font-black tracking-wider rounded-sm flex items-center gap-1.5 border ${
            isDark
              ? "bg-fuchsia-950/50 text-fuchsia-400 border-fuchsia-500/40"
              : "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
          }`}>
            <GraduationCap className="w-3.5 h-3.5" /> GRUPO: {selectedClassroom === "DIGI" ? "DIGITALIZACIÓN (DIGI)" : "BACHILLERATO (TICO)"}
          </span>
        </div>

        <h1 className={`text-3xl md:text-4xl font-black tracking-tight leading-tight transition-colors ${
          isDark ? "text-white" : "text-slate-900"
        }`} id="main-title">
          MÉTODO CIENTÍFICO y CIUDADANÍA DIGITAL
        </h1>
        <div className="h-1 w-20 bg-cyan-500 mt-4 mb-6"></div>

        <p className={`text-sm md:text-base leading-relaxed mb-8 max-w-3xl transition-colors ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}>
          Bienvenidos al asignador de proyectos de investigación. En esta unidad aprenderemos a formular hipótesis, diseñar experimentos, contrastar afirmaciones en la red y estructurar un trabajo científico riguroso. Cada grupo recibirá un tema de investigación único y una guía detallada para orientar sus descubrimientos aplicando el método científico.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6 transition-colors duration-300 border-slate-800" style={{ borderColor: isDark ? undefined : "#e2e8f0" }} id="objectives-grid">
          <div className={`flex gap-4 p-4 rounded-lg border transition-colors ${
            isDark ? "bg-slate-950/30 border-slate-800/80" : "bg-slate-50/50 border-slate-100"
          }`}>
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-sm rotate-45 flex items-center justify-center shrink-0 mt-1">
              <Microscope className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h4 className={`font-bold text-sm mb-1 ${isDark ? "text-white" : "text-slate-950"}`}>Rigor Científico</h4>
              <p className={`text-xs leading-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Aprende a formular hipótesis lógicas, manejar magnitudes físicas y buscar explicaciones racionales.
              </p>
            </div>
          </div>

          <div className={`flex gap-4 p-4 rounded-lg border transition-colors ${
            isDark ? "bg-slate-950/30 border-slate-800/80" : "bg-slate-50/50 border-slate-100"
          }`}>
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-sm rotate-45 flex items-center justify-center shrink-0 mt-1">
              <ShieldCheck className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h4 className={`font-bold text-sm mb-1 ${isDark ? "text-white" : "text-slate-950"}`}>Filtrado Crítico</h4>
              <p className={`text-xs leading-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Detecta noticias falsas (fake news), pseudociencia y sesgos cognitivos en internet contrastando fuentes fiables.
              </p>
            </div>
          </div>

          <div className={`flex gap-4 p-4 rounded-lg border transition-colors ${
            isDark ? "bg-slate-950/30 border-slate-800/80" : "bg-slate-50/50 border-slate-100"
          }`}>
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-sm rotate-45 flex items-center justify-center shrink-0 mt-1">
              <Sparkles className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h4 className={`font-bold text-sm mb-1 ${isDark ? "text-white" : "text-slate-950"}`}>Producto Creativo</h4>
              <p className={`text-xs leading-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Usa de forma ética herramientas de IA y multimedia para crear infografías o vídeos de divulgación amena.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
