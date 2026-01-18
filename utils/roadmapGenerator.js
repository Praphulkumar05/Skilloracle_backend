import Resource from "../models/Resource.js";
import Skill from "../models/Skill.js";

/**
 * Generate roadmap array for missingSkills (array of skill names).
 * Each roadmap item: { skill, message, resources: [{ title, url, type, difficulty }] }
 */
export const generateRoadmap = async (missingSkills = []) => {
  const roadmap = [];

  // Normalize helper
  const normalize = (s = "") =>
    String(s).toLowerCase().replace(/\s+/g, "").replace(/[-_]/g, "").replace(/js$/, "");

  // Fetch all published resources with populated skill (min cost)
  const allResources = await Resource.find({ status: "Published" }).populate("skill", "name");

  for (const rawSkill of missingSkills) {
    const skillNorm = normalize(rawSkill);

    // Try to find Skill doc first
    const skillDoc = await Skill.findOne({ name: new RegExp(`^${rawSkill}$`, "i") });

    // Filter resources matching by skill name normalization
    const matched = allResources.filter((r) => {
      const skillName = r.skill?.name || "";
      const rn = normalize(skillName);
      return rn === skillNorm;
    });

    // Build resource list (limit to 5)
    const resources = matched.slice(0, 5).map((r) => ({
      title: r.title || (r.url ? r.url : `Resource for ${rawSkill}`),
      url: r.url || null,
      type: r.type || r.tags?.[0] || "Article",
      difficulty: r.difficulty || "Beginner",
    }));

    // If no matched resources, provide search fallback links
    if (resources.length === 0) {
      resources.push(
        { title: `Search tutorials for ${rawSkill} (YouTube)`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(rawSkill + " tutorial")}`, type: "Video", difficulty: "Beginner" },
        { title: `Official docs / search`, url: `https://www.google.com/search?q=${encodeURIComponent(rawSkill + " documentation")}`, type: "Search", difficulty: "Beginner" }
      );
    }

    roadmap.push({
      skill: rawSkill,
      message: `Suggested short roadmap to learn ${rawSkill}.`,
      estimateDays: Math.max(3, Math.min(30, resources.length * 7)), // rough estimate
      plan: [
        `Week 1: Basics and concepts of ${rawSkill}.`,
        `Week 2: Build small practice projects with ${rawSkill}.`,
        `Week 3: Integrate ${rawSkill} into a sample app / review advanced topics.`
      ],
      resources,
    });
  }

  return {
    summary: `Roadmap for ${missingSkills.length} missing skill(s).`,
    steps: roadmap,
  };
};
