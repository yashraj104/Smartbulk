import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userStats, setUserStats] = useState({
    workoutsCompleted: 12,
    caloriesBurned: 2840,
    streak: 5,
    level: 'Bronze'
  });

  const [premiumFeatures, setPremiumFeatures] = useState([
    {
      id: 1,
      title: 'AI Personal Trainer',
      description: 'Get personalized workout plans',
      price: '$9.99/month',
      icon: 'smart-toy',
      popular: true
    },
    {
      id: 2,
      title: 'Premium Workouts',
      description: 'Access to 500+ exclusive workouts',
      price: '$19.99',
      icon: 'fitness-center',
      popular: false
    },
    {
      id: 3,
      title: 'Nutrition Coach',
      description: '1-on-1 consultation with experts',
      price: '$49/session',
      icon: 'restaurant',
      popular: false
    }
  ]);

  const handlePremiumUpgrade = (feature) => {
    Alert.alert(
      'Upgrade to Premium',
      `Unlock ${feature.title} for ${feature.price}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upgrade Now', 
          onPress: () => navigation.navigate('Payment', { feature }) 
        }
      ]
    );
  };

  const handleTrainerHire = () => {
    navigation.navigate('TrainerMarketplace');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      
      {/* Header with Premium Badge */}
      <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userLevel}>{userStats.level} Level</Text>
          </View>
          <TouchableOpacity 
            style={styles.premiumBadge}
            onPress={() => navigation.navigate('Premium')}
          >
            <Icon name="star" size={20} color="#FFD700" />
            <Text style={styles.premiumText}>PRO</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="fitness-center" size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>{userStats.workoutsCompleted}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="local-fire-department" size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>{userStats.caloriesBurned}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="whatshot" size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>{userStats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Premium Features Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Unlock Premium Features</Text>
          <Text style={styles.sectionSubtitle}>Start earning money with fitness</Text>
        </View>
        
        {premiumFeatures.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[styles.premiumCard, feature.popular && styles.popularCard]}
            onPress={() => handlePremiumUpgrade(feature)}
          >
            {feature.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            )}
            <View style={styles.premiumCardContent}>
              <Icon name={feature.icon} size={32} color="#FF6B35" />
              <View style={styles.premiumCardText}>
                <Text style={styles.premiumCardTitle}>{feature.title}</Text>
                <Text style={styles.premiumCardDesc}>{feature.description}</Text>
              </View>
              <View style={styles.premiumCardPrice}>
                <Text style={styles.priceText}>{feature.price}</Text>
                <Icon name="arrow-forward" size={20} color="#FF6B35" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('WorkoutPlanner')}
          >
            <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.actionGradient}>
              <Icon name="fitness-center" size={24} color="white" />
              <Text style={styles.actionText}>Start Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('FoodLogger')}
          >
            <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.actionGradient}>
              <Icon name="restaurant" size={24} color="white" />
              <Text style={styles.actionText}>Log Food</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.trainerButton}
          onPress={handleTrainerHire}
        >
          <LinearGradient colors={['#9C27B0', '#7B1FA2']} style={styles.trainerGradient}>
            <Icon name="person" size={24} color="white" />
            <Text style={styles.trainerText}>Hire Personal Trainer</Text>
            <Text style={styles.trainerSubtext}>Earn 20% commission on referrals</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Money-Making Opportunities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💸 Make Money with Fitness</Text>
        <View style={styles.moneyCards}>
          <View style={styles.moneyCard}>
            <Icon name="share" size={24} color="#4CAF50" />
            <Text style={styles.moneyTitle}>Refer Friends</Text>
            <Text style={styles.moneyDesc}>Get $5 for each friend who subscribes</Text>
            <Text style={styles.moneyAmount}>+$5 per referral</Text>
          </View>
          
          <View style={styles.moneyCard}>
            <Icon name="people" size={24} color="#FF9800" />
            <Text style={styles.moneyTitle}>Become a Trainer</Text>
            <Text style={styles.moneyDesc}>Earn $50-100 per session</Text>
            <Text style={styles.moneyAmount}>+$50-100/session</Text>
          </View>
          
          <View style={styles.moneyCard}>
            <Icon name="shopping-cart" size={24} color="#2196F3" />
            <Text style={styles.moneyTitle}>Equipment Sales</Text>
            <Text style={styles.moneyDesc}>15% commission on fitness gear</Text>
            <Text style={styles.moneyAmount}>+15% commission</Text>
          </View>
        </View>
      </View>

      {/* Today's Goal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Goal</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalProgress}>
            <Text style={styles.goalText}>Complete 1 Workout</Text>
            <Text style={styles.goalProgressText}>0/1 completed</Text>
          </View>
          <TouchableOpacity style={styles.goalButton}>
            <Text style={styles.goalButtonText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  userName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  userLevel: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  premiumCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  popularCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    zIndex: 1,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  premiumCardText: {
    flex: 1,
    marginLeft: 15,
  },
  premiumCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  premiumCardDesc: {
    fontSize: 14,
    color: '#666',
  },
  premiumCardPrice: {
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  actionGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
  },
  trainerButton: {
    marginTop: 10,
  },
  trainerGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  trainerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  trainerSubtext: {
    color: 'white',
    opacity: 0.9,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  moneyCards: {
    gap: 15,
  },
  moneyCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moneyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  moneyDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  moneyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  goalCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalProgress: {
    flex: 1,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  goalProgressText: {
    fontSize: 14,
    color: '#666',
  },
  goalButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  goalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
