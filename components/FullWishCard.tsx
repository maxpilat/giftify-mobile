import { StyleSheet, View, Image, TouchableOpacity, Alert, Share } from 'react-native';
import { Action, ActionButton } from './ActionsButton';
import { ExternalLink } from './ExternalLink';
import { Icon } from './Icon';
import { PlatformButton } from './PlatformButton';
import { ThemedText } from './ThemedText';
import { Wish } from '@/models';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { router, usePathname } from 'expo-router';
import { API } from '@/constants/api';
import { apiFetchData } from '@/lib/api';
import { useProfile } from '@/hooks/useStore';
import { useState } from 'react';
import { base64ToBinaryArray } from '@/utils/convertImage';
import { Colors } from '@/constants/themes';
import { getDaysUntilBookingExpires } from '@/utils/getDaysUntil';
import * as Linking from 'expo-linking';

const IMAGE_HEIGHT = 450;

type Props = {
  wish: Wish;
  onLayout?: (itemId: number, pageY: number) => void;
};

export function FullWishCard({ wish, onLayout }: Props) {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();
  const {
    bookings: myBookings,
    fetchBookings: fetchMyBookings,
    fetchWishes: fetchMyWishes,
    fetchWishLists: fetchMyWishLists,
    isFriend: isFriendFunction,
  } = useProfile();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [descriptionNumLines, setDescriptionNumLines] = useState(0);

  const booking = myBookings.find((item) => item.wish.wishId === wish.wishId);
  const isCurrentUser = wish.wisherProfileData.userId === authUser.id;
  const isFriend = isFriendFunction(wish.wisherProfileData.userId);

  const shareWish = () => {
    const deepLink = Linking.createURL(pathname, {
      queryParams: { userId: wish.wisherProfileData.userId.toString(), piggyBankId: wish.wishId.toString() },
    });

    Share.share({ url: deepLink });
  };

  const editWish = () => {
    router.push({ pathname: '/profile/wishModal', params: { wishId: wish.wishId } });
  };

  const deleteWish = () => {
    Alert.alert('Подтвердите', 'Вы уверены, что хотите удалить желание?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить желание',
        style: 'destructive',
        onPress: () => {
          apiFetchData({ endpoint: API.wishes.delete(wish.wishId), method: 'DELETE', token: authUser.token }).then(
            () => {
              fetchMyWishes().then((wishes) => wishes.length === 0 && router.back());
              fetchMyWishLists();
            }
          );
        },
      },
    ]);
  };

  const handleBookWish = () => {
    apiFetchData({
      endpoint: booking ? API.booking.cancel(booking.bookingId) : API.booking.create,
      method: booking ? 'DELETE' : 'POST',
      body: booking ? undefined : { wishId: wish.wishId, bookerId: authUser.id },
      token: authUser.token,
    }).then(fetchMyBookings);
  };

  const getBookingAction = (): Action => {
    return {
      label: booking ? 'Снять бронь' : 'Забронировать',
      onPress: handleBookWish,
    };
  };

  const saveWish = () => {
    if (wish.image) {
      apiFetchData({
        endpoint: API.wishes.create,
        method: 'POST',
        body: {
          wisherId: authUser.id,
          wishType: 'TYPE_WISH',
          name: wish.name,
          description: wish.description,
          price: wish.price,
          currencyId: wish.currency?.currencyId,
          link: wish.link,
          image: base64ToBinaryArray(wish.image),
        },
        token: authUser.token,
      }).then(fetchMyWishes);
    }
  };

  const fulfillWish = () => {
    Alert.alert('Подтвердите', 'После этого действия желание пропадёт из вашего профиля', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Ок',
        style: 'default',
        onPress: () => {
          apiFetchData({ endpoint: API.wishes.delete(wish.wishId), method: 'DELETE', token: authUser.token }).then(
            () => {
              fetchMyWishes().then((wishes) => wishes.length === 0 && router.back());
              fetchMyWishLists();
            }
          );
        },
      },
    ]);
  };

  const getWishButton = () => {
    if (wish.wisherProfileData.userId === authUser.id) {
      return (
        <PlatformButton onPress={fulfillWish} hapticFeedback="Heavy">
          <ThemedText type="bodyLargeMedium" style={{ color: Colors.white }}>
            Исполнено
          </ThemedText>
        </PlatformButton>
      );
    } else {
      const booking = myBookings.find((item) => item.wish.wishId === wish.wishId);

      return (
        <PlatformButton
          onPress={handleBookWish}
          hapticFeedback="Heavy"
          style={[{ paddingVertical: 9 }, booking && { backgroundColor: Colors.red }]}
        >
          {!booking ? (
            <View style={{ alignItems: 'center' }}>
              <ThemedText type="bodyLargeMedium" style={{ color: Colors.white }}>
                Забронировать
              </ThemedText>
              <ThemedText type="labelSmall" style={{ color: Colors.white }}>
                Пользователь ничего не узнает
              </ThemedText>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <ThemedText type="bodyLargeMedium" style={{ color: Colors.white }}>
                Отменить бронь
              </ThemedText>
              <ThemedText type="labelSmall" style={{ color: Colors.white }}>
                Бронь снимется через {getDaysUntilBookingExpires(booking.booked)} дней
              </ThemedText>
            </View>
          )}
        </PlatformButton>
      );
    }
  };

  return (
    <View
      key={wish.wishId}
      style={styles.wishContainer}
      onLayout={onLayout && ((event) => onLayout(wish.wishId, event.nativeEvent.layout.y))}
    >
      <View>
        <Image source={{ uri: wish.image }} style={[styles.image, { height: IMAGE_HEIGHT }]} />
        {!(isCurrentUser || isFriend) && (
          <View style={styles.innerActionButton}>
            <ActionButton
              disabled={!wish.image}
              size={60}
              actions={[
                { label: 'Сохранить к себе', onPress: saveWish },
                { label: 'Поделиться', onPress: shareWish },
              ]}
            />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <ThemedText type="h2">{wish.name}</ThemedText>
          <View style={styles.price}>
            {Number(wish.price) > 0 && <ThemedText type="h5">{`${wish.price} ${wish.currency?.symbol}`}</ThemedText>}
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

        {(isCurrentUser || isFriend) && (
          <View style={styles.actionContainer}>
            <View style={styles.hapticButtonContainer}>{getWishButton()}</View>
            <ActionButton
              disabled={!wish.image}
              size={60}
              actions={
                wish.wisherProfileData.userId === authUser.id
                  ? [
                      { label: 'Редактировать', onPress: editWish },
                      { label: 'Поделиться', onPress: shareWish },
                      { label: 'Удалить', onPress: deleteWish },
                    ]
                  : ([
                      { label: 'Сохранить к себе', onPress: saveWish },
                      isFriend ? getBookingAction() : null,
                      { label: 'Поделиться', onPress: shareWish },
                    ].filter(Boolean) as Action[])
              }
            />
          </View>
        )}

        <View style={{ position: 'absolute', opacity: 0, width: '100%' }}>
          <ThemedText type="bodyLarge" onTextLayout={(event) => setDescriptionNumLines(event.nativeEvent.lines.length)}>
            {wish.description}
          </ThemedText>
        </View>

        <View style={styles.descriptionContainer}>
          <ThemedText type="bodyLarge" numberOfLines={isCollapsed ? 3 : undefined}>
            {wish.description}
          </ThemedText>
          {descriptionNumLines > 3 && (
            <TouchableOpacity onPress={() => setIsCollapsed((prev) => !prev)}>
              <ThemedText type="bodyLargeMedium" style={[styles.detailsLink, { color: theme.primary }]}>
                {isCollapsed ? 'Подробнее' : 'Свернуть'}
              </ThemedText>
            </TouchableOpacity>
          )}
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
    alignItems: 'center',
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
  innerActionButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 10,
  },
});
