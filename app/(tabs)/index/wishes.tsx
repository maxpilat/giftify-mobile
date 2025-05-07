import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { API } from '@/constants/api';
import { useProfile } from '@/hooks/useProfile';
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
  const { userId = authUser.userId, wishId = 0 } = useLocalSearchParams<SearchParams>();
  const { wishes: myWishes } = useProfile();
  const scrollViewRef = useRef<ScrollView>(null);
  const processedItemsRef = useRef(new Set<number>());

  const [wishes, setWishes] = useState<Wish[]>([]);

  const isCurrentUser = +userId === authUser.userId;

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const fetchData = async () => {
    const wishes = isCurrentUser
      ? myWishes
      : await apiFetchData<Wish[]>({
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
  };

  const handleItemLayout = (itemId: number, pageY: number) => {
    if (scrollViewRef.current && !processedItemsRef.current.has(itemId) && +wishId === itemId) {
      processedItemsRef.current.add(itemId);
      scrollViewRef.current.scrollTo({ y: pageY, animated: false });
    }
  };

  return (
    <ThemedView>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
        {wishes.map((wish) => (
          <FullWishCard key={wish.wishId} wish={wish} userId={+userId} onLayout={handleItemLayout} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    gap: 42,
    paddingBottom: 130,
  },
});
