export function formatPrettyDate(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' }); // July
  const year = date.getFullYear();

  const getOrdinalSuffix = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}


export function getDaysDifference(inputDate: Date): { time: number; past: boolean } {
    // Get the current date and time
    const now = new Date();
    
    // Calculate the difference in milliseconds between the input date and now
    const differenceMs = inputDate.getTime() - now.getTime();
    
    // Convert milliseconds to days (1000 ms * 60 sec * 60 min * 24 hrs)
    const differenceDays = Math.round(differenceMs / (1000 * 60 * 60 * 24));
    
    // Determine if the date is in the past or future
    const isPast = differenceMs < 0;
    
    // Return the absolute number of days and whether it's past
    return {
        time: Math.abs(differenceDays),
        past: isPast
    };
}

export function isFutureDate(dateStr: string): boolean {
  const inputDate = new Date(dateStr);
  const today = new Date();

  // Remove time part from today's date for a pure date comparison
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate > today;
}
