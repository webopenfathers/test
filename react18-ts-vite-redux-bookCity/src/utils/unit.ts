export const px2rem = (px: number): string => {
  const rootValue = 37.5; // 基准值
  return `${px / rootValue}rem`;
};
