import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      <AppNavigator />
    </>
  );
};

export default App;
