const { db } = require('../config/firebaseAdmin');

const schemes = [
  // ... (keeping the same schemes array)
  {
    name: "PM Kisan Samman Nidhi",
    description: "Financial assistance to landholding farmer families across the country.",
    type: "central",
    state_applicable: "all",
    category: "farmer",
    eligibility_rules: { occupation: "farmer", landholding: "up to 2 hectares" },
    benefits: "₹6,000 per year in three equal installments.",
    documents: ["Aadhar Card", "Land records", "Bank account details"],
    apply_link: "https://pmkisan.gov.in/"
  },
  {
    name: "Ayushman Bharat PM-JAY",
    description: "The world's largest health insurance scheme providing health cover to bottom 40% of the population.",
    type: "central",
    state_applicable: "all",
    category: "healthcare",
    eligibility_rules: { max_income: 150000, category: ["SECC 2011", "Poor"] },
    benefits: "Cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
    documents: ["Aadhar Card", "Ration Card"],
    apply_link: "https://pmjay.gov.in/"
  },
  {
    name: "Startup India Seed Fund",
    description: "Financial assistance to early-stage startups for proof of concept, prototype development, and more.",
    type: "central",
    state_applicable: "all",
    category: "business",
    eligibility_rules: { business_type: "startup", age_of_startup: "less than 2 years" },
    benefits: "Up to ₹20 Lakhs as grant for validation of Proof of Concept, or prototype development, or product trials.",
    documents: ["DPIIT Recognition Certificate", "Business Plan"],
    apply_link: "https://seedfund.startupindia.gov.in"
  },
  {
    name: "Sukanya Samriddhi Yojana",
    description: "A small deposit scheme for the girl child launched as a part of the 'Beti Bachao Beti Padhao' campaign.",
    type: "central",
    state_applicable: "all",
    category: "women",
    eligibility_rules: { gender: "female", age_max: 10 },
    benefits: "High interest rate and tax benefits for long-term savings for education and marriage.",
    documents: ["Birth Certificate", "Guardian's ID proof"],
    apply_link: "https://www.nsiindia.gov.in/"
  },
  {
    name: "PM Awas Yojana (Gramin)",
    description: "Providing pucca houses with basic amenities to all houseless householders and those households living in kutcha and dilapidated houses.",
    type: "central",
    state_applicable: "all",
    category: "housing",
    eligibility_rules: { housing_status: "homeless", max_income: 300000 },
    benefits: "Financial assistance for house construction.",
    documents: ["Aadhar Card", "Voter ID", "BPL Certificate"],
    apply_link: "https://pmayg.nic.in/"
  },
  {
    name: "PM Mudra Yojana",
    description: "Loans up to 10 lakh to the non-corporate, non-farm small/micro enterprises.",
    type: "central",
    state_applicable: "all",
    category: "business",
    eligibility_rules: { business_type: "micro enterprise", loan_amount_max: 1000000 },
    benefits: "Collateral-free loans for business expansion or startup.",
    documents: ["ID Proof", "Address Proof", "Business Identity"],
    apply_link: "https://www.mudra.org.in/"
  },
  {
    name: "National Scholarship Portal (NSP)",
    description: "One-stop solution for various scholarship schemes offered by Central and State governments.",
    type: "central",
    state_applicable: "all",
    category: "student",
    eligibility_rules: { status: "student", previous_grade_min: 50, max_income: 250000 },
    benefits: "Direct bank transfer of scholarship amount.",
    documents: ["Marksheet", "Income Certificate", "Caste Certificate"],
    apply_link: "https://scholarships.gov.in/"
  },
  {
    name: "PM Kaushal Vikas Yojana (PMKVY)",
    description: "Skill certification scheme objective is to enable a large number of Indian youth to take up industry-relevant skill training.",
    type: "central",
    state_applicable: "all",
    category: "employment",
    eligibility_rules: { age_min: 18, age_max: 45 },
    benefits: "Free skill training and certification.",
    documents: ["Aadhar Card", "Education Qualification Proof"],
    apply_link: "https://www.pmkvyofficial.org/"
  },
  {
    name: "Stand-Up India",
    description: "Facilitating bank loans between 10 lakh and 1 crore to at least one SC or ST borrower and at least one woman borrower per bank branch.",
    type: "central",
    state_applicable: "all",
    category: "business",
    eligibility_rules: { category: ["SC", "ST", "Women"], business_type: "greenfield project" },
    benefits: "Loans for setting up a greenfield enterprise.",
    documents: ["Project Report", "Caste Certificate", "Bank Statement"],
    apply_link: "https://www.standupmitra.in/"
  },
  {
    name: "Atal Pension Yojana",
    description: "Pension scheme focused on the unorganized sector.",
    type: "central",
    state_applicable: "all",
    category: "insurance",
    eligibility_rules: { age_min: 18, age_max: 40 },
    benefits: "Guaranteed minimum pension of ₹1,000 to ₹5,000 per month after age 60.",
    documents: ["Aadhar Card", "Bank Account"],
    apply_link: "https://www.npscra.nsdl.co.in/scheme-details.php"
  },
  {
    name: "Rythu Bandhu (Telangana)",
    description: "Investment support for agriculture and horticulture crops.",
    type: "state",
    state_applicable: "Telangana",
    category: "farmer",
    eligibility_rules: { occupation: "farmer", state: "Telangana" },
    benefits: "₹5,000 per acre per season.",
    documents: ["Pattadar Passbook", "Bank Account Details"],
    apply_link: "https://rythubandhu.telangana.gov.in/"
  },
  {
    name: "Kanya Sumangala Yojana (UP)",
    description: "Financial assistance to the girls of Uttar Pradesh.",
    type: "state",
    state_applicable: "Uttar Pradesh",
    category: "women",
    eligibility_rules: { gender: "female", state: "Uttar Pradesh", max_income: 300000 },
    benefits: "₹15,000 in six stages from birth to graduation.",
    documents: ["Birth Certificate", "Aadhar of Parents", "UP Domicile"],
    apply_link: "https://mksy.up.gov.in/"
  },
  {
    name: "Pudhumai Penn (Tamil Nadu)",
    description: "Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme.",
    type: "state",
    state_applicable: "Tamil Nadu",
    category: "student",
    eligibility_rules: { gender: "female", state: "Tamil Nadu", school_type: "Government" },
    benefits: "₹1,000 per month for girls pursuing higher education.",
    documents: ["Aadhar Card", "Transfer Certificate", "Schooling Certificate"],
    apply_link: "https://www.pudhumaipenn.tn.gov.in/"
  },
  {
    name: "Mukhyamantri Chiranjeevi Swasthya Bima (Rajasthan)",
    description: "Health insurance for all families of Rajasthan.",
    type: "state",
    state_applicable: "Rajasthan",
    category: "healthcare",
    eligibility_rules: { state: "Rajasthan" },
    benefits: "Health insurance cover up to ₹25 lakh per family.",
    documents: ["Jan Aadhar Card", "Aadhar Card"],
    apply_link: "https://chiranjeevi.rajasthan.gov.in/"
  },
  {
    name: "Jal Jeevan Mission",
    description: "Har Ghar Jal - providing functional household tap connection to every rural household.",
    type: "central",
    state_applicable: "all",
    category: "housing",
    eligibility_rules: { housing_status: "rural household" },
    benefits: "Clean and safe drinking water tap connection.",
    documents: ["Address Proof", "Aadhar Card"],
    apply_link: "https://jaljeevanmission.gov.in/"
  },
  {
    name: "PM Surya Ghar Muft Bijli Yojana",
    description: "Providing free electricity to households by installing rooftop solar panels.",
    type: "central",
    state_applicable: "all",
    category: "housing",
    eligibility_rules: { max_units_monthly: 300 },
    benefits: "Up to 300 units of free electricity and subsidy for solar installation.",
    documents: ["Electricity Bill", "Aadhar Card"],
    apply_link: "https://pmsuryaghar.gov.in/"
  },
  {
    name: "MGNREGA",
    description: "Mahatma Gandhi National Rural Employment Guarantee Act.",
    type: "central",
    state_applicable: "all",
    category: "employment",
    eligibility_rules: { area: "rural" },
    benefits: "At least 100 days of guaranteed wage employment in a financial year.",
    documents: ["Job Card", "Aadhar Card"],
    apply_link: "https://nrega.nic.in/"
  },
  {
    name: "Karunya Health Scheme (Kerala)",
    description: "Comprehensive health care to the under-privileged sections of the society.",
    type: "state",
    state_applicable: "Kerala",
    category: "healthcare",
    eligibility_rules: { state: "Kerala", max_income: 300000 },
    benefits: "Financial aid for major ailments.",
    documents: ["Aadhar Card", "Income Certificate"],
    apply_link: "http://karunya.kerala.gov.in/"
  },
  {
    name: "Ladli Behna Yojana (MP)",
    description: "Financial empowerment of women in Madhya Pradesh.",
    type: "state",
    state_applicable: "Madhya Pradesh",
    category: "women",
    eligibility_rules: { gender: "female", state: "Madhya Pradesh", age_min: 21, age_max: 60 },
    benefits: "₹1,250 per month directly into bank accounts.",
    documents: ["Samagra ID", "Aadhar Card", "Bank Account Details"],
    apply_link: "https://cmladlibehna.mp.gov.in/"
  },
  {
    name: "Beti Bachao Beti Padhao",
    description: "To celebrate the Girl Child & Enable her Education.",
    type: "central",
    state_applicable: "all",
    category: "women",
    eligibility_rules: { gender: "female" },
    benefits: "Awareness and welfare services focused on girl children.",
    documents: ["Birth Certificate"],
    apply_link: "https://wcd.nic.in/"
  },
  {
    name: "Digital India Internship Scheme",
    description: "Opportunity for students to work with MeitY.",
    type: "central",
    state_applicable: "all",
    category: "student",
    eligibility_rules: { status: "student", degree: "B.E/B.Tech/M.Sc" },
    benefits: "Stipend of ₹10,000 per month and certification.",
    documents: ["College ID", "Resume", "Recommendation Letter"],
    apply_link: "https://www.meity.gov.in/internship-scheme"
  },
  {
    name: "PM SVANidhi",
    description: "Micro-credit facility for street vendors.",
    type: "central",
    state_applicable: "all",
    category: "business",
    eligibility_rules: { occupation: "street vendor" },
    benefits: "Working capital loan up to ₹10,000.",
    documents: ["Vending Certificate", "Aadhar Card"],
    apply_link: "https://pmsvanidhi.mohua.gov.in/"
  },
  {
    name: "National Career Service (NCS)",
    description: "A digital platform to bridge the gap between job-seekers and employers.",
    type: "central",
    state_applicable: "all",
    category: "employment",
    eligibility_rules: { age_min: 14 },
    benefits: "Career counseling, job matching, and vocational guidance.",
    documents: ["Educational Certificates", "Aadhar Card"],
    apply_link: "https://www.ncs.gov.in/"
  },
  {
    name: "Sovereign Gold Bond Scheme",
    description: "Government securities denominated in grams of gold.",
    type: "central",
    state_applicable: "all",
    category: "business",
    eligibility_rules: { status: "Indian resident" },
    benefits: "Periodic interest and redemption at current gold price.",
    documents: ["PAN Card", "Aadhar Card", "Bank Details"],
    apply_link: "https://www.rbi.org.in/"
  },
  {
    name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    description: "National Mission for Financial Inclusion to ensure access to financial services.",
    type: "central",
    state_applicable: "all",
    category: "business",
    eligibility_rules: { age_min: 10 },
    benefits: "Zero balance account, accidental insurance, and overdraft facility.",
    documents: ["Aadhar Card", "Voter ID"],
    apply_link: "https://pmjdy.gov.in/"
  },
  {
    name: "Ujjwala Yojana",
    description: "Providing clean cooking fuel to poor households.",
    type: "central",
    state_applicable: "all",
    category: "women",
    eligibility_rules: { gender: "female", category: "BPL" },
    benefits: "Free LPG connection to women from BPL families.",
    documents: ["BPL Card", "Aadhar Card", "Address Proof"],
    apply_link: "https://www.pmuy.gov.in/"
  },
  {
    name: "Gati Shakti Yojana",
    description: "National Master Plan for multi-modal connectivity.",
    type: "central",
    state_applicable: "all",
    category: "business",
    eligibility_rules: { sector: "infrastructure" },
    benefits: "Integrated planning and synchronized implementation of infrastructure projects.",
    documents: ["Company Registration"],
    apply_link: "https://gatishakti.gov.in/"
  },
  {
    name: "PM Vishwakarma Scheme",
    description: "Support for traditional artisans and craftspeople.",
    type: "central",
    state_applicable: "all",
    category: "employment",
    eligibility_rules: { occupation: "artisan" },
    benefits: "Skill up-gradation, toolkit incentive, and credit support.",
    documents: ["Aadhar Card", "Artisan Certificate"],
    apply_link: "https://pmvishwakarma.gov.in/"
  },
  {
    name: "National Pension System (NPS)",
    description: "Voluntary long-term retirement savings scheme.",
    type: "central",
    state_applicable: "all",
    category: "insurance",
    eligibility_rules: { age_min: 18, age_max: 70 },
    benefits: "Market-linked returns and tax benefits for retirement.",
    documents: ["PAN Card", "Aadhar Card", "Address Proof"],
    apply_link: "https://www.npscra.nsdl.co.in/"
  },
  {
    name: "Kisan Credit Card (KCC)",
    description: "Adequate and timely credit support from the banking system.",
    type: "central",
    state_applicable: "all",
    category: "farmer",
    eligibility_rules: { occupation: "farmer" },
    benefits: "Credit for cultivation and other needs at subsidized interest.",
    documents: ["Land Records", "ID Proof"],
    apply_link: "https://www.nabard.org/"
  },
  {
    name: "Shakti Scheme (Karnataka)",
    description: "Free travel for women in non-premium government buses in Karnataka.",
    type: "state",
    state_applicable: "Karnataka",
    category: "women",
    eligibility_rules: { gender: "female", state: "Karnataka" },
    benefits: "Zero-cost bus travel across the state for women residents.",
    documents: ["Domicile Proof", "ID Card"],
    apply_link: "https://sevasindhu.karnataka.gov.in/"
  },
  {
    name: "Gruha Lakshmi (Karnataka)",
    description: "Financial assistance to the woman head of the family.",
    type: "state",
    state_applicable: "Karnataka",
    category: "women",
    eligibility_rules: { gender: "female", state: "Karnataka", is_head_of_family: true },
    benefits: "₹2,000 per month directly to the bank account of the woman head.",
    documents: ["Aadhar Card", "Ration Card", "Bank Details"],
    apply_link: "https://sevasindhu.karnataka.gov.in/"
  },
  {
    name: "Raitha Vidya Nidhi (Karnataka)",
    description: "Scholarship for children of farmers in Karnataka.",
    type: "state",
    state_applicable: "Karnataka",
    category: "student",
    eligibility_rules: { state: "Karnataka", parent_occupation: "farmer" },
    benefits: "Annual scholarship ranging from ₹2,500 to ₹11,000 for higher education.",
    documents: ["Farmer ID", "Student ID", "Aadhar Card"],
    apply_link: "https://ssp.postmatric.karnataka.gov.in/"
  }
];

const seedSchemes = async () => {
  try {
    const schemesCol = db.collection('schemes');
    const snapshot = await schemesCol.limit(1).get();
    
    if (snapshot.empty) {
      console.log('Firestore is empty. Seeding schemes...');
      const batch = db.batch();
      
      schemes.forEach((scheme) => {
        const docRef = schemesCol.doc(); // Auto-generate ID
        batch.set(docRef, scheme);
      });
      
      await batch.commit();
      console.log(`Successfully seeded ${schemes.length} schemes to Firestore.`);
    } else {
      console.log(`Firestore already has schemes. Skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding schemes to Firestore:', error.message);
  }
};

module.exports = seedSchemes;
