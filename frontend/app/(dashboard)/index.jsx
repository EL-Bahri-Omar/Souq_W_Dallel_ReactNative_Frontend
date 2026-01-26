import { StyleSheet, View, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedCard from '../../components/ThemedCard';
import Spacer from '../../components/Spacer';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../constants/Colors';

const DashboardHome = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { user } = useAuth();

  return (
    <ThemedView safe style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.navBackground }]}>
          <ThemedText title style={styles.headerTitle}>
            Welcome
          </ThemedText>
          <ThemedText style={styles.welcomeText}>
            Hello, {user?.email?.split('@')[0] || 'User'}!
          </ThemedText>
        </View>

        <View style={styles.content}>
          {/* Welcome Card */}
          <ThemedCard style={styles.welcomeCard}>
            <Ionicons name="home" size={40} color={Colors.primary} />
            <ThemedText title style={styles.welcomeCardTitle}>
              Your Dashboard
            </ThemedText>
            <ThemedText style={styles.welcomeCardText}>
              This is your personal dashboard. Use the tabs below to navigate.
            </ThemedText>
          </ThemedCard>

          <Spacer height={30} />

          {/* Quick Info */}
          <ThemedCard style={styles.infoCard}>
            <ThemedText title style={styles.sectionTitle}>
              Account Summary
            </ThemedText>
            
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Email:</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.email || 'N/A'}</ThemedText>
            </View>
            
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Status:</ThemedText>
              <View style={styles.statusBadge}>
                <ThemedText style={styles.statusText}>Active</ThemedText>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Access Level:</ThemedText>
              <ThemedText style={styles.infoValue}>User</ThemedText>
            </View>
          </ThemedCard>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default DashboardHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    height: 160,
    justifyContent: 'flex-end',
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.9,
  },
  content: {
    padding: 20,
    marginTop: -30,
  },
  welcomeCard: {
    padding: 25,
    alignItems: 'center',
  },
  welcomeCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeCardText: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    padding: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.6,
  },
});