import { useState, useEffect } from "react";
import { BookOpen, RefreshCw, Sparkles, HelpCircle, FileText, Globe, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Header from "./components/Header";
import AssignPanel from "./components/AssignPanel";
import GuideReader from "./components/GuideReader";
import TopicsList from "./components/TopicsList";
import TeacherDashboard from "./components/TeacherDashboard";
import { Topic, Assignment } from "./types";

export default function App() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'pastel'>(() => {
    return (localStorage.getItem("theme") as 'dark' | 'pastel') || 'dark';
  });

  const [selectedClassroom, setSelectedClassroom] = useState<'DIGI' | 'TICO'>(() => {
    return (localStorage.getItem("scientific_classroom") as 'DIGI' | 'TICO') || 'DIGI';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'pastel' : 'dark';
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleClassroomChange = (cls: 'DIGI' | 'TICO') => {
    if (activeAssignment) return; // Locked when assignment exists
    setSelectedClassroom(cls);
    localStorage.setItem("scientific_classroom", cls);
  };

  // Fetch initial state from the Express backend
  const fetchData = async (overrideClassroom?: 'DIGI' | 'TICO') => {
    try {
      let activeCls = overrideClassroom || selectedClassroom;

      // Check if there is a saved assignment on this client/device
      const savedId = localStorage.getItem("scientific_assignment_id");
      
      // Load all assignments to see if savedId exists and what classroom it belongs to
      const assignmentsResAll = await fetch("/api/assignments");
      let resolvedAssignments: Assignment[] = [];
      if (assignmentsResAll.ok) {
        resolvedAssignments = await assignmentsResAll.json();
        if (savedId) {
          const match = resolvedAssignments.find((a: Assignment) => a.id === savedId);
          if (match) {
            setActiveAssignment(match);
            const resolvedClassroom = (match.classroom as 'DIGI' | 'TICO') || 'DIGI';
            activeCls = resolvedClassroom;
            setSelectedClassroom(resolvedClassroom);
            localStorage.setItem("scientific_classroom", resolvedClassroom);
          } else {
            localStorage.removeItem("scientific_assignment_id");
            setActiveAssignment(null);
          }
        } else {
          setActiveAssignment(null);
        }
      }

      const topicsRes = await fetch(`/api/topics?classroom=${activeCls}`);

      if (topicsRes.ok) {
        const topicsData = await topicsRes.json();

        setTopics(topicsData);
        setAssignments(resolvedAssignments);
      }
    } catch (error) {
      console.error("Error fetching data from server:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClassroom]);

  const handleAssigned = (newAssignment: Assignment) => {
    const cls = (newAssignment.classroom as 'DIGI' | 'TICO') || 'DIGI';
    setSelectedClassroom(cls);
    localStorage.setItem("scientific_classroom", cls);
    localStorage.setItem("scientific_assignment_id", newAssignment.id);
    setActiveAssignment(newAssignment);
    fetchData(cls);
  };

  const handleDeleteAssignment = async (id: string) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // If it was the active assignment on this device, clear it
        const savedId = localStorage.getItem("scientific_assignment_id");
        if (savedId === id) {
          localStorage.removeItem("scientific_assignment_id");
          setActiveAssignment(null);
          if (viewingAssignment?.id === id) {
            setViewingAssignment(null);
          }
        }

        // Refresh lists
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleUpdateAssignment = async (id: string, updates: Partial<Assignment>) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        const savedId = localStorage.getItem("scientific_assignment_id");
        if (savedId === id) {
          setActiveAssignment(updated);
          if (viewingAssignment?.id === id) {
            setViewingAssignment(updated);
          }
        }
        await fetchData();
      } else {
        const err = await res.json();
        throw new Error(err.error || "No se pudo actualizar");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  };

  const handleResetAll = async (classroom?: string) => {
    try {
      const res = await fetch("/api/assignments/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classroom }),
      });

      if (res.ok) {
        if (!classroom || (activeAssignment && (activeAssignment.classroom || 'DIGI').toUpperCase() === classroom.toUpperCase())) {
          localStorage.removeItem("scientific_assignment_id");
          setActiveAssignment(null);
          setViewingAssignment(null);
        }
        fetchData();
      }
    } catch (error) {
      console.error("Error resetting assignments:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const activeTopic = activeAssignment
    ? topics.find((t) => t.id === activeAssignment.topicId)
    : undefined;

  const viewingTopic = viewingAssignment
    ? topics.find((t) => t.id === viewingAssignment.topicId)
    : undefined;

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-16 font-sans ${
      theme === "dark" 
        ? "bg-slate-950 text-slate-200" 
        : "bg-[#f5f8fa] text-slate-800"
    }`} id="main-app-shell">
      {/* Navbar banner */}
      <nav className={`border-b py-3 px-4 sticky top-0 z-50 shadow-md print:hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900 border-slate-850 text-white"
          : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-cyan-500 rounded-sm rotate-45 flex items-center justify-center text-slate-950 shrink-0 shadow-xs shadow-cyan-500/20">
              <BookOpen className="w-3.5 h-3.5 -rotate-45" />
            </div>
            <span className={`text-xs font-mono font-black tracking-wider uppercase ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>
              Aprendiendo competencias STEM: Método Científico e Investigación
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Classroom Selector in navbar (only if not registered) */}
            {!activeAssignment ? (
              <div className={`flex items-center rounded-lg p-0.5 border text-xs font-mono font-bold ${
                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => handleClassroomChange('DIGI')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedClassroom === 'DIGI'
                      ? (theme === 'dark' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-cyan-600 text-white font-black')
                      : (theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                  }`}
                >
                  DIGI
                </button>
                <button
                  onClick={() => handleClassroomChange('TICO')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedClassroom === 'TICO'
                      ? (theme === 'dark' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-cyan-600 text-white font-black')
                      : (theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                  }`}
                >
                  TICO
                </button>
              </div>
            ) : (
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border ${
                theme === 'dark' 
                  ? 'bg-slate-950 border-slate-800 text-cyan-400' 
                  : 'bg-cyan-50 border-cyan-200 text-cyan-700'
              }`}>
                Grupo: {activeAssignment.classroom || 'DIGI'}
              </span>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 border rounded-md transition-all flex items-center gap-1.5 text-xs cursor-pointer font-mono font-bold ${
                theme === "dark"
                  ? "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-cyan-400"
                  : "bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700 hover:text-rose-800"
              }`}
              title={theme === "dark" ? "Activar Tema Claro Pastel" : "Activar Tema Oscuro"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Claro Pastel</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden md:inline">Tema Oscuro</span>
                </>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className={`p-1.5 border rounded-md transition-colors flex items-center gap-1.5 text-xs cursor-pointer font-mono font-bold ${
                theme === 'dark'
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-cyan-400'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
              } ${refreshing ? "animate-spin" : ""}`}
              title="Sincronizar datos"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 ${
              theme === 'dark'
                ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/20'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <Globe className="w-3 h-3 text-emerald-400 animate-pulse" /> Cambios guardados
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 md:pt-8" id="main-content-container">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4" id="app-loading-state">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
              theme === 'dark' ? 'border-cyan-500/20 border-t-cyan-500' : 'border-cyan-200 border-t-cyan-600'
            }`}></div>
            <p className={`text-sm font-semibold font-mono ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>Recopilando temas de investigación...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Description of the Educational Unit */}
            <Header theme={theme} selectedClassroom={selectedClassroom} />

            {/* Quick action: If they already have an assignment, show a banner to open their guide directly */}
            {activeAssignment && !viewingAssignment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-cyan-950/30 border border-cyan-500/40 text-white shadow-cyan-500/5'
                    : 'bg-cyan-50 border border-cyan-200 text-cyan-950 shadow-cyan-950/5'
                }`}
                id="active-assignment-quick-banner"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md hidden sm:block ${
                    theme === 'dark' ? 'bg-cyan-900/50 border border-cyan-500/30 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Vuestro grupo tiene un proyecto activo</h4>
                    <p className={`text-xs mt-0.5 leading-snug ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Tema: <strong className={theme === 'dark' ? 'text-cyan-400 font-extrabold' : 'text-cyan-700 font-extrabold'}>{activeTopic?.title}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewingAssignment(activeAssignment)}
                  className={`px-4 py-2 font-bold rounded-sm text-xs transition-colors cursor-pointer shrink-0 ${
                    theme === 'dark' ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-cyan-600 text-white hover:bg-cyan-700'
                  }`}
                >
                  Continuar Leyendo Guía
                </button>
              </motion.div>
            )}

            {/* Immersive AI Guide Document Viewer */}
            {viewingAssignment && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                id="active-guide-section"
              >
                <GuideReader
                  assignment={viewingAssignment}
                  topic={viewingTopic}
                  theme={theme}
                  onClose={() => setViewingAssignment(null)}
                />
              </motion.div>
            )}

            {/* Main interaction panels for assigning or browsing topics */}
            {!viewingAssignment && (
              <div className="space-y-6">
                {/* Sorteador / Raffle Assigner Panel */}
                <AssignPanel
                  topics={topics}
                  onAssigned={handleAssigned}
                  activeAssignment={activeAssignment}
                  onViewGuide={(as) => setViewingAssignment(as)}
                  theme={theme}
                  selectedClassroom={selectedClassroom}
                  onClassroomChange={handleClassroomChange}
                />

                {/* Catalog of 49 topics */}
                <TopicsList topics={topics} theme={theme} selectedClassroom={selectedClassroom} />

                {/* Collapsible Teacher dashboard */}
                <TeacherDashboard
                  assignments={assignments}
                  topics={topics}
                  theme={theme}
                  onDeleteAssignment={handleDeleteAssignment}
                  onResetAll={handleResetAll}
                  onUpdateAssignment={handleUpdateAssignment}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <footer className={`border-t py-8 mt-12 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-950/80 border-slate-900 text-slate-500' 
          : 'bg-white border-slate-150 text-slate-400'
      }`} id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs md:text-sm font-mono tracking-wide leading-relaxed">
          Recurso didáctico creado por <span className={theme === 'dark' ? 'text-slate-300 font-medium' : 'text-slate-600 font-medium'}>Jose Alberto García Gutiérrez</span> para el <strong className={theme === 'dark' ? 'text-cyan-400 font-bold' : 'text-rose-600 font-bold'}>I.E.S Martiricos de Málaga</strong>
        </div>
      </footer>
    </div>
  );
}
