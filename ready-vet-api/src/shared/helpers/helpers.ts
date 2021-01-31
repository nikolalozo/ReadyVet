export function parseJSON (obj) {
  if (typeof obj === 'string') {
    return JSON.parse(obj);
  } else {
    return obj;
  }
}