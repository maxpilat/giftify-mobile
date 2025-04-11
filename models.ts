export interface Wish {
  wishId: number;
  wishType: WishType;
  name: string;
  description?: string;
  price?: number;
  deposit?: number;
  currency?: Currency;
  link: string;
}

export interface Currency {
  currencyId: number;
  symbol: string;
  transcription: string;
}

export type WishType = 'WISH' | 'PIGGY_BANK';