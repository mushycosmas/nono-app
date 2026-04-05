const BASE_URL = 'https://nono.co.tz';

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (!path.startsWith('/')) path = '/' + path;
  return `${BASE_URL}${path}`;
};