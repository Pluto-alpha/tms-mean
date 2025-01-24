


export const parseDate = (dateString: string): Date | null => {
  const [day, month, year] = dateString.split("-");
  const formattedDate = `${year}-${month}-${day}T00:00:00Z`; // Format to yyyy-mm-dd
  return new Date(formattedDate);
};
