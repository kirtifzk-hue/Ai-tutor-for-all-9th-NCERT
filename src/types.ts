export interface ChapterPreset {
  id: string;
  name: string;
  hindi: string;
}

export interface PresetData {
  Science: ChapterPreset[];
  Mathematics: ChapterPreset[];
  "Social Science": ChapterPreset[];
  English: ChapterPreset[];
}

export type StudentProfile = "struggling" | "general" | "advanced";

export type ProjectType = "Full Study Folder" | "Compact Cheat-Sheet" | "Project Activity & Model" | "Interactive Quiz & Flashcards";

export interface CoreConcept {
  conceptName: string;
  explanation: string;
  keyFormulaOrDetail: string;
}

export interface Mnemonic {
  shortcutCode: string;
  expansion: string;
  howItWorksInstructions: string;
}

export interface PracticalProjectActivity {
  projectName: string;
  materialNeeded: string[];
  stepByStepGuide: string[];
  expectedObservation: string;
  submissionQuestionWithHInt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  funExplanationAndHint: string;
}

export interface LessonDiagram {
  diagramTitle: string;
  descriptionOfVisual: string;
  svgSourceCode: string;
  editorTipsForWord: string;
}

export interface AnalogyData {
  title: string;
  scenarioDescription: string;
  howItRelates: string;
}

export interface LessonProject {
  title: string;
  subject: string;
  chapter: string;
  targetStudentProfile: string;
  introduction: string;
  analogy: AnalogyData;
  mainCoreConcepts: CoreConcept[];
  beautifulInfographicText: string;
  mnemonics: Mnemonic[];
  practicalProjectActivity: PracticalProjectActivity;
  activeRecallQuiz: QuizQuestion[];
  quickSummaryRevisionCard: string;
  diagrams: LessonDiagram[];
}

export type FontSize = "normal" | "large" | "extra-large";
