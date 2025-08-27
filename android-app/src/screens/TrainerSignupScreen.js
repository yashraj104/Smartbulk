import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const TrainerSignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    hourlyRate: '',
    bio: ''
  });

  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  const specializations = [
    'Strength Training',
    'Cardio & HIIT',
    'Yoga & Flexibility',
    'Sports Performance',
    'Senior Fitness',
    'Nutrition & Wellness',
    'Weight Loss',
    'Muscle Building'
  ];

  const experienceLevels = [
    '0-2 years',
    '3-5 years',
    '6-10 years',
    '10+ years'
  ];

  const earningPotential = [
    {
      level: 'Beginner',
      sessions: '5-10/month',
      rate: '$30-50',
      monthly: '$150-500'
    },
    {
      level: 'Intermediate',
      sessions: '10-20/month',
      rate: '$50-75',
      monthly: '$500-1500'
    },
    {
      level: 'Advanced',
      sessions: '20-30/month',
      rate: '$75-100',
      monthly: '$1500-3000'
    },
    {
      level: 'Expert',
      sessions: '30+ month',
      rate: '$100-150',
      monthly: '$3000+'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Application Submitted!',
      'Thank you for applying to become a SmartBulk trainer. We\'ll review your application and contact you within 24 hours.',
      [
        {
          text: 'Great!',
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
  };

  const calculateEarnings = () => {
    const rate = parseFloat(formData.hourlyRate) || 0;
    const sessionsPerMonth = 15; // Average
    return (rate * sessionsPerMonth).toFixed(2);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Become a Trainer</Text>
        <Text style={styles.headerSubtitle}>Turn your passion into profit</Text>
      </LinearGradient>

      {/* Earning Potential */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💰 Your Earning Potential</Text>
        <View style={styles.earningsGrid}>
          {earningPotential.map((level, index) => (
            <View key={index} style={styles.earningCard}>
              <Text style={styles.earningLevel}>{level.level}</Text>
              <Text style={styles.earningSessions}>{level.sessions}</Text>
              <Text style={styles.earningRate}>{level.rate}/hr</Text>
              <Text style={styles.earningMonthly}>{level.monthly}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose SmartBulk?</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="people" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>10,000+</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="trending-up" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="attach-money" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>$2,500</Text>
            <Text style={styles.statLabel}>Avg Monthly</Text>
          </View>
        </View>
      </View>

      {/* Application Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application Form</Text>
        
        <View style={styles.formRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
              placeholder="Enter first name"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              placeholder="Enter last name"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            placeholder="Enter email address"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Specialization</Text>
          <View style={styles.specializationGrid}>
            {specializations.map((spec) => (
              <TouchableOpacity
                key={spec}
                style={[
                  styles.specChip,
                  selectedSpecialization === spec && styles.selectedSpecChip
                ]}
                onPress={() => setSelectedSpecialization(spec)}
              >
                <Text style={[
                  styles.specChipText,
                  selectedSpecialization === spec && styles.selectedSpecChipText
                ]}>
                  {spec}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Experience Level</Text>
          <View style={styles.experienceGrid}>
            {experienceLevels.map((exp) => (
              <TouchableOpacity
                key={exp}
                style={[
                  styles.expChip,
                  selectedExperience === exp && styles.selectedExpChip
                ]}
                onPress={() => setSelectedExperience(exp)}
              >
                <Text style={[
                  styles.expChipText,
                  selectedExperience === exp && styles.selectedExpChipText
                ]}>
                  {exp}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Hourly Rate ($)</Text>
          <TextInput
            style={styles.textInput}
            value={formData.hourlyRate}
            onChangeText={(text) => handleInputChange('hourlyRate', text)}
            placeholder="e.g., 50"
            keyboardType="numeric"
          />
          {formData.hourlyRate && (
            <Text style={styles.earningsPreview}>
              Estimated monthly earnings: ${calculateEarnings()}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bio</Text>
          <TextInput
            style={[styles.textInput, styles.bioInput]}
            value={formData.bio}
            onChangeText={(text) => handleInputChange('bio', text)}
            placeholder="Tell us about your fitness journey and expertise..."
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Trainer Benefits</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Keep 80% of your earnings</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Flexible scheduling</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Marketing & promotion support</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Client management tools</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Payment processing</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Insurance coverage</Text>
          </View>
        </View>
      </View>

      {/* Success Stories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💪 Success Stories</Text>
        <View style={styles.successCard}>
          <Text style={styles.successQuote}>
            "I started with SmartBulk 6 months ago and now earn $3,500/month as a personal trainer. The platform is amazing!"
          </Text>
          <Text style={styles.successAuthor}>- Sarah Johnson, Certified Trainer</Text>
        </View>
        <View style={styles.successCard}>
          <Text style={styles.successQuote}>
            "SmartBulk helped me build my client base from 0 to 25 clients in just 3 months. Best decision ever!"
          </Text>
          <Text style={styles.successAuthor}>- Mike Chen, Fitness Coach</Text>
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.submitGradient}>
            <Text style={styles.submitText}>Submit Application</Text>
            <Text style={styles.submitSubtext}>Start earning money in 24 hours</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Join thousands of successful trainers and start your fitness business today! 💪
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
    marginBottom: 15,
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  earningCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '48%',
  },
  earningLevel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  earningSessions: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  earningRate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  earningMonthly: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  inputGroup: {
    marginBottom: 20,
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  earningsPreview: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  specializationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedSpecChip: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  specChipText: {
    color: '#666',
    fontSize: 14,
  },
  selectedSpecChipText: {
    color: 'white',
  },
  experienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  expChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedExpChip: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  expChipText: {
    color: '#666',
    fontSize: 14,
  },
  selectedExpChipText: {
    color: 'white',
  },
  benefitsList: {
    gap: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  successCard: {
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
  successQuote: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 15,
    lineHeight: 24,
  },
  successAuthor: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  submitButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  submitGradient: {
    padding: 20,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  submitSubtext: {
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
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

export default TrainerSignupScreen;
