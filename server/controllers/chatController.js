const { db } = require('../config/firebaseAdmin');
const {
  INTENTS,
  CATEGORY_KEYWORDS,
  STATE_KEYWORDS,
  SCHEME_FAQ,
  APPLICATION_GUIDES,
  GENERAL_KNOWLEDGE,
  CONVERSATION_TEMPLATES,
} = require('../utils/chatKnowledgeBase');

// ─── Helper: Detect Intent ──────────────────────────────────────────────────────
function detectIntent(query) {
  const q = query.toLowerCase().trim();
  
  for (const [intentName, intentData] of Object.entries(INTENTS)) {
    if (intentData.patterns && intentData.patterns.some(p => q.includes(p) || q === p)) {
      return intentName;
    }
  }
  return null;
}

// ─── Helper: Detect Category ────────────────────────────────────────────────────
function detectCategory(query) {
  const q = query.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) {
      return category;
    }
  }
  return null;
}

// ─── Helper: Detect State ───────────────────────────────────────────────────────
function detectState(query) {
  const q = query.toLowerCase();
  
  for (const [state, keywords] of Object.entries(STATE_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) {
      return state;
    }
  }
  return null;
}

// ─── Helper: Check Scheme-Specific FAQ ──────────────────────────────────────────
function checkSchemeFAQ(query) {
  const q = query.toLowerCase();

  for (const [key, schemeData] of Object.entries(SCHEME_FAQ)) {
    if (schemeData.aliases.some(alias => q.includes(alias))) {
      // Found a scheme match — now find the most relevant FAQ
      for (const faq of schemeData.faqs) {
        if (faq.q.some(pattern => q.includes(pattern))) {
          return { schemeName: key, answer: faq.a };
        }
      }
      // Return null (scheme matched but no FAQ matched — we'll handle scheme detail below)
      return { schemeName: key, answer: null };
    }
  }
  return null;
}

// ─── Helper: Check General Knowledge ────────────────────────────────────────────
function checkGeneralKnowledge(query) {
  const q = query.toLowerCase();
  
  const knowledgeMap = {
    'csc': ['csc', 'common service centre', 'common service center', 'jan seva kendra'],
    'digilocker': ['digilocker', 'digi locker', 'digital locker'],
    'aadhaar': ['aadhaar', 'aadhar', 'uidai', 'unique id'],
    'income_certificate': ['income certificate', 'income proof', 'aay praman patra'],
    'caste_certificate': ['caste certificate', 'caste proof', 'jati praman patra', 'sc certificate', 'st certificate', 'obc certificate'],
    'domicile': ['domicile', 'domicile certificate', 'mool niwas', 'niwas praman patra'],
    'jan_dhan': ['jan dhan', 'zero balance', 'free bank account', 'no balance account'],
  };

  for (const [key, patterns] of Object.entries(knowledgeMap)) {
    if (patterns.some(p => q.includes(p))) {
      return GENERAL_KNOWLEDGE[key];
    }
  }
  return null;
}

// ─── Helper: Format Scheme for Response ─────────────────────────────────────────
function formatSchemeCard(scheme) {
  return {
    id: scheme.id,
    name: scheme.name,
    category: scheme.category,
    type: scheme.type,
    state: scheme.state_applicable,
    benefit: scheme.benefits?.substring(0, 100) + (scheme.benefits?.length > 100 ? '...' : ''),
    apply_link: scheme.apply_link,
  };
}

// ─── Helper: Build Scheme Detail Response ───────────────────────────────────────
function buildSchemeDetail(scheme) {
  let response = `📋 **${scheme.name}**\n\n`;
  response += `📝 ${scheme.description}\n\n`;
  response += `🏛️ **Type:** ${scheme.type === 'central' ? 'Central Government' : `State (${scheme.state_applicable})`}\n`;
  response += `📂 **Category:** ${scheme.category?.charAt(0).toUpperCase() + scheme.category?.slice(1)}\n\n`;
  
  if (scheme.benefits) {
    response += `💰 **Benefits:** ${scheme.benefits}\n\n`;
  }

  if (scheme.documents && scheme.documents.length > 0) {
    response += `📄 **Documents Required:**\n`;
    scheme.documents.forEach(doc => {
      response += `  • ${doc}\n`;
    });
    response += '\n';
  }

  if (scheme.apply_link) {
    response += `🔗 **Apply:** ${scheme.apply_link}\n`;
  }

  return response;
}

