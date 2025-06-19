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
import {
  Booking,
  Chat,
  ClientChatAttachment,
  Friend,
  FriendRequest,
  Profile,
  ProfileBackground,
  Wish,
  WishList,
} from '@/models';
import { useAuth } from '@/hooks/useAuth';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base64ToBinaryArray, uriToBase64 } from '@/utils/convertImage';
import { getDefaultBackground, loadDefaultBackgrounds } from '@/utils/profileBackground';
import { Image } from 'react-native';

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
  chats: Chat[];
  currentChatId: number;
  chatAttachments: Map<number, ClientChatAttachment>;
  isLoaded: boolean;
  fetchAvatar: () => Promise<string>;
  fetchBookings: () => Promise<Booking[]>;
  fetchFriendRequests: () => Promise<FriendRequest[]>;
  fetchFriends: () => Promise<Friend[]>;
  fetchWishes: () => Promise<Wish[]>;
  fetchWishLists: () => Promise<WishList[]>;
  fetchPiggyBanks: () => Promise<Wish[]>;
  switchChat: (chatId: number) => void;
  loadChatAttachment: (messageId: number) => Promise<void>;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
  isFriend: (friendId: number) => boolean;
  isSender: (friendId: number) => boolean;
  isReceiver: (friendId: number) => boolean;
  fetchBackground: () => Promise<ProfileBackground>;
  fetchAllBackgrounds: () => Promise<ProfileBackground[]>;
  addBackgroundImage: (backgroundUri: string) => Promise<ProfileBackground>;
  changeBackground: (background: ProfileBackground) => Promise<void>;
  changeAvatar: (avatar: string) => Promise<void>;
  fetchChats: () => Promise<Chat[]>;
  hotFetchChats: () => Promise<Chat[]>;
} | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
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
  const [background, setBackground] = useState<ProfileBackground>(getDefaultBackground());
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number>(-1);
  const [chatAttachments, setChatAttachments] = useState<Map<number, ClientChatAttachment>>(new Map());
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadDefaultBackgrounds().then(setDefaultBackgrounds);
  }, []);

  const fetchAvatar = useCallback(async () => {
    const image = await apiFetchImage({ endpoint: API.profile.getAvatar(user.id), token: user.token });

    setAvatar(image);
    return image;
  }, [user.id, user.token]);

  const fetchBookings = useCallback(async () => {
    const bookings = await apiFetchData<Booking[]>({
      endpoint: API.profile.getBookings(user.id),
      token: user.token,
    });

    const imagesMap = new Map(
      await Promise.all(
        bookings.map(async (booking) => {
          const image = await apiFetchImage({
            endpoint: API.wishes.getImage(booking.wish.wishId),
            token: user.token,
          });
          return [booking.bookingId, image] as const;
        })
      )
    );

    const avatarsMap = new Map(
      await Promise.all(
        bookings.map(async (booking) => {
          const avatar = await apiFetchImage({
            endpoint: API.profile.getAvatar(booking.wish.wisherProfileData.userId),
            token: user.token,
          });
          return [booking.bookingId, avatar] as const;
        })
      )
    );

    setBookings(
      bookings.map((booking) => ({
        ...booking,
        wish: {
          ...booking.wish,
          image: imagesMap.get(booking.bookingId),
          wisherProfileData: {
            ...booking.wish.wisherProfileData,
            avatar: avatarsMap.get(booking.bookingId),
          },
        },
      }))
    );

    return bookings;
  }, [user.id, user.token]);

  const fetchFriendRequests = useCallback(async () => {
    const friendRequests = await apiFetchData<FriendRequest[]>({
      endpoint: API.friends.getFriendRequests(user.id),
      token: user.token,
    });

    setFriendRequests(friendRequests);
    return friendRequests;
  }, [user.id, user.token]);

  const fetchFriends = useCallback(async () => {
    let friends = await apiFetchData<Friend[]>({
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

    friends = friends.map((friend) => ({
      ...friend,
      avatar: avatarsMap.get(friend.friendId),
    }));

    setFriends(friends);

    return friends;
  }, [user.id, user.token]);

  const fetchWishes = useCallback(async () => {
    const wishes = await apiFetchData<Wish[]>({
      endpoint: API.profile.getWishes(user.id),
      token: user.token,
    });

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

    setWishes(
      wishes.map((wish) => ({
        ...wish,
        image: imagesMap.get(wish.wishId),
      }))
    );

    return wishes;
  }, [user.id, user.token]);

  const fetchWishLists = useCallback(async () => {
    const wishLists = await apiFetchData<WishList[]>({
      endpoint: API.profile.getWishLists(user.id),
      token: user.token,
    });

    setWishLists(wishLists);
    return wishLists;
  }, [user.id, user.token]);

  const fetchPiggyBanks = useCallback(async () => {
    const piggyBanks = await apiFetchData<Wish[]>({
      endpoint: API.profile.getPiggyBanks(user.id),
      token: user.token,
    });

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

    setPiggyBanks(
      piggyBanks.map((piggyBank) => ({
        ...piggyBank,
        image: imagesMap.get(piggyBank.wishId),
      }))
    );

    return piggyBanks;
  }, [user.id, user.token]);

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
    if (storedBackground) {
      const parsedBackground = JSON.parse(storedBackground);
      setBackground(parsedBackground);
      return parsedBackground;
    }

    const serverBackground = await apiFetchData<ProfileBackground>({
      endpoint: API.profile.getBackground(user.id),
      token: user.token,
    });

    if (!serverBackground.backgroundImage && !serverBackground.backgroundColor) {
      return background;
    }

    const newBackground = {
      ...serverBackground,
      backgroundImage: serverBackground.backgroundImage
        ? `data:image;base64,${serverBackground.backgroundImage}`
        : undefined,
    };

    setBackground(newBackground);
    return newBackground;
  }, [background]);

  const changeBackground = useCallback(
    async (background: ProfileBackground) => {
      try {
        setBackground(background);

        await AsyncStorage.setItem('currentBackground', JSON.stringify(background));

        await apiFetchData({
          endpoint: API.settings.updateBackground,
          method: 'PUT',
          body: {
            email: user.email,
            id: background.id,
            backgroundType: background.backgroundType,
            backgroundColor: background.backgroundColor,
            backgroundImage: background.backgroundImage
              ? base64ToBinaryArray(await uriToBase64(background.backgroundImage))
              : undefined,
          },
          token: user.token,
        });
      } catch (error) {
        throw error;
      }
    },
    [user.email, user.token]
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
        id: allBackgrounds.length + 1,
        backgroundImage: backgroundUri,
      };

      setAllBackgrounds((prev) => [...prev, newBackground]);

      const storedBackgrounds = [...allBackgrounds.slice(4), newBackground];
      await AsyncStorage.setItem('backgrounds', JSON.stringify(storedBackgrounds));

      return newBackground;
    },
    [allBackgrounds]
  );

  const changeAvatar = useCallback(
    async (avatarUri: string) => {
      try {
        await apiFetchData({
          endpoint: API.settings.updateAvatar,
          method: 'PUT',
          body: {
            email: user.email,
            newAvatar: base64ToBinaryArray(await uriToBase64(avatarUri)),
          },
          token: user.token,
        });

        setAvatar(avatarUri);
      } catch (error) {
        throw error;
      }
    },
    [user.email, user.token]
  );

  const fetchChats = useCallback(async () => {
    const chats = await apiFetchData<Chat[]>({ endpoint: API.chats.getUserChats(user.id), token: user.token });

    const friendsNamesMap = new Map(
      await Promise.all(
        chats.map(async (chat) => {
          const friendId = chat.userOneId === user.id ? chat.userTwoId : chat.userOneId;
          const { name, surname } = await apiFetchData<Profile>({
            endpoint: API.profile.getProfile(friendId),
            token: user.token,
          });
          return [chat.chatId, `${name} ${surname}`] as const;
        })
      )
    );

    setChats(
      chats.map((chat) => ({
        ...chat,
        friendName: chat.userOneId === user.id ? friendsNamesMap.get(chat.chatId)! : chat.userOneDisplayName,
      }))
    );

    const friendsAvatarsMap = new Map(
      await Promise.all(
        chats.map(async (chat) => {
          if (chat.userOneId !== user.id) return [chat.chatId, null] as const;
          const avatar = await apiFetchImage({ endpoint: API.profile.getAvatar(chat.userTwoId), token: user.token });
          return [chat.chatId, avatar] as const;
        })
      )
    );

    setChats((prevChats) =>
      prevChats.map((chat) => ({
        ...chat,
        friendAvatar: friendsAvatarsMap.get(chat.chatId),
      }))
    );

    return chats;
  }, [user.id, user.token]);

  const hotFetchChats = useCallback(async () => {
    try {
      const prevAvatars = chats.map((chat) => ({ id: chat.chatId, avatar: chat.friendAvatar }));

      let newChats = await apiFetchData<Chat[]>({ endpoint: API.chats.getUserChats(user.id), token: user.token });

      const friendsNamesMap = new Map(
        await Promise.all(
          newChats.map(async (chat) => {
            if (chat.userOneId !== user.id) return [chat.chatId, chat.userOneDisplayName] as const;
            const { name, surname } = await apiFetchData<Profile>({
              endpoint: API.profile.getProfile(chat.userTwoId),
              token: user.token,
            });
            return [chat.chatId, `${name} ${surname}`] as const;
          })
        )
      );

      const friendsAvatarsMap = new Map(
        await Promise.all(
          newChats.map(async (chat) => {
            const prevItem = prevAvatars.find((item) => item.id === chat.chatId);
            if (prevItem !== undefined) return [chat.chatId, prevItem.avatar] as const;
            if (chat.userOneId !== user.id) return [chat.chatId, null] as const;
            const newAvatar = await apiFetchImage({
              endpoint: API.profile.getAvatar(chat.userTwoId),
              token: user.token,
            });
            return [chat.chatId, newAvatar] as const;
          })
        )
      );

      newChats = newChats.map((chat) => ({
        ...chat,
        friendName: friendsNamesMap.get(chat.chatId)!,
        friendAvatar: friendsAvatarsMap.get(chat.chatId),
      }));

      setChats(newChats);

      return newChats;
    } catch {
      return [];
    }
  }, []);

  const loadChatAttachment = useCallback(
    async (messageId: number) => {
      try {
        const image = await apiFetchImage({ endpoint: API.chats.loadAttachment(messageId), token: user.token });
        Image.getSize(image, (width, height) => {
          setChatAttachments((prev) => new Map(prev).set(messageId, { uri: image, aspectRatio: width / height }));
        });
      } catch {}
    },
    [user.token]
  );

  const switchChat = (chatId: number) => {
    chatAttachments.clear();
    setCurrentChatId(chatId);
  };

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
      chats,
      currentChatId,
      chatAttachments,
      isLoaded,
      fetchAvatar,
      fetchBackground,
      fetchAllBackgrounds,
      addBackgroundImage,
      changeBackground,
      changeAvatar,
      fetchBookings,
      fetchFriendRequests,
      fetchFriends,
      fetchWishes,
      fetchWishLists,
      fetchPiggyBanks,
      fetchChats,
      switchChat,
      loadChatAttachment,
      hotFetchChats,
      setIsLoaded,
      isFriend,
      isSender,
      isReceiver,
    }),
    [
      avatar,
      allBackgrounds,
      background,
      bookings,
      friendRequests,
      wishes,
      wishLists,
      piggyBanks,
      chats,
      currentChatId,
      chatAttachments,
      isLoaded,
    ]
  );

  return <StoreContext.Provider value={providerValue}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context;
};
