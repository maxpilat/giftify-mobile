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
    getAllUsers: 'api/friends',
  },
  booking: {
    create: '/api/booking',
    getBooking: (bookingId: number) => `/api/booking/${bookingId}`,
    cancel: (bookingId: number) => `/api/booking/${bookingId}`,
  },
  profile: {
    getProfile: (userId: number) => `/api/profile/`,
    getWishes: (userId: number) => `/api/profile/${userId}/wishes`,
    getWishLists: (userId: number) => `/api/profile/${userId}/wish-lists`,
    getPiggyBanks: (userId: number) => `/api/profile/${userId}/piggy-banks`,
    getBookings: (userId: number) => `/api/profile/${userId}/bookings`,
    getBackground: (userId: number) => `/api/profile/background/${userId}`,
    getAvatar: (userId: number) => `/api/profile/avatar/${userId}`,
  },
  settings: {
    updateUsername: (userId: number) => `/api/settings/username`,
    updateTheme: (userId: number) => `/api/settings/theme`,
    updatePrivacy: (userId: number) => `/api/settings/privacy`,
    updateName: (userId: number) => `/api/settings/name`,
    updateGender: (userId: number) => `/api/settings/gender`, // Смена гендера
    updateColors: (userId: number) => `/api/settings/colors`, // Смена цвета приложения
    updateBirthDate: (userId: number) => `/api/settings/birth-date`, // Смена даты рождения
    updateBackground: (userId: number) => `/api/settings/background`, // Смена заднего фона аккаунта
    updateAvatar: (userId: number) => `/api/settings/avatar`, // Смена аватара
    getSettings: (userId: number) => `/api/settings`, // Получение всех настроек аккаунта
    sendHelpMessage: (userId: number) => `/api/settings/help-message`, // Отправка сообщения в поддержку
  },
  currencies: {
    getCurrencies: '/api/currency',
  },
};
