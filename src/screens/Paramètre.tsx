import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Animated,
  Easing,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Paramètre = ({ navigation }) => {
  // États pour les différentes options
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('fr'); // 'fr' ou 'en'
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Animation pour les éléments qui apparaissent
  const [itemAppear] = useState(new Animated.Value(0));
  const modalAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animation de démarrage des éléments
    Animated.timing(itemAppear, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  // Animation pour le modal de confirmation
  useEffect(() => {
    if (showDeleteModal) {
      Animated.spring(modalAnimation, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showDeleteModal]);

  // Fonction pour changer le thème
  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);
    // Implémenter la logique de changement de thème global ici
  };

  // Fonction pour changer la langue
  const changeLanguage = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    // Implémenter la logique de changement de langue ici
  };

  // Fonction pour activer/désactiver les notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(previousState => !previousState);
    // Implémenter la logique de gestion des notifications ici
  };

  // Fonction pour confirmer la suppression du compte
  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    
    // Simulation d'une suppression de compte
    setTimeout(() => {
      Alert.alert(
        "Compte supprimé",
        "Votre compte a été supprimé avec succès.",
        [{ text: "OK", onPress: () => navigation.navigate('Login') }]
      );
    }, 1000);
    
    // Implémenter la logique réelle de suppression de compte ici
  };

  // Rendu d'une section avec animation
  const renderSection = (title, children, index) => {
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
          styles.section,
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>
          {children}
        </View>
      </Animated.View>
    );
  };

  // Rendu d'un élément de paramètre avec switch
  const renderToggleSetting = (icon, title, subtitle, value, onToggle) => {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={22} color="#007AFF" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <Switch
          trackColor={{ false: "#E0E0E0", true: "#007AFF" }}
          thumbColor={value ? "#FFF" : "#FFF"}
          ios_backgroundColor="#E0E0E0"
          onValueChange={onToggle}
          value={value}
        />
      </View>
    );
  };

  // Rendu d'un élément de paramètre avec dropdown
  const renderDropdownSetting = (icon, title, subtitle, selectedValue, options, onPress) => {
    return (
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={22} color="#007AFF" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.dropdownValue}>
          <Text style={styles.dropdownText}>
            {options.find(opt => opt.value === selectedValue)?.label || selectedValue}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#666" style={styles.dropdownIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  // Rendu d'un élément de paramètre avec bouton
  const renderButtonSetting = (icon, title, subtitle, buttonText, buttonColor, onPress) => {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={22} color={buttonColor} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: buttonColor }]}
          onPress={onPress}
        >
          <Text style={styles.actionButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Options de langue disponibles
  const languageOptions = [
    { label: 'Français', value: 'fr' },
    { label: 'English', value: 'en' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Interface */}
        {renderSection('Interface', (
          <>
            {/* Option Thème */}
            {renderToggleSetting(
              isDarkMode ? 'moon' : 'sunny',
              'Thème',
              isDarkMode ? 'Mode sombre activé' : 'Mode clair activé',
              isDarkMode,
              toggleTheme
            )}
            
            {/* Option Langue */}
            {renderDropdownSetting(
              'language',
              'Langue',
              'Choisissez la langue de l\'application',
              selectedLanguage,
              languageOptions,
              () => setShowLanguageDropdown(true)
            )}
          </>
        ), 0)}
        
        {/* Section Notifications */}
        {renderSection('Notifications', (
          <>
            {renderToggleSetting(
              'notifications',
              'Notifications push',
              notificationsEnabled ? 'Activées' : 'Désactivées',
              notificationsEnabled,
              toggleNotifications
            )}
            
            {notificationsEnabled && (
              <TouchableOpacity 
                style={styles.subSetting}
                onPress={() => navigation.navigate('NotificationPreferences')}
              >
                <Text style={styles.subSettingText}>Configurer les préférences de notification</Text>
                <Ionicons name="chevron-forward" size={16} color="#007AFF" />
              </TouchableOpacity>
            )}
          </>
        ), 1)}
        
        {/* Section Compte */}
        {renderSection('Compte', (
          <>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('PrivacySettings')}
            >
              <View style={styles.settingIcon}>
                <Ionicons name="shield-checkmark" size={22} color="#007AFF" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Confidentialité</Text>
                <Text style={styles.settingSubtitle}>Gérer vos données et permissions</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
            
            {renderButtonSetting(
              'trash-bin',
              'Supprimer mon compte',
              'Cette action est irréversible',
              'Supprimer',
              '#FF4757',
              () => setShowDeleteModal(true)
            )}
          </>
        ), 2)}
        
        {/* Section À propos */}
        {renderSection('À propos', (
          <>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('About')}
            >
              <View style={styles.settingIcon}>
                <Ionicons name="information-circle" size={22} color="#007AFF" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>À propos de l'application</Text>
                <Text style={styles.settingSubtitle}>Version 1.0.0</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('TermsOfService')}
            >
              <View style={styles.settingIcon}>
                <Ionicons name="document-text" size={22} color="#007AFF" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Conditions d'utilisation</Text>
                <Text style={styles.settingSubtitle}>Politique de confidentialité</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          </>
        ), 3)}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Dropdown pour la sélection de langue */}
      {showLanguageDropdown && (
        <TouchableOpacity 
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageDropdown(false)}
        >
          <View style={styles.dropdownMenu}>
            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                  selectedLanguage === option.value && styles.dropdownItemSelected
                ]}
                onPress={() => changeLanguage(option.value)}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedLanguage === option.value && styles.dropdownItemTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedLanguage === option.value && (
                  <Ionicons name="checkmark" size={18} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}

      {/* Modal de confirmation pour supprimer le compte */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    scale: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  }
                ],
                opacity: modalAnimation,
              }
            ]}
          >
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={40} color="#FF4757" />
            </View>
            <Text style={styles.modalTitle}>Supprimer votre compte ?</Text>
            <Text style={styles.modalDescription}>
              Cette action est irréversible. Toutes vos données seront supprimées définitivement.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.modalConfirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  dropdownValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  dropdownIcon: {
    marginTop: 1,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FF4757',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
  subSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  subSettingText: {
    fontSize: 14,
    color: '#666',
  },
  bottomSpacer: {
    height: 30,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  dropdownMenu: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#F0F7FF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,71,87,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginRight: 8,
  },
  modalCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FF4757',
    borderRadius: 8,
    marginLeft: 8,
  },
  modalConfirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Paramètre;