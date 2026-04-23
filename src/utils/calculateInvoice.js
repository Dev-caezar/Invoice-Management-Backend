export const calculateInvoice = (items) => {
  const calculatedItems = items.map((item) => {
    const total = item.quantity * item.price;

    return {
      ...item,
      total,
    };
  });

  const total = calculatedItems.reduce((sum, item) => sum + item.total, 0);

  return { calculatedItems, total };
};
