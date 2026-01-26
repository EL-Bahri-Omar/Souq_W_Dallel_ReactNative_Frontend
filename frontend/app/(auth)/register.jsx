import { StyleSheet, Text, Alert, TouchableWithoutFeedback } from 'react-native';
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Keyboard } from "react-native";
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import Spacer from '../../components/Spacer';
import ThemedTextInput from "../../components/ThemedTextInput";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../constants/Colors";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    cin: '',
    email: '',
    password: '',
    role: 'USER'
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const { register, loading, error } = useAuth();
  const router = useRouter();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSuccessMessage('');
    
    // Basic validation
    if (!formData.firstname || !formData.lastname || !formData.cin || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    try {
      await register(formData);
      setSuccessMessage('Registration successful! Please login with your credentials.');
      
      // Clear form
      setFormData({
        firstname: '',
        lastname: '',
        cin: '',
        email: '',
        password: '',
        role: 'USER'
      });
      
    } catch (err) {
      // Error is handled by Redux
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView safe style={styles.container}>
        <Spacer height={40} />
        
        <ThemedText title={true} style={styles.title}>
          Register
        </ThemedText>

        <ThemedTextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={(value) => handleChange('firstname', value)}
          value={formData.firstname}
        />

        <ThemedTextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={(value) => handleChange('lastname', value)}
          value={formData.lastname}
        />

        <ThemedTextInput
          style={styles.input}
          placeholder="CIN"
          keyboardType="numeric"
          onChangeText={(value) => handleChange('cin', value)}
          value={formData.cin}
        />

        <ThemedTextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(value) => handleChange('email', value)}
          value={formData.email}
        />

        <ThemedTextInput
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(value) => handleChange('password', value)}
          value={formData.password}
          secureTextEntry
        />

        <ThemedButton 
          onPress={handleSubmit} 
          disabled={loading}
          style={loading && styles.disabledButton}
        >
          <Text style={{ color: '#f2f2f2'}}>
            {loading ? 'Registering...' : 'Register'}
          </Text>
        </ThemedButton>

        <Spacer />

        {successMessage && (
          <Text style={styles.success}> {successMessage} </Text>
        )}

        {error && <Text style={styles.error}> {error} </Text>}

        <Spacer height={40} />

        <Link href='/login'>
          <ThemedText style={{ textAlign: 'center'}}>
            Already have an account? Login
          </ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  success: {
    color: 'green',
    padding: 10,
    width: '90%',
    backgroundColor: '#d4edda',
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  error: {
    color: Colors.warning,
    padding: 10,
    width: '90%',
    backgroundColor: '#f5c1c8',
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  }
});