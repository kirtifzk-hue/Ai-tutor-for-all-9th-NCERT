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

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return res.status(200).json(PRESETS);
}
