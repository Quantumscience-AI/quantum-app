// Track usage limits for non-authenticated users

export const USAGE_LIMITS = {
  SEARCH: 3,
  CHAT: 3,
};

export const getUsageCount = (type) => {
  const count = localStorage.getItem(`usage_${type}`);
  return count ? parseInt(count) : 0;
};

export const incrementUsage = (type) => {
  const current = getUsageCount(type);
  const newCount = current + 1;
  localStorage.setItem(`usage_${type}`, newCount.toString());
  return newCount;
};

export const resetUsage = (type) => {
  localStorage.removeItem(`usage_${type}`);
};

export const resetAllUsage = () => {
  resetUsage('SEARCH');
  resetUsage('CHAT');
};

export const canUse = (type) => {
  const count = getUsageCount(type);
  return count < USAGE_LIMITS[type];
};

export const getRemainingUses = (type) => {
  const count = getUsageCount(type);
  return Math.max(0, USAGE_LIMITS[type] - count);
};
