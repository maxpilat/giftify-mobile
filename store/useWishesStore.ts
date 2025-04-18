import { API } from '@/constants/api';
import { apiFetch } from '@/lib/api';
import { Booking, User, Wish, WishList } from '@/models';
import { create } from 'zustand';

const AUTH_USER_ID = 1; // temporary

interface WishesStore {
  wishes: Wish[];
  piggyBanks: Wish[];
  bookings: Booking[];
  wishLists: WishList[];
  _myWishes: Wish[];
  _myPiggyBanks: Wish[];
  _myWishLists: WishList[];

  createWish: (wish: Wish) => Promise<void>;
  updateWish: (wish: Wish) => Promise<void>;
  replenishPiggyBank: (piggyBankId: number, amount: number) => Promise<void>;
  addWishToList: (wishId: number, wishListId: number) => Promise<void>;
  fetchWishes: (userId?: number) => Promise<void>;
  fetchPiggyBanks: (userId?: number) => Promise<void>;
  fetchWishImage: (wishId: number) => Promise<void>;
  fulfillWish: (wishId: number) => Promise<void>;
  bookWish: (wishId: number, bookerId: number) => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
  createWishList: (creatorId: number, name: string) => Promise<void>;
  updateWishList: (wishListId: number, name: string) => Promise<void>;
  deleteWishList: (wishListId: number) => Promise<void>;
  fetchWishLists: (userId?: number) => Promise<void>;
  fetchBookings: (userId?: number) => Promise<void>;
}

export const useWishesStore = create<WishesStore>((set) => ({
  wishes: [],
  piggyBanks: [],
  bookings: [],
  wishLists: [],
  _myWishes: [],
  _myPiggyBanks: [],
  _myWishLists: [],

  createWish: async (wish: Wish) => {},

  updateWish: async (wish: Wish) => {},

  replenishPiggyBank: async (piggyBankId: number, amount: number) => {},

  addWishToList: async (wishId: number, wishListId: number) => {},

  fetchWishes: async (userId?: number) => {
    if (!userId || userId === AUTH_USER_ID) {
      const wishes: Wish[] = await apiFetch(API.profile.getWishes(AUTH_USER_ID));
      set(() => ({ _myWishes: wishes, wishes }));
    } else {
      const wishes: Wish[] = await apiFetch(API.profile.getWishes(userId));
      set(() => ({ wishes }));
    }
  },

  fetchPiggyBanks: async (userId?: number) => {
    if (!userId || userId === AUTH_USER_ID) {
      const piggyBanks: Wish[] = await apiFetch(API.profile.getPiggyBanks(AUTH_USER_ID));
      set(() => ({ _myPiggyBanks: piggyBanks, piggyBanks }));
    } else {
      const piggyBanks: Wish[] = await apiFetch(API.profile.getWishes(userId));
      set(() => ({ piggyBanks }));
    }
  },

  fetchWishImage: async (wishId: number) => {},

  fulfillWish: async (wishId: number) => {},

  bookWish: async (wishId: number, bookerId: number) => {},

  fetchBooking: async (bookingId: number) => {},

  cancelBooking: async (bookingId: number) => {},

  createWishList: async (creatorId: number, name: string) => {},

  updateWishList: async (wishListId: number, name: string) => {},

  deleteWishList: async (wishListId: number) => {},

  fetchWishLists: async (userId?: number) => {
    if (!userId || userId === AUTH_USER_ID) {
      const wishLists: WishList[] = await apiFetch(API.profile.getWishLists(AUTH_USER_ID));
      set(() => ({ _myWishLists: wishLists, wishLists }));
    } else {
      const wishLists: WishList[] = await apiFetch(API.profile.getWishLists(userId));
      set(() => ({ wishLists }));
    }
  },

  fetchBookings: async (userId?: number) => {
    const bookings: Booking[] = await apiFetch(API.profile.getBookings(userId || AUTH_USER_ID));

    const wishes = bookings.forEach(async (booking) => {
      const wish: Wish = await apiFetch(API.wishes.getWish(booking.wishId));
      const;
      const wisher: User = await apiFetch(API.profile.getProfile(wish.wisherId));
      const wisherAvatar: string = await apiFetch(API.profile.getAvatar(wish.wisherId));

      return { wish, wisher, wisherAvatar };
    });

    set(() => ({ bookings }));
  },
}));
