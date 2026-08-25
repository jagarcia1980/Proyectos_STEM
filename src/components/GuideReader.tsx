import React, { useState, useEffect } from "react";
import {
  FileText,
  Copy,
  Download,
  Printer,
  Microscope,
  ShieldCheck,
  CheckSquare,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  HelpCircle,
  FileDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Assignment, Topic } from "../types.js";
import { jsPDF } from "jspdf";

interface GuideReaderProps {
  assignment: Assignment;
  topic: Topic | undefined;
  onClose: () => void;
  theme?: 'dark' | 'pastel';
}

export default function GuideReader({ assignment, topic, onClose, theme = "dark" }: GuideReaderProps) {
  const [loading, setLoading] = useState(true);
  const [guideText, setGuideText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const isDark = theme === "dark";

  // Load guide markdown from server (either cached or triggers Gemini)
  useEffect(() => {
    let active = true;
    const fetchGuide = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/assignments/${assignment.id}/guide`, {
          method: "POST",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudo generar la guía de investigación.");
        }

        if (active) {
          setGuideText(data.guideMarkdown);
          setLoading(false);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Error al conectar con el servidor.");
          setLoading(false);
        }
      }
    };

    fetchGuide();
    return () => {
      active = false;
    };
  }, [assignment.id]);

  // Helper to parse the markdown sections
  const parseSections = (text: string) => {
    if (!text) return [];

    const sections = [
      { id: 0, title: "Introducción", icon: BookOpen, content: "" },
      { id: 1, title: "Método Científico", icon: Microscope, content: "" },
      { id: 2, title: "Ciudadanía Digital", icon: ShieldCheck, content: "" },
      { id: 3, title: "Evaluación", icon: Award, content: "" },
      { id: 4, title: "Cuestionario 25Q", icon: HelpCircle, content: "" },
    ];

    // Fallback if formatting doesn't match
    let hasSplitSuccessfully = false;

    // We'll look for headings like "## 1.", "## 2.", "## 3.", "## 4.", "## 5."
    try {
      const parts = text.split(/## \d\.\s*[^\n]+/g);
      // parts[0] is everything before ## 1. (e.g. # 📚 Guía de Investigación...)
      // parts[1] is Section 1 (Introducción)
      // parts[2] is Section 2 (Método Científico)
      // parts[3] is Section 3 (Ciudadanía Digital)
      // parts[4] is Section 4 (Evaluación)
      // parts[5] is Section 5 (Cuestionario)

      if (parts.length >= 6) {
        sections[0].content = parts[1].trim();
        sections[1].content = parts[2].trim();
        sections[2].content = parts[3].trim();
        sections[3].content = parts[4].trim();
        sections[4].content = parts[5].trim();
        hasSplitSuccessfully = true;
      }
    } catch (e) {
      console.warn("Could not split markdown strictly, falling back to basic display:", e);
    }

    if (!hasSplitSuccessfully) {
      // Basic fallback: put entire text in Tab 0 and placeholder in others
      sections[0].content = text;
      sections[1].content = "_La guía se ha cargado en formato completo en la pestaña Introducción._";
      sections[2].content = "_Consulta la pestaña Introducción para ver el documento completo._";
      sections[3].content = "_Consulta la pestaña Introducción para ver el documento completo._";
      sections[4].content = "_Consulta la pestaña Introducción para ver el documento completo._";
    }

    return sections;
  };

  const sections = parseSections(guideText);

  const handleCopy = () => {
    navigator.clipboard.writeText(guideText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([guideText], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Guia_Investigacion_Tema_${topic?.id || "X"}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPDF = () => {
    if (!topic) return;

    const doc = new jsPDF();

    // Helper to strip markdown and keep it clean
    const cleanPdfText = (text: string) => {
      return text
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .trim();
    };

    // Set styling for cover header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(3, 105, 120); // Dark Cyan
    doc.text("Guía Científica Personalizada", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Tema #${topic.id}: ${topic.title}`, 14, 26);
    doc.text(`Grupo de Investigación: ${assignment.groupName}`, 14, 31);
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
          let text = trimmed;
          let isNumbered = false;
          let prefix = "• ";

          if (/^\d+\.\s+/.test(trimmed)) {
            isNumbered = true;
            const match = trimmed.match(/^(\d+\.)\s+/);
            prefix = match ? match[1] + " " : "1. ";
            text = trimmed.replace(/^\d+\.\s+/, "");
          } else {
            text = trimmed.replace(/^[-*•]\s+/, "");
          }

          const cleanTextStr = cleanPdfText(text);
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
          doc.setFont("helvetica", "italic");
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

      y += 10; // extra padding between tabs
    });

    doc.save(`Guia_Investigacion_Tema_${topic.id}_${assignment.groupName.replace(/\s+/g, "_")}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to parse things like CO_2, H_2O, C_n H_{2n+2}, etc.
  const renderScientificFormula = (formula: string, keyPrefix: string): React.ReactNode => {
    let elements: React.ReactNode[] = [];
    let current = formula;
    let idx = 0;
    
    while (current.length > 0) {
      const subIdx = current.indexOf("_");
      const supIdx = current.indexOf("^");
      
      let firstIdx = -1;
      let type: "sub" | "sup" | null = null;
      
      if (subIdx >= 0) {
        firstIdx = subIdx;
        type = "sub";
      }
      if (supIdx >= 0 && (firstIdx === -1 || supIdx < firstIdx)) {
        firstIdx = supIdx;
        type = "sup";
      }
      
      if (firstIdx === -1) {
        elements.push(<span key={`${keyPrefix}-txt-${idx++}`}>{current}</span>);
        break;
      }
      
      if (firstIdx > 0) {
        elements.push(<span key={`${keyPrefix}-txt-${idx++}`}>{current.substring(0, firstIdx)}</span>);
      }
      
      const remainder = current.substring(firstIdx + 1);
      if (remainder.length === 0) {
        elements.push(<span key={`${keyPrefix}-err-${idx++}`}>{type === "sub" ? "_" : "^"}</span>);
        break;
      }
      
      let content = "";
      let nextStart = 0;
      
      if (remainder.startsWith("{")) {
        const closeBrace = remainder.indexOf("}");
        if (closeBrace >= 0) {
          content = remainder.substring(1, closeBrace);
          nextStart = closeBrace + 1;
        } else {
          content = remainder;
          nextStart = remainder.length;
        }
      } else {
        content = remainder.charAt(0);
        nextStart = 1;
      }
      
      if (type === "sub") {
        elements.push(<sub key={`${keyPrefix}-sub-${idx++}`} className="text-[80%] leading-none font-semibold font-mono">{content}</sub>);
      } else {
        elements.push(<sup key={`${keyPrefix}-sup-${idx++}`} className="text-[80%] leading-none font-semibold font-mono">{content}</sup>);
      }
      
      current = remainder.substring(nextStart);
    }
    
    return <span key={keyPrefix} className="inline-flex items-baseline font-bold text-cyan-600 dark:text-cyan-400 font-mono mx-0.5">{elements}</span>;
  };

  // Render basic bold and highlights (both *italic/bold* and **bold** format as bold text, and $formula$ as chemistry formulas)
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    if (!text) return "";

    let tokens: React.ReactNode[] = [];
    let currentText = text;
    let key = 0;

    while (currentText.length > 0) {
      const codeIdx = currentText.indexOf("`");
      const doubleStarIdx = currentText.indexOf("**");
      const singleStarIdx = currentText.indexOf("*");
      const dollarIdx = currentText.indexOf("$");

      let firstType: "code" | "double" | "single" | "dollar" | null = null;
      let firstIdx = -1;

      if (codeIdx >= 0) {
        firstIdx = codeIdx;
        firstType = "code";
      }

      if (doubleStarIdx >= 0 && (firstIdx === -1 || doubleStarIdx < firstIdx)) {
        firstIdx = doubleStarIdx;
        firstType = "double";
      }

      if (singleStarIdx >= 0 && (firstIdx === -1 || singleStarIdx < firstIdx)) {
        if (doubleStarIdx === singleStarIdx) {
          // It's the double star! Match double first
        } else {
          firstIdx = singleStarIdx;
          firstType = "single";
        }
      }

      if (dollarIdx >= 0 && (firstIdx === -1 || dollarIdx < firstIdx)) {
        firstIdx = dollarIdx;
        firstType = "dollar";
      }

      if (firstType === null || firstIdx === -1) {
        tokens.push(currentText);
        break;
      }

      if (firstIdx > 0) {
        tokens.push(currentText.substring(0, firstIdx));
      }

      const remainder = currentText.substring(firstIdx);
      if (firstType === "code") {
        const closeIdx = remainder.indexOf("`", 1);
        if (closeIdx >= 1) {
          const content = remainder.substring(1, closeIdx);
          tokens.push(
            <code key={key++} className={`font-mono text-xs px-1.5 py-0.5 rounded ${
              isDark 
                ? "bg-slate-900 text-cyan-400 border border-slate-800" 
                : "bg-slate-100 text-cyan-700 border border-slate-200"
            }`}>
              {content}
            </code>
          );
          currentText = remainder.substring(closeIdx + 1);
        } else {
          tokens.push("`");
          currentText = remainder.substring(1);
        }
      } else if (firstType === "double") {
        const closeIdx = remainder.indexOf("**", 2);
        if (closeIdx >= 2) {
          const content = remainder.substring(2, closeIdx);
          tokens.push(
            <strong key={key++} className={`font-black ${isDark ? "text-white" : "text-slate-950 font-extrabold"}`}>
              {renderInlineMarkdown(content)}
            </strong>
          );
          currentText = remainder.substring(closeIdx + 2);
        } else {
          tokens.push("**");
          currentText = remainder.substring(2);
        }
      } else if (firstType === "single") {
        const closeIdx = remainder.indexOf("*", 1);
        if (closeIdx >= 1) {
          const content = remainder.substring(1, closeIdx);
          tokens.push(
            <strong key={key++} className={`font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              {renderInlineMarkdown(content)}
            </strong>
          );
          currentText = remainder.substring(closeIdx + 1);
        } else {
          tokens.push("*");
          currentText = remainder.substring(1);
        }
      } else if (firstType === "dollar") {
        const closeIdx = remainder.indexOf("$", 1);
        if (closeIdx >= 1) {
          const content = remainder.substring(1, closeIdx);
          tokens.push(renderScientificFormula(content, `formula-${key++}`));
          currentText = remainder.substring(closeIdx + 1);
        } else {
          tokens.push("$");
          currentText = remainder.substring(1);
        }
      }
    }

    return tokens.length > 1 ? <span className="inline-block-container">{tokens}</span> : (tokens[0] || text);
  };

  // Helper to convert simple markdown blocks to basic JSX (including tables, lists, blockquotes, headers, paragraphs)
  const renderMarkdownToHtml = (md: string) => {
    if (!md) return null;

    const lines = md.split("\n");
    const blocks: React.ReactNode[] = [];
    let i = 0;
    let blockKey = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip blank lines
      if (!trimmed) {
        blocks.push(<div key={`empty-${blockKey++}`} className="h-3" />);
        i++;
        continue;
      }

      // Check for Table block
      if (trimmed.startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length > 0) {
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
            const colCount = headers.length || 1;

            const normalizedDataRows = dataRows.map(row => {
              const newRow = [...row];
              while (newRow.length < colCount) {
                newRow.push("");
              }
              return newRow.slice(0, colCount);
            });

            blocks.push(
              <div key={`table-${blockKey++}`} className={`my-5 overflow-x-auto rounded-lg border shadow-md ${
                isDark 
                  ? "border-slate-800 bg-slate-950/40 shadow-slate-950/50" 
                  : "border-pink-200/60 bg-white shadow-pink-100/35"
              }`} id={`table-element-${blockKey}`}>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`border-b font-mono font-bold ${
                      isDark 
                        ? "bg-slate-900 border-slate-800 text-cyan-400" 
                        : "bg-pink-100 border-pink-200 text-pink-700"
                    }`}>
                      {headers.map((header, idx) => (
                        <th key={idx} className={`p-3 uppercase tracking-wider text-[10px] border-r last:border-0 ${
                          isDark ? "border-slate-800/80" : "border-pink-200/50"
                        }`}>
                          {renderInlineMarkdown(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedDataRows.map((row, rIdx) => (
                      <tr key={rIdx} className={`border-b last:border-0 transition-colors ${
                        isDark 
                          ? "border-slate-900/65 text-slate-300 hover:bg-slate-900/20" 
                          : "border-pink-100 text-slate-750 hover:bg-pink-50/35"
                      }`}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={`p-3 border-r last:border-0 ${
                            isDark ? "border-slate-900/40" : "border-pink-100/50"
                          }`}>
                            {renderInlineMarkdown(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }
        continue;
      }

      // Check for Bullet List block
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
        const listItems: string[] = [];
        while (i < lines.length) {
          const nextLineTrimmed = lines[i].trim();
          if (nextLineTrimmed.startsWith("- ") || nextLineTrimmed.startsWith("* ") || nextLineTrimmed.startsWith("• ")) {
            listItems.push(nextLineTrimmed.replace(/^[-*•]\s+/, ""));
            i++;
          } else {
            break;
          }
        }

        blocks.push(
          <ul key={`ul-${blockKey++}`} className={`space-y-1.5 my-3 pl-5 list-disc text-sm leading-relaxed ${
            isDark ? "text-slate-350" : "text-slate-700"
          }`}>
            {listItems.map((item, idx) => (
              <li key={idx}>
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Check for Numbered List block
      if (/^\d+\.\s+/.test(trimmed)) {
        const listItems: { num: string; text: string }[] = [];
        while (i < lines.length) {
          const nextLineTrimmed = lines[i].trim();
          if (/^\d+\.\s+/.test(nextLineTrimmed)) {
            const num = nextLineTrimmed.match(/^\d+/)?.[0] || "1";
            const text = nextLineTrimmed.replace(/^\d+\.\s+/, "");
            listItems.push({ num, text });
            i++;
          } else {
            break;
          }
        }

        blocks.push(
          <ol key={`ol-${blockKey++}`} className={`space-y-2 my-3 pl-5 list-decimal text-sm leading-relaxed ${
            isDark ? "text-slate-350" : "text-slate-700"
          }`}>
            {listItems.map((item, idx) => (
              <li key={idx}>
                <span className={`font-mono font-bold mr-1 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>{item.num}.</span>{" "}
                {renderInlineMarkdown(item.text)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Check for Blockquote block
      if (trimmed.startsWith("> ")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("> ")) {
          quoteLines.push(lines[i].trim().replace(/^>\s+/, ""));
          i++;
        }

        blocks.push(
          <blockquote key={`quote-${blockKey++}`} className={`border-l-4 pl-4 py-2 pr-2 my-4 rounded-r-sm italic text-sm border-t border-b border-r ${
            isDark 
              ? "border-cyan-500 bg-slate-900/60 text-slate-300 border-slate-800" 
              : "border-pink-400 bg-pink-50/40 text-slate-750 border-pink-100"
          }`}>
            {quoteLines.map((lineText, idx) => (
              <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                {renderInlineMarkdown(lineText)}
              </p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Check for headings
      if (trimmed.startsWith("### ")) {
        blocks.push(
          <h4 key={`h4-${blockKey++}`} className={`text-base font-bold mt-6 mb-3 flex items-center gap-1.5 border-b pb-1 ${
            isDark ? "text-white border-slate-800" : "text-slate-900 border-slate-200"
          }`}>
            {renderInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
          </h4>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith("## ")) {
        blocks.push(
          <h3 key={`h3-${blockKey++}`} className={`text-lg font-bold mt-8 mb-4 flex items-center gap-2 pb-1 border-b ${
            isDark ? "text-white border-slate-800" : "text-slate-900 border-slate-200"
          }`}>
            {renderInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
          </h3>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith("# ")) {
        blocks.push(
          <h2 key={`h2-${blockKey++}`} className={`text-xl font-bold mt-8 mb-4 pb-1.5 border-b ${
            isDark ? "text-cyan-400 border-slate-800" : "text-cyan-600 border-pink-100"
          }`}>
            {renderInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
          </h2>
        );
        i++;
        continue;
      }

      // Normal paragraph
      blocks.push(
        <p key={`p-${blockKey++}`} className={`text-sm leading-relaxed mb-4 ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}>
          {renderInlineMarkdown(trimmed)}
        </p>
      );
      i++;
    }

    return <div className="space-y-1">{blocks}</div>;
  };

  return (
    <div className={`rounded-xl border p-1 overflow-hidden shadow-2xl transition-all duration-300 ${
      isDark 
        ? "bg-slate-900 border-slate-700" 
        : "bg-white border-pink-200 shadow-pink-100/30"
    }`} id="guide-reader-container">
      {/* Loading state with animated scientific messages */}
      {loading && (
        <div className={`py-24 px-6 flex flex-col items-center justify-center text-center space-y-6 rounded-lg ${
          isDark ? "bg-slate-950" : "bg-slate-50"
        }`} id="guide-loading-screen">
          <div className="relative">
            <div className={`w-20 h-20 border-4 rounded-full animate-spin ${
              isDark ? "border-cyan-500/20 border-t-cyan-500" : "border-cyan-200 border-t-cyan-600"
            }`}></div>
            <Sparkles className={`w-8 h-8 absolute inset-0 m-auto animate-pulse ${
              isDark ? "text-cyan-400" : "text-cyan-600"
            }`} />
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Diseñando tu Kit de Investigación</h3>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Adaptando las pautas del Método Científico a la temática y formulando <strong className={isDark ? "text-cyan-400" : "text-cyan-600"}>25 preguntas de trabajo</strong> para vuestro tema...
            </p>
          </div>

          <div className={`text-xs italic px-4 py-2.5 rounded-md max-w-sm border ${
            isDark 
              ? "text-slate-400 bg-slate-900 border-slate-800" 
              : "text-slate-600 bg-white border-slate-200 shadow-xs"
          }`}>
            💡 "La ciencia no consiste solo en acumular datos, sino en formular las preguntas correctas con mentalidad crítica."
          </div>
        </div>
      )}

      {error && (
        <div className={`py-16 px-6 text-center rounded-lg border ${
          isDark ? "bg-slate-950 border-rose-900/40" : "bg-rose-50/40 border-rose-200"
        }`} id="guide-error-screen">
          <div className="text-rose-500 mb-4 text-4xl">⚠️</div>
          <h3 className={`text-base font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>No se pudo generar la guía</h3>
          <p className={`text-xs max-w-md mx-auto mb-6 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-md text-xs font-semibold cursor-pointer border border-slate-700 transition-colors"
          >
            Reintentar Conexión
          </button>
        </div>
      )}

      {/* Actual Research Guide display */}
      {!loading && !error && (
        <div className={`rounded-lg overflow-hidden flex flex-col print:bg-white print:text-slate-900 print:shadow-none ${
          isDark ? "bg-slate-950" : "bg-white"
        }`} id="guide-loaded-screen">
          {/* Header Action Bar */}
          <div className={`p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b print:bg-white print:text-slate-900 print:border-slate-200 ${
            isDark ? "bg-slate-900 text-white border-slate-800" : "bg-pink-50 text-slate-900 border-pink-100"
          }`}>
            <div>
              <div className={`font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1 print:text-emerald-600 ${
                isDark ? "text-cyan-400" : "text-pink-650"
              }`}>
                <Sparkles className="w-3.5 h-3.5" /> Guía Científica Personalizada
              </div>
              <h2 className={`text-xl font-extrabold tracking-tight leading-tight ${isDark ? "text-white" : "text-slate-950"}`}>
                {topic?.id}. {topic?.title}
              </h2>
              <p className={`text-xs mt-1 print:text-slate-500 ${isDark ? "text-slate-400" : "text-slate-650"}`}>
                Asignado a: <strong className={isDark ? "text-slate-200 print:text-slate-950" : "text-slate-900 font-bold"}>{assignment.groupName}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end print:hidden">
              <button
                onClick={handleCopy}
                className={`p-2 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isDark 
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700" 
                    : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-250 shadow-xs"
                }`}
                title="Copiar guía completa"
              >
                {copied ? <ClipboardCheck className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copiado" : "Copiar"}</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className={`p-2 border rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isDark 
                    ? "bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-400 border-cyan-500/30" 
                    : "bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200 shadow-xs"
                }`}
                title="Descargar Guía de Investigación en PDF"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>

              <button
                onClick={handleDownload}
                className={`p-2 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isDark 
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700" 
                    : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-250 shadow-xs"
                }`}
                title="Descargar archivo Markdown (.md)"
              >
                <Download className="w-4 h-4" />
                <span>Descargar MD</span>
              </button>

              <button
                onClick={handlePrint}
                className={`p-2 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isDark 
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700" 
                    : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-250 shadow-xs"
                }`}
                title="Imprimir guía"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </button>

              <button
                onClick={onClose}
                className={`p-2 rounded-md text-xs font-semibold cursor-pointer border transition-colors ${
                  isDark 
                    ? "text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-250"
                }`}
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* Interactive Document Tabs */}
          <div className={`px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto print:hidden scrollbar-none border-b ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-pink-50/40 border-pink-100"
          }`} id="tabs-bar">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              const isSelected = activeTab === idx;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? (isDark 
                          ? "bg-cyan-950/55 text-cyan-400 border-cyan-500/40 shadow-xs" 
                          : "bg-pink-100 text-pink-700 border-pink-300/80 shadow-xs")
                      : (isDark 
                          ? "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-850/50" 
                          : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-pink-100/30")
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? (isDark ? "text-cyan-400" : "text-pink-650") : "text-slate-400"}`} />
                  {sec.title}
                </button>
              );
            })}
          </div>

          {/* Tab Content Display Area */}
          <div className={`p-6 md:p-8 min-h-[300px] overflow-y-auto max-h-[600px] print:max-h-none print:overflow-visible transition-colors ${
            isDark ? "bg-slate-950" : "bg-slate-50"
          }`} id="active-tab-content">
            {/* Show Print View if printing, which lists all sections consecutively */}
            <div className="hidden print:block space-y-8">
              {sections.map((sec) => (
                <div key={sec.id} className="border-b border-slate-200 pb-6 last:border-0">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4 border-l-4 border-emerald-600 pl-3">
                    {sec.title}
                  </h3>
                  <div className="pl-4">
                    {renderMarkdownToHtml(sec.content)}
                  </div>
                </div>
              ))}
            </div>

            {/* Normal screen tabbed view */}
            <div className="print:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="prose prose-invert max-w-none"
                >
                  <h3 className={`text-xl font-extrabold mb-5 flex items-center gap-2 border-b pb-2 ${
                    isDark ? "text-white border-slate-800" : "text-slate-900 border-slate-200"
                  }`}>
                    {React.createElement(sections[activeTab].icon, { className: `w-5 h-5 ${isDark ? "text-cyan-400" : "text-pink-600"}` })}
                    {sections[activeTab].title}
                  </h3>

                  <div className="space-y-1">
                    {renderMarkdownToHtml(sections[activeTab].content)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quick tips footer */}
          <div className={`p-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs print:hidden ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-pink-50 border-pink-100 text-slate-600"
          }`}>
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-pink-600"}`} />
              <span className={isDark ? "text-slate-300" : "text-slate-850"}>Recordad: debéis contrastar al menos 3 fuentes y responder las 25 preguntas.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab((prev) => (prev + 1) % 5)}
                className={`font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  isDark ? "text-cyan-400 hover:text-cyan-300" : "text-pink-650 hover:text-pink-850"
                }`}
              >
                Siguiente Sección <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
