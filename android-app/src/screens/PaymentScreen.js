import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const PaymentScreen = ({ navigation, route }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedPayment, setSelectedPayment] = useState('card');

  const subscriptionPlans = [
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: 9.99,
      period: 'month',
      savings: 0,
      popular: false,
      features: [
        'AI Personal Trainer',
        'Premium Workouts (500+)',
        'Nutrition Tracking',
        'Progress Analytics',
        'Community Access'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Pro',
      price: 99.99,
      period: 'year',
      savings: 20,
      popular: true,
      features: [
        'Everything in Monthly',
        '2 Months Free',
        'Priority Support',
        'Exclusive Content',
        'Early Access Features'
      ]
    },
    {
      id: 'lifetime',
      name: 'Lifetime Pro',
      price: 299.99,
      period: 'one-time',
      savings: 75,
      popular: false,
      features: [
        'Everything Forever',
        'All Future Updates',
        'Premium Support',
        'Exclusive Merchandise',
        'VIP Community Access'
      ]
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'payment' },
    { id: 'apple', name: 'Apple Pay', icon: 'apple' },
    { id: 'google', name: 'Google Pay', icon: 'android' }
  ];

  const handleSubscribe = () => {
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    Alert.alert(
      'Confirm Subscription',
      `Subscribe to ${plan.name} for $${plan.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Subscribe Now', 
          onPress: () => {
            // Here you would integrate with payment gateway
            Alert.alert(
              'Success!',
              'Welcome to SmartBulk Pro! 🎉',
              [{ text: 'Start Training', onPress: () => navigation.navigate('Home') }]
            );
          }
        }
      ]
    );
  };

  const handleTrainerSignup = () => {
    navigation.navigate('TrainerSignup');
  };

  const handleAffiliateSignup = () => {
    navigation.navigate('AffiliateSignup');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      
      {/* Header */}
      <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <Text style={styles.headerSubtitle}>Start earning money with fitness</Text>
      </LinearGradient>

      {/* Money-Making Opportunities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💸 Multiple Ways to Earn</Text>
        <View style={styles.earnCards}>
          <TouchableOpacity 
            style={styles.earnCard}
            onPress={handleTrainerSignup}
          >
            <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.earnGradient}>
              <Icon name="person" size={32} color="white" />
              <Text style={styles.earnTitle}>Become a Trainer</Text>
              <Text style={styles.earnDesc}>Earn $50-100 per session</Text>
              <Text style={styles.earnAmount}>+$500-1000/month</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.earnCard}
            onPress={handleAffiliateSignup}
          >
            <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.earnGradient}>
              <Icon name="share" size={32} color="white" />
              <Text style={styles.earnTitle}>Affiliate Program</Text>
              <Text style={styles.earnDesc}>Refer friends & earn</Text>
              <Text style={styles.earnAmount}>+$5 per referral</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subscription Plans */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        <Text style={styles.sectionSubtitle}>Unlock premium features and start earning</Text>
        
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedPlan,
              plan.popular && styles.popularPlan
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            )}
            
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPeriod}>per {plan.period}</Text>
              </View>
              <View style={styles.planPrice}>
                <Text style={styles.priceSymbol}>$</Text>
                <Text style={styles.priceAmount}>{plan.price}</Text>
                {plan.savings > 0 && (
                  <Text style={styles.savingsText}>Save {plan.savings}%</Text>
                )}
              </View>
            </View>
            
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedPayment === method.id && styles.selectedPayment
            ]}
            onPress={() => setSelectedPayment(method.id)}
          >
            <Icon name={method.icon} size={24} color="#666" />
            <Text style={styles.paymentName}>{method.name}</Text>
            {selectedPayment === method.id && (
              <Icon name="check-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Subscribe Button */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        >
          <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.subscribeGradient}>
            <Text style={styles.subscribeText}>Subscribe Now</Text>
            <Text style={styles.subscribeSubtext}>
              {selectedPlan === 'monthly' && 'Cancel anytime'}
              {selectedPlan === 'yearly' && 'Save 20% with yearly plan'}
              {selectedPlan === 'lifetime' && 'One-time payment, lifetime access'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Additional Revenue Streams */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 More Ways to Earn</Text>
        
        <View style={styles.revenueCard}>
          <Icon name="fitness-center" size={24} color="#FF6B35" />
          <Text style={styles.revenueTitle}>Premium Workout Plans</Text>
          <Text style={styles.revenueDesc}>Sell your custom workout plans</Text>
          <Text style={styles.revenueAmount}>Earn $19.99 per plan</Text>
        </View>
        
        <View style={styles.revenueCard}>
          <Icon name="restaurant" size={24} color="#FF6B35" />
          <Text style={styles.revenueTitle}>Nutrition Consultation</Text>
          <Text style={styles.revenueDesc}>Offer 1-on-1 nutrition advice</Text>
          <Text style={styles.revenueAmount}>Earn $49 per session</Text>
        </View>
        
        <View style={styles.revenueCard}>
          <Icon name="shopping-cart" size={24} color="#FF6B35" />
          <Text style={styles.revenueTitle}>Equipment Sales</Text>
          <Text style={styles.revenueDesc}>Sell fitness equipment & earn commission</Text>
          <Text style={styles.revenueAmount}>Earn 15% commission</Text>
        </View>
      </View>

      {/* Money Calculator */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💰 Potential Monthly Earnings</Text>
        <View style={styles.earningsCalculator}>
          <View style={styles.earningRow}>
            <Text style={styles.earningLabel}>Personal Training (10 sessions)</Text>
            <Text style={styles.earningAmount}>$500</Text>
          </View>
          <View style={styles.earningRow}>
            <Text style={styles.earningLabel}>Workout Plans (5 sales)</Text>
            <Text style={styles.earningAmount}>$100</Text>
          </View>
          <View style={styles.earningRow}>
            <Text style={styles.earningLabel}>Referrals (20 friends)</Text>
            <Text style={styles.earningAmount}>$100</Text>
          </View>
          <View style={styles.earningRow}>
            <Text style={styles.earningLabel}>Equipment Sales</Text>
            <Text style={styles.earningAmount}>$150</Text>
          </View>
          <View style={[styles.earningRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Potential</Text>
            <Text style={styles.totalAmount}>$850/month</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Start your fitness business today and turn your passion into profit! 💪
        </Text>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
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
    marginBottom: 20,
  },
  earnCards: {
    gap: 15,
  },
  earnCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  earnGradient: {
    padding: 20,
    alignItems: 'center',
  },
  earnTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  earnDesc: {
    color: 'white',
    opacity: 0.9,
    marginBottom: 10,
  },
  earnAmount: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  popularPlan: {
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
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planPeriod: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  planPrice: {
    alignItems: 'flex-end',
  },
  priceSymbol: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  savingsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 2,
  },
  planFeatures: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPayment: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  paymentName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  subscribeButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  subscribeGradient: {
    padding: 20,
    alignItems: 'center',
  },
  subscribeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subscribeSubtext: {
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  revenueCard: {
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
  revenueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  revenueDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  revenueAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  earningsCalculator: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  totalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#FF6B35',
    marginTop: 10,
    paddingTop: 15,
  },
  earningLabel: {
    fontSize: 14,
    color: '#333',
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PaymentScreen;
