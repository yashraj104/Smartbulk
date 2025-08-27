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

const WorkoutScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const workoutCategories = [
    { id: 'all', name: 'All', icon: 'fitness-center' },
    { id: 'strength', name: 'Strength', icon: 'fitness-center' },
    { id: 'cardio', name: 'Cardio', icon: 'directions-run' },
    { id: 'yoga', name: 'Yoga', icon: 'self-improvement' },
    { id: 'hiit', name: 'HIIT', icon: 'timer' }
  ];

  const freeWorkouts = [
    {
      id: 1,
      name: 'Beginner Full Body',
      duration: '20 min',
      difficulty: 'Beginner',
      category: 'strength',
      isPremium: false
    },
    {
      id: 2,
      name: 'Quick Cardio',
      duration: '15 min',
      difficulty: 'Beginner',
      category: 'cardio',
      isPremium: false
    }
  ];

  const premiumWorkouts = [
    {
      id: 3,
      name: 'Advanced Strength Training',
      duration: '45 min',
      difficulty: 'Advanced',
      category: 'strength',
      isPremium: true,
      price: '$19.99'
    },
    {
      id: 4,
      name: 'HIIT Fat Burner',
      duration: '30 min',
      difficulty: 'Intermediate',
      category: 'hiit',
      isPremium: true,
      price: '$14.99'
    },
    {
      id: 5,
      name: 'Power Yoga Flow',
      duration: '40 min',
      difficulty: 'Intermediate',
      category: 'yoga',
      isPremium: true,
      price: '$12.99'
    }
  ];

  const handleWorkoutSelect = (workout) => {
    if (workout.isPremium) {
      navigation.navigate('Payment', { 
        feature: { 
          title: workout.name, 
          price: workout.price,
          type: 'workout'
        } 
      });
    } else {
      navigation.navigate('WorkoutDetail', { workout });
    }
  };

  const handleCreateWorkout = () => {
    navigation.navigate('CreateWorkout');
  };

  const handleTrainerWorkout = () => {
    navigation.navigate('TrainerWorkouts');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.header}>
        <Text style={styles.headerTitle}>Workouts</Text>
        <Text style={styles.headerSubtitle}>Choose your fitness journey</Text>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCreateWorkout}
          >
            <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.actionGradient}>
              <Icon name="add" size={24} color="white" />
              <Text style={styles.actionText}>Create Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleTrainerWorkout}
          >
            <LinearGradient colors={['#9C27B0', '#7B1FA2']} style={styles.actionGradient}>
              <Icon name="person" size={24} color="white" />
              <Text style={styles.actionText}>Trainer Workouts</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {workoutCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? 'white' : '#666'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Free Workouts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Free Workouts</Text>
        <Text style={styles.sectionSubtitle}>Start your fitness journey</Text>
        
        {freeWorkouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutCard}
            onPress={() => handleWorkoutSelect(workout)}
          >
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <View style={styles.workoutMeta}>
                <View style={styles.metaItem}>
                  <Icon name="schedule" size={16} color="#666" />
                  <Text style={styles.metaText}>{workout.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="star" size={16} color="#666" />
                  <Text style={styles.metaText}>{workout.difficulty}</Text>
                </View>
              </View>
            </View>
            <View style={styles.workoutAction}>
              <Text style={styles.freeText}>FREE</Text>
              <Icon name="play-arrow" size={24} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Premium Workouts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium Workouts</Text>
        <Text style={styles.sectionSubtitle}>Unlock advanced training</Text>
        
        {premiumWorkouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={[styles.workoutCard, styles.premiumCard]}
            onPress={() => handleWorkoutSelect(workout)}
          >
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <View style={styles.workoutMeta}>
                <View style={styles.metaItem}>
                  <Icon name="schedule" size={16} color="#666" />
                  <Text style={styles.metaText}>{workout.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="star" size={16} color="#666" />
                  <Text style={styles.metaText}>{workout.difficulty}</Text>
                </View>
              </View>
            </View>
            <View style={styles.workoutAction}>
              <Text style={styles.premiumPrice}>{workout.price}</Text>
              <Icon name="lock" size={24} color="#FF6B35" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upgrade Prompt */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.upgradeCard}
          onPress={() => navigation.navigate('Payment')}
        >
          <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.upgradeGradient}>
            <Icon name="star" size={32} color="white" />
            <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
            <Text style={styles.upgradeDesc}>Access 500+ premium workouts</Text>
            <Text style={styles.upgradePrice}>Starting at $9.99/month</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Money-Making Opportunities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💸 Earn Money with Workouts</Text>
        
        <View style={styles.earnCard}>
          <Icon name="fitness-center" size={24} color="#4CAF50" />
          <Text style={styles.earnTitle}>Sell Your Workouts</Text>
          <Text style={styles.earnDesc}>Create and sell custom workout plans</Text>
          <Text style={styles.earnAmount}>Earn $19.99 per plan</Text>
          <TouchableOpacity 
            style={styles.earnButton}
            onPress={() => navigation.navigate('TrainerSignup')}
          >
            <Text style={styles.earnButtonText}>Start Creating</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.earnCard}>
          <Icon name="people" size={24} color="#4CAF50" />
          <Text style={styles.earnTitle}>Become a Trainer</Text>
          <Text style={styles.earnDesc}>Offer personal training sessions</Text>
          <Text style={styles.earnAmount}>Earn $50-100 per session</Text>
          <TouchableOpacity 
            style={styles.earnButton}
            onPress={() => navigation.navigate('TrainerSignup')}
          >
            <Text style={styles.earnButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Workout Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Workouts</Text>
            <Text style={styles.statPeriod}>This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2840</Text>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statPeriod}>Burned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Day</Text>
            <Text style={styles.statPeriod}>Streak</Text>
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
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategoryChip: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    color: '#666',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  selectedCategoryText: {
    color: 'white',
  },
  workoutCard: {
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
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  workoutMeta: {
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
  workoutAction: {
    alignItems: 'center',
  },
  freeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  premiumPrice: {
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
    backgroundColor: '#4CAF50',
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
    color: '#4CAF50',
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

export default WorkoutScreen;
