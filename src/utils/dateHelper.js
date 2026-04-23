export const calculatePaymentDue = (createdAt, paymentTerms) => {
  const createdDate = new Date(createdAt);
  const paymentDue = new Date(createdDate);

  paymentDue.setDate(paymentDue.getDate() + paymentTerms);

  return paymentDue;
};
