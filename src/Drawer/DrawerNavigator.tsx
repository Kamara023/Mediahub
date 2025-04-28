import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Profiles from '../tabnavigator/Profiles'; // Profil utilisateur
import Tabs from '../tabnavigator/Tabs';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Tabs"
      drawerContent={props => <Profiles {...props} />} // Utilisation du profil personnalisé dans le drawer
      screenOptions={{
        drawerType: 'front', // Le drawer se superpose aux autres éléments
        drawerStyle: {
          backgroundColor: '#fff',
          borderRadius: 15,
          width: 270,
        },
      }}
    >
      <Drawer.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false, drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  );
}