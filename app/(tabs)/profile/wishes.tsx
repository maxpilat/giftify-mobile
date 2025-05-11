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
};

export default function WishesScreen() {
  const { user: authUser } = useAuth();
  const { userId = authUser.id, wishId = 0 } = useLocalSearchParams<SearchParams>();
  const { wishes: myWishes, fetchWishes: fetchMyWishes } = useProfile();
  const scrollViewRef = useRef<ScrollView>(null);
  const processedItemsRef = useRef(new Set<number>());

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData().then(() => setIsRefreshing(false));
  };

  const isCurrentUser = +userId === authUser.id;
  const visibleWishes = isCurrentUser ? myWishes : wishes;

  useEffect(() => {
    if (userId && !isCurrentUser) fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!isCurrentUser) {
      const wishes = await apiFetchData<Wish[]>({
        endpoint: API.profile.getWishes(+userId),
        token: authUser.token,
      });

      setWishes(wishes);

      wishes.forEach(async (wish) => {
        const image = await apiFetchImage({
          endpoint: API.wishes.getImage(wish.wishId),
          token: authUser.token,
        });
        setWishes((prev) =>
          prev.map((prevWish) => (prevWish.wishId === wish.wishId ? { ...prevWish, image } : prevWish))
        );
      });
    } else {
      fetchMyWishes();
    }
  };

  const handleItemLayout = (itemId: number, pageY: number) => {
    if (scrollViewRef.current && !processedItemsRef.current.has(itemId) && +wishId === itemId) {
      processedItemsRef.current.add(itemId);
      scrollViewRef.current.scrollTo({ y: pageY, animated: false });
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollViewContainer}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      {visibleWishes.map((wish) => (
        <FullWishCard key={wish.wishId} wish={wish} userId={+userId} onLayout={handleItemLayout} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    gap: 42,
    paddingBottom: 130,
  },
});
