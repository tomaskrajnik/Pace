const hsl = require("hsl-to-hex");

export const generatePastelColor = () => {
  const hueBase = Math.random();
  const hue = Math.floor(hueBase * 360);
  const lightness = Math.floor(Math.random() * 16) + 70;
  return hslToHex(hue, 91, lightness);
};

export const hslToHex = (h: number, s: number, l: number) => {
  return hsl(h, s, l);
};
