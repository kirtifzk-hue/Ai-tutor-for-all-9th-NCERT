import { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Sparkles, 
  PlusCircle, 
  Lightbulb, 
  GraduationCap, 
  AlertCircle, 
  ChevronRight,
  Settings2
} from "lucide-react";
import { PresetData, FontSize, StudentProfile, ProjectType, LessonProject } from "./types";
import { A4ProjectDocument } from "./components/A4ProjectDocument";
import { SAMPLE_GRAVITATION_PROJECT } from "./data/mockExample";

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // Custom Font-Sizing for high readability (Normal, Large, Extra Large)
  const [fontSize, setFontSize] = useState<FontSize>("normal");

  // Client Presets lists (fallback & initial visual representation)
  const [presets, setPresets] = useState<PresetData>({
    Science: [
      { id: "s1", name: "Matter in Our Surroundings", hindi: "हमारे आस-पास के पदार्थ" },
      { id: "s2", name: "Is Matter Around Us Pure", hindi: "क्या हमारे आस-पास के पदार्थ शुद्ध हैं" },
      { id: "s3", name: "Atoms and Molecules", hindi: "परमाणु एवं अणु" },
      { id: "s4", name: "Structure of the Atom", hindi: "परमाणु की संरचना" },
      { id: "s5", name: "Cell - Fundamental Unit of Life", hindi: "जीवन की मौलिक इकाई - कोशिका" },
      { id: "s6", name: "Tissues", hindi: "ऊतक" },
      { id: "s7", name: "Motion", hindi: "गति" },
      { id: "s8", name: "Force and Laws of Motion", hindi: "बल तथा गति के नियम" },
      { id: "s9", name: "Gravitation", hindi: "गुरुत्वाकर्षण" },
      { id: "s10", name: "Work and Energy", hindi: "कार्य तथा ऊर्जा" },
      { id: "s11", name: "Sound", hindi: "ध्वनि" }
    ],
    Mathematics: [
      { id: "m1", name: "Number Systems", hindi: "संख्या पद्धति" },
      { id: "m2", name: "Polynomials", hindi: "बहुपद" },
      { id: "m3", name: "Coordinate Geometry", hindi: "निर्देशांक ज्यामिति" },
      { id: "m4", name: "Linear Equations in Two Variables", hindi: "दो चरों वाले रैखिक समीकरण" },
      { id: "m5", name: "Lines and Angles", hindi: "रेखाएँ और कोण" },
      { id: "m6", name: "Triangles", hindi: "त्रिभुज" },
      { id: "m7", name: "Quadrilaterals", hindi: "चतुर्भुज" },
      { id: "m8", name: "Circles", hindi: "वृत्त" },
      { id: "m9", name: "Heron's Formula", hindi: "हेरॉन का सूत्र" },
      { id: "m10", name: "Surface Areas and Volumes", hindi: "पृष्ठीय क्षेत्रफल और आयतन" }
    ],
    "Social Science": [
      { id: "ss1", name: "The French Revolution", hindi: "फ्रांसीसी क्रांति" },
      { id: "ss2", name: "Socialism in Europe & Russian Revolution", hindi: "यूरोप में समाजवाद एवं रूसी क्रांति" },
      { id: "ss3", name: "Nazism and the Rise of Hitler", hindi: "नात्सीवाद और हिटलर का उदय" },
      { id: "ss4", name: "India - Size and Location", hindi: "भारत - आकार और स्थिति" },
      { id: "ss5", name: "Physical Features of India", hindi: "भारत का भौतिक स्वरूप" },
      { id: "ss6", name: "Drainage", hindi: "अपवाह / नदियाँ" },
      { id: "ss7", name: "Climate", hindi: "जलवायु" },
      { id: "ss8", name: "Natural Vegetation and Wild Life", hindi: "प्राकृतिक वनस्पति तथा वन्य प्राणी" },
      { id: "ss10", name: "What is Democracy? Why Democracy?", hindi: "लोकतंत्र क्या? लोकतंत्र क्यों?" },
      { id: "ss15", name: "The Story of Village Palampur", hindi: "पालमपुर गाँव की कहानी" }
    ],
    English: [
      { id: "e1", name: "The Fun They Had", hindi: "द फन दे हैड" },
      { id: "e2", name: "The Sound of Music", hindi: "संगीत की ध्वनि" },
      { id: "e4", name: "A Truly Beautiful Mind", hindi: "एक सचमुच सुंदर मन (अल्बर्ट आइंस्टीन)" },
      { id: "e6", name: "My Childhood", hindi: "मेरा बचपन (ए.पी.जे. अब्दुल कलाम)" },
      { id: "e10", name: "The Lost Child", hindi: "खोया हुआ बच्चा" }
    ]
  });

  // Selection states
  const [selectedSubject, setSelectedSubject] = useState<keyof PresetData>("Science");
  const [selectedChapter, setSelectedChapter] = useState<string>("s9"); // DEFAULT default starts on Gravitation
  const [customChapterName, setCustomChapterName] = useState<string>("");
  const [isUsingCustomChapter, setIsUsingCustomChapter] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile>("general");
  const [projectType, setProjectType] = useState<ProjectType>("Full Study Folder");

  // Output project content
  const [generatedProject, setGeneratedProject] = useState<LessonProject | null>(SAMPLE_GRAVITATION_PROJECT); // Preload demo to look glorious instantly!
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Fetch true database values from server if modified or loaded
  useEffect(() => {
    fetch("/api/presets")
      .then((res) => {
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("HTML response received instead of JSON presets");
        }
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (data && data.Science) {
          setPresets(data);
        }
      })
      .catch(() => {
        console.log("Using core pre-integrated educational chapters.");
      });
  }, []);

  // Update chapter selection automatically when client switches subject
  useEffect(() => {
    if (!isUsingCustomChapter) {
      const subjectChapters = presets[selectedSubject];
      if (subjectChapters && subjectChapters.length > 0) {
        setSelectedChapter(subjectChapters[0].id);
      }
    }
  }, [selectedSubject, presets, isUsingCustomChapter]);

  // Visual simulation loaders representing top educational tasks
  const simulatePedagogySteps = async () => {
    const steps = [
      "Initializing AI Classroom with World-Class Academic Methods (शिक्षण प्रणाली प्रारंभ)...",
      "Mapping Syllabus guidelines for ICSE/CBSE 9th Standards...",
      "Crafting unforgettable daily analogies with Indian background context (सरल घरेलू उदाहरण जोड़ना)...",
      "Translating complex vocabulary into Hindi words in brackets '()'...",
      "Assembling practical hands-on experiment model using low-cost household objects...",
      "Encoding vector SVG schemas for step-by-step visual diagrams...",
      "Designing active recall brain-teasers with custom teachers memory hints..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  };

  const handleGenerate = async () => {
    setErrorStatus(null);
    setLoading(true);

    // Get exact chapter title strings
    let chapterTitle = "";
    if (isUsingCustomChapter) {
      if (!customChapterName.trim()) {
        setErrorStatus("Please enter your custom chapter name (कृपया अध्याय का नाम दर्ज करें).");
        setLoading(false);
        return;
      }
      chapterTitle = customChapterName;
    } else {
      const matched = presets[selectedSubject].find((c) => c.id === selectedChapter);
      chapterTitle = matched ? `${matched.name} (${matched.hindi})` : "Universal Chapter";
    }

    try {
      // Start the pedagogical steps simulation in parallel for a rich response feel
      const simulationPromise = simulatePedagogySteps();

      // Transform profile string for custom instruction text
      let targetProfileDescription = "Regular 9th standard CBSE student";
      if (selectedProfile === "struggling") {
        targetProfileDescription = "Struggling student who needs basic explanation, rich analogy, high repetition, and Hindi translations for simple terms.";
      } else if (selectedProfile === "advanced") {
        targetProfileDescription = "Exceptionally bright student who enjoys mathematical rigor, deep historical analysis, puzzles, and high cognitive challenge.";
      }

      const responsePromise = fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          chapter: chapterTitle,
          studentProfile: targetProfileDescription,
          projectType: projectType
        })
      });

      const [_, res] = await Promise.all([simulationPromise, responsePromise]);

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          "Received an invalid HTML/Text response from the server instead of JSON. " +
          "If you are deployed on Vercel, please make sure you uploaded the newly configured '/api' folder to your GitHub repository and have configured your GEMINI_API_KEY under Project Settings -> Environment Variables in your Vercel Dashboard!"
        );
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "The server failed to validate your request or the API key is not in settings.");
      }

      const data = await res.json();
      setGeneratedProject(data);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(
        err?.message || "Missing or Invalid GEMINI_API_KEY. Please verify in Secrets panel or preview the preloaded core standard project."
      );
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // Safe manual load for the Newton's gravitation demo in case they don't have active keys yet
  const handleLoadDemo = () => {
    setGeneratedProject(SAMPLE_GRAVITATION_PROJECT);
    setSelectedSubject("Science");
    setSelectedChapter("s9");
    setIsUsingCustomChapter(false);
    setErrorStatus(null);
  };

  // Class toggle for theme
  const getThemeClass = () => {
    return theme === "dark" ? "dark bg-slate-950 text-white" : "bg-slate-50 text-gray-900";
  };

  return (
    <div className={`min-h-screen font-sans ${getThemeClass()} transition-colors duration-300`}>
      
      {/* ================= REUSABLE NAVIGATION RAIL ================= */}
      <header className="border-b border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-40 backdrop-blur no-print px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 md:p-2.5 rounded-xl shadow-md shadow-emerald-600/30 shrink-0">
              <GraduationCap size={22} className="stroke-2 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 flex-wrap">
                GuruJi AI 
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/75 text-emerald-800 dark:text-emerald-300 ml-1.5">
                  2026 Edition
                </span>
              </h1>
              <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">9th Class Outstanding Teacher & Printable A4 Project Architect</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 dark:border-slate-800 pt-2 sm:pt-0">
            <span className="text-[10px] font-bold text-gray-400 sm:hidden uppercase tracking-wider">App Settings (सेटिंग्स):</span>
            <div className="flex items-center gap-2">
              {/* Day/Night Selector */}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700/50 text-gray-700 dark:text-gray-300 transition-all cursor-pointer"
                title="Toggle Day/Night View"
                id="theme-toggler"
              >
                {theme === "light" ? <Moon size={18} className="fill-indigo-50/50" /> : <Sun size={18} className="text-amber-400 fill-amber-400/20" />}
              </button>

              {/* Typography Sizer Selector */}
              <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-1 border border-transparent dark:border-slate-700/50">
                <button
                  onClick={() => setFontSize("normal")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${fontSize === "normal" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-205"}`}
                  title="Normal Font Size"
                >
                  1x
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${fontSize === "large" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-205"}`}
                  title="Large Font Size"
                >
                  1.5x
                </button>
                <button
                  onClick={() => setFontSize("extra-large")}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${fontSize === "extra-large" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-205"}`}
                  title="Extra Large Font Size"
                >
                  2x
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= PRIMARY APP WORKSPACE ================= */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONTROL & SELECTION ENGINE (no-print) */}
        <section className="lg:col-span-5 flex flex-col gap-6 no-print">
          
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-md shadow-slate-100/40 dark:shadow-none">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <Settings2 className="text-emerald-600 dark:text-emerald-400" size={20} />
              <h2 className="text-md font-bold text-gray-800 dark:text-gray-100">Configure Teaching Unit (प्रोजेक्ट सेटिंग्स)</h2>
            </div>

            {/* Step 1: Select Subject */}
            <div className="mb-5">
              <label className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                1. Select Subject (विषय चुनें)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(presets) as Array<keyof PresetData>).map((sub) => {
                  const isSelected = selectedSubject === sub;
                  let icon = "🧪";
                  if (sub === "Mathematics") icon = "📐";
                  if (sub === "Social Science") icon = "🌍";
                  if (sub === "English") icon = "📚";

                  return (
                    <button
                      key={sub}
                      onClick={() => {
                        setSelectedSubject(sub);
                        setIsUsingCustomChapter(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all active:scale-[0.97] cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold"
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-lg mr-1.5">{icon}</span>
                      <span className="text-xs md:text-sm">{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select or write Custom Chapter */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                  2. Chapter Selector (अध्याय का नाम)
                </label>
                <button
                  type="button"
                  onClick={() => setIsUsingCustomChapter(!isUsingCustomChapter)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle size={12} />
                  {isUsingCustomChapter ? "Switch to App Presets" : "Type Custom Chapter"}
                </button>
              </div>

              {!isUsingCustomChapter ? (
                <div className="relative">
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:outline-none text-slate-800 dark:text-slate-200 cursor-pointer appearance-none"
                  >
                    {presets[selectedSubject]?.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.hindi})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customChapterName}
                    onChange={(e) => setCustomChapterName(e.target.value)}
                    placeholder="e.g. Gravity and Mass, Laws of Motion etc."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium"
                  />
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    💡 Ideal for preparing topics or CBSE chapters outside standard lists (with Hindi brackets automatically created by GuruJi).
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Choose target Student profile */}
            <div className="mb-5">
              <label className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                3. Student Learning Profile (विद्यार्थी वर्ग)
              </label>
              <div className="space-y-2">
                {[
                  { id: "struggling", label: "Slow Learner / Struggling Base (बुनियादी समझ)", desc: "Relies on daily analogies, visual guides, step-by-step experiment instructions, and multi-lingual word lists.", icon: "🐢" },
                  { id: "general", label: "Standard 9th Grader (सामान्य वर्ग)", desc: "Perfect pedagogical balance of standard textbook theory, experiments, memory mnemonics, and printable sheets.", icon: "🧠" },
                  { id: "advanced", label: "Gifted / Intellectual Master (उच्च कोटि मेधावी)", desc: "Incorporates advanced formulas, formula derivations, research challenges, exam nights cheatsheet.", icon: "🚀" }
                ].map((prof) => {
                  const isSel = selectedProfile === prof.id;
                  return (
                    <button
                      key={prof.id}
                      onClick={() => setSelectedProfile(prof.id as StudentProfile)}
                      className={`w-full text-left p-3 rounded-xl border transition-all active:scale-[0.99] flex items-start gap-3 cursor-pointer ${
                        isSel
                          ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-100 font-medium scale-[1.01]"
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-lg mt-0.5 shrink-0">{prof.icon}</span>
                      <div>
                        <span className="block text-xs font-bold">{prof.label}</span>
                        <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{prof.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Special Project type */}
            <div className="mb-6">
              <label className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                4. Select Project Portfolio Format (प्रोजेक्ट प्रारुप)
              </label>
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
                {[
                  "Full Study Folder",
                  "Compact Cheat-Sheet",
                  "Project Activity & Model",
                  "Interactive Quiz & Flashcards"
                ].map((type) => {
                  const isSel = projectType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setProjectType(type as ProjectType)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-semibold ${
                        isSel
                          ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-700 dark:text-indigo-300 scale-[1.02]"
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-95 cursor-pointer"
              >
                <Sparkles size={18} className={loading ? "animate-spin" : "animate-pulse"} />
                <span>{loading ? "Generating Masterclass..." : "Generate Printable Project"}</span>
              </button>

              <button
                type="button"
                onClick={handleLoadDemo}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2 px-4 rounded-xl transition-all text-xs border border-transparent dark:border-slate-700/50 cursor-pointer"
              >
                📚 Load Free Physics Gravitation Demo Project
              </button>
            </div>

          </div>

          {/* Pedagogy explanation card for transparency */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-indigo-100 rounded-2xl p-5 border border-indigo-800">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-indigo-300 flex items-center gap-1.5 mb-2">
              <Lightbulb size={14} className="text-amber-400" />
              Award-Winning Method Explanation
            </h3>
            <p className="text-xs leading-relaxed text-indigo-200 mb-1">
              • <strong>Analogies First</strong>: Instead of abstract algebra, we introduce everyday items (yo-yos, family budgets, cycles) to build visual cognitive connections.
            </p>
            <p className="text-xs leading-relaxed text-indigo-200 mb-1">
              • <strong>Dual Vocabulary</strong>: Difficult words are immediately tagged with Hindi expressions in bracket brackets to ensure slow standard learners don't drop out.
            </p>
            <p className="text-xs leading-relaxed text-indigo-200">
              • <strong>Print-to-Word Compatible</strong>: Results can be printed instantly to A4 files or copied to Microsoft Word for immediate high-mark homework submission!
            </p>
          </div>

        </section>

        {/* RIGHT COLUMN: PREVIEW OF THE GENERATED A4 PAPER/WORD FILE */}
        <section className="lg:col-span-7 flex flex-col items-center w-full">
          
          {/* Active loader rendering */}
          {loading && (
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[400px] mt-2">
              <div className="relative mb-6">
                <span className="relative flex h-14 w-14">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-14 w-14 bg-emerald-600 flex items-center justify-center">
                    <GraduationCap size={28} className="text-white animate-bounce" />
                  </span>
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-850 dark:text-slate-100">
                Teacher GuruJi is composing your project...
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm mt-2">
                Applying advanced pedagogical routines tailored to 9th-grade mental models.
              </p>
              
              <div className="mt-6 w-full max-w-md bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-pulse" style={{ width: "100%" }}></div>
              </div>

              {loadingStep && (
                <div className="mt-4 p-3 bg-emerald-50/50 dark:bg-slate-800/80 rounded-xl border border-emerald-100 dark:border-slate-800 text-xs text-emerald-800 dark:text-emerald-400 font-medium font-mono animate-fade-in max-w-md">
                   {loadingStep}
                </div>
              )}
            </div>
          )}

          {/* Main Content Presentation */}
          {!loading && generatedProject && (
            <A4ProjectDocument 
              project={generatedProject} 
              fontSize={fontSize} 
              theme={theme} 
            />
          )}

          {/* Missing API Key warning/troubleshooting wrapper */}
          {!loading && errorStatus && (
            <div className="w-full mt-4 p-5 bg-amber-50 border-2 border-dashed border-amber-300 dark:bg-amber-950/20 dark:border-amber-900/60 rounded-2xl">
              <div className="flex gap-3">
                <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-305">
                    Gemini API Configuration Notice (सेवा कॉन्फ़िगरेशन सूचना)
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed mt-1">
                    {errorStatus}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                    <strong>To use personalized generation:</strong> Click on the **Secrets** icon in AI Studio settings or environmental panel, and add your <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">GEMINI_API_KEY</code>.
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={handleLoadDemo}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow shadow-amber-600/20 transition-all cursor-pointer"
                    >
                      Instant Solution: View Full Preloaded Physics Project instead
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty presentation state when no project and no error */}
          {!loading && !generatedProject && !errorStatus && (
            <div className="w-full text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <BookOpen size={48} className="mx-auto text-slate-350 dark:text-slate-600 mb-4" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Project Active</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Chose a subject and chapter above, then press 'Generate Printable Project' to see the award winning methods in action.
              </p>
            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="no-print mt-10 border-t border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-gray-500 bg-white dark:bg-slate-950 font-medium">
        <p>© 2026 GuruJi Classrooms. Designed for 9th Standard CBSE, ICSE, and Board Portfolio Requirements.</p>
        <p className="mt-1 text-slate-400">Suitable for pasting onto Microsoft Word files or printing immediately on standard A4 paper sizes with optimal page brakes configured.</p>
      </footer>

    </div>
  );
}
