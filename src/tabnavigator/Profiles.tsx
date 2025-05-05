import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Remplacez par vos assets
const DEFAULT_AVATAR = require('../../assets/images/avatar.png');
const HEADER_BACKGROUND = require('../../assets/images/bg-bts-ida.jpg');

const Profiles = ({ navigation }) => {
  // Animation pour les éléments qui apparaissent
  const [itemAppear] = useState(new Animated.Value(0));
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Données utilisateur simulées - À remplacer par vos données réelles
  const userData = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    viewedContent: 42,
    favorites: 15,
    memberSince: 'Juin 2023',
    avatar: DEFAULT_AVATAR,
  };

  useEffect(() => {
    // Animation de démarrage avec séquence pour les éléments
    Animated.stagger(100, [
      Animated.timing(itemAppear, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Interpolations pour les animations
  const headerOpacity = itemAppear.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  const avatarScale = itemAppear.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    // Implémentez votre logique de déconnexion ici
    alert('Déconnexion...');
    // navigation.navigate('Login');
  };

  // Fonction pour changer le thème
  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);
    // Ici, vous devriez implémenter votre logique de changement de thème
  };

  // Fonction pour modifier le profil
  const handleEditProfile = () => {
    // Navigation vers l'écran d'édition de profil
    navigation.navigate('ModifierProfile');
  };

  // Rendu des statistiques utilisateur
  const renderStat = (icon, label, value, index) => {
    const translateY = itemAppear.interpolate({
      inputRange: [0, 1],
      outputRange: [50 * (index + 1), 0],
    });
    
    const opacity = itemAppear.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    return (
      <Animated.View 
        style={[
          styles.statItem,
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <View style={styles.statIconContainer}>
          <Ionicons name={icon} size={22} color="#007AFF" />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>
      </Animated.View>
    );
  };

  // Rendu d'un bouton d'action
  const renderActionButton = (icon, label, onPress, color = "#007AFF", index) => {
    const translateX = itemAppear.interpolate({
      inputRange: [0, 1],
      outputRange: [30 * (index + 1), 0],
    });
    
    const opacity = itemAppear.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    return (
      <Animated.View 
        style={[
          { opacity, transform: [{ translateX }] }
        ]}
      >
        <TouchableOpacity 
          style={[styles.actionButton, { borderColor: color }]} 
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Ionicons name={icon} size={18} color={color} style={styles.actionIcon} />
          <Text style={[styles.actionLabel, { color }]}>{label}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      {/* Header avec bouton retour */}
      <Animated.View 
        style={[
          styles.header,
          { opacity: headerOpacity }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Paramètre')}
        >
          <Ionicons name="settings-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Image d'arrière-plan du header */}
      <Animated.Image 
        source={HEADER_BACKGROUND} 
        style={[styles.headerBackground, { opacity: headerOpacity }]} 
        resizeMode="cover" 
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Profil */}
        <View style={styles.profileSection}>
          {/* Avatar de l'utilisateur */}
          <Animated.View 
            style={[
              styles.avatarContainer,
              { 
                opacity: headerOpacity,
                transform: [{ scale: avatarScale }]
              }
            ]}
          >
            <Image source={userData.avatar} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>

          {/* Nom d'utilisateur */}
          <Animated.Text 
            style={[
              styles.userName,
              { 
                opacity: itemAppear,
                transform: [{ translateY: itemAppear.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })}] 
              }
            ]}
          >
            {userData.name}
          </Animated.Text>
          
          {/* Email */}
          <Animated.Text 
            style={[
              styles.userEmail,
              { 
                opacity: itemAppear,
                transform: [{ translateY: itemAppear.interpolate({
                  inputRange: [0, 1],
                  outputRange: [15, 0],
                })}] 
              }
            ]}
          >
            {userData.email}
          </Animated.Text>

          {/* Membre depuis */}
          <Animated.Text 
            style={[
              styles.memberSince,
              { 
                opacity: itemAppear,
                transform: [{ translateY: itemAppear.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                })}] 
              }
            ]}
          >
            Membre depuis {userData.memberSince}
          </Animated.Text>
        </View>

        {/* Section Statistiques */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsContainer}>
            {renderStat('eye-outline', 'Contenus Visionnés', userData.viewedContent, 0)}
            {renderStat('heart-outline', 'Favoris', userData.favorites, 1)}
            {renderStat('time-outline', 'Temps Total', '5h 23min', 2)}
          </View>
        </View>

        {/* Section Préférences */}
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <Animated.View 
            style={[
              styles.themeToggleContainer,
              { 
                opacity: itemAppear,
                transform: [{ translateY: itemAppear.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                })}] 
              }
            ]}
          >
            <View style={styles.themeToggleContent}>
              <Ionicons 
                name={isDarkMode ? "moon" : "sunny"} 
                size={20} 
                color={isDarkMode ? "#7E57C2" : "#FF9800"} 
                style={styles.themeIcon}
              />
              <Text style={styles.themeText}>
                {isDarkMode ? "Mode Sombre" : "Mode Clair"}
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#7E57C2" }}
              thumbColor={isDarkMode ? "#FFF" : "#FFF"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </Animated.View>
        </View>

        {/* Section Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionButtonsContainer}>
            {renderActionButton('person-outline', 'Modifier Profil', handleEditProfile, "#007AFF", 0)}
            {renderActionButton('notifications-outline', 'Notifications', () => navigation.navigate('NotificationSettings'), "#FF9800", 1)}
            {renderActionButton('log-out-outline', 'Déconnexion', handleLogout, "#FF4757", 2)}
          </View>
        </View>

        {/* Espace en bas pour éviter que le contenu ne soit caché */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    height: Platform.OS === 'ios' ? 100 : 90,
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerBackground: {
    width: '100%',
    height: 200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    paddingTop: 120, // Pour que le contenu commence en dessous du header
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 60, // Espace pour l'avatar qui chevauche le header background
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -50, // Pour chevaucher le header
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  statsSection: {
    marginTop: 24,
  },
  statsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  preferencesSection: {
    marginTop: 24,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  themeToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    marginRight: 12,
  },
  themeText: {
    fontSize: 16,
    color: '#333',
  },
  actionsSection: {
    marginTop: 24,
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default Profiles;