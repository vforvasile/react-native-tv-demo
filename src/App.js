import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
// Enable screens
import {enableScreens} from 'react-native-screens';
import AppProvider from './AppProvider';
import Content from './components/Content';
import {navigationRef} from './Navigation';

enableScreens();

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer ref={navigationRef}>
        <Content />
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
