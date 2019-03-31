import React, { Component } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator, createStackNavigator ,createAppContainer } from 'react-navigation';

import HomeScreen from './screens/HomeScreen'
import RepoScreen from './screens/RepoScreen'
import FollowerScreen from './screens/FollowerScreen'
import FollowingScreen from './screens/FollowingScreen'
import ProfileScreen from './screens/ProfileScreen'

const AppStackNavigator = createStackNavigator({
  Home: HomeScreen,
  Repo: RepoScreen,
  Follower: FollowerScreen,
  Following: FollowingScreen,
  Profile: ProfileScreen,
})


const App = createAppContainer(AppStackNavigator);
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
