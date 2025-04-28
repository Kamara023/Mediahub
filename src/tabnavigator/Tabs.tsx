
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import { COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import Favoris_Historique from './Favoris_Historique';
import Profiles from './Profiles';
import Quiz_Recommandations from './Quiz_Recommandations';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    const navigation = useNavigation(); // Utilisation du hook pour accéder au navigation

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Inbox') {
                        iconName = focused ? 'mail' : 'mail-outline';
                    } else if (route.name === 'Notification') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} style={{ top: '50%', }} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                headerShown: false,
                tabBarStyle: {
                    display: 'flex',
                    height: '10%',
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    marginTop: -50,

                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    bottom: '-18%',
                    fontFamily: 'Poppins-Regular',
                    // borderWidth:1

                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Favoris_Historique" component={Favoris_Historique} />
            <Tab.Screen name="Quiz_Recommandations" component={Quiz_Recommandations} />
            <Tab.Screen name="Profiles" component={Profiles} // Tu peux mettre un composant vide ou un écran par défaut
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault(); // Empêcher la navigation par défaut
                        navigation.openDrawer(); // Ouvrir le Drawer lorsque "Profile" est cliqué
                    },
                }}
            />
        </Tab.Navigator>
    );
};

export default Tabs;
