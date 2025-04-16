// import { create } from 'zustand';
// import { apiRequest } from '@/lib/api';
// import { API } from '@/constants/api';
// import { Wish } from '@/models';


// interface WishesStore {
//   wishes: Wish[];
//   isLoading: boolean;
//   createWish: (title: string) => Promise<void>;
//   updateWish: (wishId: number) => Promise<void>;
//   depositToWish: (wishId: number, amount: number) => Promise<void>;
//   addWishToList: (wishId: number, listId: number) => Promise<void>;
//   getWishImage: (wishId: number) => Promise<string>;
//   fulfillWish: (wishId: number) => Promise<void>;
// };

// export const useWishesStore = create<WishesStore>((set) => ({
//   wishes: [],
//   isLoading: false,


// }));



// useWishesStore - наши желания
// useProfileStore - желания другого пользователя + остальные данные
// useFriendsStore - наши друзья, тут же лежат наши заявки в друзья по которым мы можем понять отношение с другим пользователем - он наш друг или мы отправили ему заявку а он еще не принял

