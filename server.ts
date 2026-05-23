import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy load Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set. API calls will fail until configured in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Built-in list of CBSE/ICSE 9th Class Chapters across standard subjects
const PRESETS = {
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
    { id: "s11", name: "Sound", hindi: "ध्वनि" },
    { id: "s12", name: "Improvement in Food Resources", hindi: "खाद्य संसाधनों में सुधार" }
  ],
  Mathematics: [
    { id: "m1", name: "Number Systems", hindi: "संख्या पद्धति" },
    { id: "m2", name: "Polynomials", hindi: "बहुपद" },
    { id: "m3", name: "Coordinate Geometry", hindi: "निर्देशांक ज्यामिति" },
    { id: "m4", name: "Linear Equations in Two Variables", hindi: "दो चरों वाले रैखिक समीकरण" },
    { id: "m5", name: "Introduction to Euclid's Geometry", hindi: "यूक्लिड की ज्यामिति का परिचय" },
    { id: "m6", name: "Lines and Angles", hindi: "रेखाएँ और कोण" },
    { id: "m7", name: "Triangles", hindi: "त्रिभुज" },
    { id: "m8", name: "Quadrilaterals", hindi: "चतुर्भुज" },
    { id: "m9", name: "Circles", hindi: "वृत्त" },
    { id: "m10", name: "Heron's Formula", hindi: "हेरॉन का सूत्र" },
    { id: "m11", name: "Surface Areas and Volumes", hindi: "पृष्ठीय क्षेत्रफल और आयतन" },
    { id: "m12", name: "Statistics", hindi: "सांख्यिकी" }
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
    { id: "ss9", name: "Population", hindi: "जनसंख्या" },
    { id: "ss10", name: "What is Democracy? Why Democracy?", hindi: "लोकतंत्र क्या? लोकतंत्र क्यों?" },
    { id: "ss11", name: "Constitutional Design", hindi: "संविधान निर्माण" },
    { id: "ss12", name: "Electoral Politics", hindi: "चुनावी राजनीति" },
    { id: "ss13", name: "Working of Institutions", hindi: "संस्थाओं का कामकाज" },
    { id: "ss14", name: "Democratic Rights", hindi: "लोकतांत्रिक अधिकार" },
    { id: "ss15", name: "The Story of Village Palampur", hindi: "पालमपुर गाँव की कहानी" },
    { id: "ss16", name: "People as Resource", hindi: "संसाधन के रूप में लोग" },
    { id: "ss17", name: "Poverty as a Challenge", hindi: "निर्धनता: एक चुनौती" },
    { id: "ss18", name: "Food Security in India", hindi: "भारत में खाद्य सुरक्षा" }
  ],
  English: [
    { id: "e1", name: "The Fun They Had", hindi: "द फन दे हैड" },
    { id: "e2", name: "The Sound of Music", hindi: "संगीत की ध्वनि" },
    { id: "e3", name: "The Little Girl", hindi: "छोटी बच्ची" },
    { id: "e4", name: "A Truly Beautiful Mind", hindi: "एक सचमुच सुंदर मन (अल्बर्ट आइंस्टीन)" },
    { id: "e5", name: "The Snake and the Mirror", hindi: "साँप और दर्पण" },
    { id: "e6", name: "My Childhood", hindi: "मेरा बचपन (ए.पी.जे. अब्दुल कलाम)" },
    { id: "e7", name: "Reach for the Top", hindi: "शिखर तक पहुँचें" },
    { id: "e8", name: "Kathmandu", hindi: "काठमांडू" },
    { id: "e9", name: "If I Were You", hindi: "यदि मैं तुम्हारी जगह होता" },
    { id: "e10", name: "The Lost Child", hindi: "खोया हुआ बच्चा" }
  ]
};

// API: List presets
app.get("/api/presets", (req, res) => {
  res.json(PRESETS);
});

