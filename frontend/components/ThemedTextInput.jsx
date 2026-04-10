import { useTheme } from '../constants/ThemeContext'
import { TextInput } from 'react-native';
import { Colors } from "../constants/Colors";

const ThemedTextInput = ({ style, ...props }) => {
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  
  return (
    <TextInput 
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
          padding: 16,
          paddingLeft: 45,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.iconColor + '20',
          fontSize: 16,
        },
        style
      ]}
      placeholderTextColor={theme.iconColor + '80'} 
      {...props}
    />
  );
};

export default ThemedTextInput;