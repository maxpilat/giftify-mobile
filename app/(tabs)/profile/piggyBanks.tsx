import { useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API } from '@/constants/api';
import { useProfile } from '@/hooks/useStore';
import { useAuth } from '@/hooks/useAuth';
import { Wish } from '@/models';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { FullPiggyBankCard } from '@/components/FullPiggyBankCard';

type SearchParams = {
  userId?: string;
  piggyBankId?: string;
};

export default function PiggyBanksScreen() {
  const { user: authUser } = useAuth();
  const { userId = authUser.id, piggyBankId = 0 } = useLocalSearchParams<SearchParams>();
  const { piggyBanks: myPiggyBanks, fetchPiggyBanks: fetchMyPiggyBanks } = useProfile();
  const scrollViewRef = useRef<ScrollView>(null);
  const itemsRef = useRef(new Map<number, number>());

  const [piggyBanks, setPiggyBanks] = useState<Wish[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData().then(() => setIsRefreshing(false));
  };

  const isCurrentUser = +userId === authUser.id;
  const visiblePiggyBanks = isCurrentUser ? myPiggyBanks : piggyBanks;

  useEffect(() => {
    if (userId && !isCurrentUser) fetchData();
  }, [userId]);

  useEffect(() => {
    if (itemsRef.current.size) {
      scrollViewRef.current!.scrollTo({ y: itemsRef.current.get(+piggyBankId), animated: false });
    }
  }, [piggyBankId]);

  const fetchData = async () => {
    if (!isCurrentUser) {
      apiFetchData<Wish[]>({
        endpoint: API.profile.getPiggyBanks(+userId),
        token: authUser.token,
      }).then(async (data) => {
        setPiggyBanks(data);

        const imagesMap = new Map(
          await Promise.all(
            data.map(async (piggyBank) => {
              const image = await apiFetchImage({
                endpoint: API.wishes.getImage(piggyBank.wishId),
                token: authUser.token,
              });
              return [piggyBank.wishId, image] as const;
            })
          )
        );

        const updatedPiggyBanks = data.map((piggyBank) => ({
          ...piggyBank,
          image: imagesMap.get(piggyBank.wishId),
        }));

        setPiggyBanks(updatedPiggyBanks);
      });
    } else {
      fetchMyPiggyBanks();
    }
  };

  const handleItemLayout = (itemId: number, pageY: number) => {
    if (!itemsRef.current.has(itemId) && scrollViewRef.current && +piggyBankId === itemId) {
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
      {visiblePiggyBanks.map((piggyBank) => (
        <FullPiggyBankCard key={piggyBank.wishId} piggyBank={piggyBank} onLayout={handleItemLayout} />
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
