import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const userStats = {
    workoutsCompleted: 45,
    totalCalories: 12500,
    currentStreak: 12,
    level: 'Gold',
    points: 2840
  };

  const achievements = [
    { id: 1, name: 'First Workout', icon: 'fitness-center', unlocked: true },
    { id: 2, name: '7-Day Streak', icon: 'whatshot', unlocked: true },
    { id: 3, name: '1000 Calories', icon: 'local-fire-department', unlocked: true },
    { id: 4, name: 'Premium Member', icon: 'star', unlocked: false },
    { id: 5, name: 'Trainer Certified', icon: 'school', unlocked: false }
  ];

  const earningHistory = [
    { id: 1, type: 'Referral Bonus', amount: 5.00, date: '2024-01-15' },
    { id: 2, type: 'Workout Plan Sale', amount: 19.99, date: '2024-01-10' },
    { id: 3, type: 'Trainer Session', amount: 75.00, date: '2024-01-05' }
  ];

  const handleUpgrade = () => {
    navigation.navigate('Payment');
  };

  const handleBecomeTrainer = () => {
    navigation.navigate('TrainerSignup');
  };

  const handleReferral = () => {
    navigation.navigate('ReferralProgram');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#9C27B0" />
      
      {/* Header */}
      <LinearGradient colors={['#9C27B0', '#7B1FA2']} style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100x100' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatar}>
              <Icon name="edit" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@email.com</Text>
            <View style={styles.levelBadge}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.levelText}>{userStats.level} Level</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.section}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.workoutsCompleted}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.totalCalories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.section}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'earnings' && styles.activeTab]}
            onPress={() => setSelectedTab('earnings')}
          >
            <Text style={[styles.tabText, selectedTab === 'earnings' && styles.activeTabText]}>
              Earnings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'achievements' && styles.activeTab]}
            onPress={() => setSelectedTab('achievements')}
          >
            <Text style={[styles.tabText, selectedTab === 'achievements' && styles.activeTabText]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleUpgrade}
            >
              <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.actionGradient}>
                <Icon name="star" size={24} color="white" />
                <Text style={styles.actionTitle}>Upgrade to Pro</Text>
                <Text style={styles.actionDesc}>Unlock premium features</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleBecomeTrainer}
            >
              <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.actionGradient}>
                <Icon name="person" size={24} color="white" />
                <Text style={styles.actionTitle}>Become Trainer</Text>
                <Text style={styles.actionDesc}>Start earning money</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleReferral}
            >
              <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.actionGradient}>
                <Icon name="share" size={24} color="white" />
                <Text style={styles.actionTitle}>Refer Friends</Text>
                <Text style={styles.actionDesc}>Earn $5 per referral</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Settings')}
            >
              <LinearGradient colors={['#9C27B0', '#7B1FA2']} style={styles.actionGradient}>
                <Icon name="settings" size={24} color="white" />
                <Text style={styles.actionTitle}>Settings</Text>
                <Text style={styles.actionDesc}>Customize your app</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Earnings Tab */}
      {selectedTab === 'earnings' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earning History</Text>
          
          <View style={styles.earningsSummary}>
            <View style={styles.earningCard}>
              <Text style={styles.earningLabel}>Total Earned</Text>
              <Text style={styles.earningAmount}>$99.99</Text>
              <Text style={styles.earningPeriod}>This Month</Text>
            </View>
          </View>
          
          {earningHistory.map((earning) => (
            <View key={earning.id} style={styles.earningItem}>
              <View style={styles.earningInfo}>
                <Text style={styles.earningType}>{earning.type}</Text>
                <Text style={styles.earningDate}>{earning.date}</Text>
              </View>
              <Text style={styles.earningValue}>+${earning.amount}</Text>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.withdrawButton}
            onPress={() => navigation.navigate('Withdraw')}
          >
            <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.withdrawGradient}>
              <Text style={styles.withdrawText}>Withdraw Earnings</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Achievements</Text>
          
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.lockedIcon
                ]}>
                  <Icon 
                    name={achievement.icon} 
                    size={32} 
                    color={achievement.unlocked ? '#4CAF50' : '#ccc'} 
                  />
                </View>
                <Text style={[
                  styles.achievementName,
                  !achievement.unlocked && styles.lockedText
                ]}>
                  {achievement.name}
                </Text>
                {achievement.unlocked && (
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Money-Making Opportunities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💸 More Ways to Earn</Text>
        
        <View style={styles.earnCard}>
          <Icon name="fitness-center" size={24} color="#9C27B0" />
          <Text style={styles.earnTitle}>Create & Sell Workouts</Text>
          <Text style={styles.earnDesc}>Design custom workout plans and earn money</Text>
          <Text style={styles.earnAmount}>Earn $19.99 per plan</Text>
          <TouchableOpacity 
            style={styles.earnButton}
            onPress={handleBecomeTrainer}
          >
            <Text style={styles.earnButtonText}>Start Creating</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.earnCard}>
          <Icon name="restaurant" size={24} color="#9C27B0" />
          <Text style={styles.earnTitle}>Nutrition Consultation</Text>
          <Text style={styles.earnDesc}>Offer personalized nutrition advice</Text>
          <Text style={styles.earnAmount}>Earn $49 per session</Text>
          <TouchableOpacity 
            style={styles.earnButton}
            onPress={handleBecomeTrainer}
          >
            <Text style={styles.earnButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Statistics</Text>
        <View style={styles.profileStats}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>45</Text>
            <Text style={styles.profileStatLabel}>Total Workouts</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>12</Text>
            <Text style={styles.profileStatLabel}>Current Streak</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>2840</Text>
            <Text style={styles.profileStatLabel}>Total Points</Text>
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
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    color: 'white',
    opacity: 0.9,
    marginBottom: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
    backgroundColor: '#9C27B0',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  actionCard: {
    width: '48%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
  },
  actionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  actionDesc: {
    color: 'white',
    opacity: 0.9,
    fontSize: 12,
    textAlign: 'center',
  },
  earningsSummary: {
    marginBottom: 20,
  },
  earningCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  earningAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  earningPeriod: {
    fontSize: 14,
    color: '#666',
  },
  earningItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
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
  earningInfo: {
    flex: 1,
  },
  earningType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  earningDate: {
    fontSize: 14,
    color: '#666',
  },
  earningValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  withdrawButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
  },
  withdrawGradient: {
    padding: 20,
    alignItems: 'center',
  },
  withdrawText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  achievementCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  lockedIcon: {
    backgroundColor: '#F0F0F0',
  },
  achievementName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  lockedText: {
    color: '#ccc',
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
    backgroundColor: '#9C27B0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  earnButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  profileStat: {
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
  profileStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 5,
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProfileScreen;
