export function formatNewWishes(number: number): string {
  const absNumber = Math.abs(number) % 100;
  const lastDigit = absNumber % 10;

  let adjective: string;
  let noun: string;

  if (absNumber >= 11 && absNumber <= 19) {
    adjective = 'новых';
    noun = 'желаний';
  } else if (lastDigit === 1) {
    adjective = 'новое';
    noun = 'желание';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    adjective = 'новых';
    noun = 'желания';
  } else {
    adjective = 'новых';
    noun = 'желаний';
  }

  return `${number} ${adjective} ${noun}`;
}

export function formatDays(number: number): string {
  const absNumber = Math.abs(number) % 100;
  const lastDigit = absNumber % 10;

  let noun: string;

  if (absNumber >= 11 && absNumber <= 19) {
    noun = 'дней';
  } else if (lastDigit === 1) {
    noun = 'день';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    noun = 'дня';
  } else {
    noun = 'дней';
  }

  return `${number} ${noun}`;
}
