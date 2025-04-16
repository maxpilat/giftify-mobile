export interface Wish {
  wishId: number;
  wishType: WishType;
  name: string;
  description?: string;
  price?: number;
  deposit?: number;
  currency?: Currency;
  link: string;
  image?: ArrayBuffer;
}

export interface Currency {
  currencyId: number;
  symbol: string;
  transcription: string;
}

export interface WishList {
  wishListId: number,
  name: string,
  wishes: Wish[]
}

export type WishType = 'WISH' | 'PIGGY_BANK';