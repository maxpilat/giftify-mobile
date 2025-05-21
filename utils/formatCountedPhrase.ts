export type Params = {
  number: number;
  singular: string;
  few: string;
  many: string;
  singularAdj?: string;
  pluralAdj?: string;
};

export function formatCountedPhrase(options: Params): string {
  const { number, singular, few, many, singularAdj, pluralAdj } = options;
  const absNumber = Math.abs(number) % 100;
  const lastDigit = absNumber % 10;

  let noun: string;
  let adjective: string | undefined;

  if (absNumber >= 11 && absNumber <= 19) {
    noun = many;
    adjective = pluralAdj;
  } else if (lastDigit === 1) {
    noun = singular;
    adjective = singularAdj;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    noun = few;
    adjective = pluralAdj;
  } else {
    noun = many;
    adjective = pluralAdj;
  }

  return `${number} ${adjective ? adjective + ' ' : ''}${noun}`;
}
