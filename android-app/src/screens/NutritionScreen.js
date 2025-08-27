import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const NutritionScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('plans');

  const nutritionPlans = [
    {
      id: 1,
      name: 'Weight Loss Plan',
      duration: '30 days',
      calories: '1500',
      isPremium: false,
      price: 'FREE'
    },
    {
      id: 2,
      name: 'Muscle Building Plan',
      duration: '30 days',
      calories: '2500',
      isPremium: true,
      price: '$24.99'
    },
    {
      id: 3,
      name: 'Athlete Performance',
      duration: '30 days',
      calories: '3000',
      isPremium: true,
      price: '$29.99'
    }
  ];

  const mealPlans = [
    {
      id: 1,
      name: 'Breakfast Boost',
      type: 'Breakfast',
      calories: '400',
      isPremium: false
    },
    {
      id: 2,
      name: 'Power Lunch',
      type: 'Lunch',
      calories: '600',
      isPremium: false
    },
    {
      id: 3,
      name: 'Elite Dinner',
      type: 'Dinner',
      calories: '500',
      isPremium: true,
      price: '$4.99'
    }
  ];

  const handlePlanSelect = (plan) => {
    if (plan.isPremium) {
      navigation.navigate('Payment', { 
        feature: { 
          title: plan.name, 
          price: plan.price,
          type: 'nutrition'
        } 
      });
    } else {
      navigation.navigate('NutritionDetail', { plan });
    }
  };

  const handleConsultation = () => {
    navigation.navigate('Payment', { 
      feature: { 
        title: 'Nutrition Consultation', 
        price: '$49',
        type: 'consultation'
      } 
    });
  };

  const handleCreateMeal = () => {
    navigation.navigate('CreateMeal');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      
      {/* Header */}
      <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
        <Text style={styles.headerTitle}>Nutrition</Text>
        <Text style={styles.headerSubtitle}>Fuel your fitness journey</Text>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCreateMeal}
          >
            <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.actionGradient}>
              <Icon name="add" size={24} color="white" />
              <Text style={styles.actionText}>Create Meal</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleConsultation}
          >
            <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.actionGradient}>
              <Icon name="person" size={24} color="white" />
              <Text style={styles.actionText}>Get Consultation</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.section}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'plans' && styles.activeTab]}
            onPress={() => setSelectedTab('plans')}
          >
            <Text style={[styles.tabText, selectedTab === 'plans' && styles.activeTabText]}>
              Nutrition Plans
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'meals' && styles.activeTab]}
            onPress={() => setSelectedTab('meals')}
          >
            <Text style={[styles.tabText, selectedTab === 'meals' && styles.activeTabText]}>
              Meal Plans
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nutrition Plans */}
      {selectedTab === 'plans' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Plans</Text>
          <Text style={styles.sectionSubtitle}>Personalized nutrition guidance</Text>
          
          {nutritionPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, plan.isPremium && styles.premiumCard]}
              onPress={() => handlePlanSelect(plan)}
            >
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="schedule" size={16} color="#666" />
                    <Text style={styles.metaText}>{plan.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="local-fire-department" size={16} color="#666" />
                    <Text style={styles.metaText}>{plan.calories} cal</Text>
                  </View>
                </View>
              </View>
              <View style={styles.planAction}>
                <Text style={[
                  styles.planPrice,
                  !plan.isPremium && styles.freeText
                ]}>
                  {plan.price}
                </Text>
                {plan.isPremium ? (
                  <Icon name="lock" size={24} color="#FF6B35" />
                ) : (
                  <Icon name="check-circle" size={24} color="#4CAF50" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Meal Plans */}
      {selectedTab === 'meals' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Plans</Text>
          <Text style={styles.sectionSubtitle}>Daily nutrition breakdown</Text>
          
          {mealPlans.map((meal) => (
            <TouchableOpacity
              key={meal.id}
              style={[styles.mealCard, meal.isPremium && styles.premiumCard]}
              onPress={() => handlePlanSelect(meal)}
            >
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <View style={styles.mealMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="restaurant" size={16} color="#666" />
                    <Text style={styles.metaText}>{meal.type}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="local-fire-department" size={16} color="#666" />
                    <Text style={styles.metaText}>{meal.calories} cal</Text>
                  </View>
                </View>
              </View>
              <View style={styles.mealAction}>
                {meal.isPremium ? (
                  <>
                    <Text style={styles.mealPrice}>{meal.price}</Text>
                    <Icon name="lock" size={24} color="#FF6B35" />
                  </>
                ) : (
                  <>
                    <Text style={styles.freeText}>FREE</Text>
                    <Icon name="check-circle" size={24} color="#4CAF50" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Upgrade Prompt */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.upgradeCard}
          onPress={() => navigation.navigate('Payment')}
        >
          <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.upgradeGradient}>
            <Icon name="restaurant" size={32} color="white" />
            <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
            <Text style={styles.upgradeDesc}>Access premium nutrition plans</Text>
            <Text style={styles.upgradePrice}>Starting at $9.99/month</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Money-Making Opportunities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💸 Earn Money with Nutrition</Text>
        
        <View style={styles.earnCard}>
          <Icon name="restaurant" size={24} color="#2196F3" />
          <Text style={styles.earnTitle}>Create Meal Plans</Text>
          <Text style={styles.earnDesc}>Design and sell custom nutrition plans</Text>
          <Text style={styles.earnAmount}>Earn $24.99 per plan</Text>
          <TouchableOpacity 
            style={styles.earnButton}
            onPress={() => navigation.navigate('TrainerSignup')}
          >
            <Text style={styles.earnButtonText}>Start Creating</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.earnCard}>
          <Icon name="people" size={24} color="#2196F3" />
          <Text style={styles.earnTitle}>Nutrition Consultation</Text>
          <Text style={styles.earnDesc}>Offer 1-on-1 nutrition advice</Text>
          <Text style={styles.earnAmount}>Earn $49 per session</Text>
          <TouchableOpacity 
            style={styles.earnButton}
            onPress={() => navigation.navigate('TrainerSignup')}
          >
            <Text style={styles.earnButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nutrition Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Nutrition</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1850</Text>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statPeriod}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>120g</Text>
            <Text style={styles.statLabel}>Protein</Text>
            <Text style={styles.statPeriod}>Target</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>65g</Text>
            <Text style={styles.statLabel}>Fat</Text>
            <Text style={styles.statPeriod}>Target</Text>
          </View>
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
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  actionButton: {
    flex: 1,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  planMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  planAction: {
    alignItems: 'center',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  freeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  mealCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  mealMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  mealAction: {
    alignItems: 'center',
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  upgradeCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  upgradeGradient: {
    padding: 25,
    alignItems: 'center',
  },
  upgradeTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  upgradeDesc: {
    color: 'white',
    opacity: 0.9,
    marginBottom: 10,
  },
  upgradePrice: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  earnCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  earnDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  earnAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  earnButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  earnButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statPeriod: {
    fontSize: 12,
    color: '#666',
  },
});

export default NutritionScreen;
