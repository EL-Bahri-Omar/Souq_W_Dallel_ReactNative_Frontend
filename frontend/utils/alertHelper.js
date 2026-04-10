import { Alert, Platform } from 'react-native';

/**
 * Cross-platform confirmation dialog.
 * On web, uses window.confirm (since Alert.alert with buttons doesn't work).
 * On native, uses Alert.alert with Cancel/Confirm buttons.
 */
export const confirmDialog = (title, message, onConfirm, onCancel) => {
  if (Platform.OS === 'web') {
    const result = window.confirm(`${title}\n\n${message}`);
    if (result) {
      onConfirm?.();
    } else {
      onCancel?.();
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: 'Annuler', style: 'cancel', onPress: onCancel },
        { text: 'Confirmer', style: 'destructive', onPress: onConfirm },
      ]
    );
  }
};

/**
 * Cross-platform info alert (no callbacks needed, just a message).
 * Works on both web and native.
 */
export const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};
