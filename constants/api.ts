export const REMOTE_URL = 'http://localhost:9999';

const images = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL_BgTANZFIIIVFGv1FjjDYvDzygFMkufN1A&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8MIAZ6FPDd8ByzuMeotdtzCZwvg9FRZmxGg&s',
  'https://t4.ftcdn.net/jpg/05/88/76/11/360_F_588761135_IRCiaSZaexToGiqU9ZldLhzN4ICS5sEc.jpg',
  'https://imgd.aeplcdn.com/370x208/n/cw/ec/121335/avinya-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
  'https://media.istockphoto.com/id/505239248/photo/humayun-tomb-new-delhi-india.jpg?s=612x612&w=0&k=20&c=UQTU6YOnVsSklzHi34cOhNW5AhsACDxKLiD9--T-3Kg='
]

export const API = {
  getWishImage: (wishId: number) => images[wishId],

  auth: {
    register: '/api/auth/sign-up',
    login: '/api/auth/sign-in',
    uniqueEmail: '/api/auth/unique-email',
    validateEmail: '/api/auth/validate-email',
    google: '/api/auth/google',
    changePassword: '/api/auth/password',
    changeEmail: '/api/auth/email',
    deactivateAccount: '/api/auth/deactivate-account'
  },
  wishes: {
    create: '/api/wish',
    update: '/api/wish',
    deposit: '/api/wish/deposit',
    addToWishList: '/api/wish/add-to-wish-list',
    getImage: (wishId: number) => `/api/wish/${wishId}/img`,
    delete: (wishId: number) => `/api/wish/${wishId}`
  },
  wishLists: {
    create: '/api/wish-list',
    update: '/api/wish-list',
    delete: (wishListId: number) => `/api/wish-list/${wishListId}`
  },
  friends: {
    sendRequest: '/api/friends',
    getFriends: (userId: number) => `/api/friends/${userId}`,
    getFriendRequests: (userId: number) => `/api/friends/requests/${userId}`
  },
  booking: {
    create: '/api/booking',
    cancel: (bookingId: number) => `/api/booking/${bookingId}`,
  },
  profile: {
    getProfile: (userId: number) => `/api/profile/${userId}`,
    getWishes: (userId: number) => `/api/profile/${userId}/wishes`,
    getWishLists: (userId: number) => `/api/profile/${userId}/wish-lists`,
    getPiggyBanks: (userId: number) => `/api/profile/${userId}/piggy-banks`,
    getBookings: (userId: number) => `/api/profile/${userId}/bookings`,
    getBackground: (userId: number) => `/api/profile/background/${userId}`,
    getAvatar: (userId: number) => `/api/profile/avatar/${userId}`,
  },
  currencies: {
    getCurrencies: '/api/currency'
  }
};