import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Tag, HelpCircle, CheckCircle, Info, GraduationCap } from "lucide-react";
import { Topic } from "../types.js";

interface TopicsListProps {
  topics: Topic[];
  onSelectTopic?: (topic: Topic) => void;
  theme?: 'dark' | 'pastel';
  selectedClassroom?: 'DIGI' | 'TICO';
}

export default function TopicsList({ topics, onSelectTopic, theme = "dark", selectedClassroom = "DIGI" }: TopicsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null);

  const isDark = theme === "dark";

  const toggleExpand = (id: number) => {
    setExpandedTopicId(expandedTopicId === id ? null : id);
  };

  // Filter topics based on search term
  const filteredTopics = topics.filter((topic) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = topic.title.toLowerCase().includes(term);
    const subtopicMatch = topic.subtopics.some((s) => s.toLowerCase().includes(term));
    const idMatch = topic.id.toString() === term;
    return titleMatch || subtopicMatch || idMatch;
  });

  return (
    <div className={`border rounded-xl p-6 shadow-lg transition-colors duration-300 ${
      isDark
        ? "bg-slate-900 border-slate-700"
        : "bg-white border-slate-200 shadow-slate-200/40"
    }`} id="topics-list-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <Tag className="w-5 h-5 text-cyan-500" /> Catálogo de Temas de Investigación
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Explora las preguntas iniciales y disponibilidad de los temas para el grupo <strong className="text-cyan-600 dark:text-cyan-400">{selectedClassroom}</strong>.
          </p>
        </div>

        {/* Search input */}
        <div className="relative max-w-sm w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar temas (ej: Marte, Enigma, Sol...)"
            className={`w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-colors ${
              isDark 
                ? "bg-slate-950 border-slate-750 text-slate-100 placeholder:text-slate-600" 
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
            }`}
          />
        </div>
      </div>

      {filteredTopics.length === 0 ? (
        <div className={`py-12 text-center border border-dashed rounded-lg ${
          isDark 
            ? "bg-slate-950/40 border-slate-800 text-slate-400" 
            : "bg-slate-50 border-slate-200 text-slate-500"
        }`}>
          <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-800"}`}>No se encontraron temas coincidentes</p>
          <p className="text-xs text-slate-500 mt-1">Prueba con otras palabras clave o borra la búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="topics-grid">
          {filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            const isAssigned = topic.isAssigned;

            return (
              <div
                key={topic.id}
                className={`border rounded-lg transition-all duration-200 ${
                  isDark
                    ? (isAssigned
                        ? "bg-slate-950/35 border-slate-800/80"
                        : isExpanded
                        ? "bg-slate-900/95 border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-md"
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-750 hover:shadow-sm")
                    : (isAssigned
                        ? "bg-slate-50/55 border-slate-100"
                        : isExpanded
                        ? "bg-cyan-50/15 border-cyan-500 ring-1 ring-cyan-500/10 shadow-sm"
                        : "bg-white border-slate-150 hover:border-slate-300 hover:shadow-xs")
                }`}
              >
                {/* Header portion */}
                <div
                  onClick={() => toggleExpand(topic.id)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-black rounded-sm border shrink-0 text-center min-w-[2.25rem] ${
                        isDark
                          ? (isAssigned
                              ? "bg-slate-950 border-slate-800 text-slate-600"
                              : "bg-cyan-950/50 border-cyan-500/30 text-cyan-400")
                          : (isAssigned
                              ? "bg-slate-100 border-slate-200 text-slate-400"
                              : "bg-cyan-50 border-cyan-200 text-cyan-700")
                      }`}
                    >
                      #{topic.id}
                    </span>

                    <div>
                      <h4
                        className={`text-sm font-bold leading-snug transition-colors ${
                          isAssigned 
                            ? (isDark 
                                ? "text-slate-550 line-through decoration-slate-700" 
                                : "text-slate-400 line-through decoration-slate-300") 
                            : (isDark ? "text-slate-100" : "text-slate-900")
                        }`}
                      >
                        {topic.title}
                      </h4>

                      {/* Assignment Badge */}
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {isAssigned ? (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm border ${
                            isDark 
                              ? "text-slate-500 bg-slate-950/60 border-slate-800/80" 
                              : "text-slate-500 bg-slate-100 border-slate-200"
                          }`}>
                            <CheckCircle className="w-3 h-3 text-slate-500" /> Reservado: {topic.assignedTo}
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border ${
                            isDark 
                              ? "text-emerald-400 bg-emerald-950/30 border-emerald-500/20" 
                              : "text-emerald-700 bg-emerald-50 border-emerald-200"
                          }`}>
                            DISPONIBLE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className="text-slate-500 hover:text-slate-300 focus:outline-none p-1 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Section Details */}
                {isExpanded && (
                  <div className={`px-4 pb-4 pt-2 border-t rounded-b-lg ${
                    isDark 
                      ? "border-slate-800 bg-slate-950/50" 
                      : "border-slate-100 bg-slate-50/50"
                  }`}>
                    <div className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-1 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Preguntas Iniciales de Investigación:
                    </div>
                    <ul className="space-y-1.5">
                      {topic.subtopics.map((sub, i) => (
                        <li key={i} className={`text-xs leading-relaxed flex items-start gap-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}>
                          <span className="text-cyan-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>

                    {onSelectTopic && !isAssigned && (
                      <div className={`mt-4 pt-3 border-t flex justify-end ${
                        isDark ? "border-slate-850" : "border-slate-100"
                      }`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTopic(topic);
                          }}
                          className={`px-3 py-1.5 border rounded-md text-xs font-bold transition-colors cursor-pointer ${
                            isDark 
                              ? "bg-cyan-950/50 border-cyan-500/40 hover:bg-cyan-900/40 text-cyan-400" 
                              : "bg-cyan-50 border-cyan-200 hover:bg-cyan-100 text-cyan-800"
                          }`}
                        >
                          Seleccionar para este grupo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
