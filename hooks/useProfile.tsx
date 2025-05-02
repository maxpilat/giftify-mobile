import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { API } from '@/constants/api';
import { Booking, FriendRequest, Wish, WishList } from '@/models';
import { useAuth } from '../hooks/useAuth';
import { apiFetchData, apiFetchImage } from '@/lib/api';

const ProfileContext = createContext<{
  avatar?: string;
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
  isFriend: (friendId: number) => boolean;
  isReceiver: (friendId: number) => boolean;
} | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<string>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishLists, setWishLists] = useState<WishList[]>([]);
  const [piggyBanks, setPiggyBanks] = useState<Wish[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const fetchAvatar = async () => {
    const image = await apiFetchImage({
      endpoint: API.profile.getAvatar(user.userId),
      token: user.token,
    });
    setAvatar(image);
    return image;
  };

  const fetchBookings = async () => {
    const bookings = await apiFetchData<Booking[]>({
      endpoint: API.profile.getBookings(user.userId),
      token: user.token,
    });
    setBookings(bookings);
    return bookings;
  };

  const fetchFriendRequests = async () => {
    const friendRequests = await apiFetchData<FriendRequest[]>({
      endpoint: API.friends.getFriendRequests(user.userId),
      token: user.token,
    });
    console.log(friendRequests);
    setFriendRequests(friendRequests);
    return friendRequests;
  };

  const fetchWishes = async () => {
    const wishes = await apiFetchData<Wish[]>({ endpoint: API.profile.getWishes(user.userId), token: user.token });
    setWishes(wishes);
    return wishes;
  };

  const fetchWishLists = async () => {
    const wishLists = await apiFetchData<WishList[]>({
      endpoint: API.profile.getWishLists(user.userId),
      token: user.token,
    });
    setWishLists(wishLists);
    return wishLists;
  };

  const fetchPiggyBanks = async () => {
    const piggyBanks = await apiFetchData<Wish[]>({
      endpoint: API.profile.getPiggyBanks(user.userId),
      token: user.token,
    });
    setPiggyBanks(piggyBanks);
    return piggyBanks;
  };

  const isFriend = (friendId: number) => {
    return friendRequests.find(
      (request) =>
        (request.userOneId === friendId || request.userTwoId === friendId) &&
        request.isUserOneAccept &&
        request.isUserTwoAccept
    )
      ? true
      : false;
  };

  const isReceiver = (friendId: number) => {
    // console.log(friendRequests);
    return friendRequests.find(
      (request) =>
        (request.userOneId === friendId && !request.isUserOneAccept && request.isUserTwoAccept) ||
        (request.userTwoId === friendId && !request.isUserTwoAccept && request.isUserOneAccept)
    )
      ? true
      : false;
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
        isFriend,
        isReceiver,
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
