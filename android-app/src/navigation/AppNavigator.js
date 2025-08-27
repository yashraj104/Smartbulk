import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import NutritionScreen from '../screens/NutritionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PaymentScreen from '../screens/PaymentScreen';
import TrainerSignupScreen from '../screens/TrainerSignupScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Main Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Workouts') {
            iconName = 'fitness-center';
          } else if (route.name === 'Nutrition') {
            iconName = 'restaurant';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutScreen}
        options={{
          tabBarLabel: 'Workouts',
        }}
      />
      <Tab.Screen 
        name="Nutrition" 
        component={NutritionScreen}
        options={{
          tabBarLabel: 'Nutrition',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="TrainerSignup" component={TrainerSignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
