import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Image, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActionButton } from '@/components/ActionsButton';
import { ExternalLink } from '@/components/ExternalLink';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/Icon';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { useLocalSearchParams } from 'expo-router';
import { API } from '@/constants/api';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Wish } from '@/models';
import { apiFetch } from '@/lib/api';
import { arrayBufferToBase64 } from '@/utils/imageConverter';

const IMAGE_HEIGHT = 450;

export default function WishesScreen() {
  const { theme } = useTheme();
  const { user: authUser, token } = useAuth();
  const { isLoaded, wishes: myWishes, fetchWishes: fetchMyWishes } = useProfile();
  const { userId = authUser.userId, wishId = 0 } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleItemLayout = (id: number, pageY: number) => {
    if (+wishId === id && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: pageY, animated: false });
    }
  };

  const [wishes, setWishes] = useState<Wish[]>([]);

  const fetchData = async () => {
    const loadImages = async (wishes: Wish[]) => {
      for (const wish of wishes) {
        const response: Response = await apiFetch({ endpoint: API.wishes.getImage(wish.wishId) });
        const buffer = await response.arrayBuffer();
        const image = arrayBufferToBase64(buffer);
        setWishes((prev) =>
          prev.map((prevWish) => (prevWish.wishId === wish.wishId ? { ...prevWish, image } : prevWish))
        );
      }
    };

    if (+userId === authUser.userId) {
      if (isLoaded) {
        setWishes(myWishes);
        await loadImages(myWishes);
      } else {
        await fetchMyWishes();
        setWishes(myWishes);
        await loadImages(myWishes);
      }
    } else {
      const fetchedWishes = await apiFetch({ endpoint: API.profile.getWishes(+userId), token });
      setWishes(fetchedWishes);
      await loadImages(fetchedWishes);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <ThemedView>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
        {wishes.map((wish) => (
          <View
            key={wish.wishId}
            style={styles.wishContainer}
            onLayout={(event) => handleItemLayout(wish.wishId, event.nativeEvent.layout.y)}
          >
            <Image source={{ uri: wish.image }} style={[styles.image, { height: IMAGE_HEIGHT }]} />
            <View style={styles.infoContainer}>
              <View style={styles.textContainer}>
                <ThemedText type="h2">{wish.name}</ThemedText>
                <View style={styles.price}>
                  <ThemedText>{`${wish.price} ${wish.currency?.symbol}`}</ThemedText>
                  {wish.link && (
                    <ExternalLink style={styles.externalLink} href={wish.link}>
                      <View style={styles.externalLinkContainer}>
                        <ThemedText type="bodyLargeMedium" style={[styles.externalLinkText, { color: theme.primary }]}>
                          Где купить
                        </ThemedText>
                        <Icon name="bag" size={20} style={styles.externalLinkIcon} color={theme.primary} />
                      </View>
                    </ExternalLink>
                  )}
                </View>
              </View>

              <View style={styles.actionContainer}>
                <View style={styles.hapticButtonContainer}>
                  <PlatformButton
                    style={{ backgroundColor: theme.primary }}
                    onPress={() => console.log('Исполнено')}
                    hapticFeedback="Heavy"
                  >
                    <ThemedText type="bodyLargeMedium" style={{ color: Colors.white }}>
                      Исполнено
                    </ThemedText>
                  </PlatformButton>
                </View>
                <ActionButton size={60} actions={[{ label: 'Поделиться', onPress: () => console.log('Поделиться') }]} />
              </View>

              <View style={styles.descriptionContainer}>
                <ThemedText type="bodyLarge" numberOfLines={3} ellipsizeMode="tail">
                  EMO – это небольшой, но продвинутый настольный робот-компаньон, который обладает искусственным
                  интеллектом и может демонстрировать эмоции и на
                </ThemedText>
                <ThemedText type="bodyLargeMedium" style={[styles.detailsLink, { color: theme.primary }]}>
                  Подробнее
                </ThemedText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    gap: 56,
    paddingBottom: 130,
  },
  wishContainer: {
    gap: 24,
  },
  image: {
    width: '100%',
  },
  infoContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  textContainer: {
    gap: 14,
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  externalLink: {
    color: 'red',
  },
  externalLinkContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  externalLinkText: {
    textAlign: 'right',
  },
  externalLinkIcon: {
    marginTop: 3,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  hapticButtonContainer: {
    flex: 1,
  },
  descriptionContainer: {
    gap: 10,
  },
  detailsLink: {
    textAlign: 'right',
  },
});
