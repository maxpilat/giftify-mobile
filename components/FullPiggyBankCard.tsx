import { StyleSheet, View, Image, Alert, TouchableOpacity, Share } from 'react-native';
import { ActionButton } from '@/components/ActionsButton';
import { ProgressBar } from '@/components/ProgressBar';
import { ThemedText } from '@/components/ThemedText';
import { Wish } from '@/models';
import { useState } from 'react';
import { PlatformButton } from '@/components/PlatformButton';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useStore';
import { router, usePathname } from 'expo-router';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { Colors } from '@/constants/themes';
import * as Linking from 'expo-linking';
import { showToast } from '@/utils/showToast';

const IMAGE_HEIGHT = 450;

type Props = {
  piggyBank: Wish;
  onLayout?: (itemId: number, pageY: number) => void;
};

export function FullPiggyBankCard({ piggyBank, onLayout }: Props) {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();
  const { fetchPiggyBanks: fetchMyPiggyBanks } = useProfile();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [descriptionNumLines, setDescriptionNumLines] = useState(0);

  const isCurrentUser = piggyBank.wisherProfileData.userId === authUser.id;

  const sharePiggyBank = () => {
    const deepLink = Linking.createURL(pathname, {
      queryParams: { userId: piggyBank.wisherProfileData.userId.toString(), piggyBankId: piggyBank.wishId.toString() },
    });

    Share.share({ url: deepLink });
  };

  const editPiggyBank = () => {
    router.push({ pathname: '/profile/piggyBankModal', params: { piggyBankId: piggyBank.wishId } });
  };

  const deletePiggyBank = () => {
    Alert.alert('Подтвердите', 'Вы уверены, что хотите удалить копилку?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить копилку',
        style: 'destructive',
        onPress: () => {
          apiFetchData({ endpoint: API.wishes.delete(piggyBank.wishId), method: 'DELETE', token: authUser.token })
            .then(fetchMyPiggyBanks)
            .then((piggyBanks) => {
              piggyBanks.length === 0 && router.back();
              showToast('success', 'Копилка удалена');
            })
            .catch(() => showToast('error', 'Не удалось удалить копилку'));
        },
      },
    ]);
  };

  return (
    <View
      key={piggyBank.wishId}
      style={styles.piggyBankContainer}
      onLayout={onLayout && ((event) => onLayout(piggyBank.wishId, event.nativeEvent.layout.y))}
    >
      <View>
        <Image source={{ uri: piggyBank.image }} style={[styles.image, { height: IMAGE_HEIGHT }]} />
        {!isCurrentUser && (
          <View style={styles.innerActionButton}>
            <ActionButton
              disabled={!piggyBank.image}
              size={60}
              actions={[{ label: 'Поделиться', onPress: sharePiggyBank }]}
            />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <ThemedText type="h1">{piggyBank.name}</ThemedText>
          <View style={styles.price}>
            <ThemedText type="bodyLarge" style={styles.priceLabel}>
              Стоимость:
            </ThemedText>
            <ThemedText type="h5">
              {piggyBank.price} {piggyBank.currency?.symbol}
            </ThemedText>
          </View>
        </View>

        <ProgressBar currentAmount={piggyBank.deposit} targetAmount={piggyBank.price} currency={piggyBank.currency} />

        {isCurrentUser && (
          <View style={styles.actionContainer}>
            <View style={styles.hapticButtonContainer}>
              <PlatformButton
                onPress={() =>
                  router.push({ pathname: '/profile/piggyBankDepositModal', params: { piggyBankId: piggyBank.wishId } })
                }
                hapticFeedback="Heavy"
              >
                <ThemedText type="bodyLargeMedium" style={{ color: Colors.white }}>
                  Пополнить
                </ThemedText>
              </PlatformButton>
            </View>
            <ActionButton
              disabled={!piggyBank.image}
              size={60}
              actions={[
                { label: 'Редактировать', onPress: editPiggyBank },
                { label: 'Поделиться', onPress: sharePiggyBank },
                { label: 'Удалить', onPress: deletePiggyBank },
              ]}
            />
          </View>
        )}

        <View style={{ position: 'absolute', opacity: 0, width: '100%' }}>
          <ThemedText type="bodyLarge" onTextLayout={(event) => setDescriptionNumLines(event.nativeEvent.lines.length)}>
            {piggyBank.description}
          </ThemedText>
        </View>

        <View style={styles.descriptionContainer}>
          <ThemedText type="bodyLarge" numberOfLines={isCollapsed ? 3 : undefined}>
            {piggyBank.description}
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
  piggyBankContainer: {
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
