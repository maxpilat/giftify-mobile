export function getDaysUntilBirthday(birthDate: string): number {
  const [day, month] = birthDate.split('.').map(Number);

  const today = new Date();
  const currentYear = today.getFullYear();

  let targetDate = new Date(currentYear, month - 1, day);

  if (targetDate < today) {
    targetDate = new Date(currentYear + 1, month - 1, day);
  }

  const differenceInTime = targetDate.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays;
}
