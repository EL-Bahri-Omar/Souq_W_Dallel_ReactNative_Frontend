import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Alert, 
  TouchableOpacity, 
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from 'react-native';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import ThemedTextInput from '../../components/ThemedTextInput';
import ThemedCard from '../../components/ThemedCard';
import Spacer from '../../components/Spacer';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchAuctionById, updateAuction } from '../../store/slices/auctionSlice';
import { Colors } from '../../constants/Colors';

const EditAuction = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { currentAuction, loading, updating } = useAppSelector((state) => state.auction);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const categories = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'real-estate', label: 'Real Estate' },
    { id: 'collectibles', label: 'Collectibles' },
    { id: 'art', label: 'Art' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'sports', label: 'Sports' },
    { id: 'general', label: 'General' },
  ];

  const statusOptions = [
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'ended', label: 'Ended' },
  ];

  useEffect(() => {
    if (id) {
      loadAuction();
    }
  }, [id]);

  useEffect(() => {
    if (currentAuction) {
      setFormData({
        title: currentAuction.title || '',
        description: currentAuction.description || '',
        startingPrice: currentAuction.startingPrice?.toString() || '',
        status: currentAuction.status || 'active',
      });
      
      if (currentAuction.photoId?.length) {
        setExistingImages(currentAuction.photoId.map(id => ({ id, isExisting: true })));
      }
    }
  }, [currentAuction]);

  const loadAuction = async () => {
    try {
      await dispatch(fetchAuctionById(id)).unwrap();
    } catch (error) {
      console.error('Error loading auction:', error);
      Alert.alert('Error', 'Failed to load auction');
      router.back();
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 0.8,
      selectionLimit: 10 - (existingImages.length + selectedImages.length),
    });

    if (!result.canceled && result.assets) {
      const newImages = [...selectedImages, ...result.assets];
      setSelectedImages(newImages);
    }
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      const newImages = [...existingImages];
      newImages.splice(index, 1);
      setExistingImages(newImages);
    } else {
      const newImages = [...selectedImages];
      newImages.splice(index, 1);
      setSelectedImages(newImages);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.startingPrice.trim()) {
      newErrors.startingPrice = 'Starting price is required';
    } else if (isNaN(formData.startingPrice) || parseFloat(formData.startingPrice) <= 0) {
      newErrors.startingPrice = 'Starting price must be a positive number';
    }
    
    if (existingImages.length + selectedImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      const auctionData = {
        id,
        title: formData.title,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        status: formData.status,
      };

      await dispatch(updateAuction({ auctionId: id, auctionData })).unwrap();
      
      Alert.alert(
        'Success',
        'Auction updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      
    } catch (error) {
      console.error('Update auction error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update auction. Please try again.'
      );
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const allImages = [...existingImages, ...selectedImages];

  return (
    <ThemedView safe style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Spacer height={40} />
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.iconColorFocused} />
            </TouchableOpacity>
            <ThemedText title style={styles.headerTitle}>
              Edit Auction
            </ThemedText>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.content}>
            <ThemedCard style={styles.formCard}>
              <View style={styles.section}>
                <ThemedText title style={styles.sectionTitle}>
                  Auction Images ({allImages.length}/10)
                </ThemedText>
                
                {errors.images && (
                  <ThemedText style={styles.errorText}>{errors.images}</ThemedText>
                )}
                
                <View style={styles.imageGrid}>
                  {allImages.length < 10 && (
                    <TouchableOpacity 
                      style={styles.addImageButton}
                      onPress={pickImages}
                    >
                      <Ionicons name="add" size={30} color="#666" />
                      <ThemedText style={styles.addImageText}>
                        Add Images
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                  
                  {allImages.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Ionicons name="image" size={60} color="#ccc" />
                      <TouchableOpacity 
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index, image.isExisting)}
                      >
                        <Ionicons name="close-circle" size={24} color={Colors.warning} />
                      </TouchableOpacity>
                      {image.isExisting && (
                        <View style={styles.existingBadge}>
                          <ThemedText style={styles.existingBadgeText}>Existing</ThemedText>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <ThemedText title style={styles.sectionTitle}>
                  Auction Information
                </ThemedText>
                
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Title </ThemedText>
                  <ThemedTextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    placeholder="Enter auction title"
                    value={formData.title}
                    onChangeText={(value) => handleChange('title', value)}
                    maxLength={100}
                  />
                  {errors.title && <ThemedText style={styles.errorText}>{errors.title}</ThemedText>}

                  <ThemedText style={styles.inputLabel}>Description </ThemedText>
                  <TextInput
                    style={[styles.textArea, errors.description && styles.inputError]}
                    placeholder="Describe your item in detail"
                    value={formData.description}
                    onChangeText={(value) => handleChange('description', value)}
                    multiline
                    numberOfLines={4}
                    maxLength={1000}
                  />
                  {errors.description && <ThemedText style={styles.errorText}>{errors.description}</ThemedText>}

                  <ThemedText style={styles.inputLabel}>Starting Price ($) </ThemedText>
                  <ThemedTextInput
                    style={[styles.input, errors.startingPrice && styles.inputError]}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={formData.startingPrice}
                    onChangeText={(value) => handleChange('startingPrice', value)}
                  />
                  {errors.startingPrice && <ThemedText style={styles.errorText}>{errors.startingPrice}</ThemedText>}

                  <ThemedText style={styles.inputLabel}>Status </ThemedText>
                  <View style={styles.statusContainer}>
                    {statusOptions.map(status => (
                      <TouchableOpacity
                        key={status.id}
                        style={[
                          styles.statusButton,
                          formData.status === status.id && styles.statusButtonActive
                        ]}
                        onPress={() => handleChange('status', status.id)}
                      >
                        <ThemedText style={[
                          styles.statusText,
                          formData.status === status.id && styles.statusTextActive
                        ]}>
                          {status.label}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ThemedCard>

            <Spacer height={30} />

            <View style={styles.buttonsContainer}>
              <ThemedButton
                onPress={handleSubmit}
                disabled={updating || loading}
                style={[styles.submitButton, (updating || loading) && styles.disabledButton]}
              >
                <View style={styles.buttonContent}>
                  {updating ? (
                    <Ionicons name="time-outline" size={22} color="#fff" />
                  ) : (
                    <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  )}
                  <ThemedText style={styles.buttonText}>
                    {updating ? 'Updating...' : 'Update Auction'}
                  </ThemedText>
                </View>
              </ThemedButton>

              <Spacer height={15} />

              <ThemedButton
                onPress={() => router.back()}
                style={styles.cancelButton}
                variant="secondary"
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="close-circle" size={22} color={theme.text} />
                  <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                </View>
              </ThemedButton>
            </View>

            <Spacer height={40} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default EditAuction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  formCard: {
    borderRadius: 20,
    padding: 25,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  addImageText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#666',
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  existingBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  existingBadgeText: {
    color: '#fff',
    fontSize: 10,
  },
  inputGroup: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
    marginTop: 15,
    opacity: 0.8,
  },
  input: {
    padding: 14,
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 10,
  },
  textArea: {
    padding: 14,
    fontSize: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Colors.warning,
    borderWidth: 1,
  },
  errorText: {
    color: Colors.warning,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: Colors.primary,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusTextActive: {
    color: '#fff',
  },
  buttonsContainer: {
    paddingHorizontal: 10,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});