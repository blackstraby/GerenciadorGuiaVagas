
/**
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import { Icon } from 'react-native-elements'

import Mapa from './Screens/Mapa';
import Sobre from './Screens/Sobre';
import mainColor from './Components/About/constants'
//import { fromLeft } from 'react-navigation-transitions';

const TabNav = createBottomTabNavigator(
  {
    MainTab: {
      screen: Mapa,
      path: '/',
      navigationOptions: {
        title: 'Guia Vagas',
        tabBarLabel: 'Mapa',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
          color={focused ? mainColor : '#DDD'}
            name='ios-map'
            type='ionicon'
          />
        ),
      },
    },
    SobreTab: {
      screen: Sobre,
      path: '/sobre',
      navigationOptions: {
        title: 'Sobre', //Footer
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name='ios-information-circle'
            type='ionicon'
            color={focused ? mainColor : '#DDD'}
            />
        ),
      },
    },
  },

  

  {
    tabBarOptions: {
      activeTintColor: mainColor,
      labelStyle: {
        fontSize: 15,
      },
      style: {
        backgroundColor: '#fff',
      },
    },
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  },

);

TabNav.navigationOptions = ({ navigation }) => {

  let { routeName } = navigation.state.routes[navigation.state.index];
  let title;
  if (routeName === 'SobreTab') {
    title = 'Sobre'; // Header Title
  } else if (routeName === 'MainTab') {
    title = 'Guia Vagas';
  }
  return {
    title,
  };
};


const StacksOverTabs = createStackNavigator({
  Root: {
    screen: TabNav,
  },
},
  {
    navigationOptions: {
      gesturesEnabled: false,
      headerStyle: { 
        backgroundColor: mainColor, 
        borderWidth: 1, 
        borderBottomColor: 'white' 
      },
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#fff",
        zIndex: 1,
        fontSize: 18,
        lineHeight: 23,
       },
       headerTintColor: "#fff",
       animationEnabled: true

    },
    //transitionConfig: () => fromLeft(),
  }
);

export default StacksOverTabs;