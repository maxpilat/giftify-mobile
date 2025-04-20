import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { API } from '@/constants/api';
import { apiFetch } from '@/lib/api';
import { Booking, FriendRequest, Wish, WishList } from '@/models';
import { useAuth } from '../hooks/useAuth';
import { arrayBufferToBase64 } from '@/utils/imageConverter';

const ProfileContext = createContext<{
  avatar: string | null;
  bookings: Booking[];
  friendRequests: FriendRequest[];
  wishes: Wish[];
  wishLists: WishList[];
  piggyBanks: Wish[];
  isLoaded: boolean;
  fetchAvatar: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchFriendRequests: () => Promise<void>;
  fetchWishes: () => Promise<void>;
  fetchWishLists: () => Promise<void>;
  fetchPiggyBanks: () => Promise<void>;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishLists, setWishLists] = useState<WishList[]>([]);
  const [piggyBanks, setPiggyBanks] = useState<Wish[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const fetchAvatar = async () => {
    const response: Response = await apiFetch({
      endpoint: API.profile.getAvatar(user.userId),
      contetType: 'application/octet-stream',
      token,
    });
    const buffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    setAvatar(base64);
  };

  const fetchBookings = async () => {
    const bookings = await apiFetch({ endpoint: API.profile.getBookings(user.userId), token });
    setBookings(bookings);
  };

  const fetchFriendRequests = async () => {
    const friendRequests = await apiFetch({ endpoint: API.friends.getFriendRequests(user.userId), token });
    setFriendRequests(friendRequests);
  };

  const fetchWishes = async () => {
    const wishes = await apiFetch({ endpoint: API.profile.getWishes(user.userId), token });
    setWishes(wishes);
  };

  const fetchWishLists = async () => {
    const wishLists = await apiFetch({ endpoint: API.profile.getWishLists(user.userId), token });
    setWishLists(wishLists);
  };

  const fetchPiggyBanks = async () => {
    const piggyBanks = await apiFetch({ endpoint: API.profile.getPiggyBanks(user.userId), token });
    setPiggyBanks(piggyBanks);
  };

  return (
    <ProfileContext.Provider
      value={{
        avatar,
        bookings,
        friendRequests,
        wishes,
        wishLists,
        piggyBanks,
        isLoaded,
        fetchAvatar,
        fetchBookings,
        fetchFriendRequests,
        fetchWishes,
        fetchWishLists,
        fetchPiggyBanks,
        setIsLoaded,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return context;
};
