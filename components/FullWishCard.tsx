import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Action, ActionButton } from './ActionsButton';
import { ExternalLink } from './ExternalLink';
import { Icon } from './Icon';
import { PlatformButton } from './PlatformButton';
import { ThemedText } from './ThemedText';
import { Wish } from '@/models';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { API } from '@/constants/api';
import { apiFetchData } from '@/lib/api';
import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';

const IMAGE_HEIGHT = 450;

type Props = {
  wish: Wish;
  userId: number;
  onLayout?: (itemId: number, pageY: number) => void;
};

export function FullWishCard({ wish, userId, onLayout }: Props) {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();
  const { bookings: myBookings, fetchBookings: fetchMyBookings, fetchWishes: fetchMyWishes, isFriend } = useProfile();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const shareWish = () => {
    console.log('Поделиться желанием');
  };

  const editWish = (wishId: number) => {
    router.push({ pathname: './wishModal', params: { wishId } });
  };

  const deleteWish = (wishId: number) => {
    apiFetchData({ endpoint: API.wishes.delete(wishId), method: 'DELETE', token: authUser.token }).then(fetchMyWishes);
  };

  const getBookingAction = (wishId: number): Action => {
    const booking = myBookings.find((item) => item.wish.wishId === wishId);

    return {
      label: booking ? 'Снять бронь' : 'Забронировать',
      onPress: () =>
        apiFetchData({
          endpoint: booking ? API.booking.cancel(booking.bookingId) : API.booking.create,
          method: booking ? 'DELETE' : 'POST',
          body: booking ? undefined : { wishId, bookerId: authUser.userId },
          token: authUser.token,
        }).then(fetchMyBookings),
    };
  };

  const isCurrentUser = +userId === authUser.userId;

  return (
    <View
      key={wish.wishId}
      style={styles.wishContainer}
      onLayout={onLayout && ((event) => onLayout(wish.wishId, event.nativeEvent.layout.y))}
    >
      <Image source={{ uri: wish.image }} style={[styles.image, { height: IMAGE_HEIGHT }]} />
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <ThemedText type="h2">{wish.name}</ThemedText>
          <View style={styles.price}>
            {Number(wish.price) > 0 && <ThemedText>{`${wish.price} ${wish.currency?.symbol}`}</ThemedText>}
            {wish.link && (
              <ExternalLink href={wish.link}>
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
            <PlatformButton onPress={() => console.log('Исполнено')} hapticFeedback="Heavy">
              <ThemedText type="bodyLargeMedium" style={{ color: Colors.white }}>
                Исполнено
              </ThemedText>
            </PlatformButton>
          </View>
          <ActionButton
            size={60}
            actions={
              isCurrentUser
                ? [
                    { label: 'Редактировать', onPress: () => editWish(wish.wishId) },
                    { label: 'Поделиться', onPress: shareWish },
                    { label: 'Удалить', onPress: () => deleteWish(wish.wishId) },
                  ]
                : [
                    { label: 'Сохранить к себе', onPress: () => editWish(wish.wishId) },
                    isFriend(+userId) ? getBookingAction(wish.wishId) : null,
                    { label: 'Поделиться', onPress: shareWish },
                  ].filter((action) => !!action)
            }
          />
        </View>

        <View style={styles.descriptionContainer}>
          <ThemedText type="bodyLarge" numberOfLines={isCollapsed ? 3 : undefined}>
            EMO – это небольшой, но продвинутый настольный робот-компаньон, который обладает искусственным интеллектом и
            может демонстрировать эмоции и на
          </ThemedText>
          <TouchableOpacity onPress={() => setIsCollapsed((prev) => !prev)}>
            <ThemedText type="bodyLargeMedium" style={[styles.detailsLink, { color: theme.primary }]}>
              {isCollapsed ? 'Подробнее' : 'Свернуть'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wishContainer: {
    gap: 24,
  },
  image: {
    width: '100%',
  },
  infoContainer: {
    paddingHorizontal: 16,
    gap: 24,
  },
  textContainer: {
    gap: 12,
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
