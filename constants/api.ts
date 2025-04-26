export const API = {
  auth: {
    signUp: '/api/auth/sign-up',
    signIn: '/api/auth/sign-in',
    uniqueEmail: '/api/auth/unique-email',
    validateEmail: '/api/auth/validate-email',
    google: '/api/auth/google',
    resetPassword: '/api/auth/password',
    changePassword: '/api/auth/password',
    changeEmail: '/api/auth/email',
    deactivateAccount: '/api/auth/deactivate-account',
  },
  wishes: {
    create: '/api/wish',
    update: '/api/wish',
    deposit: '/api/wish/deposit',
    addToWishList: '/api/wish/add-to-wish-list',
    getWish: (wishId: number) => `/api/wish/${wishId}`,
    getImage: (wishId: number) => `/api/wish/${wishId}/img`,
    delete: (wishId: number) => `/api/wish/${wishId}`,
  },
  wishLists: {
    create: '/api/wish-list',
    update: '/api/wish-list',
    delete: (wishListId: number) => `/api/wish-list/${wishListId}`,
  },
  friends: {
    sendRequest: '/api/friends',
    getFriends: (userId: number) => `/api/friends/${userId}`,
    getFriendRequests: (userId: number) => `/api/friends/requests/${userId}`,
  },
  booking: {
    create: '/api/booking',
    getBooking: (bookingId: number) => `/api/booking/${bookingId}`,
    cancel: (bookingId: number) => `/api/booking/${bookingId}`,
  },
  profile: {
    getProfile: (userId: number) => `/api/profile/7`,
    getWishes: (userId: number) => `/api/profile/${userId}/wishes`,
    getWishLists: (userId: number) => `/api/profile/${userId}/wish-lists`,
    getPiggyBanks: (userId: number) => `/api/profile/${userId}/piggy-banks`,
    getBookings: (userId: number) => `/api/profile/${userId}/bookings`,
    getBackground: (userId: number) => `/api/profile/background/${userId}`,
    getAvatar: (userId: number) => `/api/profile/avatar/${userId}`,
  },
  currencies: {
    getCurrencies: '/api/currency',
  },
};
