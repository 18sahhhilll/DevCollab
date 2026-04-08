/**
 * Client-side match calculation utility (mirrors backend logic).
 */
export const calculateMatch = (userSkills = [], requiredSkills = []) => {
  if (!requiredSkills.length) return { score: 0, matchedSkills: [], missingSkills: [] };
  const normUser = userSkills.map(s => s.toLowerCase().trim());
  const matchedSkills = requiredSkills.filter(s => normUser.includes(s.toLowerCase().trim()));
  const missingSkills = requiredSkills.filter(s => !normUser.includes(s.toLowerCase().trim()));
  const score = Math.round((matchedSkills.length / requiredSkills.length) * 100);
  return { score, matchedSkills, missingSkills };
};
