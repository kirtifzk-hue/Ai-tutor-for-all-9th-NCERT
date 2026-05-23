import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
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

export default async function handler(req: any, res: any) {
  // Setup CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { subject, chapter, studentProfile, projectType } = req.body || {};

    if (!subject || !chapter) {
      return res.status(400).json({ error: "Subject and Chapter fields are required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing. Pls add GEMINI_API_KEY as an environment variable in your Vercel Dashboard secrets."
      });
    }

    const client = getGeminiClient();

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
                  svgSourceCode: { type: Type.STRING, description: "Write valid standalone inline SVG code. No XML declaration, just raw <svg> tag with styling tags so we can render it directly on A4 printable sheet or let them display beautifully." },
                  editorTipsForWord: { type: Type.STRING, description: "Advice for students pasting this in MS Word or drawing on project sheets" }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error("Error generating educational project: ", error);
    return res.status(500).json({ error: error?.message || "Internal server error during project construction." });
  }
}
