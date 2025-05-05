import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Remplacez par vos assets
const DEFAULT_AVATAR = require('../../assets/images/avatar.png');

const ModifierProfile = ({ navigation, route }) => {
  // Animation pour les éléments qui apparaissent
  const [itemAppear] = useState(new Animated.Value(0));
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionné de technologie et d\'innovation.',
    avatar: DEFAULT_AVATAR,
  });

  // État pour suivre si le formulaire a été modifié
  const [isFormModified, setIsFormModified] = useState(false);

  // Référence pour l'input actif
  const inputRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    bio: useRef(null),
  };

  // Animation de démarrage
  useEffect(() => {
    Animated.timing(itemAppear, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Fonction pour mettre à jour les champs du formulaire
  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
    setIsFormModified(true);
  };

  // Fonction pour gérer la sélection d'une image
  const handleImagePick = async () => {
    try {
      // Demander la permission d'accéder à la galerie
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à votre galerie.');
        return;
      }

      // Lancer la sélection d'image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData(prevData => ({
          ...prevData,
          avatar: { uri: result.assets[0].uri },
        }));
        setIsFormModified(true);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner une image.');
    }
  };

  // Fonction pour enregistrer les modifications
  const handleSaveChanges = () => {
    // Ici, vous implémenteriez la logique pour enregistrer les modifications
    // Par exemple, envoi à une API, mise à jour dans une base de données locale, etc.
    Alert.alert(
      'Profil mis à jour',
      'Vos modifications ont été enregistrées avec succès.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  // Fonction pour confirmer l'annulation des modifications
  const handleCancel = () => {
    if (isFormModified) {
      Alert.alert(
        'Annuler les modifications',
        'Voulez-vous vraiment annuler vos modifications ? Les changements non enregistrés seront perdus.',
        [
          { text: 'Continuer l\'édition', style: 'cancel' },
          { text: 'Annuler les modifications', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Fonction pour rendre un champ de formulaire
  const renderFormField = (label, field, placeholder, keyboardType = 'default', multiline = false) => {
    const inputStyle = multiline ? styles.textAreaInput : styles.textInput;
    const containerStyle = multiline ? styles.textAreaContainer : styles.inputContainer;
    
    const translateY = itemAppear.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });
    
    const opacity = itemAppear.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    return (
      <Animated.View 
        style={[
          containerStyle,
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          ref={inputRefs[field]}
          style={inputStyle}
          value={formData[field]}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          returnKeyType={multiline ? 'default' : 'next'}
          blurOnSubmit={multiline}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {/* Header avec bouton retour */}
      <Animated.View 
        style={[
          styles.header,
          { 
            opacity: itemAppear,
            transform: [{ translateY: itemAppear.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            })}]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleCancel}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier Profil</Text>
        <TouchableOpacity 
          style={[styles.saveButton, !isFormModified && styles.saveButtonDisabled]}
          onPress={handleSaveChanges}
          disabled={!isFormModified}
        >
          <Text style={[styles.saveButtonText, !isFormModified && styles.saveButtonTextDisabled]}>
            Enregistrer
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar Section */}
          <Animated.View 
            style={[
              styles.avatarSection,
              { 
                opacity: itemAppear,
                transform: [{ scale: itemAppear.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                })}]
              }
            ]}
          >
            <Image source={formData.avatar} style={styles.avatar} />
            <TouchableOpacity 
              style={styles.changeAvatarButton}
              onPress={handleImagePick}
            >
              <Ionicons name="camera" size={18} color="#FFF" />
              <Text style={styles.changeAvatarText}>Changer</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {renderFormField('Nom complet', 'name', 'Entrez votre nom complet')}
            {renderFormField('Email', 'email', 'Entrez votre email', 'email-address')}
            {renderFormField('Téléphone', 'phone', 'Entrez votre numéro de téléphone', 'phone-pad')}
            {renderFormField('Bio', 'bio', 'Écrivez quelque chose à propos de vous...', 'default', true)}
          </View>

          {/* Actions supplémentaires */}
          <Animated.View 
            style={[
              styles.additionalActionsSection,
              { 
                opacity: itemAppear,
                transform: [{ translateY: itemAppear.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                })}]
              }
            ]}
          >
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="lock-closed-outline" size={20} color="#007AFF" style={styles.actionIcon} />
              <Text style={styles.actionText}>Changer le mot de passe</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="notifications-outline" size={20} color="#007AFF" style={styles.actionIcon} />
              <Text style={styles.actionText}>Préférences de notifications</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.deleteAccountButton]}>
              <Ionicons name="trash-outline" size={20} color="#FF4757" style={styles.actionIcon} />
              <Text style={[styles.actionText, styles.deleteAccountText]}>Supprimer mon compte</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Espace en bas pour éviter que le contenu ne soit caché */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    height: Platform.OS === 'ios' ? 90 : 80,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#B0D0FF',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButtonTextDisabled: {
    color: '#FFF',
  },
  scrollContent: {
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  changeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 10,
  },
  changeAvatarText: {
    color: '#FFF',
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 14,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textAreaContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textAreaInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
  },
  additionalActionsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  deleteAccountButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFE0E0',
    backgroundColor: '#FFF',
  },
  deleteAccountText: {
    color: '#FF4757',
  },
  bottomSpacer: {
    height: 50,
  },
});

export default ModifierProfile;