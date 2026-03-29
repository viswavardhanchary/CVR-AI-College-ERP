const avatarColors = [
  '#f97316',
  '#ef4444',
  '#8b5cf6',
  '#0ea5e9',
  '#14b8a6',
  '#22c55e',
  '#eab308',
  '#f43f5e',
  '#fb7185',
  '#71717a'
];

export const getAvatarColor = (seed = '') => {
  if (!seed) return avatarColors[0];
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[Math.floor(Math.random()*10)];
};
