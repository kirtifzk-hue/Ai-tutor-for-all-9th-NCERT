import { useState } from "react";
import { LessonProject, FontSize } from "../types";
import { BookOpen, Award, Layers, HelpCircle, Puzzle, Heart, Printer, Copy, CheckCircle2, RefreshCw, Eye, Sparkles, Download, FileText } from "lucide-react";

const prepareSvgForExport = (svgString: string, targetWidth: number = 550): string => {
  let width = targetWidth;
  let height = Math.round(targetWidth * 0.5); // Default 2:1 ratio
  
  const viewBoxMatch = svgString.match(/viewBox=["']\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s*["']/i);
  if (viewBoxMatch && viewBoxMatch[3] && viewBoxMatch[4]) {
    const vbW = parseFloat(viewBoxMatch[3]);
    const vbH = parseFloat(viewBoxMatch[4]);
    if (vbW > 0) {
      height = Math.round((vbH / vbW) * targetWidth);
    }
  }

  let cleaned = svgString;
  cleaned = cleaned.replace(/\s+width=["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\s+height=["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/<svg/i, `<svg width="${width}" height="${height}"`);
  
  if (!cleaned.includes("xmlns=")) {
    cleaned = cleaned.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  
  return cleaned;
};

interface Props {
  project: LessonProject;
  fontSize: FontSize;
  theme: "light" | "dark";
}

export function A4ProjectDocument({ project, fontSize, theme }: Props) {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [showPdfInstruction, setShowPdfInstruction] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [studentName, setStudentName] = useState("Vikas Kumar (विकास कुमार)");
  const [schoolName, setSchoolName] = useState("Adarsh Vidyalaya (आदर्श विद्यालय)");

  // Translate font-size config directly to tailwind classes
  const getTextClass = (element: "p" | "h1" | "h2" | "h3" | "label") => {
    switch (fontSize) {
      case "large":
        if (element === "p") return "text-lg leading-relaxed text-gray-800 dark:text-gray-100";
        if (element === "h1") return "text-3xl font-extrabold";
        if (element === "h2") return "text-2xl font-bold";
        if (element === "h3") return "text-xl font-semibold";
        return "text-base";
      case "extra-large":
        if (element === "p") return "text-xl leading-loose text-gray-900 dark:text-gray-50 font-medium";
        if (element === "h1") return "text-4xl font-black";
        if (element === "h2") return "text-3xl font-black";
        if (element === "h3") return "text-2xl font-bold";
        return "text-lg";
      default: // normal
        if (element === "p") return "text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-200";
        if (element === "h1") return "text-2xl md:text-3xl font-bold";
        if (element === "h2") return "text-xl md:text-2xl font-semibold";
        if (element === "h3") return "text-lg font-medium";
        return "text-sm";
    }
  };

  const handleDownloadWord = () => {
    // Generate styled HTML string that Microsoft Word renders perfectly when loaded with .doc file format
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${project.title}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body {
            font-family: Arial, "Segoe UI", sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1e293b;
            margin: 1in;
          }
          .title-cover {
            text-align: center;
            margin-top: 30px;
            margin-bottom: 30px;
          }
          h1 {
            font-family: "Arial Black", Gadget, sans-serif;
            font-size: 22pt;
            color: #047857; /* Emerald-700 */
            text-align: center;
            margin: 0 0 10px 0;
          }
          h2 {
            font-family: Arial, sans-serif;
            font-size: 14pt;
            color: #047857;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 4px;
            margin-top: 35px;
            margin-bottom: 15px;
          }
          h3 {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            color: #0f172a;
            margin-top: 20px;
            margin-bottom: 8px;
          }
          p {
            margin-bottom: 15px;
            text-align: justify;
          }
          .credentials {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 15px;
            margin-bottom: 25px;
          }
          .analogy-box {
            background-color: #ecfdf5;
            border-left: 6px solid #10b981;
            padding: 15px;
            margin-top: 15px;
            margin-bottom: 25px;
          }
          .concept-box {
            border: 1px solid #e2e8f0;
            padding: 15px;
            margin-bottom: 20px;
          }
          .hint-box {
            background-color: #f8fafc;
            border-left: 3px solid #6366f1;
            padding: 10px;
            font-size: 10pt;
            margin-top: 8px;
          }
          .mnemonic-box {
            border: 2px dashed #fecdd3;
            background-color: #fff1f2;
            padding: 15px;
            margin-bottom: 15px;
          }
          .badge {
            background-color: #047857;
            color: #ffffff;
            font-size: 10pt;
            font-weight: bold;
            padding: 4px 10px;
          }
          .signature-table {
            width: 100%;
            margin-top: 60px;
          }
          .signature-cell {
            text-align: center;
            width: 45%;
          }
          ul, ol {
            margin-bottom: 15px;
            padding-left: 20px;
          }
          li {
            margin-bottom: 6px;
          }
        </style>
      </head>
      <body>
    `;

    let htmlContent = `
      <div class="title-cover">
        <h1>${project.title}</h1>
        <p style="text-align: center; font-size: 12pt; color: #475569;">
          <span class="badge">Subject: ${project.subject}</span> &nbsp;|&nbsp; 
          <span class="badge">Chapter: ${project.chapter}</span>
        </p>
      </div>

      <div class="credentials">
        <strong>Student Name (छात्र):</strong> ${studentName}<br/>
        <strong>School Name (विद्यालय):</strong> ${schoolName}<br/>
        <strong>Syllabus Framework:</strong> CBSE / ICSE 9th Standards - Multi-Level Interactive Portfolio<br/>
        <strong>GuruJi Teacher Tuning Note:</strong> ${project.targetStudentProfile}
      </div>

      <h2>1. Chapter Prologue (अध्याय भूमिका)</h2>
      <p>${project.introduction}</p>

      <h2>2. Everyday Analogy (दैनिक जीवन से तुलना)</h2>
      <div class="analogy-box">
        <strong style="font-size: 11pt; color: #047857;">Memory Analogic Concept: ${project.analogy.title}</strong>
        <p style="font-style: italic; margin-top: 5px;">${project.analogy.scenarioDescription}</p>
        <p style="margin-top: 10px;"><strong>How it relates academically:</strong> ${project.analogy.howItRelates}</p>
      </div>

      <h2>3. Core Academic Pillars (अध्याय के मुख्य वैचारिक स्तंभ)</h2>
    `;

    project.mainCoreConcepts.forEach((c, idx) => {
      htmlContent += `
        <div class="concept-box">
          <h3 style="color: #047857;">${idx + 1}. ${c.conceptName}</h3>
          <p>${c.explanation}</p>
          ${c.keyFormulaOrDetail ? `<div class="hint-box"><strong>💡 Landmark Formula / Key Highlight Detail:</strong><br/>${c.keyFormulaOrDetail.replace(/\n/g, '<br/>')}</div>` : ""}
        </div>
      `;
    });

    // Section 4: Visual Blueprint & Diagrams (चित्र व आरेख)
    if (project.diagrams && project.diagrams.length > 0) {
      htmlContent += `<h2>4. Visual Blueprint & Diagrams (चित्र व आरेख)</h2>`;
      project.diagrams.forEach((diag, index) => {
        const processedSvg = prepareSvgForExport(diag.svgSourceCode, 520);
        htmlContent += `
          <div class="concept-box" style="background-color: #f8fafc; text-align: center; border: 1px solid #e2e8f0; padding: 15px; margin-bottom: 20px;">
            <strong style="color: #047857; font-size: 12pt;">Diagram ${index + 1}: ${diag.diagramTitle}</strong>
            <p style="font-style: italic; font-size: 9.5pt; color: #475569; margin-top: 5px; margin-bottom: 15px;">
              ${diag.descriptionOfVisual}
            </p>
            <div style="margin: 15px auto; display: block; text-align: center;">
              ${processedSvg}
            </div>
            ${diag.editorTipsForWord ? `
              <div class="hint-box" style="border-left: 3px solid #06b6d4; background-color: #ecfeff; font-size: 9.5pt; text-align: left; margin-top: 15px; padding: 10px;">
                <strong>📝 Tip for student portfolio:</strong> ${diag.editorTipsForWord}
              </div>
            ` : ""}
          </div>
        `;
      });
    }

    htmlContent += `
      <h2>5. Magical Mnemonics (याद रखने की जादुई तरकीबें)</h2>
    `;

    project.mnemonics.forEach((m) => {
      htmlContent += `
        <div class="mnemonic-box">
          <strong style="color: #e11d48; font-size: 11.5pt;">Shortcut Code: ${m.shortcutCode}</strong><br/>
          <p style="font-family: 'Courier New', Courier, monospace; color: #4f46e5; margin: 5px 0 5px 0;">
            ${m.expansion.replace(/\n/g, '<br/>')}
          </p>
          <small style="color: #475569;"><strong>Pedagogical guidelines:</strong> ${m.howItWorksInstructions}</small>
        </div>
      `;
    });

    htmlContent += `
      <h2>6. Infographic Poster Layout Guide (पोस्टर चार्ट निर्देश)</h2>
      <p style="background-color: #fef3c7; border: 1.5px solid #fde047; padding: 15px; font-style: italic;">
        ${project.beautifulInfographicText}
      </p>

      <h2>7. Easy A4 Hand-made Project (करके सीखें: मुख्य गतिविधि)</h2>
      <div class="concept-box" style="border-left: 5px solid #047857; background-color: #fafafa;">
        <strong style="font-size: 12pt; color: #047857;">Project Task: ${project.practicalProjectActivity.projectName}</strong>
        <h4 style="margin: 10px 0 5px 0;">📦 Materials Required (आवश्यक वस्तुएं):</h4>
        <ul>
          ${project.practicalProjectActivity.materialNeeded.map(m => `<li>${m}</li>`).join("")}
        </ul>
        <h4 style="margin: 10px 0 5px 0;">⚙️ Detailed Guidelines (निर्देश):</h4>
        <ol>
          ${project.practicalProjectActivity.stepByStepGuide.map(s => `<li>${s}</li>`).join("")}
        </ol>
        <p style="margin-top: 10px;"><strong>Expected Scientific Result:</strong> ${project.practicalProjectActivity.expectedObservation}</p>
        <div class="hint-box" style="border-left: 3px solid #6366f1; background-color: #eff6ff;">
          <strong>✍️ Workbook Question to Solve:</strong> ${project.practicalProjectActivity.submissionQuestionWithHInt}
        </div>
      </div>

      <h2>8. Active Recall Brain Challenge (मस्तिष्क परीक्षण)</h2>
    `;

    project.activeRecallQuiz.forEach((quiz, i) => {
      htmlContent += `
        <div class="concept-box" style="background-color: #f8fafc;">
          <strong>Question ${i+1}: ${quiz.question}</strong>
          <ul style="list-style-type: none; padding-left: 5px; margin-top: 8px;">
            ${quiz.options.map((opt, oIdx) => `
              <li style="margin-bottom: 5px;">
                ${oIdx === quiz.correctOptionIndex ? '<b>[x] (Answer Verified) </b>' : '[ ] '}
                ${opt}
              </li>
            `).join("")}
          </ul>
          <p style="margin-top: 8px; font-size: 10pt; color: #15803d; font-style: italic;">
            <strong>Teacher Answer Analysis:</strong> ${quiz.funExplanationAndHint}
          </p>
        </div>
      `;
    });

    htmlContent += `
      <h2>9. Night-Before-Exam Summary Flashcard (त्वरित पुनरावृत्ति)</h2>
      <pre style="background: #0f172a; color: #f1f5f9; padding: 15px; font-family: 'Courier New', Courier, monospace; font-size: 10pt; line-height: 1.4;">${project.quickSummaryRevisionCard}</pre>

      <table class="signature-table">
        <tr>
          <td class="signature-cell">
            <div style="height: 50px;"></div>
            <div style="border-top: 1px solid #64748b; padding-top: 5px; font-size: 10pt; font-weight: bold; color: #475569;">
              Student Signature (छात्र के हस्ताक्षर)
            </div>
          </td>
          <td style="width: 10%;"></td>
          <td class="signature-cell">
            <div style="height: 50px; font-family: 'Courier New', monospace; color: #047857; font-weight: bold; font-size: 12pt; text-align: center;">GuruJi AI Teacher</div>
            <div style="border-top: 1px solid #64748b; padding-top: 5px; font-size: 10pt; font-weight: bold; color: #475569;">
              Teacher Evaluator Seal (शिक्षक मूल्यांकन)
            </div>
          </td>
        </tr>
      </table>
    `;

    const footer = `
      </body>
      </html>
    `;

    const fullBlobHtml = header + htmlContent + footer;
    
    // Create download link for dynamic document compiling
    const blob = new Blob(['\ufeff' + fullBlobHtml], {
      type: 'application/msword;charset=utf-8'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedTitle = project.chapter.replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `${sanitizedTitle}_9thClass_Project.doc`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    // Generate clean copy text with simple format
    let cleanText = `PROJECT REPORT: ${project.title}\n`;
    cleanText += `Subject: ${project.subject} | Chapter: ${project.chapter}\n`;
    cleanText += `Optimized for: ${project.targetStudentProfile}\n\n`;
    cleanText += `--- 1. INTRODUCTION ---\n${project.introduction}\n\n`;
    cleanText += `--- 2. MEMORY ANALOGY ---\nTitle: ${project.analogy.title}\nScenario: ${project.analogy.scenarioDescription}\nRelates: ${project.analogy.howItRelates}\n\n`;
    cleanText += `--- 3. CORE CONCEPTS ---\n`;
    project.mainCoreConcepts.forEach((c, idx) => {
      cleanText += `${idx + 1}. ${c.conceptName}\nExplanation: ${c.explanation}\nKey Detail: ${c.keyFormulaOrDetail}\n\n`;
    });
    cleanText += `--- 4. MNEMONICS FOR MEMORY ---\n`;
    project.mnemonics.forEach((m) => {
      cleanText += `Shortcut: ${m.shortcutCode}\nMeaning: ${m.expansion}\nWhy: ${m.howItWorksInstructions}\n\n`;
    });
    cleanText += `--- 5. HANDS-ON PRACTICAL PROJECT ACTIVITY ---\nName:${project.practicalProjectActivity.projectName}\nMaterials: ${project.practicalProjectActivity.materialNeeded.join(", ")}\nSteps:\n`;
    project.practicalProjectActivity.stepByStepGuide.forEach((step, idx) => {
      cleanText += `- Step ${idx + 1}: ${step}\n`;
    });
    cleanText += `Observation: ${project.practicalProjectActivity.expectedObservation}\nSubmission Question: ${project.practicalProjectActivity.submissionQuestionWithHInt}\n\n`;
    cleanText += `--- 6. REVISION SUMMARY ---\n${project.quickSummaryRevisionCard}\n`;

    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDFDirect = async () => {
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      // Fallback if script load fails
      setShowPdfInstruction(true);
      return;
    }

    setExportingPdf(true);

    const isDark = document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    try {
      const originalEle = document.getElementById("a4-printable-area");
      if (!originalEle) {
        if (isDark) {
          document.documentElement.classList.add("dark");
          document.body.classList.add("dark");
        }
        setExportingPdf(false);
        return;
      }

      // Clone Node to make sure we don't disrupt active DOM tree state
      const clonedEle = originalEle.cloneNode(true) as HTMLElement;

      // Force classic high-contrast light styles for a perfect printable file
      clonedEle.classList.remove("dark", "bg-slate-900", "text-white");
      clonedEle.classList.add("bg-white", "text-gray-900");
      
      clonedEle.style.color = "#000000";
      clonedEle.style.background = "#ffffff";
      clonedEle.style.padding = "40px";
      clonedEle.style.boxShadow = "none";
      clonedEle.style.border = "none";
      clonedEle.style.maxWidth = "800px";
      clonedEle.style.width = "800px";

      // Strip elements that must not appear in the PDF (like interactive controls)
      const noPrintElements = clonedEle.querySelectorAll(".no-print");
      noPrintElements.forEach(el => el.remove());

      // In the printable PDF block, show input field values as simple text spans
      const inputs = clonedEle.querySelectorAll("input");
      inputs.forEach(input => {
        const val = input.value || "";
        const span = document.createElement("span");
        span.className = "text-sm font-bold border-b border-gray-400 pb-0.5 inline-block";
        span.style.borderBottom = "1px solid #94a3b8";
        span.style.paddingBottom = "2px";
        span.style.fontWeight = "bold";
        span.innerText = val;
        input.parentNode?.replaceChild(span, input);
      });

      // Find all SVG nodes in the cloned HTML and assign explicit pixel dimensions
      // to avoid visual collapsing in html2canvas / html2pdf
      const svgElements = clonedEle.querySelectorAll("svg");
      svgElements.forEach((svg) => {
        const viewBox = svg.getAttribute("viewBox");
        if (viewBox) {
          const parts = viewBox.trim().split(/\s+/);
          if (parts.length === 4) {
            const vbW = parseFloat(parts[2]);
            const vbH = parseFloat(parts[3]);
            if (!isNaN(vbW) && !isNaN(vbH) && vbW > 0) {
              const targetWidth = 550;
              const targetHeight = Math.round((vbH / vbW) * targetWidth);
              svg.setAttribute("width", targetWidth.toString());
              svg.setAttribute("height", targetHeight.toString());
              svg.style.width = `${targetWidth}px`;
              svg.style.height = `${targetHeight}px`;
            }
          }
        } else {
          svg.setAttribute("width", "550");
          svg.setAttribute("height", "280");
          svg.style.width = "550px";
          svg.style.height = "280px";
        }
      });

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-9999px";
      container.style.left = "-9999px";
      container.style.width = "800px";
      container.appendChild(clonedEle);
      document.body.appendChild(container);

      const opt = {
        margin: [12, 12, 15, 12],
        filename: `${project.chapter.replace(/[^a-zA-Z0-9]/g, '_')}_A4_Masterclass.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(clonedEle).save();
      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF download build failed: ", err);
      // fallback
      window.print();
    } finally {
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
      }
      setExportingPdf(false);
    }
  };

  const selectOption = (qIdx: number, optIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    setShowExplanation(prev => ({ ...prev, [qIdx]: true }));
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowExplanation({});
  };

  // Helper to color/style difficult words dynamically inside markdown-like sections or just emphasize brackets
  const renderDifficultWords = (text: string) => {
    if (!text) return "";
    // Regex matches words followed by (Hindi translation) e.g., "Force (बल)"
    // We can highlight the Hindi translation with soft green or blue for readability
    const parts = text.split(/(\([^)]+\))/);
    return parts.map((part, i) => {
      if (part.startsWith("(") && part.endsWith(")")) {
        return (
          <span key={i} className="text-emerald-600 dark:text-emerald-400 font-semibold mx-1 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {exportingPdf && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md no-print">
          <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl max-w-sm w-full mx-4 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 animate-pulse" size={24} />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Generating High-Quality PDF
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Optimizing diagram geometries, styling high-contrast fonts, and structuring A4 page breaks for school publication file...
            </p>
          </div>
        </div>
      )}

      {/* Action panel at top */}
      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 shadow-lg rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 no-print print:hidden">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
            Project generated with <strong className="text-emerald-600 dark:text-emerald-400">Award-winning Teaching Pedagogy</strong>!
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 size={15} className="text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadWord}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-505 text-white bg-indigo-600 hover:bg-indigo-500 shadow shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Word File (.doc)</span>
          </button>

          <button
            onClick={handleDownloadPDFDirect}
            disabled={exportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow shadow-rose-600/20 hover:shadow-rose-500/30 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
          >
            {exportingPdf ? (
              <>
                <div className="w-4.5 h-4.5 border-2 border-white/35 border-t-white rounded-full animate-spin"></div>
                <span>Compiling PDF...</span>
              </>
            ) : (
              <>
                <FileText size={15} />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow shadow-emerald-600/20 hover:shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <Printer size={15} />
            <span>Print A4</span>
          </button>
        </div>
      </div>

      {/* PDF Generation/Download instructions modal */}
      {showPdfInstruction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-fade-in text-gray-900 dark:text-slate-100">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <Sparkles className="text-rose-500" size={20} />
              Export High-Quality PDF with Diagrams
            </h3>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
              We leverage browser native vector printing which renders SVG drawings, color-coded concept charts, and Hindi translations with flawless high resolution.
            </p>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 mb-5 space-y-3">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                ⚙️ Optimal PDF Settings (अनुकूल सेटिंग्स):
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex gap-2">
                  <span className="font-extrabold text-rose-500">1.</span>
                  <div>
                    <strong>Destination (गंतव्य):</strong> Change destination to <span className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold">Save as PDF</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="font-extrabold text-rose-500">2.</span>
                  <div>
                    <strong>Background Graphics (पृष्ठभूमि ग्राफिक्स):</strong> <span className="text-rose-600 dark:text-rose-450 font-bold underline">MUST CHECK / ENABLE</span> this under "More settings" to display full vector colors & drawings!
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="font-extrabold text-rose-500">3.</span>
                  <div>
                    <strong>Headers & Footers (हेडर):</strong> <span className="font-bold text-gray-700 dark:text-gray-300">Disable / Uncheck</span> to remove the default website URL text.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPdfInstruction(false)}
                className="w-1/2 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-gray-700 dark:text-slate-350 transition-all cursor-pointer"
              >
                Go Back
              </button>
              
              <button
                onClick={() => {
                  setShowPdfInstruction(false);
                  setTimeout(() => {
                    window.print();
                  }, 250);
                }}
                className="w-1/2 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow shadow-rose-600/20 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={15} />
                Open PDF dialog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated physical A4 sheet wrapper */}
      <div 
        id="a4-printable-area" 
        className={`w-full max-w-[800px] min-h-[1130px] bg-white dark:bg-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl p-6 md:p-12 font-sans text-gray-900 rounded-2xl relative transition-all duration-300 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-full`}
        style={{
          boxSizing: "border-box",
        }}
      >
        {/* A4 Watermark and Borders */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border border-emerald-500/10 dark:border-emerald-500/10 pointer-events-none rounded-lg print:border-green-800/10"></div>
        
        {/* Decorative Badge on Simulated A4 */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 dark:border-slate-800 pb-6 mb-8">
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
              9TH CLASS CBSE/ICSE PORTFOLIO (९वीं कक्षा प्रोजेक्ट)
            </h4>
            <span className="text-[10px] text-gray-400 dark:text-gray-400 font-mono">
              Pedagogical Engine v2026.3 • Printable A4 Template
            </span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
            <Award size={14} className="text-amber-500 animate-pulse" />
            <span>Top Teacher Approved (उत्कृष्ट शिक्षण पद्धति)</span>
          </div>
        </div>

        {/* ================= PROJECT COVER HEADER ================= */}
        <div className="text-center my-8">
          <h1 className={`${getTextClass("h1")} tracking-tight text-emerald-700 dark:text-emerald-400 leading-tight`}>
            {project.title}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap text-sm font-medium">
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-800 dark:text-slate-200">
              Subject: <strong className="text-emerald-600 dark:text-emerald-400">{project.subject}</strong>
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-800 dark:text-slate-200">
              Chapter: <strong className="text-emerald-600 dark:text-emerald-400">{project.chapter}</strong>
            </span>
          </div>
        </div>

        {/* Personalized Student Credentials Form - highly useful for printing directly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 p-4 rounded-xl mb-8 print:bg-slate-50">
          <div className="no-print flex flex-col gap-1.5 ">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">STUDENT NAME (आपका नाम):</label>
            <input 
              type="text" 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)}
              className="px-3 py-1 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-sm text-gray-900 dark:text-white"
            />
          </div>
          <div className="no-print flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">SCHOOL NAME (विद्यालय का नाम):</label>
            <input 
              type="text" 
              value={schoolName} 
              onChange={(e) => setSchoolName(e.target.value)}
              className="px-3 py-1 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-sm text-gray-900 dark:text-white"
            />
          </div>
          {/* Print only credentials values */}
          <div className="hidden print:block text-sm">
            <strong>Student Name:</strong> {studentName}
          </div>
          <div className="hidden print:block text-sm">
            <strong>School / Academy:</strong> {schoolName}
          </div>
          <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-700/50 pt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400 flex items-start gap-1">
            <Heart size={14} className="text-red-500 shrink-0 mt-0.5" />
            <span>
              <strong>Teacher Tuning:</strong> {project.targetStudentProfile}
            </span>
          </div>
        </div>

        {/* ================= 1. INTRODUCTION ================= */}
        <section className="mb-10 page-break">
          <div className="flex items-center gap-2 border-b-2 border-emerald-100 dark:border-slate-800 pb-2 mb-4">
            <BookOpen size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className={`${getTextClass("h2")} text-slate-800 dark:text-slate-100`}>
              1. Chapter Prologue (अध्याय भूमिका)
            </h2>
          </div>
          <p className={`${getTextClass("p")} indent-6 text-justify`}>
            {renderDifficultWords(project.introduction)}
          </p>
        </section>

        {/* ================= 2. THE MEMORY ANALOGY ================= */}
        <section className="mb-10 bg-gradient-to-br from-emerald-50/40 to-cyan-50/20 dark:from-slate-800/30 dark:to-slate-900/10 border border-emerald-100/60 dark:border-slate-800/80 p-6 rounded-2xl page-break">
          <div className="flex items-center gap-2 border-b border-emerald-100 dark:border-slate-800 pb-2 mb-4">
            <Layers size={20} className="text-amber-500" />
            <h2 className={`${getTextClass("h2")} text-slate-800 dark:text-slate-100`}>
              2. Everyday Analogy (दैनिक जीवन से तुलना)
            </h2>
          </div>
          <p className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400 mb-2">
            ✨ Memory Scenario: {project.analogy.title}
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-amber-400 pl-4 py-1 italic">
              <p className={getTextClass("p")}>{renderDifficultWords(project.analogy.scenarioDescription)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                🤝 Why this explains the concept perfectly:
              </p>
              <p className={`${getTextClass("p")} mt-1`}>
                {renderDifficultWords(project.analogy.howItRelates)}
              </p>
            </div>
          </div>
        </section>

        {/* ================= 3. CORE CONCEPTS PILLARS ================= */}
        <section className="mb-10 page-break">
          <div className="flex items-center gap-2 border-b-2 border-emerald-100 dark:border-slate-800 pb-2 mb-4">
            <Sparkles size={20} className="text-indigo-500" />
            <h2 className={`${getTextClass("h2")} text-slate-800 dark:text-slate-100`}>
              3. Core Academic Pillars (अध्याय के मुख्य वैचारिक स्तंभ)
            </h2>
          </div>
          
          <div className="space-y-6">
            {project.mainCoreConcepts.map((concept, index) => (
              <div 
                key={index} 
                className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/20 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-800 transition-all shadow-sm"
              >
                <h3 className={`${getTextClass("h3")} text-emerald-700 dark:text-emerald-400 flex items-start gap-2`}>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">
                    {index + 1}
                  </span>
                  <span>{renderDifficultWords(concept.conceptName)}</span>
                </h3>
                <p className={`${getTextClass("p")} mt-2 text-justify`}>
                  {renderDifficultWords(concept.explanation)}
                </p>
                {concept.keyFormulaOrDetail && (
                  <div className="mt-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 p-3 rounded-lg font-mono text-sm text-indigo-600 dark:text-indigo-400 whitespace-pre-line leading-relaxed">
                    <strong>💡 Key Formula / Landmark Stat:</strong>
                    <br />
                    {renderDifficultWords(concept.keyFormulaOrDetail)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= 4. DIAGRAMS / ILLUSTRATIONS ================= */}
        {project.diagrams && project.diagrams.length > 0 && (
          <section className="mb-10 page-break">
            <div className="flex items-center gap-2 border-b-2 border-emerald-100 dark:border-slate-800 pb-2 mb-4">
              <Eye size={20} className="text-cyan-600 dark:text-cyan-400" />
              <h2 className={`${getTextClass("h2")} text-slate-800 dark:text-slate-100`}>
                4. visual Blueprint & Diagrams (चित्र व आरेख)
              </h2>
            </div>

            <div className="space-y-8">
              {project.diagrams.map((diag, index) => (
                <div key={index} className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                  <h3 className={`${getTextClass("h3")} text-slate-800 dark:text-slate-100 mb-2 font-semibold`}>
                    📷 Diagram {index + 1}: {diag.diagramTitle}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
                    {diag.descriptionOfVisual}
                  </p>
                  
                  {/* Standalone raw SVG Render */}
                  <div className="w-full flex justify-center mb-4 max-h-[300px]">
                    <div 
                      className="w-full max-w-[500px]"
                      dangerouslySetInnerHTML={{ __html: diag.svgSourceCode }}
                    />
                  </div>
                  
                  {diag.editorTipsForWord && (
                    <div className="text-xs bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-800 text-cyan-800 dark:text-cyan-400 p-3 rounded-lg">
                      <strong>📝 Tip for student portfolio:</strong> {diag.editorTipsForWord}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= 5. MNEMONICS FOR MEMORY ================= */}
        <section className="mb-10 page-break">
          <div className="flex items-center gap-2 border-b-2 border-emerald-100 dark:border-slate-800 pb-2 mb-4">
            <Puzzle size={20} className="text-rose-500" />
            <h2 className={`${getTextClass("h2")} text-slate-800 dark:text-slate-100`}>
              5. Magical Mnemonics (याद रखने की जादुई तरकीबें)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.mnemonics.map((m, idx) => (
              <div 
                key={idx} 
                className="border-2 border-dashed border-rose-200 dark:border-rose-950/40 p-4 rounded-xl bg-rose-50/30 dark:bg-rose-950/10"
              >
                <div className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold px-3 py-1 rounded-md text-sm inline-block mb-3 font-mono">
                  🔑 Key Shortcut: {m.shortcutCode}
                </div>
                <p className={`${getTextClass("p")} font-mono font-medium text-indigo-700 dark:text-indigo-400 whitespace-pre-line`}>
                  {renderDifficultWords(m.expansion)}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  <strong>💡 How to use:</strong> {m.howItWorksInstructions}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 6. INFOGRAPHIC POSTER METRIC ================= */}
        <section className="mb-10 page-break">
          <div className="flex items-center gap-2 border-b-2 border-emerald-100 dark:border-slate-800 pb-2 mb-4">
            <Award size={20} className="text-amber-500" />
            <h2 className={`${getTextClass("h2")} text-slate-800 dark:text-slate-100`}>
              6. Infographic Poster Layout Guide (पोस्टर चार्ट निर्देश)
            </h2>
          </div>
          <div className="p-5 border border-amber-200 bg-amber-50/20 dark:border-yellow-900/50 dark:bg-yellow-950/10 rounded-xl leading-relaxed">
            <p className={getTextClass("p")}>
              {renderDifficultWords(project.beautifulInfographicText)}
            </p>
          </div>
        </section>

        {/* ================= 7. HANDS-ON PRACTICAL PROJECT ACTIVITY ================= */}
        <section className="mb-10 page-break">
          <div className="flex items-center gap-2 border-b-2 border-emerald-100 dark:border-slate-800 pb-2 mb-4">
            <Layers size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className={`${getTextClass("h2")} text-slate-800 dark:text-slate-100`}>
              7. Easy A4 Hand-made Project (करके सीखें: मुख्य गतिविधि)
            </h2>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <div className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-bold inline-block mb-4">
              Project Task: {project.practicalProjectActivity.projectName}
            </div>
            
            <div className="mb-4">
              <h4 className="text-xs uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400 mb-2">
                📦 Materials Needed (आवश्यक वस्तुएं)
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {project.practicalProjectActivity.materialNeeded.map((mat, i) => (
                  <li key={i}>{renderDifficultWords(mat)}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-xs uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400 mb-2">
                ⚙️ Step-by-Step Instructions (चरण-दर-चरण निर्देश)
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {project.practicalProjectActivity.stepByStepGuide.map((step, i) => (
                  <li key={i} className="pl-1">
                    {renderDifficultWords(step)}
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700/80 pt-4 mb-4">
              <h4 className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
                🔎 Scientific Observation Expected (अपेक्षित अवलोकन)
              </h4>
              <p className={getTextClass("p")}>
                {renderDifficultWords(project.practicalProjectActivity.expectedObservation)}
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 p-4 rounded-xl">
              <h4 className="text-xs uppercase tracking-widest font-bold text-indigo-800 dark:text-indigo-300 mb-1">
                ✍️ Write this in your school workbook (प्रोजेक्ट फ़ाइल प्रश्न):
              </h4>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                {renderDifficultWords(project.practicalProjectActivity.submissionQuestionWithHInt)}
              </p>
            </div>
          </div>
        </section>

        {/* ================= 8. ACTIVE RECALL CHALENGE (INTERACTIVE IN APP, PRINTABLE FOR STUDY) ================= */}
        <section className="mb-10 page-break">
          <div className="flex items-center gap-2 border-b-2 border-emerald-100 dark:border-slate-800 pb-2 mb-4">
            <HelpCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className={`${getTextClass("h2")} text-slate-800 dark:text-slate-100`}>
              8. Active Recall Brain challenge (मस्तिष्क परीक्षण)
            </h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-400 mb-4 inline-block bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded no-print">
            💡 interactive Tool: Click option to instantly discover answers with teachers notes.
          </p>

          <div className="space-y-6">
            {project.activeRecallQuiz.map((quiz, qIndex) => {
              const selectedIdx = quizAnswers[qIndex];
              const isCorrect = selectedIdx === quiz.correctOptionIndex;
              const hasAnswered = selectedIdx !== undefined;

              return (
                <div key={qIndex} className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    QUESTION {qIndex + 1}
                  </span>
                  <p className={`${getTextClass("p")} font-bold text-slate-800 dark:text-slate-100 mt-1 mb-3`}>
                    {renderDifficultWords(quiz.question)}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {quiz.options.map((opt, oIndex) => {
                      const isOptionSelected = selectedIdx === oIndex;
                      let optionStyle = "border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200";
                      
                      if (hasAnswered) {
                        if (oIndex === quiz.correctOptionIndex) {
                          optionStyle = "bg-emerald-550 border-emerald-500 text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 font-semibold";
                        } else if (isOptionSelected) {
                          optionStyle = "bg-rose-50 border-rose-300 text-rose-800 dark:text-rose-200 dark:bg-rose-950/20";
                        }
                      }

                      return (
                        <button
                          key={oIndex}
                          disabled={hasAnswered}
                          onClick={() => selectOption(qIndex, oIndex)}
                          className={`w-full text-left p-3 rounded-xl border text-sm transition-all active:scale-[0.99] disabled:scale-100 flex items-center gap-3 no-print cursor-pointer ${optionStyle}`}
                        >
                          <span className="h-6 w-6 rounded-full bg-slate-200/50 dark:bg-slate-800/80 text-xs font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span>{renderDifficultWords(opt)}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* High contrast option preview of choices in pure printed mode */}
                  <div className="hidden print:block text-xs space-y-1 my-3">
                    {quiz.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className="inline-block border text-[10px] w-4 h-4 text-center rounded">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt} {oIdx === quiz.correctOptionIndex ? "✔️" : ""}</span>
                      </div>
                    ))}
                  </div>

                  {showExplanation[qIndex] && (
                    <div className="p-3.5 mt-2 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 rounded-xl leading-relaxed">
                      <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold mb-1">
                        🏆 Teacher {isCorrect ? "Encouragement" : "Explanation"} Note:
                      </p>
                      <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
                        {renderDifficultWords(quiz.funExplanationAndHint)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="no-print mt-4 flex justify-end">
            <button
              onClick={resetQuiz}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} className="animate-spin-slow" />
              Reset Self Quiz (पुनः हल करें)
            </button>
          </div>
        </section>

        {/* ================= 9. QUICK SUMMARY / FLASHCARD NIGHT SHEET ================= */}
        <section className="mb-8 border-t-2 border-slate-100 dark:border-slate-800 pt-8 page-break">
          <div className="flex items-center gap-2 border-b-2 border-emerald-100 dark:border-slate-800 pb-2 mb-4">
            <Layers size={21} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className={`${getTextClass("h2")} text-slate-800 dark:text-slate-100`}>
              9. Night-Before-Exam Summary Flashcard (त्वरित पुनरावृत्ति)
            </h2>
          </div>
          
          <div className="bg-indigo-950 text-indigo-100 dark:bg-indigo-950/80 p-6 rounded-2xl border-4 border-indigo-200 dark:border-indigo-900">
            <div className="text-center font-bold text-xs uppercase tracking-widest text-indigo-400 mb-3">
              🎒 STICK TO YOUR BEDROOM WALL OR WORD DOCUMENT FILE
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-indigo-200 select-all p-3 bg-indigo-1000/60 rounded bg-slate-900/40">
              {project.quickSummaryRevisionCard}
            </pre>
          </div>
        </section>

        {/* Simulated signature block for project printing authentication */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/85 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="h-10"></div>
            <p className="border-t border-slate-300 dark:border-slate-700 pt-2 font-bold text-slate-500">
              Student Signature (छात्र के हस्ताक्षर)
            </p>
          </div>
          <div>
            <div className="font-mono text-emerald-600 italic font-semibold">GuruJi AI Teacher</div>
            <p className="border-t border-slate-300 dark:border-slate-700 pt-2 font-bold text-slate-500">
              Teacher Evaluator Seal (शिक्षक मूल्यांकन)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
