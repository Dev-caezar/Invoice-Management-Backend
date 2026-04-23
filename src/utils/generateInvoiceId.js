export const generateInvoiceId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const numbers = Math.floor(1000 + Math.random() * 9000);

  return `${randomLetters}${numbers}`;
};
