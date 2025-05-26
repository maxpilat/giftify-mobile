import { useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API } from '@/constants/api';
import { useProfile } from '@/hooks/useStore';
import { useAuth } from '@/hooks/useAuth';
import { Wish } from '@/models';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { FullWishCard } from '@/components/FullWishCard';

type SearchParams = {
  userId?: string;
  wishId?: string;
  isMyBookings?: string;
};

export default function WishesScreen() {
  const { user: authUser } = useAuth();
  const { userId = authUser.id, wishId = 0, isMyBookings } = useLocalSearchParams<SearchParams>();
  const { wishes: myWishes, fetchWishes: fetchMyWishes, bookings: myBookings } = useProfile();
  const scrollViewRef = useRef<ScrollView>(null);
  const itemsRef = useRef(new Map<number, number>());

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData().then(() => setIsRefreshing(false));
  };

  const isCurrentUser = +userId === authUser.id;
  const visibleWishes = isMyBookings ? myBookings.map((booking) => booking.wish) : isCurrentUser ? myWishes : wishes;

  useEffect(() => {
    if (userId && !isCurrentUser) fetchData();
  }, [userId]);

  useEffect(() => {
    if (itemsRef.current.size) {
      scrollViewRef.current!.scrollTo({ y: itemsRef.current.get(+wishId), animated: false });
    }
  }, [wishId]);

  const fetchData = async () => {
    if (!isCurrentUser) {
      apiFetchData<Wish[]>({
        endpoint: API.profile.getWishes(+userId),
        token: authUser.token,
      }).then(async (data) => {
        setWishes(data);

        const imagesMap = new Map(
          await Promise.all(
            data.map(async (wish) => {
              const image = await apiFetchImage({
                endpoint: API.wishes.getImage(wish.wishId),
                token: authUser.token,
              });
              return [wish.wishId, image] as const;
            })
          )
        );

        const updatedWishes = data.map((wish) => ({
          ...wish,
          image: imagesMap.get(wish.wishId),
        }));

        setWishes(updatedWishes);
      });
    } else {
      fetchMyWishes();
    }
  };

  const handleItemLayout = (itemId: number, pageY: number) => {
    if (!itemsRef.current.has(itemId) && scrollViewRef.current && +wishId === itemId) {
      scrollViewRef.current.scrollTo({ y: pageY, animated: false });
    }
    itemsRef.current.set(itemId, pageY);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollViewContainer}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      {visibleWishes.map((wish) => (
        <FullWishCard key={wish.wishId} wish={wish} onLayout={handleItemLayout} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    gap: 42,
    paddingBottom: 120,
  },
});
