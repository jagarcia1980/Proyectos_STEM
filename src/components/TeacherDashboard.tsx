import React, { useState } from "react";
import { Settings, Trash2, RotateCcw, ShieldAlert, AlertCircle, Edit2, FileDown, Lock, KeyRound, Check, X, GraduationCap } from "lucide-react";
import { Assignment, Topic } from "../types.js";
import { jsPDF } from "jspdf";
import { TOPICS } from "../data/topics.js";

interface TeacherDashboardProps {
  assignments: Assignment[];
  topics: Topic[];
  onDeleteAssignment: (id: string) => void;
  onResetAll: (classroom?: string) => void;
  onUpdateAssignment: (id: string, updates: Partial<Assignment>) => Promise<void>;
  theme?: 'dark' | 'pastel';
}

export default function TeacherDashboard({
  assignments,
  topics,
  onDeleteAssignment,
  onResetAll,
  onUpdateAssignment,
  theme = "dark"
}: TeacherDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetTarget, setResetTarget] = useState<'DIGI' | 'TICO' | 'BOTH' | null>(null);
  const [filterClassroom, setFilterClassroom] = useState<'Todos' | 'DIGI' | 'TICO'>('Todos');

  const getResetWarnings = (target: 'DIGI' | 'TICO' | 'BOTH') => {
    const warnings: string[] = [];
    const classrooms: ('DIGI' | 'TICO')[] = target === 'BOTH' ? ['DIGI', 'TICO'] : [target];
    
    classrooms.forEach(cls => {
      const clsAssignments = assignments.filter(as => (as.classroom || 'DIGI').toUpperCase() === cls);
      if (clsAssignments.length > 0) {
        const hasUnfinished = clsAssignments.some(as => !as.grade || as.grade.trim() === "");
        const stateStr = clsAssignments.map(as => `${as.id}-${as.grade || ''}-${as.comments || ''}-${as.topicId}`).sort().join('|');
        const isDownloaded = localStorage.getItem(`pdf_state_${cls}`) === stateStr;
        
        if (hasUnfinished) {
          warnings.push(`Hay proyectos de ${cls === 'DIGI' ? 'DIGI' : 'TICO'} pendientes de calificación.`);
        }
        if (!isDownloaded) {
          warnings.push(`No se ha descargado el reporte PDF final para el aula ${cls === 'DIGI' ? 'DIGI' : 'TICO'} con las últimas calificaciones.`);
        }
      }
    });
    
    return warnings;
  };

  // Edit states
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editTopicId, setEditTopicId] = useState<number>(1);
  const [editStudents, setEditStudents] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editComments, setEditComments] = useState("");
  const [editClassroom, setEditClassroom] = useState<'DIGI' | 'TICO'>('DIGI');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const isDark = theme === "dark";

  const getTopicTitle = (topicId: number) => {
    return TOPICS.find((t) => t.id === topicId)?.title || topics.find((t) => t.id === topicId)?.title || `Tema #${topicId}`;
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Hace poco";
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "2812") {
      setIsAuthenticated(true);
      setPinError("");
      setPin("");
    } else {
      setPinError("PIN incorrecto. Introduce el código de acceso docente.");
    }
  };

  const startEditing = (as: Assignment) => {
    setEditingAssignment(as);
    setEditTopicId(as.topicId);
    setEditStudents(as.students || "");
    setEditGrade(as.grade || "");
    setEditComments(as.comments || "");
    setEditClassroom(as.classroom || 'DIGI');
    setEditError("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;

    setSavingEdit(true);
    setEditError("");
    try {
      await onUpdateAssignment(editingAssignment.id, {
        topicId: editTopicId,
        students: editStudents,
        grade: editGrade,
        comments: editComments,
        classroom: editClassroom
      });
      setEditingAssignment(null);
    } catch (err: any) {
      setEditError(err.message || "Error al actualizar la asignación.");
    } finally {
      setSavingEdit(false);
    }
  };

  const downloadGuidePDF = (as: Assignment) => {
    if (!as.guideMarkdown) return;

    const doc = new jsPDF();
    const topic = TOPICS.find((t) => t.id === as.topicId);
    if (!topic) return;

    // Helper to strip markdown and keep it clean
    const cleanPdfText = (text: string) => {
      return text
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .trim();
    };

    // Helper to parse the markdown sections
    const parseSections = (text: string) => {
      if (!text) return [];

      const sectionsList = [
        { id: 0, title: "1. Introducción al Tema", content: "" },
        { id: 1, title: "2. Enfoque desde el Método Científico", content: "" },
        { id: 2, title: "3. Ciudadanía Digital y Búsqueda de Información", content: "" },
        { id: 3, title: "4. Criterios de Evaluación del Proyecto", content: "" },
        { id: 4, title: "5. Cuestionario de Investigación (25 Preguntas)", content: "" },
      ];

      let hasSplitSuccessfully = false;

      try {
        const parts = text.split(/## \d\.\s*[^\n]+/g);
        if (parts.length >= 6) {
          sectionsList[0].content = parts[1].trim();
          sectionsList[1].content = parts[2].trim();
          sectionsList[2].content = parts[3].trim();
          sectionsList[3].content = parts[4].trim();
          sectionsList[4].content = parts[5].trim();
          hasSplitSuccessfully = true;
        }
      } catch (e) {
        console.warn("Could not split markdown, falling back:", e);
      }

      if (!hasSplitSuccessfully) {
        sectionsList[0].content = text;
        sectionsList[1].content = "_No disponible de forma separada._";
        sectionsList[2].content = "_No disponible de forma separada._";
        sectionsList[3].content = "_No disponible de forma separada._";
        sectionsList[4].content = "_No disponible de forma separada._";
      }

      return sectionsList;
    };

    const sections = parseSections(as.guideMarkdown);

    // Set styling for cover header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(3, 105, 120); // Dark Cyan
    doc.text("Guía Científica Personalizada", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Tema #${topic.id}: ${topic.title}`, 14, 26);
    doc.text(`Grupo de Investigación: ${as.groupName}`, 14, 31);
    doc.line(14, 34, 196, 34);

    let y = 44;

    sections.forEach((sec) => {
      if (y > 230) {
        doc.addPage();
        y = 20;
      }

      // Section Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(sec.title, 14, y);
      y += 8;

      const secLines = sec.content.split("\n");
      let lineIdx = 0;

      while (lineIdx < secLines.length) {
        const line = secLines[lineIdx];
        const trimmed = line.trim();

        // Skip blank lines
        if (!trimmed) {
          y += 4;
          lineIdx++;
          continue;
        }

        // Check for Table Block
        if (trimmed.startsWith("|")) {
          const tableLines: string[] = [];
          while (lineIdx < secLines.length && secLines[lineIdx].trim().startsWith("|")) {
            tableLines.push(secLines[lineIdx].trim());
            lineIdx++;
          }

          const isSeparator = (l: string) => {
            const clean = l.replace(/[|\-:\s]/g, "");
            return clean.length === 0;
          };

          const parsedRows = tableLines
            .filter(l => !isSeparator(l))
            .map(l => {
              const parts = l.split("|");
              if (parts[0] === "") parts.shift();
              if (parts[parts.length - 1] === "") parts.pop();
              return parts.map(cell => cell.trim());
            });

          if (parsedRows.length > 0) {
            const headers = parsedRows[0];
            const dataRows = parsedRows.slice(1);
            const numCols = headers.length || 1;
            const colWidth = 180 / numCols;

            const normalizedPdfDataRows = dataRows.map(row => {
              const newRow = [...row];
              while (newRow.length < numCols) {
                newRow.push("");
              }
              return newRow.slice(0, numCols);
            });

            if (y > 250) {
              doc.addPage();
              y = 20;
            }

            // Header Background and text
            doc.setFillColor(241, 245, 249);
            doc.rect(14, y, 180, 8, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42);

            headers.forEach((header, colIdx) => {
              doc.text(cleanPdfText(header), 16 + colIdx * colWidth, y + 5.5);
            });

            doc.setDrawColor(203, 213, 225);
            doc.setLineWidth(0.2);
            doc.line(14, y + 8, 194, y + 8);
            y += 8;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(51, 65, 85);

            normalizedPdfDataRows.forEach((row) => {
              let maxLines = 1;
              row.forEach((cell) => {
                const cleanCell = cleanPdfText(cell);
                const cellLines = doc.splitTextToSize(cleanCell, colWidth - 4);
                if (cellLines.length > maxLines) {
                  maxLines = cellLines.length;
                }
              });

              const rowHeight = (maxLines * 4.5) + 2.5;

              if (y + rowHeight > 275) {
                doc.addPage();
                y = 20;

                doc.setFillColor(241, 245, 249);
                doc.rect(14, y, 180, 8, "F");
                doc.setFont("helvetica", "bold");
                headers.forEach((header, colIdx) => {
                  doc.text(cleanPdfText(header), 16 + colIdx * colWidth, y + 5.5);
                });
                doc.line(14, y + 8, 194, y + 8);
                y += 8;
                doc.setFont("helvetica", "normal");
              }

              row.forEach((cell, colIdx) => {
                const cleanCell = cleanPdfText(cell);
                const cellLines = doc.splitTextToSize(cleanCell, colWidth - 4);
                doc.text(cellLines, 16 + colIdx * colWidth, y + 4.5);
              });

              doc.setDrawColor(241, 245, 249);
              doc.line(14, y + rowHeight, 194, y + rowHeight);
              y += rowHeight;
            });

            y += 5;
          }
          continue;
        }

        // Check for headings inside sections
        if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          const cleanHeading = cleanPdfText(trimmed.replace(/^#{1,3}\s+/, ""));

          if (y > 265) {
            doc.addPage();
            y = 20;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(trimmed.startsWith("### ") ? 10.5 : trimmed.startsWith("## ") ? 11.5 : 12.5);
          doc.setTextColor(15, 23, 42);

          doc.text(cleanHeading, 14, y + 5);
          y += 10;
          lineIdx++;
          continue;
        }

        // Check for list items
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ") || /^\d+\.\s+/.test(trimmed)) {
          let textStr = trimmed;
          let isNumbered = false;
          let prefix = "• ";

          if (/^\d+\.\s+/.test(trimmed)) {
            isNumbered = true;
            const match = trimmed.match(/^(\d+\.)\s+/);
            prefix = match ? match[1] + " " : "1. ";
            textStr = trimmed.replace(/^\d+\.\s+/, "");
          } else {
            textStr = trimmed.replace(/^[-*•]\s+/, "");
          }

          const cleanTextStr = cleanPdfText(textStr);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);

          const splitText = doc.splitTextToSize(cleanTextStr, 172);
          const blockHeight = (splitText.length * 5) + 2;

          if (y + blockHeight > 275) {
            doc.addPage();
            y = 20;
          }

          doc.setFont("helvetica", "bold");
          if (isNumbered) {
            doc.setTextColor(3, 105, 120); // Cyan
          }
          doc.text(prefix, 16, y + 4.5);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);

          splitText.forEach((pLine: string, idx: number) => {
            doc.text(pLine, 21, y + 4.5 + (idx * 5));
          });

          y += blockHeight;
          lineIdx++;
          continue;
        }

        // Check for Blockquote
        if (trimmed.startsWith("> ")) {
          const cleanQuote = cleanPdfText(trimmed.replace(/^>\s+/, ""));
          doc.setFont("italic");
          doc.setFontSize(9.5);
          doc.setTextColor(71, 85, 105);

          const splitText = doc.splitTextToSize(cleanQuote, 170);
          const blockHeight = (splitText.length * 5) + 4;

          if (y + blockHeight > 275) {
            doc.addPage();
            y = 20;
          }

          doc.setDrawColor(6, 182, 212); // cyan-500
          doc.setLineWidth(1);
          doc.line(14, y, 14, y + blockHeight - 2);

          splitText.forEach((qLine: string, idx: number) => {
            doc.text(qLine, 18, y + 4 + (idx * 5));
          });

          y += blockHeight;
          lineIdx++;
          continue;
        }

        // Regular paragraph text
        const cleanParagraphText = cleanPdfText(trimmed);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);

        const splitText = doc.splitTextToSize(cleanParagraphText, 180);
        const blockHeight = (splitText.length * 5) + 3;

        if (y + blockHeight > 275) {
          doc.addPage();
          y = 20;
        }

        splitText.forEach((pLine: string, idx: number) => {
          doc.text(pLine, 14, y + 4 + (idx * 5));
        });

        y += blockHeight;
        lineIdx++;
      }

      y += 10;
    });

    doc.save(`Guia_Investigacion_Tema_${topic.id}_${as.groupName.replace(/\s+/g, "_")}.pdf`);
  };

  const filteredAssignments = assignments.filter((as) => {
    if (filterClassroom === 'Todos') return true;
    return as.classroom === filterClassroom;
  });

  // Generate a beautiful teacher report PDF of all class assignments
  const downloadAssignmentsPDF = () => {
    const doc = new jsPDF();
    
    // Set typography and colors for the report
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(3, 105, 120); // Dark Cyan
    doc.text("Método Científico e Investigación", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Reporte Completo de Calificaciones y Asignaciones - Aula: ${filterClassroom}`, 14, 26);
    doc.line(14, 29, 196, 29);
    
    let y = 38;
    
    filteredAssignments.forEach((as, idx) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      // Group header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(`${idx + 1}. Grupo: ${as.groupName} (${as.classroom || 'DIGI'})`, 14, y);
      
      // Timestamp
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(formatDate(as.assignedAt), 150, y);
      y += 6;
      
      // Topic
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(6, 182, 212); // cyan-500
      doc.text(`Tema #${as.topicId}: ${getTopicTitle(as.topicId)}`, 14, y);
      y += 6;
      
      // Members
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text("Integrantes: ", 14, y);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(as.students || "Ninguno", 35, y);
      y += 5;
      
      // Grade
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("Calificación: ", 14, y);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(as.grade || "Pendiente de calificar", 35, y);
      y += 5;
      
      // Comments
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("Comentarios / Feedback: ", 14, y);
      
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 116, 139);
      const commentsText = as.comments || "Sin comentarios del docente.";
      const splitComments = doc.splitTextToSize(commentsText, 150);
      doc.text(splitComments, 55, y);
      
      y += (splitComments.length * 4.5) + 6;
      
      // Divider
      doc.setDrawColor(241, 245, 249);
      doc.line(14, y - 4, 196, y - 4);
      y += 4;
    });
    
    if (filterClassroom === 'Todos' || filterClassroom === 'DIGI') {
      const digiAssignments = assignments.filter(as => (as.classroom || 'DIGI').toUpperCase() === 'DIGI');
      const stateStr = digiAssignments.map(as => `${as.id}-${as.grade || ''}-${as.comments || ''}-${as.topicId}`).sort().join('|');
      localStorage.setItem(`pdf_state_DIGI`, stateStr);
    }
    if (filterClassroom === 'Todos' || filterClassroom === 'TICO') {
      const ticoAssignments = assignments.filter(as => (as.classroom || 'DIGI').toUpperCase() === 'TICO');
      const stateStr = ticoAssignments.map(as => `${as.id}-${as.grade || ''}-${as.comments || ''}-${as.topicId}`).sort().join('|');
      localStorage.setItem(`pdf_state_TICO`, stateStr);
    }

    doc.save(`Reporte_Docente_Investigacion_${filterClassroom}.pdf`);
  };

  return (
    <div className={`border rounded-xl p-5 mb-8 transition-colors duration-300 ${
      isDark
        ? "bg-slate-900 border-slate-800"
        : "bg-white border-slate-200 shadow-slate-200/40"
    }`} id="teacher-dashboard-container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-500 animate-spin-slow" />
          <div>
            <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Panel del Profesorado</h3>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Herramientas de gestión, edición, calificaciones y reinicios.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setConfirmReset(false);
            setResetTarget(null);
            if (isOpen) {
              setIsAuthenticated(false); // Relock when hidden
            }
          }}
          className={`px-4 py-2 text-xs font-bold rounded-md border transition-all cursor-pointer ${
            isOpen
              ? (isDark ? "bg-slate-850 text-white border-slate-700" : "bg-slate-200 text-slate-800 border-slate-300")
              : (isDark 
                  ? "bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-900 border-slate-800" 
                  : "bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200")
          }`}
        >
          {isOpen ? "Ocultar Panel" : "Abrir Panel de Gestión"}
        </button>
      </div>

      {isOpen && (
        <div className={`mt-5 border-t pt-5 space-y-6 ${isDark ? "border-slate-800" : "border-slate-200"}`} id="teacher-panel-content">
          {/* Lock screen if not authenticated */}
          {!isAuthenticated ? (
            <div className="py-8 max-w-sm mx-auto text-center space-y-4" id="pin-login-form">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${
                isDark 
                  ? "bg-cyan-950/45 border-cyan-500/30 text-cyan-400" 
                  : "bg-cyan-50 border-cyan-200 text-cyan-700"
              }`}>
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Acceso Restringido a Docentes</h4>
                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Introduce el PIN secreto de 4 dígitos para editar calificaciones, cambiar temas o resetear el aula.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-3">
                <div className="flex justify-center">
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value.replace(/\D/g, ""));
                      setPinError("");
                    }}
                    placeholder="••••"
                    className={`w-28 text-center border rounded-md py-2 font-mono text-xl tracking-widest focus:border-cyan-500 focus:outline-none ${
                      isDark 
                        ? "bg-slate-950 border-slate-800 text-cyan-400" 
                        : "bg-slate-50 border-slate-300 text-cyan-700 font-bold"
                    }`}
                    autoComplete="current-password"
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-rose-500 font-semibold">{pinError}</p>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs rounded-sm cursor-pointer transition-colors w-full max-w-[12rem] flex items-center justify-center gap-1.5 mx-auto"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Acceder al Panel
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Authenticated content */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Grupos Registrados ({filteredAssignments.length})
                    </h4>

                    {/* Classroom Filtering Tabs */}
                    <div className={`inline-flex rounded-lg p-0.5 border text-[11px] font-mono font-bold ${
                      isDark ? "bg-slate-950 border-slate-850" : "bg-slate-100 border-slate-250"
                    }`}>
                      {(['Todos', 'DIGI', 'TICO'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setFilterClassroom(opt)}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            filterClassroom === opt
                              ? (isDark ? "bg-cyan-500 text-slate-950 font-black" : "bg-cyan-600 text-white font-black")
                              : (isDark ? "text-slate-450 hover:text-white" : "text-slate-600 hover:text-slate-900")
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredAssignments.length > 0 && (
                    <button
                      onClick={downloadAssignmentsPDF}
                      className={`px-3 py-1.5 border rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isDark 
                          ? "bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-400 border-cyan-500/30" 
                          : "bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200"
                      }`}
                      title="Descargar calificaciones y feedback de toda la clase en PDF"
                    >
                      <FileDown className="w-4 h-4" /> Exportar Reporte {filterClassroom !== 'Todos' ? `(${filterClassroom})` : ""} (PDF)
                    </button>
                  )}
                </div>

                {filteredAssignments.length === 0 ? (
                  <div className={`p-6 border border-dashed rounded-lg text-center text-xs ${
                    isDark ? "bg-slate-950 border-slate-850 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}>
                    Todavía ningún grupo de {filterClassroom === 'Todos' ? "ninguna de las aulas" : `la clase ${filterClassroom}`} ha sorteado un tema.
                  </div>
                ) : (
                  <div className={`overflow-x-auto rounded-lg border shadow-inner ${
                    isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"
                  }`}>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`font-mono font-bold border-b ${
                          isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          <th className="p-3 uppercase tracking-wider text-[10px]">Grupo</th>
                          <th className="p-3 uppercase tracking-wider text-[10px]">Aula</th>
                          <th className="p-3 uppercase tracking-wider text-[10px]">Tema Científico</th>
                          <th className="p-3 uppercase tracking-wider text-[10px]">Integrantes</th>
                          <th className="p-3 uppercase tracking-wider text-[10px]">Calificación</th>
                          <th className="p-3 uppercase tracking-wider text-[10px]">Feedback / Observaciones</th>
                          <th className="p-3 uppercase tracking-wider text-[10px] text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssignments.map((as) => (
                          <tr key={as.id} className={`border-b last:border-0 transition-colors ${
                            isDark 
                              ? "border-slate-850 hover:bg-slate-900/30 text-slate-300" 
                              : "border-slate-150 hover:bg-slate-50 text-slate-700"
                          }`}>
                            <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">{as.groupName}</td>
                            <td className="p-3 font-mono">
                              <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border ${
                                isDark 
                                  ? "bg-slate-900 border-slate-800 text-slate-400" 
                                  : "bg-slate-100 border-slate-250 text-slate-650"
                              }`}>
                                {as.classroom || "DIGI"}
                              </span>
                            </td>
                            <td className={`p-3 font-semibold max-w-xs ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                              <span className={`px-1.5 py-0.5 rounded-sm text-[10px] mr-1.5 font-bold font-mono border ${
                                isDark 
                                  ? "bg-slate-900 border-slate-800 text-cyan-400" 
                                  : "bg-cyan-50 border-cyan-150 text-cyan-700"
                              }`}>
                                #{as.topicId}
                              </span>
                              {getTopicTitle(as.topicId)}
                            </td>
                            <td className={`p-3 italic max-w-xs truncate ${isDark ? "text-slate-400" : "text-slate-500"}`} title={as.students}>
                              {as.students || "—"}
                            </td>
                            <td className="p-3 font-mono font-bold">
                              {as.grade ? (
                                <span className={`px-2 py-0.5 rounded-sm border ${
                                  isDark 
                                    ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/40" 
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                }`}>
                                  {as.grade}
                                </span>
                              ) : (
                                <span className="text-slate-500 italic">No calificado</span>
                              )}
                            </td>
                            <td className={`p-3 max-w-xs truncate ${isDark ? "text-slate-400" : "text-slate-500"}`} title={as.comments}>
                              {as.comments || <span className="text-slate-500 italic opacity-60">Sin comentarios</span>}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {as.guideMarkdown ? (
                                  <button
                                    onClick={() => downloadGuidePDF(as)}
                                    className={`p-1.5 rounded-md transition-colors cursor-pointer border border-transparent ${
                                      isDark 
                                        ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20 hover:border-emerald-900/30" 
                                        : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200"
                                    }`}
                                    title="Descargar Guía de Investigación (PDF)"
                                  >
                                    <FileDown className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className={`p-1.5 rounded-md border border-transparent opacity-35 cursor-not-allowed ${
                                      isDark ? "text-slate-600" : "text-slate-400"
                                    }`}
                                    title="Guía de investigación aún no generada por los alumnos"
                                  >
                                    <FileDown className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => startEditing(as)}
                                  className={`p-1.5 rounded-md transition-colors cursor-pointer border border-transparent ${
                                    isDark 
                                      ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/20 hover:border-cyan-900/30" 
                                      : "text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50 hover:border-cyan-200"
                                  }`}
                                  title="Editar tema, integrantes, comentarios o calificación"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteAssignment(as.id)}
                                  className={`p-1.5 rounded-md transition-colors cursor-pointer border border-transparent ${
                                    isDark 
                                      ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 hover:border-rose-900/30" 
                                      : "text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200"
                                  }`}
                                  title="Liberar tema y borrar grupo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Dangerous Operations */}
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? "bg-rose-950/10 border-rose-900/40" 
                  : "bg-rose-50/50 border-rose-200"
              }`}>
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className={`text-xs font-bold ${isDark ? "text-rose-300" : "text-rose-800"}`}>Operaciones de Restablecimiento de Aula</h4>
                    <p className={`text-xs leading-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Estas acciones modifican permanentemente los datos del servidor. Se recomiendan para inicializar el aula al inicio de clase o al cambiar de trimestre.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  {!resetTarget ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setResetTarget('DIGI')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-sm text-xs font-bold flex items-center gap-1.5 border border-transparent transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Aula DIGI
                      </button>
                      <button
                        onClick={() => setResetTarget('TICO')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-sm text-xs font-bold flex items-center gap-1.5 border border-transparent transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Aula TICO
                      </button>
                      <button
                        onClick={() => setResetTarget('BOTH')}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-sm text-xs font-bold flex items-center gap-1.5 border border-transparent transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Ambas Aulas
                      </button>
                    </div>
                  ) : (
                    <div className={`p-4 border rounded-lg space-y-3 ${
                      isDark ? "bg-slate-950 border-rose-900/40" : "bg-white border-rose-300"
                    }`}>
                      <div className="flex items-start gap-2 text-rose-600">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold">
                            ¿Confirmas que deseas reiniciar las asignaciones de:{" "}
                            <strong className="underline text-sm font-extrabold">
                              {resetTarget === 'BOTH' ? 'AMBAS AULAS (DIGI y TICO)' : resetTarget === 'DIGI' ? 'AULA DIGI' : 'AULA TICO'}
                            </strong>? Esta acción borrará permanentemente todas las asignaciones de ese grupo.
                          </p>
                        </div>
                      </div>

                      {/* Warning Section */}
                      {getResetWarnings(resetTarget).length > 0 && (
                        <div className={`p-3 rounded-md border text-xs space-y-2 ${
                          isDark ? "bg-amber-950/20 border-amber-900/40 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}>
                          <div className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                            <ShieldAlert className="w-4 h-4 text-amber-500" /> Advertencias de Seguridad:
                          </div>
                          <ul className="list-disc pl-5 space-y-1">
                            {getResetWarnings(resetTarget).map((warn, wIdx) => (
                              <li key={wIdx}>{warn}</li>
                            ))}
                          </ul>
                          <p className="text-[10px] italic opacity-85 mt-1">
                            Se aconseja calificar todos los trabajos y exportar el reporte PDF antes de proceder para no perder vuestros registros docentes.
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            const clsParam = resetTarget === 'BOTH' ? undefined : resetTarget;
                            onResetAll(clsParam);
                            setResetTarget(null);
                          }}
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-sm text-xs font-bold cursor-pointer"
                        >
                          Sí, reiniciar ahora
                        </button>
                        <button
                          onClick={() => setResetTarget(null)}
                          className={`px-4 py-1.5 rounded-sm text-xs font-bold cursor-pointer border ${
                            isDark 
                              ? "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800" 
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-250"
                          }`}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Modal for Editing Assignments */}
      {editingAssignment && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="edit-assignment-modal">
          <div className={`border rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col transition-colors duration-300 ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-250"
          }`}>
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"
            }`}>
              <h4 className={`font-bold text-base flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Edit2 className="w-5 h-5 text-cyan-600" /> Editar Asignación: <span className="text-cyan-600">{editingAssignment.groupName}</span>
              </h4>
              <button
                onClick={() => {
                  setEditingAssignment(null);
                  setEditError("");
                }}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-150"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              {editError && (
                <div className="p-3 bg-rose-950/20 border border-rose-900/40 text-rose-300 text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* Classroom Setting */}
              <div>
                <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Grupo Académico / Aula
                </label>
                <div className="flex gap-2">
                  {(['DIGI', 'TICO'] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setEditClassroom(cls)}
                      className={`flex-1 py-2 border rounded-md text-xs font-mono font-bold cursor-pointer transition-all ${
                        editClassroom === cls
                          ? "bg-cyan-500 text-slate-950 font-black border-cyan-500"
                          : (isDark 
                              ? "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800" 
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100")
                      }`}
                    >
                      {cls === 'DIGI' ? 'DIGI (Digitalización)' : 'TICO (Bachillerato)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change Topic */}
              <div>
                <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Tema de Investigación Científica
                </label>
                <select
                  value={editTopicId}
                  onChange={(e) => setEditTopicId(parseInt(e.target.value))}
                  className={`w-full border rounded-md text-xs p-2.5 focus:border-cyan-500 focus:outline-none cursor-pointer ${
                    isDark 
                      ? "bg-slate-950 border-slate-850 text-slate-200" 
                      : "bg-slate-50 border-slate-200 text-slate-850 font-medium"
                  }`}
                >
                  {topics.map((t) => {
                    const isAssignedToOther = assignments.some(
                      (as) => as.topicId === t.id && as.id !== editingAssignment.id && as.classroom === editClassroom
                    );
                    return (
                      <option key={t.id} value={t.id} disabled={isAssignedToOther}>
                        #{t.id} - {t.title} {isAssignedToOther ? `(Ocupado por otro grupo de ${editClassroom})` : ""}
                      </option>
                    );
                  })}
                </select>
                <p className={`text-[10px] mt-1.5 font-sans leading-normal ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  💡 Nota: Si cambias el tema de investigación, la Guía Científica se restablecerá y se volverá a generar de forma inteligente adaptándose al nuevo tema en cuanto los alumnos la abran de nuevo.
                </p>
              </div>

              {/* Members */}
              <div>
                <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Integrantes del Grupo
                </label>
                <input
                  type="text"
                  value={editStudents}
                  onChange={(e) => setEditStudents(e.target.value)}
                  placeholder="Nombres de los alumnos, separados por comas"
                  className={`w-full border rounded-md text-xs p-2.5 focus:border-cyan-500 focus:outline-none ${
                    isDark 
                      ? "bg-slate-950 border-slate-850 text-slate-200 placeholder:text-slate-700" 
                      : "bg-slate-50 border-slate-200 text-slate-850 placeholder:text-slate-400"
                  }`}
                />
              </div>

              {/* Grade */}
              <div>
                <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Calificación / Nota final
                </label>
                <input
                  type="text"
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value)}
                  placeholder="Ej: 8.75, Sobresaliente, Excelente"
                  className={`w-full border rounded-md text-xs p-2.5 focus:border-cyan-500 focus:outline-none ${
                    isDark 
                      ? "bg-slate-950 border-slate-850 text-slate-200 placeholder:text-slate-700" 
                      : "bg-slate-50 border-slate-200 text-slate-850 placeholder:text-slate-400"
                  }`}
                />
              </div>

              {/* Comments */}
              <div>
                <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Comentarios, feedback y observaciones de la rúbrica
                </label>
                <textarea
                  value={editComments}
                  onChange={(e) => setEditComments(e.target.value)}
                  rows={4}
                  placeholder="Añade aquí correcciones de fuentes, rigor científico, nivel de pensamiento crítico, etc."
                  className={`w-full border rounded-md text-xs p-2.5 focus:border-cyan-500 focus:outline-none resize-none ${
                    isDark 
                      ? "bg-slate-950 border-slate-850 text-slate-200 placeholder:text-slate-700" 
                      : "bg-slate-50 border-slate-200 text-slate-850 placeholder:text-slate-400"
                  }`}
                />
              </div>

              {/* Footer actions inside form */}
              <div className={`pt-3 border-t flex items-center justify-end gap-2.5 ${
                isDark ? "border-slate-850" : "border-slate-200"
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAssignment(null);
                    setEditError("");
                  }}
                  className={`px-4 py-2 rounded-sm text-xs font-semibold cursor-pointer border transition-colors ${
                    isDark 
                      ? "bg-slate-950 hover:bg-slate-900 text-slate-300 border-slate-850" 
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-sm text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  {savingEdit ? (
                    <span className="w-3.5 h-3.5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></span>
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
