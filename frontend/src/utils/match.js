/**
 * Client-side skill matching utility.
 * Mirrors the backend matchingService logic.
 */

const normalize = (s) => s.toLowerCase().trim();

/**
 * @param {string[]} userSkills
 * @param {string[]} requiredSkills
 * @returns {{ score: number, matchedSkills: string[], missingSkills: string[] } | null}
 */
export function calculateMatch(userSkills = [], requiredSkills = []) {
  if (!requiredSkills.length) return null;

  const normUser = userSkills.map(normalize);
  const matchedSkills = requiredSkills.filter((s) => normUser.includes(normalize(s)));
  const missingSkills = requiredSkills.filter((s) => !normUser.includes(normalize(s)));
  const score = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return { score, matchedSkills, missingSkills };
}
