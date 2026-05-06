/**
 * GovBot Knowledge Base
 * Comprehensive training data for the GovBridge India chatbot.
 * Covers: scheme info, eligibility, documents, application process, FAQs, conversational flows.
 */

// ─── Intent Patterns ────────────────────────────────────────────────────────────
const INTENTS = {
  GREETING: {
    patterns: ['hi', 'hello', 'hey', 'namaste', 'hloo', 'hiii', 'hi bot', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'whats up', 'greetings', 'namaskar', 'vanakkam', 'sat sri akal'],
    responses: [
      "Namaste! 🙏 I'm **GovBot**, your personal government schemes assistant. I can help you:\n\n• Find schemes you're eligible for\n• Explain benefits & documents needed\n• Guide you through the application process\n• Answer questions about deadlines\n\nWhat would you like to know?",
      "Hello! 👋 Welcome to **GovBot**. I'm here to help you discover government schemes tailored for you. Try asking me things like:\n\n• \"What schemes can farmers get?\"\n• \"Am I eligible for PM Kisan?\"\n• \"What documents do I need for Ayushman Bharat?\"\n\nHow can I help you today?"
    ]
  },

  THANKS: {
    patterns: ['thank you', 'thanks', 'thanku', 'thnx', 'dhanyavaad', 'shukriya', 'thanks a lot', 'thank u', 'tysm', 'appreciate it'],
    responses: [
      "You're welcome! 😊 Feel free to ask if you have more questions about any government scheme. I'm always here to help!",
      "Happy to help! 🙌 Remember, you can always come back to check for new schemes or get application guidance. Jai Hind! 🇮🇳"
    ]
  },

  GOODBYE: {
    patterns: ['bye', 'goodbye', 'see you', 'exit', 'quit', 'close', 'alvida', 'tata'],
    responses: [
      "Goodbye! 👋 Remember to check back regularly for new schemes and deadlines. Take care!",
      "See you later! 🙏 Don't forget to bookmark the schemes you're interested in. Jai Hind!"
    ]
  },

  HELP: {
    patterns: ['help', 'what can you do', 'how to use', 'guide me', 'commands', 'options', 'menu', 'features', 'what do you know'],
    responses: [
      "Here's what I can help you with:\n\n🔍 **Find Schemes** — Ask about schemes for farmers, students, women, businesses, etc.\n📋 **Eligibility Check** — Ask \"Am I eligible for [scheme name]?\"\n📄 **Documents Required** — Ask \"What documents for [scheme name]?\"\n🔗 **How to Apply** — Ask \"How to apply for [scheme name]?\"\n📅 **Deadlines** — Ask about upcoming deadlines\n🏛️ **State Schemes** — Ask about schemes in your state\n💰 **Benefits** — Ask \"What are the benefits of [scheme]?\"\n\nJust type your question naturally — I understand Hindi-English mix too!"
    ]
  },

  ELIGIBILITY: {
    patterns: ['eligible', 'eligibility', 'qualify', 'can i apply', 'am i eligible', 'who can apply', 'requirements', 'criteria', 'conditions'],
  },

  DOCUMENTS: {
    patterns: ['documents', 'document', 'papers', 'paperwork', 'what do i need', 'docs required', 'documentation', 'certificates', 'proofs'],
  },

  HOW_TO_APPLY: {
    patterns: ['how to apply', 'apply', 'application', 'register', 'registration', 'sign up', 'enroll', 'enrollment', 'where to apply', 'online apply', 'apply online', 'application process', 'how to get'],
  },

  BENEFITS: {
    patterns: ['benefits', 'advantage', 'what do i get', 'how much', 'amount', 'money', 'stipend', 'subsidy', 'grant', 'loan amount', 'financial help', 'paise', 'kitna milega', 'kitna paisa'],
  },

  DEADLINE: {
    patterns: ['deadline', 'last date', 'when', 'date', 'time limit', 'expiry', 'kab tak', 'last day', 'closing date'],
  },

  STATUS: {
    patterns: ['status', 'check status', 'application status', 'track', 'tracking', 'where is my', 'pending', 'approved', 'rejected'],
  },

  COMPARE: {
    patterns: ['compare', 'difference', 'vs', 'versus', 'which is better', 'comparison', 'better option'],
  }
};

