import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { API } from '@/constants/api';
import { apiFetch } from '@/lib/api';
import { Booking, FriendRequest, Wish, WishList } from '@/models';
import { useAuth } from '../hooks/useAuth';

const ProfileContext = createContext<{
  avatar: string | null;
  bookings: Booking[];
  friendRequests: FriendRequest[];
  wishes: Wish[];
  wishLists: WishList[];
  piggyBanks: Wish[];
  isLoaded: boolean;
  fetchAvatar: () => Promise<string>;
  fetchBookings: () => Promise<Booking[]>;
  fetchFriendRequests: () => Promise<FriendRequest[]>;
  fetchWishes: () => Promise<Wish[]>;
  fetchWishLists: () => Promise<WishList[]>;
  fetchPiggyBanks: () => Promise<Wish[]>;
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
    const image: string = await apiFetch({
      endpoint: API.profile.getAvatar(user.userId),
      contentType: 'application/octet-stream',
      token,
    });
    setAvatar(image);
    return image;
  };

  const fetchBookings = async () => {
    const bookings: Booking[] = await apiFetch({ endpoint: API.profile.getBookings(user.userId), token });
    setBookings(bookings);
    return bookings;
  };

  const fetchFriendRequests = async () => {
    const friendRequests: FriendRequest[] = await apiFetch({
      endpoint: API.friends.getFriendRequests(user.userId),
      token,
    });
    setFriendRequests(friendRequests);
    return friendRequests;
  };

  const fetchWishes = async () => {
    const wishes: Wish[] = await apiFetch({ endpoint: API.profile.getWishes(user.userId), token });
    setWishes(wishes);
    return wishes;
  };

  const fetchWishLists = async () => {
    const wishLists: WishList[] = await apiFetch({ endpoint: API.profile.getWishLists(user.userId), token });
    setWishLists(wishLists);
    return wishLists;
  };

  const fetchPiggyBanks = async () => {
    const piggyBanks: Wish[] = await apiFetch({ endpoint: API.profile.getPiggyBanks(user.userId), token });
    setPiggyBanks(piggyBanks);
    return piggyBanks;
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
