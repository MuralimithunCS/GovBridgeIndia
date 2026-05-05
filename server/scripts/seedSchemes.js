require('dotenv').config({ path: '../.env' });
const admin = require('firebase-admin');

// Since we are running this script directly from the server folder or scripts folder
// We need to initialize admin sdk
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log('Seeding Local Emulator...');
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'demo-govbridge',
    credential: admin.credential.applicationDefault()
  });
} else {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!serviceAccountPath) {
    console.error("Missing FIREBASE_SERVICE_ACCOUNT_PATH");
    process.exit(1);
  }
  const serviceAccount = require(`../../${serviceAccountPath}`);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const schemes = [
  {
    name: "Startup India Seed Fund",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { category: ["Business"] },
    benefits: "Financial assistance for proof of concept, prototype development, and product trials.",
    documents: ["DPIIT Recognition Certificate", "Pitch Deck"],
    apply_link: "https://seedfund.startupindia.gov.in"
  },
  {
    name: "PM Suraksha Bima Yojana",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { age_min: 18, age_max: 70, category: ["Insurance"] },
    benefits: "Accidental death/disability insurance (₹2 lakh cover at ₹20/year).",
    documents: ["Aadhar Card", "Bank Account Details"],
    apply_link: "https://jansuraksha.gov.in/"
  },
  {
    name: "PM Jeevan Jyoti Bima Yojana",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { age_min: 18, age_max: 50, category: ["Insurance"] },
    benefits: "Life insurance cover (₹2 lakh at ₹436/year).",
    documents: ["Aadhar Card", "Bank Account Details"],
    apply_link: "https://jansuraksha.gov.in/"
  },
  {
    name: "MGNREGA",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { category: ["Employment"] },
    benefits: "100 days of guaranteed wage employment for rural households.",
    documents: ["Job Card", "Aadhar Card"],
    apply_link: "https://nrega.nic.in/"
  },
  {
    name: "Pradhan Mantri Kaushal Vikas Yojana",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { category: ["Education", "Employment"] },
    benefits: "Skill training and certification for youth.",
    documents: ["Aadhar Card", "Educational Certificates"],
    apply_link: "https://www.pmkvyofficial.org/"
  },
  {
    name: "PM Surya Ghar Muft Bijli Yojana",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { category: ["Housing", "Business"] },
    benefits: "Free electricity (up to 300 units) via rooftop solar.",
    documents: ["Electricity Bill", "Aadhar Card"],
    apply_link: "https://pmsuryaghar.gov.in/"
  },
  {
    name: "Jal Jeevan Mission",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { category: ["Housing"] },
    benefits: "Tap water connections for every rural household.",
    documents: ["Address Proof", "Aadhar Card"],
    apply_link: "https://jaljeevanmission.gov.in/"
  },
  {
    name: "Mukhyamantri Yuva Swavalamban Yojana",
    type: "state",
    state_applicable: "Gujarat",
    eligibility_rules: { category: ["Education"] },
    benefits: "Education assistance for students.",
    documents: ["Domicile Certificate", "Income Certificate"],
    apply_link: "https://mysy.guj.nic.in/"
  },
  {
    name: "Mukhyamantri Chiranjeevi Swasthya Bima",
    type: "state",
    state_applicable: "Rajasthan",
    eligibility_rules: { category: ["Healthcare", "Insurance"] },
    benefits: "Health insurance for state residents.",
    documents: ["Jan Aadhar Card"],
    apply_link: "https://chiranjeevi.rajasthan.gov.in/"
  },
  {
    name: "Rythu Bandhu Scheme",
    type: "state",
    state_applicable: "Telangana",
    eligibility_rules: { occupation: ["Farmer"], category: ["Agriculture"] },
    benefits: "Investment support for farmers.",
    documents: ["Pattadar Passbook", "Bank Account Details"],
    apply_link: "https://rythubandhu.telangana.gov.in/"
  },
  {
    name: "Karunya Health Scheme",
    type: "state",
    state_applicable: "Kerala",
    eligibility_rules: { category: ["Healthcare"] },
    benefits: "Healthcare assistance.",
    documents: ["Aadhar Card", "Income Certificate"],
    apply_link: "http://karunya.kerala.gov.in/"
  },
  {
    name: "Pudhumai Penn Scheme",
    type: "state",
    state_applicable: "Tamil Nadu",
    eligibility_rules: { gender: "Female", category: ["Education", "Women"] },
    benefits: "Financial aid for girl students.",
    documents: ["Aadhar Card", "School Certificates"],
    apply_link: "https://www.pudhumaipenn.tn.gov.in/"
  },
  {
    name: "Kanya Sumangala Yojana",
    type: "state",
    state_applicable: "Uttar Pradesh",
    eligibility_rules: { gender: "Female", category: ["Women"] },
    benefits: "Holistic development for girl children.",
    documents: ["Birth Certificate", "Aadhar Card"],
    apply_link: "https://mksy.up.gov.in/"
  },
  {
    name: "PM Kisan Samman Nidhi",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { occupation: ["Farmer"], category: ["Agriculture"] },
    benefits: "Income support of ₹6,000/year to farmer families.",
    documents: ["Aadhar Card", "Land Details"],
    apply_link: "https://pmkisan.gov.in/"
  },
  {
    name: "Ayushman Bharat PM-JAY",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { category: ["Healthcare", "Insurance"] },
    benefits: "Health cover of ₹5 lakh/family per year.",
    documents: ["Aadhar Card", "Ration Card"],
    apply_link: "https://pmjay.gov.in/"
  },
  {
    name: "PM Mudra Yojana",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { category: ["Business", "Employment"] },
    benefits: "Loans up to ₹10 lakh for small/micro enterprises.",
    documents: ["Business Plan", "Aadhar Card"],
    apply_link: "https://www.mudra.org.in/"
  },
  {
    name: "National Scholarship Portal",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { category: ["Education"] },
    benefits: "Centralized scholarship management.",
    documents: ["Aadhar Card", "Previous Year Marksheet"],
    apply_link: "https://scholarships.gov.in/"
  },
  {
    name: "Sukanya Samriddhi Yojana",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { gender: "Female", age_max: 10, category: ["Women", "Insurance"] },
    benefits: "Long-term savings scheme for the girl child.",
    documents: ["Birth Certificate", "Aadhar Card of Parent"],
    apply_link: "https://www.indiapost.gov.in/"
  },
  {
    name: "Beti Bachao Beti Padhao",
    type: "central",
    state_applicable: "All",
    eligibility_rules: { gender: "Female", category: ["Women", "Education"] },
    benefits: "Campaign to ensure survival and education of girl children.",
    documents: ["Aadhar Card"],
    apply_link: "https://wcd.nic.in/"
  }
];

async function seed() {
  try {
    const batch = db.batch();
    for (const scheme of schemes) {
      scheme.createdAt = new Date().toISOString();
      const docRef = db.collection('schemes').doc();
      batch.set(docRef, scheme);
    }
    await batch.commit();
    console.log(`Successfully seeded ${schemes.length} schemes into Firestore.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding schemes: ", error);
    process.exit(1);
  }
}

seed();