// ─── Category Keywords ──────────────────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  farmer: ['farmer', 'kisan', 'agriculture', 'farming', 'crop', 'land', 'cultivation', 'kheti', 'krishi', 'seeds', 'fertilizer', 'irrigation', 'harvest', 'rural farmer', 'marginal farmer', 'small farmer'],
  student: ['student', 'scholarship', 'education', 'college', 'school', 'university', 'study', 'degree', 'padhai', 'vidyarthi', 'exam', 'merit', 'post-matric', 'pre-matric', 'fellowship', 'internship'],
  women: ['women', 'woman', 'girl', 'female', 'mahila', 'beti', 'stree', 'lady', 'ladies', 'mother', 'pregnant', 'maternity', 'widow', 'single mother'],
  business: ['business', 'startup', 'loan', 'entrepreneur', 'enterprise', 'company', 'shop', 'vendor', 'msme', 'vyapar', 'udyam', 'self-employed', 'trader', 'manufacturing'],
  healthcare: ['health', 'medical', 'hospital', 'doctor', 'treatment', 'medicine', 'insurance', 'bima', 'swasthya', 'illness', 'surgery', 'disease', 'patient', 'ayushman'],
  housing: ['house', 'home', 'housing', 'shelter', 'awas', 'ghar', 'building', 'construction', 'roof', 'pucca', 'kutcha', 'electricity', 'solar', 'water', 'tap'],
  employment: ['employment', 'job', 'work', 'career', 'skill', 'training', 'naukri', 'rojgar', 'kaushal', 'placement', 'vocational', 'artisan', 'craftsman'],
  insurance: ['insurance', 'pension', 'retirement', 'bima', 'security', 'old age', 'social security', 'annuity']
};

// ─── State Keywords ─────────────────────────────────────────────────────────────
const STATE_KEYWORDS = {
  'maharashtra': ['maharashtra', 'mumbai', 'pune', 'nagpur', 'nashik'],
  'telangana': ['telangana', 'hyderabad', 'warangal', 'nizamabad'],
  'karnataka': ['karnataka', 'bangalore', 'bengaluru', 'mysore', 'mangalore'],
  'tamil nadu': ['tamil nadu', 'tamilnadu', 'chennai', 'coimbatore', 'madurai'],
  'kerala': ['kerala', 'kochi', 'cochin', 'thiruvananthapuram', 'trivandrum'],
  'uttar pradesh': ['uttar pradesh', 'up', 'lucknow', 'noida', 'agra', 'varanasi'],
  'rajasthan': ['rajasthan', 'jaipur', 'jodhpur', 'udaipur'],
  'madhya pradesh': ['madhya pradesh', 'mp', 'bhopal', 'indore', 'gwalior'],
  'gujarat': ['gujarat', 'ahmedabad', 'surat', 'vadodara'],
  'west bengal': ['west bengal', 'kolkata', 'bengal'],
  'bihar': ['bihar', 'patna'],
  'odisha': ['odisha', 'orissa', 'bhubaneswar'],
  'andhra pradesh': ['andhra pradesh', 'ap', 'visakhapatnam', 'vijayawada'],
  'punjab': ['punjab', 'chandigarh', 'amritsar', 'ludhiana'],
  'haryana': ['haryana', 'gurgaon', 'gurugram', 'faridabad'],
  'assam': ['assam', 'guwahati'],
  'jharkhand': ['jharkhand', 'ranchi'],
  'chhattisgarh': ['chhattisgarh', 'raipur'],
  'uttarakhand': ['uttarakhand', 'dehradun'],
  'goa': ['goa', 'panaji'],
  'delhi': ['delhi', 'new delhi'],
};

