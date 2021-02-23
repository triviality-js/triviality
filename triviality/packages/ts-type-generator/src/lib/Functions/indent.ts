export const indent = (string: string, w: number = 2) => {
  const text = new Array(w + 1).join(' ');
  return string.replace(/^(?!$)/mg, text);
};;
