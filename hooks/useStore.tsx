import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { API } from '@/constants/api';
import { Booking, Friend, FriendRequest, ProfileBackground, Wish, WishList } from '@/models';
import { useAuth } from './useAuth';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base64ToBinaryArray, uriToBase64 } from '@/utils/convertImage';
import { getDefaultBackground, loadDefaultBackgrounds } from '@/utils/profileBackground';
import { useTheme } from '@/hooks/useTheme';

const StoreContext = createContext<{
  avatar?: string;
  allBackgrounds: ProfileBackground[];
  background: ProfileBackground;
  bookings: Booking[];
  friendRequests: FriendRequest[];
  friends: Friend[];
  wishes: Wish[];
  wishLists: WishList[];
  piggyBanks: Wish[];
  isLoaded: boolean;
  fetchAvatar: () => Promise<string>;
  fetchBookings: () => Promise<Booking[]>;
  fetchFriendRequests: () => Promise<FriendRequest[]>;
  fetchFriends: () => Promise<Friend[]>;
  fetchWishes: () => Promise<Wish[]>;
  fetchWishLists: () => Promise<WishList[]>;
  fetchPiggyBanks: () => Promise<Wish[]>;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
  isFriend: (friendId: number) => boolean;
  isSender: (friendId: number) => boolean;
  isReceiver: (friendId: number) => boolean;
  fetchBackground: () => Promise<ProfileBackground>;
  fetchAllBackgrounds: () => Promise<ProfileBackground[]>;
  addBackgroundImage: (backgroundUri: string) => Promise<ProfileBackground>;
  changeBackground: (background: ProfileBackground) => Promise<void>;
} | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const { themeType, systemThemeType } = useTheme();
  const themeTypeValue = themeType === 'system' ? systemThemeType : themeType;

  const { user } = useAuth();

  const [avatar, setAvatar] = useState<string>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishLists, setWishLists] = useState<WishList[]>([]);
  const [piggyBanks, setPiggyBanks] = useState<Wish[]>([]);
  const [defaultBackgrounds, setDefaultBackgrounds] = useState<ProfileBackground[]>([]);
  const [allBackgrounds, setAllBackgrounds] = useState<ProfileBackground[]>([]);
  const [background, setBackground] = useState<ProfileBackground>(getDefaultBackground(themeTypeValue));
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadDefaultBackgrounds().then(setDefaultBackgrounds);
  }, []);

  useEffect(() => {
    if (background.backgroundId === 0) {
      setBackground(getDefaultBackground(themeTypeValue));
    }
  }, [themeTypeValue]);

  const fetchAvatar = useCallback(async () => {
    const image = await apiFetchImage({ endpoint: API.profile.getAvatar(user.id), token: user.token });

    setAvatar(image);
    return image;
  }, [user]);

  const fetchBookings = useCallback(async () => {
    const bookings = await apiFetchData<Booking[]>({
      endpoint: API.profile.getBookings(user.id),
      token: user.token,
    });

    setBookings(bookings);

    const imagesMap = new Map(
      await Promise.all(
        bookings.map(async (booking) => {
          const image = await apiFetchImage({
            endpoint: API.wishes.getImage(booking.wish.wishId),
            token: user.token,
          });
          return [booking.wish.wishId, image] as const;
        })
      )
    );

    const updatedBookings = bookings.map((booking) => ({
      ...booking,
      wish: {
        ...booking.wish,
        image: imagesMap.get(booking.wish.wishId),
      },
    }));

    setBookings(updatedBookings);
    return updatedBookings;
  }, [user]);

  const fetchFriendRequests = useCallback(async () => {
    const friendRequests = await apiFetchData<FriendRequest[]>({
      endpoint: API.friends.getFriendRequests(user.id),
      token: user.token,
    });

    setFriendRequests(friendRequests);
    return friendRequests;
  }, [user]);

  const fetchFriends = useCallback(async () => {
    const friends = await apiFetchData<Friend[]>({
      endpoint: API.friends.getFriends(user.id),
      token: user.token,
    });

    setFriends(friends);

    const avatarsMap = new Map(
      await Promise.all(
        friends.map(async (friend) => {
          const image = await apiFetchImage({
            endpoint: API.profile.getAvatar(friend.friendId),
            token: user.token,
          });
          return [friend.friendId, image] as const;
        })
      )
    );

    const updatedFriends = friends.map((friend) => ({
      ...friend,
      avatar: avatarsMap.get(friend.friendId),
    }));

    setFriends(updatedFriends);
    return updatedFriends;
  }, [user]);

  const fetchWishes = useCallback(async () => {
    const wishes = await apiFetchData<Wish[]>({
      endpoint: API.profile.getWishes(user.id),
      token: user.token,
    });

    setWishes(wishes);

    const imagesMap = new Map(
      await Promise.all(
        wishes.map(async (wish) => {
          const image = await apiFetchImage({
            endpoint: API.wishes.getImage(wish.wishId),
            token: user.token,
          });
          return [wish.wishId, image] as const;
        })
      )
    );

    const updatedWishes = wishes.map((wish) => ({
      ...wish,
      image: imagesMap.get(wish.wishId),
    }));

    setWishes(updatedWishes);
    return updatedWishes;
  }, [user]);

  const fetchWishLists = useCallback(async () => {
    const wishLists = await apiFetchData<WishList[]>({
      endpoint: API.profile.getWishLists(user.id),
      token: user.token,
    });

    setWishLists(wishLists);
    return wishLists;
  }, [user]);

  const fetchPiggyBanks = useCallback(async () => {
    const piggyBanks = await apiFetchData<Wish[]>({
      endpoint: API.profile.getPiggyBanks(user.id),
      token: user.token,
    });

    setPiggyBanks(piggyBanks);

    const imagesMap = new Map(
      await Promise.all(
        piggyBanks.map(async (piggyBank) => {
          const image = await apiFetchImage({
            endpoint: API.wishes.getImage(piggyBank.wishId),
            token: user.token,
          });
          return [piggyBank.wishId, image] as const;
        })
      )
    );

    const updatedPiggyBanks = piggyBanks.map((piggyBank) => ({
      ...piggyBank,
      image: imagesMap.get(piggyBank.wishId),
    }));

    setPiggyBanks(updatedPiggyBanks);
    return updatedPiggyBanks;
  }, [user]);

  const isFriend = useCallback(
    (friendId: number) => {
      return friends.some((friend) => friend.friendId === friendId);
    },
    [friends]
  );

  const isSender = useCallback(
    (friendId: number) => {
      return friendRequests.some(
        (request) =>
          (request.userOneId === friendId && request.isUserOneAccept && !request.isUserTwoAccept) ||
          (request.userTwoId === friendId && request.isUserTwoAccept && !request.isUserOneAccept)
      );
    },
    [friendRequests]
  );

  const isReceiver = useCallback(
    (friendId: number) => {
      return friendRequests.some(
        (request) =>
          (request.userOneId === friendId && !request.isUserOneAccept && request.isUserTwoAccept) ||
          (request.userTwoId === friendId && !request.isUserTwoAccept && request.isUserOneAccept)
      );
    },
    [friendRequests]
  );

  const fetchBackground = useCallback(async () => {
    const storedBackground = await AsyncStorage.getItem('currentBackground');
    const targetBackground: ProfileBackground = storedBackground ? JSON.parse(storedBackground) : background;

    setBackground(targetBackground);
    return targetBackground;
  }, [background]);

  const changeBackground = useCallback(
    async (background: ProfileBackground) => {
      setBackground(background);

      await AsyncStorage.setItem('currentBackground', JSON.stringify(background));

      await apiFetchData({
        endpoint: API.settings.updateBackground,
        method: 'PUT',
        body: {
          email: user.email,
          backgroundType: background.backgroundType,
          backgroundColor: background.backgroundColor,
          backgroundImage: background.backgroundUri
            ? base64ToBinaryArray(await uriToBase64(background.backgroundUri))
            : undefined,
        },
        token: user.token,
      });
    },
    [user]
  );

  const fetchAllBackgrounds = useCallback(async () => {
    const storedBackgrounds = await AsyncStorage.getItem('backgrounds');
    const parsedBackgrounds = storedBackgrounds ? JSON.parse(storedBackgrounds) : [];

    const newBackgrounds: ProfileBackground[] = [...defaultBackgrounds, ...parsedBackgrounds];

    setAllBackgrounds(newBackgrounds);
    return newBackgrounds;
  }, [defaultBackgrounds]);

  const addBackgroundImage = useCallback(
    async (backgroundUri: string) => {
      const newBackground: ProfileBackground = {
        backgroundType: 'TYPE_IMAGE',
        backgroundId: allBackgrounds.length + 1,
        backgroundUri,
      };

      setAllBackgrounds((prev) => [...prev, newBackground]);

      const storedBackgrounds = [...allBackgrounds.slice(4), newBackground];
      await AsyncStorage.setItem('backgrounds', JSON.stringify(storedBackgrounds));

      return newBackground;
    },
    [allBackgrounds]
  );

  const providerValue = useMemo(
    () => ({
      avatar,
      allBackgrounds,
      background,
      bookings,
      friendRequests,
      friends,
      wishes,
      wishLists,
      piggyBanks,
      isLoaded,
      fetchAvatar,
      fetchBackground,
      fetchAllBackgrounds,
      addBackgroundImage,
      changeBackground,
      fetchBookings,
      fetchFriendRequests,
      fetchFriends,
      fetchWishes,
      fetchWishLists,
      fetchPiggyBanks,
      setIsLoaded,
      isFriend,
      isSender,
      isReceiver,
    }),
    [avatar, allBackgrounds, background, bookings, friendRequests, wishes, wishLists, piggyBanks, isLoaded]
  );

  return <StoreContext.Provider value={providerValue}>{children}</StoreContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return context;
};
