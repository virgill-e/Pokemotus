export const getBrusselsDate = () => {
  // Use Intl.DateTimeFormat to get the date in Europe/Brussels timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Brussels',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // en-CA format is YYYY-MM-DD
  return formatter.format(new Date());
};
