export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const generateSessionId = (): string => {
  return crypto.randomUUID();
};

export const truncateText = (text: string, maxLength = 50): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const hasLength = password.length >= 8;
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpper = /[A-Z]/.test(password);

  const score = [hasLength, hasNumbers, hasSpecial, hasUpper].filter(Boolean).length;

  if (score <= 1) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
};

export const stripMarkdownForSpeech = (text: string): string => {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[📝👨‍🍳⏱📊🍳🎤📚🔪🥘🍕🍜🥗🧁🥗]/g, '')
    .replace(/\n+/g, '. ')
    .trim();
};

export const getDietaryBadgeColor = (preference: string): string => {
  switch (preference) {
    case 'vegetarian':
      return '#48BB78';
    case 'vegan':
      return '#68D391';
    case 'non-vegetarian':
      return '#FC8181';
    default:
      return '#F5A623';
  }
};
