const matchSchemes = (user, schemes) => {
  const recommendations = schemes.map(scheme => {
    let score = 0;
    const reasons = [];
    const rules = scheme.eligibility_rules || {};

    // 1. Occupation Match
    if (rules.occupation) {
      if (user.occupation?.toLowerCase() === rules.occupation.toLowerCase()) {
        score += 3;
        reasons.push(`You are a ${user.occupation}`);
      } else {
        // Hard fail for occupation specific schemes
        return null;
      }
    }

    // 2. Gender Match
    if (rules.gender) {
      if (user.gender?.toLowerCase() === rules.gender.toLowerCase()) {
        score += 2;
        reasons.push(`This scheme supports ${user.gender} applicants`);
      } else {
        return null;
      }
    }

    // 3. State Match
    if (scheme.type === 'state') {
      if (user.state?.toLowerCase() === scheme.state_applicable?.toLowerCase()) {
        score += 2;
        reasons.push(`This scheme is specifically for ${user.state} residents`);
      } else {
        return null;
      }
    } else {
      score += 2;
      reasons.push(`This is a Central scheme available in your state (${user.state})`);
    }

    // 4. Income Match
    if (rules.max_income) {
      // Map user income strings to numbers for comparison
      const incomeMap = {
        'Below 1L': 100000,
        '1L - 3L': 300000,
        '3L - 5L': 500000,
        'Above 5L': 1000000
      };
      const userIncomeVal = incomeMap[user.income] || 0;
      
      if (userIncomeVal <= rules.max_income) {
        score += 2;
        reasons.push(`Your income level fits within the required threshold`);
      } else {
        return null;
      }
    }

    // 5. Age Match
    if (rules.age_min || rules.age_max) {
      const userAge = parseInt(user.age);
      if (rules.age_min && userAge < rules.age_min) return null;
      if (rules.age_max && userAge > rules.age_max) return null;
      
      score += 1;
      reasons.push(`Your age (${userAge}) is within the eligible range`);
    }

    // 6. Category Match
    if (rules.category) {
      const ruleCategories = Array.isArray(rules.category) ? rules.category : [rules.category];
      if (ruleCategories.some(cat => cat.toLowerCase() === user.category?.toLowerCase() || cat.toLowerCase() === 'all')) {
        score += 1;
        reasons.push(`Matched category: ${user.category}`);
      }
    }

    // 7. Area Type Match (Rural/Urban)
    if (rules.area) {
      if (user.rural_urban?.toLowerCase() === rules.area.toLowerCase()) {
        score += 1;
        reasons.push(`This scheme is tailored for ${user.rural_urban} areas`);
      }
    }

    // If we reached here, the scheme is a match
    return {
      scheme,
      score,
      reasons
    };
  }).filter(rec => rec !== null);

  // Sort by score DESC
  return recommendations.sort((a, b) => b.score - a.score);
};

module.exports = matchSchemes;
