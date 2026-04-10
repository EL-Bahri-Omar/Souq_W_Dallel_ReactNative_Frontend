import { Text } from 'react-native'
import { Colors } from "../constants/Colors"
import { useTheme } from "../constants/ThemeContext"

const ThemedText = ({ style, title = false, ...props}) => {
    
  const { colorScheme } = useTheme()
  const theme = Colors[colorScheme] ?? Colors.light  
  
  const textColor = title ? theme.title : theme.text
  
  return (
      <Text
        style={[{ color : textColor}, style]}
        {...props}
      />
  )
}

export default ThemedText