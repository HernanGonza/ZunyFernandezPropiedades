// src/utils/publicPath.js
const BASE_PATH = import.meta.env.BASE_URL || '/';

export function getPublicPath(path) {
  // Asegurar que path empiece con /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Si BASE_PATH ya termina con /, no duplicar
  return BASE_PATH.endsWith('/') 
    ? `${BASE_PATH.slice(0, -1)}${cleanPath}`
    : `${BASE_PATH}${cleanPath}`;
}