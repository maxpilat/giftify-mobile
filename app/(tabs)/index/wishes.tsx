import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView, Image, StyleSheet, View } from 'react-native';
import { type Props as TWish } from '@/components/WishCard';
import { ActionButton } from '@/components/ActionsButton';
import { ExternalLink } from '@/components/ExternalLink';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/Icon';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/Themes';

const IMAGE_HEIGHT = 450;

const wishes: (TWish & { id: number; categoryId: number })[] = [
  {
    id: 0,
    image: {
      uri: 'https://vector.thedroidyouarelookingfor.info/wp-content/uploads/2020/09/EmoDesktopPet.jpg',
    },
    name: 'Робот Emo',
    price: 1800,
    currency: 'BYN',
    categoryId: 1,
  },
  {
    id: 1,
    image: {
      uri: 'https://images.pexels.com/photos/258196/pexels-photo-258196.jpeg?cs=srgb&dl=pexels-pixabay-258196.jpg&fm=jpg',
    },
    name: 'Робот Emo',
    price: 1800,
    currency: 'BYN',
    categoryId: 1,
  },
  {
    id: 2,
    image: {
      uri: 'https://images.pexels.com/photos/1156684/pexels-photo-1156684.jpeg?cs=srgb&dl=pexels-arunbabuthomas-1156684.jpg&fm=jpg',
    },
    name: 'Робот Emo',
    price: 1800,
    currency: 'BYN',
    categoryId: 2,
  },
] as const;

export default function WishesScreen() {
  const { theme } = useTheme();

  const updateWish = () => {
    console.log('Исполнено');
  };

  return (
    <ThemedView>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {wishes.map((wish) => (
          <View key={wish.id} style={styles.wishContainer}>
            <Image
              source={{ uri: wish.image.uri }}
              style={[styles.image, { height: wish.image.height || IMAGE_HEIGHT }]}
            />
            <View style={styles.infoContainer}>
              <View style={styles.textContainer}>
                <ThemedText type="h2">{wish.name}</ThemedText>
                <View style={styles.price}>
                  <ThemedText>{`${wish.price} ${wish.currency}`}</ThemedText>
                  <ExternalLink style={styles.externalLink} href="https://www.google.com/">
                    <View style={styles.externalLinkContainer}>
                      <ThemedText type="bodyLargeMedium" style={[styles.externalLinkText, { color: theme.primary }]}>
                        Где купить
                      </ThemedText>
                      <Icon name="bag" size={20} style={styles.externalLinkIcon} color={theme.primary} />
                    </View>
                  </ExternalLink>
                </View>
              </View>

              <View style={styles.actionContainer}>
                <View style={styles.hapticButtonContainer}>
                  {/*
                    если это наше желание - исполнено
                    если желание друга - забронировать или отменить бронь
                    если желание пользователя - не рисуем этот и кнопку actions переносим в нижний левый угол изображения
                  */}
                  <PlatformButton
                    style={{ backgroundColor: theme.primary }}
                    onPress={updateWish}
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
