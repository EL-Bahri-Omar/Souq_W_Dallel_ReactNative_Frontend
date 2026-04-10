import { useTheme } from '../constants/ThemeContext'
import { Colors } from '../constants/Colors'
import { ActivityIndicator } from "react-native"
import ThemedView from "./ThemedView"

const ThemedLoader = () => {
    const { colorScheme } = useTheme()
    const theme = Colors[colorScheme] ?? Colors.light

    return (
        <ThemedView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <ActivityIndicator size="large" color={theme.text} />
        </ThemedView>
    )
} 

export default ThemedLoader