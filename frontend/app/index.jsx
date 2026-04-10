import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants/ThemeContext";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import AuctionCard from "../components/AuctionCard";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchAllAuctions } from "../store/slices/auctionSlice";
import { fetchUserById } from "../store/slices/userSlice";
import { Colors } from "../constants/Colors";
import { userService } from "../store/services/userService";

const categories = [
  { id: "all", label: "Toutes", icon: "apps-outline" },
  { id: "electronics", label: "Électronique", icon: "tv-outline" },
  { id: "furniture", label: "Meubles", icon: "bed-outline" },
  { id: "vehicles", label: "Véhicules", icon: "car-outline" },
  { id: "real-estate", label: "Immobilier", icon: "home-outline" },
  { id: "collectibles", label: "Collection", icon: "albums-outline" },
  { id: "art", label: "Art", icon: "color-palette-outline" },
  { id: "jewelry", label: "Bijoux", icon: "diamond-outline" },
  { id: "clothing", label: "Vêtements", icon: "shirt-outline" },
  { id: "sports", label: "Sports", icon: "basketball-outline" },
  { id: "general", label: "Général", icon: "apps-outline" },
];

const Home = () => {
  const router = useRouter();
  const { colorScheme, toggleTheme, isDark } = useTheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { user: authUser } = useAuth();
  const dispatch = useAppDispatch();
  const { auctions, loading } = useAppSelector((state) => state.auction);
  const { user: userData } = useAppSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [photoRefreshing, setPhotoRefreshing] = useState(false);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);

  useEffect(() => {
    loadAuctions();
    if (authUser?.id) {
      loadUserData();
    }
  }, []);

  useEffect(() => {
    if (userData?.photoId) {
      loadUserPhoto();
    } else {
      setUserPhotoUrl(null);
    }
  }, [userData?.photoId, userData?.id]);

  const loadUserData = async () => {
    try {
      await dispatch(fetchUserById(authUser.id)).unwrap();
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadUserPhoto = async () => {
    if (!userData?.photoId) {
      setUserPhotoUrl(null);
      return;
    }

    try {
      setPhotoRefreshing(true);
      const photoUrl = `${userService.getUserPhotoUrl(userData.id, userData.photoId)}?t=${Date.now()}`;
      setUserPhotoUrl(photoUrl);
    } catch (error) {
      console.error("Error loading user photo:", error);
      setUserPhotoUrl(null);
    } finally {
      setPhotoRefreshing(false);
    }
  };

  const loadAuctions = async () => {
    try {
      await dispatch(fetchAllAuctions()).unwrap();
    } catch (error) {
      console.error("Error loading auctions:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAuctions();
    if (authUser?.id) {
      await loadUserData();
    }
    setRefreshing(false);
  };

  const filteredAuctions = auctions.filter((auction) => {
    const matchesSearch =
      searchQuery === "" ||
      auction.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || auction.category === selectedCategory;

    // Show all auctions EXCEPT pending ones
    const isNotPending = auction.status?.toLowerCase() !== "pending";
    const isNotWaitingForPayment =
      auction.status?.toLowerCase() !== "waiting for payment";

    // Status filter
    const now = new Date();
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && auction.status === "active" && new Date(auction.expireDate) > now) ||
      (selectedStatus === "ended" && (auction.status === "ended" || new Date(auction.expireDate) <= now));

    return (
      matchesSearch && matchesCategory && isNotPending && isNotWaitingForPayment && matchesStatus
    );
  });

  const displayName =
    userData?.firstname || userData?.lastname
      ? `${userData.firstname || ""} ${userData.lastname || ""}`.trim()
      : authUser?.email?.split("@")[0] || "Utilisateur";

  return (
    <ThemedView safe style={styles.container}>
      {/* Left Sidebar Menu */}
      <LeftSidebar
        visible={leftSidebarVisible}
        onClose={() => setLeftSidebarVisible(false)}
      />

      {/* Right Sidebar Filters */}
      <RightSidebar
        visible={rightSidebarVisible}
        onClose={() => setRightSidebarVisible(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.navBackground }]}>
        <View style={styles.headerLeft}>
          {/* Menu Button */}
          <TouchableOpacity
            onPress={() => setLeftSidebarVisible(true)}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={28} color={Colors.primary} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Ionicons name="hammer" size={22} color={Colors.primary} />
            <View style={styles.appNameContainer}>
              <ThemedText title style={styles.appNameLine}>Souq</ThemedText>
              <ThemedText title style={styles.appNameLine}>w</ThemedText>
              <ThemedText title style={styles.appNameLine}>Dallel</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push("/(dashboard)/profile")}
          >
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName} numberOfLines={1}>
                {displayName}
              </ThemedText>
            </View>

            <View style={styles.photoContainer}>
              {userPhotoUrl && !photoRefreshing ? (
                <Image
                  source={{ uri: userPhotoUrl }}
                  style={styles.profilePhoto}
                  onError={() => setUserPhotoUrl(null)}
                />
              ) : (
                <LinearGradient
                  colors={[Colors.primary, "#764ba2"]}
                  style={styles.defaultPhoto}
                >
                  {photoRefreshing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <ThemedText style={styles.defaultPhotoText}>
                      {displayName.charAt(0).toUpperCase()}
                    </ThemedText>
                  )}
                </LinearGradient>
              )}
            </View>
          </TouchableOpacity>

          {/* Theme Toggle */}
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: theme.uiBackground }]}
            onPress={toggleTheme}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={18}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filter Row */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des enchères..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setRightSidebarVisible(true)}
        >
          <Ionicons name="options-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Auctions List */}
      <FlatList
        data={filteredAuctions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AuctionCard
            auction={item}
            onPress={() => router.push(`/auction-details/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.auctionsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="hammer" size={60} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              Aucune enchère trouvée
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              {loading ? "Chargement..." : "Soyez le premier à en créer une !"}
            </ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    padding: 5,
    marginRight: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appNameContainer: {
    marginLeft: 4,
  },
  appNameLine: {
    fontSize: 7,
    fontWeight: "bold",
    color: Colors.primary,
    lineHeight: 8,
    textAlign: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeToggle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "flex-end",
    marginRight: 10,
    maxWidth: 120,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "600",
  },
  photoContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
  },
  defaultPhoto: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultPhotoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  auctionsList: {
    padding: 20,
    paddingTop: 3,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});
