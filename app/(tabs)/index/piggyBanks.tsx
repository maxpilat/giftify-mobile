import React, { useRef } from 'react';
import { ScrollView, Image, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActionButton } from '@/components/ActionsButton';
import { useTheme } from '@/hooks/useTheme';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { useLocalSearchParams } from 'expo-router';
import { Wish } from '@/models';
import { API } from '@/constants/api';
import { ProgressBar } from '@/components/ProgressBar';

const IMAGE_HEIGHT = 450;

const wishes: Wish[] = [
  {
    wishId: 0,
    wishType: 'WISH',
    name: 'Беспроводные наушники',
    description: 'Sony WH-1000XM5 с шумоподавлением',
    price: 950,
    deposit: 750,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: 'https://example.com/sony-headphones',
  },
  {
    wishId: 1,
    wishType: 'PIGGY_BANK',
    name: 'Поездка в Париж',
    description: 'Хочу на неделю в Париж весной',
    price: 3000,
    deposit: 800,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: '',
  },
  {
    wishId: 2,
    wishType: 'WISH',
    name: 'Новая клавиатура',
    description: 'Механическая клавиатура Keychron K6',
    price: 350,
    deposit: 100,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: 'https://example.com/keychron-k6',
  },
  {
    wishId: 3,
    wishType: 'WISH',
    name: 'Умная колонка',
    description: 'Яндекс Станция Макс',
    price: 500,
    deposit: 50,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: 'https://example.com/yandex-station',
  },
  {
    wishId: 4,
    wishType: 'PIGGY_BANK',
    name: 'Курс по дизайну',
    description: 'Онлайн-курс UX/UI на Coursera',
    price: 1200,
    deposit: 300,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: 'https://coursera.org/design-course',
  },
];

export default function WishesScreen() {
  const { theme } = useTheme();
  const { wishId = 0 } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleItemLayout = (id: number, pageY: number) => {
    if (+wishId === id && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: pageY, animated: false });
    }
  };

  return (
    <ThemedView>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
        {wishes.map((wish) => (
          <View
            key={wish.wishId}
            style={styles.wishContainer}
            onLayout={(event) => handleItemLayout(wish.wishId, event.nativeEvent.layout.y)}
          >
            <Image source={{ uri: API.getWishImage(wish.wishId) }} style={[styles.image, { height: IMAGE_HEIGHT }]} />
            <View style={styles.infoContainer}>
              <View style={styles.textContainer}>
                <ThemedText type="h1">{wish.name}</ThemedText>
                <View style={styles.price}>
                  <ThemedText type="bodyLarge" style={styles.priceLabel}>
                    Стоимость:
                  </ThemedText>
                  <ThemedText type="h5">
                    {wish.price} {wish.currency?.symbol}
                  </ThemedText>
                </View>
              </View>

              <ProgressBar currentAmount={wish.deposit || 0} targetAmount={wish.price || 0} currency={wish.currency} />

              <View style={styles.actionContainer}>
                <View style={styles.hapticButtonContainer}>
                  <PlatformButton
                    style={{ backgroundColor: theme.primary }}
                    onPress={() => console.log('Исполнено')}
                    hapticFeedback="Heavy"
                  >
                    <ThemedText type="bodyLargeMedium" style={{ color: Colors.white }}>
                      Пополнить
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
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  priceLabel: {
    color: Colors.grey,
    paddingRight: 10,
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
