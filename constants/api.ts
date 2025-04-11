export const API_BASE_URL = '';

const images = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL_BgTANZFIIIVFGv1FjjDYvDzygFMkufN1A&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8MIAZ6FPDd8ByzuMeotdtzCZwvg9FRZmxGg&s',
  'https://t4.ftcdn.net/jpg/05/88/76/11/360_F_588761135_IRCiaSZaexToGiqU9ZldLhzN4ICS5sEc.jpg',
  'https://imgd.aeplcdn.com/370x208/n/cw/ec/121335/avinya-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
  'https://media.istockphoto.com/id/505239248/photo/humayun-tomb-new-delhi-india.jpg?s=612x612&w=0&k=20&c=UQTU6YOnVsSklzHi34cOhNW5AhsACDxKLiD9--T-3Kg='
]

export const API = {
  getWishImage: (wishId: number) => images[wishId],
};