// API: Generate Project
app.post("/api/generate-project", async (req, res) => {
  try {
    const { subject, chapter, studentProfile, projectType, languagePreference } = req.body;

    if (!subject || !chapter) {
      return res.status(400).json({ error: "Subject and Chapter fields are required." });
    }

    const client = getGeminiClient();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY configuration is missing. Please set your Gemini key in the Secrets pane."
      });
    }

    // Prepare specialized system instructions tailored for "World Level Award Winning Teacher"
    const systemInstruction = `You are a World-Level Award-Winning Teacher who knows all the master techniques for teaching any 9th-grade student, whether struggling (poor understanding/weak basics) or highly intelligent/gifted. You teach in a way that students never forget, using modern 2026 pedagogy (analogies, mnemonics, step-by-step practical activities, visual outlines, active recall).

CRITICAL REQUIREMENTS:
1. Every technical or slightly complex English term MUST be supplemented with its precise Hindi equivalent meaning in parentheses/brackets directly following it.
   Examples: Matter (पदार्थ), Force (बल), French Revolution (फ्रांसीसी क्रांति), Cell (कोशिका), Chloroplast (हरितलवक), Polynomial (बहुपद). Even simple vocabulary that could challenge a 9th grader should have translation: e.g., Environment (पर्यावरण), Theory (सिद्धांत), Equality (समानता).
2. Explanations must be crisp, highly structured, and designed for printing on A4 sheet formatting.
3. Every main concept must have a dedicated visual aid description or a structured layout representation of diagrams. If you can, use structured ASCII diagram patterns or beautiful inline SVG/flowchart descriptions that render wonderfully.
4. Structure the response precisely according to the JSON schema. Everything must be highly detailed and written in an inspiring, compassionate, world-class teaching tone.`;

    const prompt = `Create a spectacular educational project report designed to be printed on A4 paper or pasted in a Microsoft Word file.
subject: "${subject}"
chapter: "${chapter}"
studentProfile (How to tune the material): "${studentProfile || "General 9th grader"}" (If 'struggling/poor basics', use extremely relatable daily analogies and step-by-step guidance. If 'advanced/gifted', use high-order thinking, intellectual questions, and sophisticated concepts alongside analogies).
projectType: "${projectType || "Full Study Folder"}"

Please produce a comprehensive, interactive response filled with diagrams, explanations with Hindi meanings in brackets "()", active recall, mnemonics, and practical experiments. Use 'gemini-3.5-flash'.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "title",
            "subject",
            "chapter",
            "targetStudentProfile",
            "introduction",
            "analogy",
            "mainCoreConcepts",
            "beautifulInfographicText",
            "mnemonics",
            "practicalProjectActivity",
            "activeRecallQuiz",
            "quickSummaryRevisionCard",
            "diagrams"
          ],
          properties: {
            title: { type: Type.STRING, description: "Catchy and professional Project Title suitable for an A4 Cover Page" },
            subject: { type: Type.STRING, description: "Subject of the project" },
            chapter: { type: Type.STRING, description: "Chapter name being taught" },
            targetStudentProfile: { type: Type.STRING, description: "Teacher's custom note on how this project has been optimized to teach this student category" },
            introduction: { type: Type.STRING, description: "Easy, engaging introduction to the chapter's core mystery with real-life hook" },
            analogy: {
              type: Type.OBJECT,
              required: ["title", "scenarioDescription", "howItRelates"],
              properties: {
                title: { type: Type.STRING, description: "Name/title of the unforgettable analogy (e.g. 'The Cellular Factory' or 'The Solar Balance scale')" },
                scenarioDescription: { type: Type.STRING, description: "Relatable daily life scenario involving Indian context or general day-to-day objects, with Hindi bracket meanings." },
                howItRelates: { type: Type.STRING, description: "Detailed mapping step-by-step of how the analogy matches the technical chapters concepts, with Hindi meanings." }
              }
            },
            mainCoreConcepts: {
              type: Type.ARRAY,
              description: "The top 3-4 absolute pillars of this chapter written clearly with Hindi words in brackets",
              items: {
                type: Type.OBJECT,
                required: ["conceptName", "explanation", "keyFormulaOrDetail"],
                properties: {
                  conceptName: { type: Type.STRING, description: "Name of the core concept (e.g., Inertia (जड़त्व))" },
                  explanation: { type: Type.STRING, description: "Clear, friendly explanation designed for A4 learning" },
                  keyFormulaOrDetail: { type: Type.STRING, description: "Vital equations, laws, dates, or core highlights" }
                }
              }
            },
            beautifulInfographicText: {
              type: Type.STRING,
              description: "A textual blueprint/layout details representing a high-impact poster for classroom walls - what to draw on cardboards/word files."
            },
            mnemonics: {
              type: Type.ARRAY,
              description: "Magical tricks, word plays, formulas or acronyms to never forget key definitions or list of elements",
              items: {
                type: Type.OBJECT,
                required: ["shortcutCode", "expansion", "howItWorksInstructions"],
                properties: {
                  shortcutCode: { type: Type.STRING, description: "The magic code/acronym (e.g. My Very Educated Mother...)" },
                  expansion: { type: Type.STRING, description: "Line by line expanded list with English + Hindi meaning" },
                  howItWorksInstructions: { type: Type.STRING, description: "Why this mnemonic helps memorize this concept" }
                }
              }
            },
            practicalProjectActivity: {
              type: Type.OBJECT,
              description: "Hands-on simple activity or home cardboard model project to build for printing or writing with high score guarantee",
              required: ["projectName", "materialNeeded", "stepByStepGuide", "expectedObservation", "submissionQuestionWithHInt"],
              properties: {
                projectName: { type: Type.STRING },
                materialNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                stepByStepGuide: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Detailed action checklist with English/Hindi dual terms" },
                expectedObservation: { type: Type.STRING, description: "What the scientific/historical/mathematical result looks like" },
                submissionQuestionWithHInt: { type: Type.STRING, description: "The core proof observation question to write in the Word/file project with helpful teachers hint" }
              }
            },
            activeRecallQuiz: {
              type: Type.ARRAY,
              description: "5 active recall questions that cement the information permanently",
              items: {
                type: Type.OBJECT,
                required: ["question", "options", "correctOptionIndex", "funExplanationAndHint"],
                properties: {
                  question: { type: Type.STRING, description: "Self-explanatory conceptual check with Hindi translations in brackets" },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctOptionIndex: { type: Type.INTEGER },
                  funExplanationAndHint: { type: Type.STRING, description: "The ultimate memory hook explaining why this correct answer logic makes sense" }
                }
              }
            },
            quickSummaryRevisionCard: {
              type: Type.STRING,
              description: "An ultra-compact high-contrast revision flashcard with key terms, formulas, and diagrams reference for exam night"
            },
            diagrams: {
              type: Type.ARRAY,
              description: "Custom SVG code or structured layout diagrams that represent flowcharts, schematics or visual representations of raw science/math/history. Max 2 diagrams.",
              items: {
                type: Type.OBJECT,
                required: ["diagramTitle", "descriptionOfVisual", "svgSourceCode", "editorTipsForWord"],
                properties: {
                  diagramTitle: { type: Type.STRING },
                  descriptionOfVisual: { type: Type.STRING },
                  svgSourceCode: { type: Type.STRING, description: "Write valid standalone inline SVG code (width='100%', height='100%', viewBox='0 0 400 200' or appropriate, styled with clean fonts, shapes, high-contrast dark lines, arrows, labels, and text elements with dual language. No XML declaration, just raw <svg> tag with styling tags) so we can render it directly on A4 printable sheet or let them display beautifully." },
                  editorTipsForWord: { type: Type.STRING, description: "Advice for students pasting this in MS Word or drawing on project sheets" }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);

  } catch (error: any) {
    console.error("Error generating educational project: ", error);
    res.status(500).json({ error: error?.message || "Internal server error during project construction." });
  }
});

// Configure Vite middleware in development or serve static build files in production
const isProd = process.env.NODE_ENV === "production";

async function setupApp() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`World Award Teacher Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
