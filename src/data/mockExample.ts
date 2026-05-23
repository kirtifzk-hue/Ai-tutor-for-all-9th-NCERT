import { LessonProject } from "../types";

export const SAMPLE_GRAVITATION_PROJECT: LessonProject = {
  title: "9th Class Supreme Project: Gravitation (गुरुत्वाकर्षण की कहानी)",
  subject: "Science",
  chapter: "Gravitation (गुरुत्वाकर्षण)",
  targetStudentProfile: "Optimized for Multi-Level Interactive Learners with Hindi brackets () support",
  introduction: "Have you ever wondered why an apple falls straight downwards to the ground instead of flying off into outer space (अंतरिक्ष)? Why doesn't the moon (चंद्रमा) wander away from Earth? Let's venture together into the magical, invisible force that glues the entire universe together!",
  analogy: {
    title: "The Unbreakable Cosmic Yo-Yo (ब्रह्मांडीय यो-यो का रहस्य)",
    scenarioDescription: "Imagine you are spinning a small stone (पत्थर) attached to a string (धागा) around in a circular circle (वृत्तीय मार्ग) above your head. As long as you pull the thread, the stone is bound to fly in circles around your hand.",
    howItRelates: "Just like your strong finger pulls the thread providing a centripetal force (अभिकेंद्र बल) to keep the stone from escaping, Earth pulls the Moon with an invisible gravity thread! If you cut the string, the stone flies off in a straight tangent line (स्पर्शरेखा) - just like the planets would if gravity suddenly slept!"
  },
  mainCoreConcepts: [
    {
      conceptName: "Universal Law of Gravitation (गुरुत्वाकर्षण का सार्वत्रिक नियम)",
      explanation: "Every object in the universe attracts every other object with a force that is directly proportional to the product of their masses (द्रव्यमान) and inversely proportional to the square of the distance (दूरी) between their centers.",
      keyFormulaOrDetail: "F = G × (M × m) / d² \n(Where G is the Universal Gravitational Constant (सार्वत्रिक गुरुत्वाकर्षण नियतांक) = 6.673 × 10⁻¹¹ N m²/kg²)"
    },
    {
      conceptName: "Free Fall (मुक्त पतन)",
      explanation: "Whenever objects fall towards the earth under the influence of gravitational force alone with no other forces acting, they are said to be in Free Fall. Their velocity changes, creating an acceleration due to gravity (गुरुत्वीय त्वरण).",
      keyFormulaOrDetail: "g = G × M / R² ≈ 9.8 m/s² on the Earth surface (पृथ्वी की सतह पर)"
    },
    {
      conceptName: "Mass vs Weight (द्रव्यमान बनाम भार)",
      explanation: "Mass (द्रव्यमान) is the measure of an object's inertia (जड़त्व) and stays constant everywhere, even on Mars. Weight (भार) is the actual force with which Earth attracts that object and changes depending on local gravity!",
      keyFormulaOrDetail: "Weight (W) = Mass (m) × Gravity (g). Weight on Moon = 1/6th of Weight on Earth"
    }
  ],
  beautifulInfographicText: "✏️ POSTER LAYOUT (A4 BOARD):\n- Center Circle: Giant Earth reaching out with golden magnetic field waves representing Gravity (गुरुत्व).\n- Left Column: Standard mass balance (तुला) measuring kilograms (किग्रा) vs spring balance measuring weight in Newtons (न्यूटन).\n- Right Pillar: Sir Isaac Newton resting under an apple tree with a light bulb lighting up as the apple drops downwards.",
  mnemonics: [
    {
      shortcutCode: "G vs g",
      expansion: "Capital 'G' is Grandfather (Universal constant, stays constant everywhere in the cosmos!). Little 'g' is baby grandson (highly active, changes depending on which planet or high mountain he resides!).",
      howItWorksInstructions: "Helps prevent the common mistake of confusing Universal constant G with locally fluctuating acceleration g."
    },
    {
      shortcutCode: "F-M-D Double Rule",
      expansion: "Force (बल) Up as Mass (द्रव्यमान) goes Up ↑. Force Down as Distance (दूरी) goes Up Doubly ↓↓ (Inverse square relation).",
      howItWorksInstructions: "Instantly allows visual intuition for numerical ratio problems."
    }
  ],
  practicalProjectActivity: {
    projectName: "Homemade Gravity Pendulum & Apple Experiment (घर पर बना सरल लोलक)",
    materialNeeded: [
      "A long sewing thread (धागा) of 1 meter",
      "A heavy metal nut or dry lemon (नींबू) as the weight bob",
      "A kitchen ruler or scale (मापक)",
      "A smartphone stopwatch (विराम घड़ी)"
    ],
    stepByStepGuide: [
      "Tie one end of the 1-meter thread to the lemon bob firmly.",
      "Hold the other string end securely at a table edge so it swings empty in the air description.",
      "Pull the bob slightly to one side (approx 10 degrees) and release it.",
      "Count exactly 20 full oscillations (दोलन) from left to right and back, timing with the stopwatch.",
      "Calculate the time period (आवर्तकाल) of 1 oscillation = Total Time / 20."
    ],
    expectedObservation: "You will discover that changing how heavy the lemon bob is does NOT change the speed or time of the swinging! Gravity accelerates all masses at the exact same rate 'g' under clean free-standing state!",
    submissionQuestionWithHInt: "Question: If we set up this experiment on the Moon, will the oscillation speed be faster or slower? Hint: Gravity on Moon is 6 times weaker, so the restoring pull is much lazier!"
  },
  activeRecallQuiz: [
    {
      question: "If the distance between two bodies is doubled, the gravitational force becomes:",
      options: [
        "Doubled (दोगुना)",
        "Halved (आधा)",
        "Four times stronger (चार गुना)",
        "One-Fourth of initial value (एक-चौथाई)"
      ],
      correctOptionIndex: 3,
      funExplanationAndHint: "Because of the Inverse Square Law (व्युत्क्रम वर्ग नियम)! Since distance 'd' is in the denominator squared (d²), doubling distance makes the force fall by 1 / (2)² = 1/4th!"
    },
    {
      question: "What is the weight of an astronaut on Earth if their mass is 60 kg?",
      options: [
        "60 Newtons (न्यूटन)",
        "588 Newtons (न्यूटन)",
        "10 Newtons (न्यूटन)",
        "zero (शून्य)"
      ],
      correctOptionIndex: 1,
      funExplanationAndHint: "W = m × g = 60 kg × 9.8 m/s² = 588 Newtons! Weight is measured in Newtons, but mass is in kilograms!"
    }
  ],
  quickSummaryRevisionCard: "🧠 RAPID CHEATSHEET:\n- Value of G: 6.67 × 10⁻¹¹ N m² kg⁻² (Discovered by Henry Cavendish)\n- Acceleration g: 9.8 m/s² on Earth's surface.\n- Trust Factor: Mass stays constant, weight changes everywhere!\n- Centripetal Force: Center-seeking force needed to sustain circular motion paths.",
  diagrams: [
    {
      diagramTitle: "Inverse Square Distance Relationship (दूरी एवं बल संबंध)",
      descriptionOfVisual: "Visual representation of gravity fading rapidly as distance increases from center.",
      svgSourceCode: `<svg width="100%" height="100%" viewBox="0 0 400 200" style="background:#0f172a; border-radius:12px; font-family:sans-serif;" xmlns="http://www.w3.org/2000/svg">
  <!-- Grid background -->
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" rx="12" />
  
  <!-- Planet Earth -->
  <circle cx="60" cy="100" r="25" fill="#38bdf8" stroke="#0ea5e9" stroke-width="2" />
  <text x="60" y="105" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Earth</text>
  <text x="60" y="145" fill="#38bdf8" font-size="9" text-anchor="middle">Mass M</text>

  <!-- Distance 1 D -->
  <line x1="85" y1="100" x2="180" y2="100" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4" />
  <circle cx="180" cy="100" r="10" fill="#fda4af" stroke="#f43f5e" stroke-width="2" />
  <text x="180" y="93" fill="#ffffff" font-size="9" text-anchor="middle">m</text>
  <text x="132" y="90" fill="#f43f5e" font-size="10" font-weight="bold" text-anchor="middle">Distance d</text>
  <text x="180" y="130" fill="#f43f5e" font-size="11" font-weight="bold" text-anchor="middle">Force = F</text>

  <!-- Distance 2 D -->
  <line x1="85" y1="100" x2="310" y2="100" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="2" />
  <circle cx="310" cy="100" r="10" fill="#fef08a" stroke="#eab308" stroke-width="2" />
  <text x="310" y="93" fill="#ffffff" font-size="9" text-anchor="middle">m</text>
  <text x="245" y="115" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">Distance 2d ↑</text>
  <text x="310" y="130" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Force = F / 4 ↓↓</text>
  
  <text x="200" y="30" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Universal Gravity Attraction (गुरुत्वीय खिंचाव)</text>
</svg>`,
      editorTipsForWord: "Pasting instructions: Take a screenshot or click 'Download Project Word Pack' to directly get the vector block in your school journal."
    }
  ]
};