// ─── Helper: Get random response from array ─────────────────────────────────────
function randomResponse(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Helper: Fuzzy match scheme name ────────────────────────────────────────────
function fuzzyMatchScheme(query, schemes) {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 2);
  
  let bestMatch = null;
  let bestScore = 0;

  for (const scheme of schemes) {
    const name = scheme.name.toLowerCase();
    let score = 0;

    // Exact substring match
    if (q.includes(name) || name.includes(q)) {
      return scheme;
    }

    // Word-level matching
    for (const word of words) {
      if (name.includes(word)) {
        score += 2;
      }
    }

    // Acronym matching (e.g., "PMKVY" matches "PM Kaushal Vikas Yojana")
    const acronym = scheme.name.split(/\s+/).map(w => w[0]).join('').toLowerCase();
    if (q.includes(acronym) && acronym.length >= 3) {
      score += 5;
    }

    if (score > bestScore && score >= 2) {
      bestScore = score;
      bestMatch = scheme;
    }
  }

  return bestMatch;
}


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CHAT HANDLER
// ═══════════════════════════════════════════════════════════════════════════════
exports.handleChatQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.json({ message: "Please type a question about government schemes. Type **\"help\"** to see what I can do!" });
    }

    const lowQuery = query.toLowerCase().trim();

    // ─── 1. Handle Simple Intents (Greetings, Thanks, Bye, Help) ────────────
    const simpleIntents = ['GREETING', 'THANKS', 'GOODBYE', 'HELP'];
    for (const intentName of simpleIntents) {
      const intent = INTENTS[intentName];
      if (intent.patterns.some(p => lowQuery === p || lowQuery.startsWith(p + ' ') || lowQuery.endsWith(' ' + p))) {
        return res.json({ 
          message: randomResponse(intent.responses),
          type: 'info'
        });
      }
    }

    // ─── 2. Check Scheme-Specific FAQ (highest priority for trained data) ────
    const faqResult = checkSchemeFAQ(lowQuery);

    // ─── 3. Fetch all schemes from Firestore ────────────────────────────────
    const schemesSnapshot = await db.collection('schemes').get();
    const allSchemes = schemesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // ─── 4. If FAQ matched with an answer, return it ────────────────────────
    if (faqResult && faqResult.answer) {
      return res.json({
        message: faqResult.answer,
        type: 'faq'
      });
    }

    // ─── 5. Detect primary intent ───────────────────────────────────────────
    const intent = detectIntent(lowQuery);
    const category = detectCategory(lowQuery);
    const state = detectState(lowQuery);

    // ─── 6. If a specific scheme is mentioned, show its details ─────────────
    const matchedScheme = fuzzyMatchScheme(lowQuery, allSchemes);

    if (matchedScheme) {
      // User is asking about a specific scheme
      if (intent === 'ELIGIBILITY') {
        const rules = matchedScheme.eligibility_rules || {};
        let eligText = `📋 **Eligibility for ${matchedScheme.name}:**\n\n`;
        
        if (rules.occupation) eligText += `👤 **Occupation:** ${rules.occupation}\n`;
        if (rules.gender) eligText += `⚥ **Gender:** ${rules.gender}\n`;
        if (rules.age_min || rules.age_max) eligText += `🎂 **Age:** ${rules.age_min || 'No min'} to ${rules.age_max || 'No max'} years\n`;
        if (rules.max_income) eligText += `💰 **Max Income:** ₹${rules.max_income.toLocaleString('en-IN')}\n`;
        if (rules.state) eligText += `📍 **State:** ${rules.state}\n`;
        if (rules.category) {
          const cats = Array.isArray(rules.category) ? rules.category.join(', ') : rules.category;
          eligText += `📂 **Category:** ${cats}\n`;
        }
        if (rules.status) eligText += `📝 **Status:** ${rules.status}\n`;
        
        if (Object.keys(rules).length === 0) {
          eligText += "This scheme has broad eligibility. Visit the official portal for detailed criteria.\n";
        }

        eligText += `\n🔗 Check more at: ${matchedScheme.apply_link || 'official portal'}`;
        
        return res.json({ message: eligText, type: 'eligibility' });
      }

      if (intent === 'DOCUMENTS') {
        let docText = `📄 **Documents Required for ${matchedScheme.name}:**\n\n`;
        if (matchedScheme.documents && matchedScheme.documents.length > 0) {
          matchedScheme.documents.forEach((doc, i) => {
            docText += `${i + 1}. ${doc}\n`;
          });
        } else {
          docText += "Document list not available. Please check the official portal.\n";
        }
        docText += `\n💡 Keep originals + 2 photocopies ready when applying.`;
        
        return res.json({ message: docText, type: 'documents' });
      }

      if (intent === 'HOW_TO_APPLY') {
        let applyText = `🚀 **How to Apply for ${matchedScheme.name}:**\n\n`;
        if (matchedScheme.apply_link) {
          applyText += `🌐 **Online:** Visit ${matchedScheme.apply_link}\n\n`;
        }
        applyText += APPLICATION_GUIDES.online + '\n\n';
        applyText += `📍 **Can't apply online?** ` + APPLICATION_GUIDES.csc;
        
        return res.json({ message: applyText, type: 'application' });
      }

      if (intent === 'BENEFITS') {
        let benefitText = `💰 **Benefits of ${matchedScheme.name}:**\n\n`;
        benefitText += `${matchedScheme.benefits || 'Benefit details not available.'}\n\n`;
        benefitText += `📝 ${matchedScheme.description || ''}`;
        
        return res.json({ message: benefitText, type: 'benefits' });
      }

      if (intent === 'STATUS') {
        let statusText = `📊 **Check Status for ${matchedScheme.name}:**\n\n`;
        if (matchedScheme.apply_link) {
          statusText += `🌐 Visit: ${matchedScheme.apply_link}\n`;
          statusText += `📝 Look for 'Check Status' or 'Track Application' on the portal.\n`;
          statusText += `🆔 You'll need your application/reference number.\n\n`;
        }
        statusText += `📍 You can also check at your nearest **CSC Centre** or the relevant government office.`;
        
        return res.json({ message: statusText, type: 'status' });
      }

      // Default: show full scheme details
      return res.json({
        message: buildSchemeDetail(matchedScheme),
        type: 'detail',
        scheme: formatSchemeCard(matchedScheme)
      });
    }

    // ─── 7. Category-based search ───────────────────────────────────────────
    if (category) {
      let filtered = allSchemes.filter(s => s.category === category);
      
      // Also filter by state if mentioned
      if (state) {
        filtered = filtered.filter(s => 
          s.state_applicable?.toLowerCase() === state || 
          s.state_applicable?.toLowerCase() === 'all'
        );
      }

      if (filtered.length > 0) {
        const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
        const stateLabel = state ? ` in ${state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}` : '';

        return res.json({
          message: `I found **${filtered.length} ${categoryLabel} schemes**${stateLabel} for you:`,
          schemes: filtered.slice(0, 8).map(formatSchemeCard),
          type: 'list',
          total: filtered.length
        });
      }
    }

    // ─── 8. State-only search ───────────────────────────────────────────────
    if (state && !category) {
      const stateSchemes = allSchemes.filter(s => 
        s.state_applicable?.toLowerCase() === state
      );
      const centralSchemes = allSchemes.filter(s => 
        s.state_applicable?.toLowerCase() === 'all'
      );
      
      const stateLabel = state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      if (stateSchemes.length > 0) {
        return res.json({
          message: `Here are the schemes available in **${stateLabel}**:\n\n🏛️ **${stateSchemes.length} State-specific** schemes + **${centralSchemes.length} Central** schemes available to you.`,
          schemes: [...stateSchemes, ...centralSchemes.slice(0, 3)].map(formatSchemeCard),
          type: 'list',
          total: stateSchemes.length + centralSchemes.length
        });
      } else {
        return res.json({
          message: `I don't have state-specific schemes for **${stateLabel}** yet, but you're eligible for **${centralSchemes.length} Central Government schemes** that are available across all states!`,
          schemes: centralSchemes.slice(0, 5).map(formatSchemeCard),
          type: 'list',
          total: centralSchemes.length
        });
      }
    }

    // ─── 9. General Knowledge Check ─────────────────────────────────────────
    const gkAnswer = checkGeneralKnowledge(lowQuery);
    if (gkAnswer) {
      return res.json({ message: gkAnswer, type: 'info' });
    }

    // ─── 10. Application Process General Query ──────────────────────────────
    if (intent === 'HOW_TO_APPLY' && !matchedScheme) {
      return res.json({
        message: APPLICATION_GUIDES.online + '\n\n' + APPLICATION_GUIDES.csc,
        type: 'guide'
      });
    }

    // ─── 11. Status Check General Query ─────────────────────────────────────
    if (intent === 'STATUS') {
      return res.json({
        message: "To check the status of your application, you'll need:\n\n1️⃣ The **scheme name** you applied for\n2️⃣ Your **application/reference number**\n3️⃣ Your **Aadhaar number** or **mobile number**\n\nTell me which scheme you want to check status for, and I'll guide you to the right portal!",
        type: 'info'
      });
    }

    // ─── 12. Browse all schemes ─────────────────────────────────────────────
    const browsePatterns = ['all schemes', 'show all', 'list all', 'browse', 'show me everything', 'sabhi yojana', 'sab dikhao', 'all yojana'];
    if (browsePatterns.some(p => lowQuery.includes(p))) {
      const categories = [...new Set(allSchemes.map(s => s.category))].filter(Boolean);
      return res.json({
        message: `We have **${allSchemes.length} schemes** across **${categories.length} categories**:\n\n${categories.map(c => `• **${c.charAt(0).toUpperCase() + c.slice(1)}** (${allSchemes.filter(s => s.category === c).length} schemes)`).join('\n')}\n\nAsk me about any category — e.g., \"Show farmer schemes\" or \"Student scholarships\"`,
        type: 'categories'
      });
    }

    // ─── 13. Number/Count Queries ───────────────────────────────────────────
    const countPatterns = ['how many', 'count', 'total', 'kitne', 'number of'];
    if (countPatterns.some(p => lowQuery.includes(p))) {
      const central = allSchemes.filter(s => s.type === 'central').length;
      const state = allSchemes.filter(s => s.type === 'state').length;
      return res.json({
        message: `📊 **GovBridge Database Stats:**\n\n• **${allSchemes.length}** total schemes\n• **${central}** Central Government schemes\n• **${state}** State-specific schemes\n• **${[...new Set(allSchemes.map(s => s.category))].length}** categories covered\n\nWe're constantly adding more! Complete your profile for personalized recommendations.`,
        type: 'stats'
      });
    }

    // ─── 14. Broad keyword search across scheme names and descriptions ──────
    const queryWords = lowQuery.split(/\s+/).filter(w => w.length > 3);
    if (queryWords.length > 0) {
      const scored = allSchemes.map(s => {
        let score = 0;
        const searchText = `${s.name} ${s.description} ${s.benefits} ${s.category}`.toLowerCase();
        for (const word of queryWords) {
          if (searchText.includes(word)) score++;
        }
        return { scheme: s, score };
      }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

      if (scored.length > 0) {
        return res.json({
          message: `Here's what I found related to your query:`,
          schemes: scored.slice(0, 5).map(x => formatSchemeCard(x.scheme)),
          type: 'search',
          total: scored.length
        });
      }
    }

    // ─── 15. Fallback ───────────────────────────────────────────────────────
    res.json({
      message: CONVERSATION_TEMPLATES.no_match,
      type: 'fallback'
    });

  } catch (error) {
    console.error('Chat Error:', error.message);
    res.status(500).json({ error: 'GovBot is temporarily experiencing issues. Please try again.' });
  }
};
