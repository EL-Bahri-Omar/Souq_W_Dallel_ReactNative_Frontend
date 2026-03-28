import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedCard from "../../components/ThemedCard";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../constants/Colors";
import AuthGuard from "../../components/auth/AuthGuard";

const TransporterInfo = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { user } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <AuthGuard userOnly allowedRoles={["TRANSPORTER"]} redirectTo="/">
      <ThemedView safe style={styles.container}>
        <LinearGradient
          colors={[Colors.primary, "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle}>Transporteur</ThemedText>
            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/profile")}
              style={styles.profileButton}
            >
              <Ionicons name="person-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ThemedCard style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="car" size={48} color={Colors.primary} />
            </View>
            <ThemedText style={styles.infoTitle}>
              Bienvenue sur votre espace transporteur
            </ThemedText>
            <ThemedText style={styles.infoText}>
              Vous êtes enregistré en tant que transporteur. Vous pouvez gérer
              vos livraisons depuis l'onglet "Livraisons" en bas de l'écran ou
              depuis le menu latéral.
            </ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="cube" size={48} color="#fbbf24" />
            </View>
            <ThemedText style={styles.infoTitle}>
              Comment ça fonctionne ?
            </ThemedText>
            <ThemedText style={styles.infoText}>
              1. Les administrateurs vous assignent des colis à livrer{"\n"}
              2. Vous pouvez voir tous vos colis assignés dans "Mes livraisons"
              {"\n"}
              3. Une fois le colis livré, confirmez la livraison{"\n"}
              4. L'acheteur pourra évaluer la qualité du produit
            </ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="information-circle" size={48} color="#3b82f6" />
            </View>
            <ThemedText style={styles.infoTitle}>
              Informations importantes
            </ThemedText>
            <ThemedText style={styles.infoText}>
              • Assurez-vous de vérifier l'adresse de collecte et de destination
              avant de partir{"\n"}• En cas de problème avec le colis, contactez
              l'administrateur{"\n"}• La confirmation de livraison est
              définitive
            </ThemedText>
          </ThemedCard>

          <TouchableOpacity
            style={styles.goToParcelsButton}
            onPress={() => router.push("/parcels")}
          >
            <LinearGradient
              colors={[Colors.primary, "#764ba2"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="cube" size={24} color="#fff" />
              <ThemedText style={styles.buttonText}>
                Voir mes livraisons
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </AuthGuard>
  );
};

export default TransporterInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  infoIcon: {
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
  },
  goToParcelsButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
