export const base64Prefix = "data:image/svg+xml;base64";

const serializeToBase64 = (
//   image: React.FunctionComponent<React.SVGAttributes<SVGElement>>
image: any

): string => {
  const s = new XMLSerializer().serializeToString(image);
  return window.btoa(s);
};

export const asBase64Src = (
  image: React.FunctionComponent<React.SVGAttributes<SVGElement>>
) => {
  const b64 = serializeToBase64(image);
  return `${base64Prefix}, ${b64}`;
};