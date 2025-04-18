export interface Wish {
  wishId: number;
  wishType: WishType;
  name: string;
  description?: string;
  price?: number;
  deposit?: number;
  currency?: Currency;
  link: string;
  image?: string;
  created?: string;
  isActive?: boolean;
  activeBookingId?: number | null;
}

export type WishType = 'TYPE_WISH' | 'TYPE_PIGGY_BANK';

export interface Currency {
  currencyId: number;
  symbol: string;
  transcription: string;
}

export interface WishList {
  wishListId: number;
  name: string;
  wishes: Wish[];
}

export interface Booking {
  bookingId: number;
  wishId: number;
  bookerId: number;
  booked: string;
  isActive: boolean;
}
