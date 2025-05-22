import { ViewStyle, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RenderThumbProps } from 'reanimated-color-picker';

export function ColorPickerThumb({ height, positionStyle }: RenderThumbProps) {
  const triangleSize = height / 4;

  const triangleStyle = {
    width: 0,
    height: 0,
    borderLeftWidth: triangleSize,
    borderRightWidth: triangleSize,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  } as const;

  return (
    <Animated.View
      style={[
        {
          height,
          gap: height + 8,
        },
        positionStyle as ViewStyle,
      ]}
    >
      <View
        style={{
          ...triangleStyle,
          borderTopWidth: triangleSize,
          borderTopColor: Colors.black,
        }}
      />
      <View
        style={{
          ...triangleStyle,
          borderBottomWidth: triangleSize,
          borderBottomColor: Colors.black,
        }}
      />
    </Animated.View>
  );
}
