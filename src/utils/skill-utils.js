export function getSlugFromSkill(skill) {
  return skill.replace(/ /g, '-')
}

export function getSkillFromSlug(slug) {
  return slug.replace(/-/g, ' ')
}