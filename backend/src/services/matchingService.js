/**
 * Matching Service
 * Calculates skill-match percentage between a user and a project.
 */

/**
 * Normalize a skill string for case-insensitive comparison.
 */
const normalize = (skill) => skill.toLowerCase().trim();

/**
 * Calculate match score between user skills and project required skills.
 * @param {string[]} userSkills
 * @param {string[]} requiredSkills
 * @returns {{ score: number, matchedSkills: string[], missingSkills: string[] }}
 */
const calculateMatch = (userSkills = [], requiredSkills = []) => {
  if (!requiredSkills.length) return { score: 0, matchedSkills: [], missingSkills: [] };

  const normalizedUser = userSkills.map(normalize);
  const normalizedRequired = requiredSkills.map(normalize);

  const matchedSkills = requiredSkills.filter((skill) =>
    normalizedUser.includes(normalize(skill))
  );
  const missingSkills = requiredSkills.filter(
    (skill) => !normalizedUser.includes(normalize(skill))
  );

  const score = Math.round((matchedSkills.length / normalizedRequired.length) * 100);
  return { score, matchedSkills, missingSkills };
};

/**
 * Sort and enrich projects with match data for a given user.
 * @param {Object[]} projects
 * @param {string[]} userSkills
 * @returns {Object[]} sorted projects with matchData attached
 */
const matchProjects = (projects, userSkills) => {
  return projects
    .map((project) => {
      const matchData = calculateMatch(userSkills, project.requiredSkills || []);
      return { ...project.toObject(), matchData };
    })
    .sort((a, b) => b.matchData.score - a.matchData.score);
};

module.exports = { calculateMatch, matchProjects };
