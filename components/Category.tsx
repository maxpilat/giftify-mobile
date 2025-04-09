import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Themes';
import { ThemedText } from '@/components/ThemedText';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/hooks/useTheme';

const WIDTH_DIFF = 36;

export type Props = {
  name: string;
  count: number;
  isActive?: boolean;
  onPress?: () => void;
};

export function Category({ name, count, isActive, onPress }: Props) {
  const [width, setWidth] = useState<number | null>(null);
  const { theme } = useTheme();

  const handleLayout = (event: LayoutChangeEvent) => {
    if (!width) setWidth(event.nativeEvent.layout.width + (isActive ? WIDTH_DIFF : 0));
  };

  useEffect(() => {
    width && setWidth((prev) => prev! + (isActive ? WIDTH_DIFF : -WIDTH_DIFF));
  }, [isActive]);

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.container, { backgroundColor: isActive ? theme.secondary : Colors.black, width: width || 'auto' }]}
      onPress={onPress}
      onLayout={handleLayout}
    >
      <ThemedText type="bodyLarge" style={styles.text}>
        {name}
      </ThemedText>
      <ThemedText type="h1" style={styles.text}>
        {count}
      </ThemedText>
      <TouchableOpacity activeOpacity={0.5} style={[styles.actions, { right: isActive ? 14 : -WIDTH_DIFF }]}>
        <Icon name="actions"></Icon>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 20,
  },
  text: {
    color: Colors.white,
  },
  actions: {
    position: 'absolute',
    top: 15,
  },
});

// import React, { useEffect, useRef, useState } from 'react';
// import { Animated, LayoutChangeEvent, StyleSheet, TouchableOpacity } from 'react-native';
// import { Colors } from '@/constants/Themes';
// import { ThemedText } from '@/components/ThemedText';
// import { Icon } from '@/components/Icon';
// import { useTheme } from '@/hooks/useTheme';

// const WIDTH_DIFF = 36;

// export type Props = {
//   name: string;
//   count: number;
//   isActive?: boolean;
//   onPress?: () => void;
// };

// export function Category({ name, count, isActive, onPress }: Props) {
//   const [layoutWidth, setLayoutWidth] = useState<number | null>(null); // Сохраняем начальную ширину
//   const widthAnim = useRef(new Animated.Value(100)).current; // Устанавливаем резервную ширину 100px
//   const rightAnim = useRef(new Animated.Value(-WIDTH_DIFF)).current; // Анимируемое смещение
//   const { theme } = useTheme();

//   // Обработка `onLayout` для получения реальной ширины
//   const handleLayout = (event: LayoutChangeEvent) => {
//     const measuredWidth = event.nativeEvent.layout.width;
//     if (!layoutWidth || layoutWidth === 0) {
//       setLayoutWidth(measuredWidth); // Устанавливаем реальную ширину
//       widthAnim.setValue(measuredWidth); // Инициализируем анимационное значение
//     }
//   };

//   // Эффект для изменения ширины на основе активности
//   useEffect(() => {
//     if (layoutWidth !== null) {
//       const targetWidth = layoutWidth + (isActive ? WIDTH_DIFF : 0); // Рассчитываем целевую ширину
//       Animated.timing(widthAnim, {
//         toValue: targetWidth,
//         duration: 300,
//         useNativeDriver: false, // Отключаем nativeDriver для ширины
//       }).start();
//     }

//     // Анимация положения `right`
//     Animated.timing(rightAnim, {
//       toValue: isActive ? 14 : -WIDTH_DIFF,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   }, [isActive, layoutWidth]);

//   return (
//     <TouchableOpacity
//       activeOpacity={0.5}
//       style={[
//         styles.container,
//         {
//           backgroundColor: isActive ? theme.secondary : Colors.black,
//         },
//       ]}
//       onPress={onPress}
//       onLayout={handleLayout} // Отслеживаем изменения размеров компонента
//     >
//       <Animated.View style={{ width: widthAnim }}>
//         <ThemedText numberOfLines={1} type="bodyLarge" style={styles.text}>
//           {name}
//         </ThemedText>
//         <ThemedText type="h1" style={styles.text}>
//           {count}
//         </ThemedText>
//         <Animated.View style={[styles.actions, { right: rightAnim }]}>
//           <Icon name="actions" />
//         </Animated.View>
//       </Animated.View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 14,
//     borderRadius: 20,
//   },
//   text: {
//     color: Colors.white,
//   },
//   actions: {
//     position: 'absolute',
//     top: 15,
//   },
// });
