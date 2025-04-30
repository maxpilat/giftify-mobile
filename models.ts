export interface Wish {
  wishId: number;
  wisherId: number;
  wishType: WishType;
  name: string;
  description?: string;
  price?: number;
  deposit?: number;
  currency?: Currency;
  link?: string;
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
  wish: Omit<Wish, 'wisherId'> & { wisherProfileData: Profile };
  bookerId: number;
  booked: string;
  isActive: boolean;
}

export interface Profile {
  userId: number;
  name: string;
  surname: string;
  username: string;
}

export interface Friend {
  friendId: number;
  name: string;
  surname: string;
  username: string;
  birthDate: string;
  newWishesCount: number;
  avatar?: string;
}

export interface FriendRequest {
  userOneId: number;
  isUserOneAccept: boolean;
  userTwoId: number;
  isUserTwoAccept: boolean;
}

export interface AuthData {
  userId: number;
  email: string;
  token: string;
}

export type Gender = 'Male' | 'Female';
