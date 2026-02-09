import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import ThemedText from './ThemedText';
import ThemedCard from './ThemedCard';
import { Colors } from '../constants/Colors';
import { auctionService } from '../store/services/auctionService';
import { userService } from '../store/services/userService';

const AuctionCard = ({ auction, onPress }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  
  useEffect(() => {
    loadAuctionData();
  }, [auction]);

  const loadAuctionData = async () => {
    // Load auction photo
    if (auction?.photoId?.[0]) {
      const url = auctionService.getAuctionPhotoUrl(auction.id, auction.photoId[0]);
      setPhotoUrl(url);
    }

    // Load seller details
    await loadSellerDetails();
  };

  const loadSellerDetails = async () => {
    try {
      // If auction already has full seller object
      if (auction.seller && typeof auction.seller === 'object') {
        setSellerDetails(auction.seller);
        return;
      }
      
      // If auction has sellerId, fetch seller
      const sellerId = auction.sellerId || auction.seller;
      if (sellerId) {
        const seller = await userService.getUserById(sellerId);
        setSellerDetails(seller);
      } else {
        setSellerDetails(null);
      }
    } catch (error) {
      console.error('Error loading seller details:', error);
      setSellerDetails(null);
    }
  };

  const formatPrice = (price) => {
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#4ade80';
      case 'pending': return '#fbbf24';
      case 'ended': return '#ef4444';
      default: return '#666';
    }
  };

  const getSellerName = () => {
    if (!sellerDetails) return 'Unknown Seller';
    return `${sellerDetails.firstname || ''} ${sellerDetails.lastname || ''}`.trim() || sellerDetails.email || 'Unknown';
  };

  const getSellerInitial = () => {
    if (!sellerDetails) return 'U';
    const name = sellerDetails.firstname || sellerDetails.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <ThemedCard style={styles.card} elevated>
        <View style={styles.imageContainer}>
          {photoUrl ? (
            <Image 
              source={{ uri: photoUrl }} 
              style={styles.auctionImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="image" size={40} color="#ccc" />
            </View>
          )}
          
          <View style={styles.topBadges}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(auction.status) }]}>
              <ThemedText style={styles.statusText}>
                {auction.status || 'Active'}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.bidCountBadge}>
            <Ionicons name="people" size={14} color="#fff" />
            <ThemedText style={styles.bidCountText}>
              {auction.bidders ? Object.keys(auction.bidders).length : 0}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <ThemedText title style={styles.auctionTitle} numberOfLines={1}>
            {auction.title || 'Untitled Auction'}
          </ThemedText>
          
          <ThemedText style={styles.auctionDescription} numberOfLines={2}>
            {auction.description || 'No description available'}
          </ThemedText>
          
          <View style={styles.priceContainer}>
            <View>
              <ThemedText style={styles.startingPriceLabel}>
                Starting Price
              </ThemedText>
              <ThemedText title style={styles.startingPrice}>
                {formatPrice(auction.startingPrice)}
              </ThemedText>
            </View>
            
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <ThemedText style={styles.timeText}>
                {auction.timeLeft || '24h left'}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.sellerContainer}>
            <View style={styles.sellerAvatar}>
              <ThemedText style={styles.sellerInitial}>
                {getSellerInitial()}
              </ThemedText>
            </View>
            <View style={styles.sellerInfo}>
              <ThemedText style={styles.sellerLabel}>
                Seller
              </ThemedText>
              <ThemedText style={styles.sellerName} numberOfLines={1}>
                {getSellerName()}
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
};

export default AuctionCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  auctionImage: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBadges: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(104, 73, 167, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  bidCountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bidCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsContainer: {
    paddingHorizontal: 5,
  },
  auctionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  auctionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 15,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  startingPriceLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  startingPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.8,
    marginLeft: 4,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '600',
  },
});