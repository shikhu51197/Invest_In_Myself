export const CATEGORY_EMOJIS = {
  'Poetry': '📜',
  'Shayri': '🥀',
  'Songs': '🎶',
  'Sketches': '🎨',
  'Recipes': '🍳',
  'Blogs': '📝',
  'Thoughts': '💭',
  'Advice': '💡'
};

export function getCategoryEmoji(category) {
  return CATEGORY_EMOJIS[category] || '✨';
}
