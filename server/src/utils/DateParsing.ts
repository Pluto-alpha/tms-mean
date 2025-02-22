


export const parseDate = (dateString: string): Date | null => {
  if (!dateString || !/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return null;
  }
  const [day, month, year] = dateString.split("-").map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return null;
  }
  return new Date(Date.UTC(year, month - 1, day));
};
