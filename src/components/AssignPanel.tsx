import React, { useState, useEffect } from "react";
import { Sparkles, Users, Shuffle, CheckCircle, FileText, ArrowRight, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Topic, Assignment } from "../types.js";

interface AssignPanelProps {
  topics: Topic[];
  onAssigned: (assignment: Assignment) => void;
  activeAssignment: Assignment | null;
  onViewGuide: (assignment: Assignment) => void;
  theme?: 'dark' | 'pastel';
  selectedClassroom: 'DIGI' | 'TICO';
  onClassroomChange: (cls: 'DIGI' | 'TICO') => void;
}

export default function AssignPanel({
  topics,
  onAssigned,
  activeAssignment,
  onViewGuide,
  theme = "dark",
  selectedClassroom,
  onClassroomChange
}: AssignPanelProps) {
  const [groupName, setGroupName] = useState("");
  const [students, setStudents] = useState("");
  const [formClassroom, setFormClassroom] = useState<'DIGI' | 'TICO'>(selectedClassroom);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawText, setDrawText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isDark = theme === "dark";

  // Keep formClassroom in sync with prop
  useEffect(() => {
    setFormClassroom(selectedClassroom);
  }, [selectedClassroom]);

  // Filter out already assigned topics for the raffle pool
  const availableTopics = topics.filter((t) => !t.isAssigned);

  const handleClassroomSelect = (cls: 'DIGI' | 'TICO') => {
    setFormClassroom(cls);
    onClassroomChange(cls);
  };

  const handleDraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!groupName.trim()) {
      setError("Por favor, introduce un nombre para tu grupo de trabajo.");
      return;
    }

    if (availableTopics.length === 0) {
      setError(`No quedan temas de investigación disponibles para el grupo académico ${formClassroom}. Todos han sido asignados.`);
      return;
    }

    setIsDrawing(true);

    // Simulated slot machine animation
    let duration = 2500; // ms
    let intervalTime = 80; // ms
    let elapsed = 0;

    const timer = setInterval(() => {
      const tempIndex = Math.floor(Math.random() * availableTopics.length);
      setDrawText(availableTopics[tempIndex].title);
      elapsed += intervalTime;

      if (elapsed >= duration) {
        clearInterval(timer);
        executeAssign();
      }
    }, intervalTime);
  };

  const executeAssign = async () => {
    try {
      const response = await fetch("/api/assignments/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName: groupName.trim(),
          students: students.trim(),
          classroom: formClassroom,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al asignar tema.");
      }

      onAssigned(data);
      setIsDrawing(false);
      setDrawText("");
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
      setIsDrawing(false);
      setDrawText("");
    }
  };

  return (
    <div className={`border rounded-xl p-6 shadow-lg mb-8 transition-colors duration-300 ${
      isDark
        ? "bg-slate-900 border-slate-700"
        : "bg-white border-slate-200 shadow-slate-200/40"
    }`} id="assign-panel-container">
      <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
        <Shuffle className="w-5 h-5 text-cyan-500 animate-spin-slow" /> Sorteador y Asignación de Temas
      </h2>

      <AnimatePresence mode="wait">
        {!activeAssignment && !isDrawing && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleDraw}
            className="space-y-4"
            id="assign-form"
          >
            {/* Classroom Selection Radios */}
            <div className={`p-4 rounded-lg border transition-all ${
              isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/80 border-slate-200"
            }`}>
              <span className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                Selecciona tu Grupo Académico *
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleClassroomSelect("DIGI")}
                  className={`flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all text-left cursor-pointer ${
                    formClassroom === "DIGI"
                      ? (isDark 
                          ? "bg-cyan-950/40 border-cyan-500/80 text-cyan-400 ring-1 ring-cyan-500/30" 
                          : "bg-cyan-50 border-cyan-500 text-cyan-800 font-bold")
                      : (isDark 
                          ? "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-slate-200" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800")
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <div>
                    <div className="text-xs font-bold font-mono">DIGI</div>
                    <div className="text-[10px] opacity-80 leading-tight">Digitalización de 4º ESO</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleClassroomSelect("TICO")}
                  className={`flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all text-left cursor-pointer ${
                    formClassroom === "TICO"
                      ? (isDark 
                          ? "bg-cyan-950/40 border-cyan-500/80 text-cyan-400 ring-1 ring-cyan-500/30" 
                          : "bg-cyan-50 border-cyan-500 text-cyan-800 font-bold")
                      : (isDark 
                          ? "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-slate-200" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800")
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <div>
                    <div className="text-xs font-bold font-mono">TICO</div>
                    <div className="text-[10px] opacity-80 leading-tight">Tecnología de la Inf. y Com. (1º Bachillerato)</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Nombre del Grupo / Equipo *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Ej: Grupo 3 - Los Viajeros del Tiempo"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-colors ${
                      isDark 
                        ? "bg-slate-950 border-slate-750 text-slate-100 placeholder:text-slate-600" 
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Integrantes del Grupo (opcional)
                </label>
                <input
                  type="text"
                  value={students}
                  onChange={(e) => setStudents(e.target.value)}
                  placeholder="Ej: Laura Martínez, Pedro Gómez, Sofia Sánz"
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-colors ${
                    isDark 
                      ? "bg-slate-950 border-slate-750 text-slate-100 placeholder:text-slate-600" 
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  }`}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/40 text-rose-300 text-xs rounded-md border border-rose-850 font-medium">
                ⚠️ {error}
              </div>
            )}

            <div className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50/80 border-slate-200"
            }`}>
              <div className={`text-xs leading-relaxed max-w-xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">¿Cómo funciona el sorteo?</span> Al pulsar el botón, el sistema asignará de manera justa un tema aleatorio entre los <span className="text-cyan-600 dark:text-cyan-400 font-bold">{availableTopics.length} temas disponibles</span> de la lista de 50 para vuestro grupo <strong className="text-cyan-600 dark:text-cyan-400">{formClassroom}</strong>. El tema quedará reservado exclusivamente para vosotros.
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-sm text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" /> Registrar Equipo y Sortear Tema
              </button>
            </div>
          </motion.form>
        )}

        {isDrawing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            id="drawing-state"
          >
            <div className="relative">
              <div className={`w-16 h-16 border-4 rounded-full animate-spin ${isDark ? "border-cyan-500/20 border-t-cyan-500" : "border-cyan-200 border-t-cyan-600"}`}></div>
              <Shuffle className="w-6 h-6 text-cyan-500 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="max-w-md">
              <h3 className={`text-sm font-mono font-bold uppercase tracking-widest animate-pulse ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Sorteando tema para {formClassroom}...
              </h3>
              <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400 mt-2 min-h-[3rem] px-4 italic leading-tight transition-all duration-75">
                "{drawText}"
              </p>
            </div>
          </motion.div>
        )}

        {activeAssignment && !isDrawing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`border rounded-xl p-6 transition-colors duration-300 ${
              isDark 
                ? "border-cyan-500/40 bg-cyan-950/15" 
                : "border-cyan-200 bg-cyan-50/50"
            }`}
            id="assigned-success-state"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className={`px-2.5 py-1 text-xs font-mono font-bold tracking-wider rounded-sm flex items-center gap-1.5 border w-fit ${
                  isDark 
                    ? "bg-cyan-950/60 text-cyan-400 border-cyan-500/40" 
                    : "bg-cyan-100 text-cyan-800 border-cyan-200"
                }`}>
                  <CheckCircle className="w-3.5 h-3.5" /> ¡TEMA ASIGNADO CON ÉXITO!
                </span>

                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Equipo: <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">{activeAssignment.groupName}</span>
                  <span className={`text-xs ml-2 px-2 py-0.5 rounded-sm font-mono ${isDark ? "bg-slate-950 text-slate-400" : "bg-slate-200 text-slate-700"}`}>
                    {activeAssignment.classroom || "DIGI"}
                  </span>
                </h3>

                {activeAssignment.students && (
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    <strong className={isDark ? "text-slate-300" : "text-slate-700"}>Integrantes:</strong> {activeAssignment.students}
                  </p>
                )}

                <div className={`mt-4 p-4 border rounded-lg max-w-2xl transition-colors duration-300 ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold tracking-wider mb-1">
                    TEMA CIENTÍFICO #{activeAssignment.topicId}
                  </div>
                  <h4 className={`text-lg font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    {topics.find((t) => t.id === activeAssignment.topicId)?.title || "Tema de Investigación"}
                  </h4>
                  <p className={`text-xs mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Este tema ya está guardado en el servidor para vuestro grupo académico. Podéis abrir la Guía Científica Personalizada para comenzar a redactar las hipótesis y responder las 25 preguntas adaptadas.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                <button
                  onClick={() => onViewGuide(activeAssignment)}
                  className="w-full px-5 py-3.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-sm text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-4.5 h-4.5" /> Abrir Guía de Investigación <ArrowRight className="w-4 h-4" />
                </button>
                <p className={`text-[10px] text-center font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  También podréis descargala en PDF.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
