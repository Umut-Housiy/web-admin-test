export const getNumericPositive = (text: string): string => text.replace(/[^0-9.]+/g, '');

export const getNumeric = (text: string): string => text.replace(/[^0-9.-]+/g, '');

export const getTimeFormatted = (text: string): string => {
  text = text.replace(/\D/g, '');
  const parts = [text.substring(0, 2), text.substring(2, 4)];
  return `${parts[0] ? parts[0] : ''}${parts[1] ? `:${parts[1]}` : ''}`;
}
