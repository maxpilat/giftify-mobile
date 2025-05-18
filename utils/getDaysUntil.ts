export const BOOKING_EXPIRATION_DAYS = 60;

export function getDaysUntilBirthday(birthDate: string): number {
  const [_, month, day] = birthDate.split('-').map(Number);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let targetDate = new Date(today.getFullYear(), month - 1, day);

  if (targetDate < today) {
    targetDate.setFullYear(targetDate.getFullYear() + 1);
  }

  return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDaysUntilBookingExpires(bookedDate: string): number {
  const [year, month, day] = bookedDate.split('-').map(Number);

  const creationDate = new Date(year, month - 1, day);
  const today = new Date();

  const differenceInTime = today.getTime() - creationDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return Math.max(BOOKING_EXPIRATION_DAYS - differenceInDays, 0);
}
