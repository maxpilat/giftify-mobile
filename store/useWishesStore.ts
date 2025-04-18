import { API } from '@/constants/api';
import { apiFetch } from '@/lib/api';
import { Booking, Wish, WishList } from '@/models';
import { create } from 'zustand';

interface WishesStore {
  myWishes: Wish[];
  wishes: Wish[];
  myPiggyBanks: Wish[];
  piggyBanks: Wish[];
  bookings: Booking[];
  wishLists: WishList[];
  isLoading: boolean;

  createWish: (wish: Wish) => Promise<void>;
  updateWish: (wish: Wish) => Promise<void>;
  replenishPiggyBank: (piggyBankId: number, amount: number) => Promise<void>;
  addWishToList: (wishId: number, wishListId: number) => Promise<void>;
  // fetchWish: (userId: number) => Promise<Wish>;
  fetchWishes: (userId?: number) => Promise<void>;
  fetchPiggyBanks: (userId?: number) => Promise<void>;
  fetchWishImage: (wishId: number) => Promise<void>;
  fulfillWish: (wishId: number) => Promise<void>;
  bookWish: (wishId: number, bookerId: number) => Promise<void>;
  // fetchBooking: (bookingId: number) => Promise<Booking>;
  cancelBooking: (bookingId: number) => Promise<void>;
  createWishList: (creatorId: number, name: string) => Promise<void>;
  updateWishList: (wishListId: number, name: string) => Promise<void>;
  deleteWishList: (wishListId: number) => Promise<void>;
  fetchWishLists: (userId?: number) => Promise<void>;
}

export const useWishesStore = create<WishesStore>((set) => ({
  myWishes: [],
  wishes: [],
  myPiggyBanks: [],
  piggyBanks: [],
  bookings: [],
  wishLists: [],
  isLoading: false,

  createWish: async (wish: Wish) => {},

  updateWish: async (wish: Wish) => {},

  replenishPiggyBank: async (piggyBankId: number, amount: number) => {},

  addWishToList: async (wishId: number, wishListId: number) => {},

  getWish: async (userId: number) => {},

  fetchWishes: async (userId?: number) => {
    const authUserId = 1; // temporary

    if (!userId || userId === authUserId) {
      const wishes = await apiFetch(API.profile.getWishes(authUserId));
      set((state) => ({ ...state, myWishes: wishes }));
    } else {
      const wishes = await apiFetch(API.profile.getWishes(userId));
      set((state) => ({ ...state, wishes }));
    }
  },

  fetchPiggyBanks: async (userId?: number) => {},

  fetchWishImage: async (wishId: number) => {},

  fulfillWish: async (wishId: number) => {},

  bookWish: async (wishId: number, bookerId: number) => {},

  fetchBooking: async (bookingId: number) => {},

  cancelBooking: async (bookingId: number) => {},

  createWishList: async (creatorId: number, name: string) => {},

  updateWishList: async (wishListId: number, name: string) => {},

  deleteWishList: async (wishListId: number) => {},

  fetchWishLists: async (userId?: number) => {},
}));
