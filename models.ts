export interface Wish {
  wishId: number;
  wisherProfileData: Profile,
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
  wish: Wish;
  bookerId: number;
  booked: string;
  isActive: boolean;
}

export interface Profile {
  userId: number;
  name: string;
  surname: string;
  username?: string;
  avatar?: string;
}

export interface Friend {
  friendId: number;
  name: string;
  surname: string;
  username?: string;
  birthDate?: string;
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
  id: number;
  email: string;
  token: string;
}

export type Gender = 'Male' | 'Female';

export interface SettingsData {
  id: number;
  name: string;
  surname: string;
  username?: string;
  birthDate?: string;
  isMan: boolean;
  isPrivate: boolean;
  themeType: ApiThemeType;
  primaryColor: string;
  secondaryColor: string;
}

export type ApiThemeType = 'TYPE_LIGHT' | 'TYPE_DARK' | 'TYPE_SYSTEM';

export type BackgroundType = 'TYPE_COLOR' | 'TYPE_IMAGE';

export interface ApiProfileBackground {
  backgroundType: BackgroundType;
  backgroundImage?: number[];
  backgroundColor?: string;
}

export interface ProfileBackground {
  backgroundType: BackgroundType;
  backgroundId?: number;
  backgroundUri?: string;
  backgroundColor?: string;
}