// ─── Scheme-Specific FAQ ────────────────────────────────────────────────────────
const SCHEME_FAQ = {
  'pm kisan': {
    aliases: ['pm kisan', 'pm-kisan', 'pmkisan', 'kisan samman', 'kisan nidhi', 'pm kisan samman nidhi'],
    faqs: [
      {
        q: ['how much money', 'amount', 'kitna paisa', 'kitna milega'],
        a: "Under **PM Kisan Samman Nidhi**, eligible farmers receive **₹6,000 per year** in **3 equal installments** of ₹2,000 each, directly into their bank accounts."
      },
      {
        q: ['who is eligible', 'eligibility', 'can i apply'],
        a: "**PM Kisan Eligibility:**\n• Must be a **landholding farmer family**\n• All farmer families with cultivable land\n• **Excluded:** Institutional landholders, former/present ministers, income tax payers, professionals (doctors, engineers, lawyers, CAs)\n• No income ceiling for small and marginal farmers"
      },
      {
        q: ['documents', 'papers needed', 'docs'],
        a: "**Documents for PM Kisan:**\n📄 Aadhaar Card (mandatory)\n📄 Land ownership records / Khasra Khatauni\n📄 Bank account details\n📄 Mobile number linked to Aadhaar\n\n⚠️ Aadhaar must be seeded with the bank account."
      },
      {
        q: ['how to apply', 'apply', 'registration'],
        a: "**How to apply for PM Kisan:**\n1️⃣ Visit **pmkisan.gov.in**\n2️⃣ Click on 'New Farmer Registration'\n3️⃣ Enter your Aadhaar number\n4️⃣ Fill in land details and bank info\n5️⃣ Submit — the local patwari/revenue officer will verify\n\nYou can also apply through your nearest **CSC (Common Service Centre)**."
      },
      {
        q: ['status', 'check status', 'beneficiary status'],
        a: "**Check PM Kisan Status:**\n1️⃣ Go to **pmkisan.gov.in**\n2️⃣ Click 'Beneficiary Status'\n3️⃣ Enter Aadhaar, Account Number, or Mobile\n4️⃣ View your installment history\n\nYou can also check via the **PM Kisan Mobile App**."
      },
      {
        q: ['installment', 'next installment', 'kist'],
        a: "PM Kisan installments are paid **3 times a year**:\n• **April – July** (1st installment)\n• **August – November** (2nd installment)\n• **December – March** (3rd installment)\n\nEach installment is **₹2,000**. Check your beneficiary status at pmkisan.gov.in."
      }
    ]
  },

  'ayushman bharat': {
    aliases: ['ayushman', 'ayushman bharat', 'pm jay', 'pm-jay', 'pmjay', 'jan arogya', 'ayushman card'],
    faqs: [
      {
        q: ['eligibility', 'who can apply', 'can i get'],
        a: "**Ayushman Bharat PM-JAY Eligibility:**\n• Families identified by **SECC 2011** database\n• No income ceiling — identified by **deprivation categories**\n• Covers bottom **40% of the population** (~50 crore people)\n• Both rural and urban poor families\n\n🔍 Check eligibility at **mera.pmjay.gov.in** using your Aadhaar or ration card."
      },
      {
        q: ['benefits', 'coverage', 'how much'],
        a: "**Ayushman Bharat Benefits:**\n💰 Up to **₹5 lakh per family per year**\n🏥 Covers **1,929+ medical procedures**\n🚫 **No cap** on family size or age\n✅ Pre/post hospitalization expenses covered\n\nThe scheme is **cashless and paperless** at empanelled hospitals."
      },
      {
        q: ['how to apply', 'get card'],
        a: "**How to get Ayushman Card:**\n1️⃣ Check eligibility at **mera.pmjay.gov.in**\n2️⃣ Visit a **CSC Centre** or empanelled hospital\n3️⃣ Carry Aadhaar Card + Ration Card\n4️⃣ Biometric verification will be done\n5️⃣ E-card is generated instantly\n\nYou can also use the **Ayushman App** for self-registration."
      }
    ]
  },

  'mudra': {
    aliases: ['mudra', 'pm mudra', 'mudra yojana', 'mudra loan'],
    faqs: [
      {
        q: ['loan amount', 'how much loan', 'kitna loan'],
        a: "**PM Mudra Yojana Loan Categories:**\n\n🟢 **Shishu:** Up to ₹50,000 (for startups)\n🟡 **Kishore:** ₹50,001 to ₹5,00,000 (for growth)\n🔴 **Tarun:** ₹5,00,001 to ₹10,00,000 (for expansion)\n\nAll loans are **collateral-free** and available at all banks."
      },
      {
        q: ['eligibility', 'who can apply'],
        a: "**Mudra Loan Eligibility:**\n• Any Indian citizen starting or expanding a business\n• Non-corporate, non-farm small/micro enterprises\n• Manufacturing, trading, and service sector activities\n• No minimum income required\n• **No collateral** needed"
      },
      {
        q: ['how to apply', 'apply'],
        a: "**How to apply for Mudra Loan:**\n1️⃣ Visit any **bank, NBFC, or MFI**\n2️⃣ Fill the Mudra loan application form\n3️⃣ Submit business plan/proposal\n4️⃣ Provide ID proof + address proof + business identity\n5️⃣ Bank processes within **7-10 working days**\n\n🌐 Online: Apply via **mudra.org.in** or **PSBLoansIn59Minutes.com**"
      }
    ]
  },

  'sukanya samriddhi': {
    aliases: ['sukanya', 'sukanya samriddhi', 'ssy', 'sukanya yojana'],
    faqs: [
      {
        q: ['interest rate', 'how much interest'],
        a: "**Sukanya Samriddhi Yojana** offers one of the **highest interest rates** among government savings schemes — currently around **8.2% per annum** (subject to quarterly revisions). Interest is **compounded annually** and is **fully tax-free**."
      },
      {
        q: ['eligibility', 'who can open'],
        a: "**SSY Eligibility:**\n• For **girl child below 10 years** of age\n• Maximum **2 accounts** per family (one per girl child)\n• Guardian opens the account on behalf of the child\n• Minimum deposit: **₹250/year**, Maximum: **₹1,50,000/year**"
      }
    ]
  }
};

