import { StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

const ThemedButton = ({ style, variant = 'primary', ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.iconColor,
        };
      case 'warning':
        return {
          backgroundColor: Colors.warning,
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
        };
      default:
        return {
          backgroundColor: Colors.primary,
        };
    }
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn, 
        getButtonStyle(),
        pressed && styles.pressed, 
        style
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  }
});

export default ThemedButton;