// Normalize function for flexible matching
const normalize = (str = "") => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")  // remove ALL non-alphanumeric characters
    .replace(/javascript|js|script/g, "javascript") // unify all JS forms
    .replace(/reactjs|react/g, "react")
    .replace(/nodejs|node/g, "node")
    .replace(/expressjs|express/g, "express")
    .replace(/mongodb|mongo/g, "mongodb")
    .trim();
};

export const calculateJobMatch = (jobRole, userSkills) => {
  let score = 0;

  const normalizedUserSkills = userSkills.map(s => normalize(s));

  const requiredNames = jobRole.requiredSkills.map(s => normalize(s.name));
  const optionalNames = jobRole.optionalSkills.map(s => normalize(s.name));

  const missingSkills = [];

  // 1️⃣ Required Skills (High Priority)
  requiredNames.forEach(reqSkill => {
    if (normalizedUserSkills.includes(reqSkill)) {
      score += 20;
    } else {
      score -= 10;
      missingSkills.push(reqSkill);
    }
  });

  // 2️⃣ Optional Skills
  optionalNames.forEach(optSkill => {
    if (normalizedUserSkills.includes(optSkill)) {
      score += 5;
    }
  });

  // 3️⃣ Difficulty Level (harder → lower score)
  score -= jobRole.difficultyLevel * 1.5;

  // 4️⃣ Industry Demand (higher → better)
  score += jobRole.industryDemand * 2;

  // 5️⃣ Salary Influence
  if (jobRole.avgSalary?.min && jobRole.avgSalary?.max) {
    const avg = (jobRole.avgSalary.min + jobRole.avgSalary.max) / 2;
    let salaryScore = avg / 20000;
    if (salaryScore > 15) salaryScore = 15;
    score += salaryScore;
  }

  // Ensure score stays in 0–100 range
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: finalScore,
    missingSkills,
  };
};