// ─── Application Process Templates ──────────────────────────────────────────────
const APPLICATION_GUIDES = {
  online: "**General Online Application Steps:**\n1️⃣ Visit the official scheme website\n2️⃣ Click on 'Register' or 'New Application'\n3️⃣ Enter Aadhaar + mobile number for OTP verification\n4️⃣ Fill in personal and eligibility details\n5️⃣ Upload required documents (scanned copies)\n6️⃣ Review and submit application\n7️⃣ Note the application/reference number\n8️⃣ Track status online using the reference number",

  offline: "**Offline Application Steps:**\n1️⃣ Visit the nearest **CSC (Common Service Centre)** or **government office**\n2️⃣ Carry all original documents + 2 photocopies\n3️⃣ Fill out the application form\n4️⃣ Submit along with documents\n5️⃣ Get acknowledgment receipt\n6️⃣ Follow up at the office after 15-30 days",

  csc: "**CSC (Common Service Centre) Info:**\n📍 CSCs are present in nearly every village and town\n🔍 Find nearest CSC: **locator.csccloud.in**\n💡 CSCs can help with: Aadhaar enrollment, scheme applications, DigiLocker, and more\n💰 Nominal service charges apply (₹20-50 per application)"
};

// ─── General Knowledge Responses ────────────────────────────────────────────────
const GENERAL_KNOWLEDGE = {
  csc: "**Common Service Centres (CSCs)** are digital hubs in rural and remote areas that provide government and private services. Find the nearest one at **locator.csccloud.in**.",
  
  digilocker: "**DigiLocker** is a digital document wallet by the Government of India. You can store and share your Aadhaar, PAN, marksheets, etc. Sign up at **digilocker.gov.in** using your Aadhaar.",
  
  aadhaar: "**Aadhaar** is a 12-digit unique identity number issued by UIDAI. It's required for almost all government schemes. If you don't have one, visit your nearest **Aadhaar Enrollment Centre** or post office.",
  
  income_certificate: "**Income Certificate** can be obtained from your **District Collector / Tehsildar / Revenue Officer**. Required documents: Aadhaar, ration card, salary slip (if employed). You can also apply online through your state's e-District portal.",
  
  caste_certificate: "**Caste Certificate** is issued by the **Sub-Divisional Magistrate (SDM)** or Revenue Officer. Apply through your state's **e-District portal** or visit the **Tehsil office** with Aadhaar + parent's caste certificate.",

  domicile: "**Domicile Certificate** proves you're a resident of a particular state. Apply through your state's **e-District portal** or the **Tehsil/SDM office**. Required: Aadhaar + address proof + school certificate.",

  jan_dhan: "**PM Jan Dhan Yojana** provides **zero-balance bank accounts** with ₹1 lakh accidental insurance. Visit any bank with your Aadhaar card to open one — it's completely free.",
};

// ─── Conversational Templates ───────────────────────────────────────────────────
const CONVERSATION_TEMPLATES = {
  no_match: "I couldn't find an exact match, but here are some suggestions:\n\n• Try using keywords like **\"farmer schemes\"**, **\"student scholarships\"**, or **\"health insurance\"**\n• Ask about a specific scheme by name (e.g., **\"Tell me about PM Kisan\"**)\n• Ask about schemes in your state (e.g., **\"Schemes in Karnataka\"**)\n\n💡 Type **\"help\"** to see everything I can do!",

  profile_tip: "💡 **Pro Tip:** Complete your profile on GovBridge to get **personalized scheme recommendations** based on your age, income, occupation, and state!",

  disclaimer: "⚠️ *Information is based on the latest available data. Always verify details on the official government portal before applying.*",

  multilingual_tip: "🌐 You can ask me in English or Hinglish — I understand both! Try: \"Farmer ke liye kaunse scheme hain?\"",
};

module.exports = {
  INTENTS,
  CATEGORY_KEYWORDS,
  STATE_KEYWORDS,
  SCHEME_FAQ,
  APPLICATION_GUIDES,
  GENERAL_KNOWLEDGE,
  CONVERSATION_TEMPLATES,
};
