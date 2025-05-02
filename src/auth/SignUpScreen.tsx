import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  // États pour gérer les inputs et la validation
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');

  // Refs pour les animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const logoAnim = useRef();
  const formAnim = useRef();

  // Animation d'entrée
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Demander la permission pour accéder à la galerie
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission refusée',
          text2: "L'accès à la galerie est nécessaire pour sélectionner une photo.",
          visibilityTime: 3000,
          position: 'bottom',
          bottomOffset: 20,
        });
      }
    })();
  }, []);

  // Fonction pour sélectionner une photo
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Fonction de validation du nom
  const validateName = (text) => {
    if (!text) {
      setNameError('Nom requis');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  // Fonction de validation de l'email
  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('Email requis');
      return false;
    } else if (!emailRegex.test(text)) {
      setEmailError('Format d\'email invalide');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Fonction de validation du mot de passe
  const validatePassword = (text) => {
    if (!text) {
      setPasswordError('Mot de passe requis');
      return false;
    } else if (text.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Fonction de validation de la confirmation du mot de passe
  const validateConfirmPassword = (text) => {
    if (!text) {
      setConfirmPasswordError('Confirmation du mot de passe requise');
      return false;
    } else if (text !== password) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  // Fonction de validation des conditions
  const validateTerms = () => {
    if (!termsAccepted) {
      setTermsError('Vous devez accepter les conditions');
      return false;
    } else {
      setTermsError('');
      return true;
    }
  };

  // Fonction d'inscription
  const handleSignUp = async () => {
    // Validation des champs
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isTermsValid = validateTerms();

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isTermsValid) {
      return;
    }

    // Animation du bouton et affichage du spinner
    setIsLoading(true);

    // Simuler une requête API
    setTimeout(() => {
      setIsLoading(false);

      // Simuler une inscription réussie
      Toast.show({
        type: 'success',
        text1: 'Inscription réussie',
        text2: 'Bienvenue sur MediaHub !',
        visibilityTime: 3000,
        position: 'bottom',
        bottomOffset: 20,
      });

      // Redirection vers l'écran principal
      setTimeout(() => {
        navigation.navigate('LoginScreen');
      }, 1000); // Attendre 1 seconde pour laisser le toast visible
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Arrière-plan dégradé */}
      <LinearGradient
        colors={['#121212', '#1E3A8A']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animation des bulles en arrière-plan */}
      <Animated.View style={[styles.bubblesContainer, { opacity: fadeAnim }]}>
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              {
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80}%`,
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                backgroundColor: `rgba(66, 153, 225, ${Math.random() * 0.2})`,
              },
            ]}
          />
        ))}
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo et titre */}
        <Animatable.View
          ref={logoAnim}
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          style={styles.logoContainer}
        >
          <LinearGradient
            colors={['#4F46E5', '#3B82F6']}
            style={styles.logoBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="play-circle" size={50} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.appTitle}>MediaHub</Text>
          <Text style={styles.tagline}>Créez votre compte en quelques clics</Text>
        </Animatable.View>

        {/* Formulaire */}
        <Animatable.View
          ref={formAnim}
          animation="fadeInUp"
          delay={500}
          style={styles.formContainer}
        >
          <Text style={styles.welcomeText}>Inscription</Text>

          {/* Champ Nom */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color="#A0AEC0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor="#A0AEC0"
              value={name}
              onChangeText={(text) => {
                setName(text);
                validateName(text);
              }}
            />
          </View>
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          {/* Champ Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color="#A0AEC0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A0AEC0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }}
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Champ Mot de passe */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#A0AEC0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#A0AEC0"
              secureTextEntry={hidePassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                validatePassword(text);
              }}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setHidePassword(!hidePassword)}
            >
              <Ionicons
                name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#A0AEC0"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Champ Confirmer mot de passe */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#A0AEC0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmer mot de passe"
              placeholderTextColor="#A0AEC0"
              secureTextEntry={hideConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                validateConfirmPassword(text);
              }}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
            >
              <Ionicons
                name={hideConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#A0AEC0"
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          {/* Sélection de la photo */}
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <LinearGradient
              colors={['#4F46E5', '#3B82F6']}
              style={styles.photoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photoPreview} />
              ) : (
                <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
              )}
              <Text style={styles.photoButtonText}>
                {photo ? 'Changer la photo' : 'Ajouter une photo (optionnel)'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Checkbox Conditions (personnalisée) */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              setTermsAccepted(!termsAccepted);
              validateTerms();
            }}
          >
            <Ionicons
              name={termsAccepted ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={termsAccepted ? '#3B82F6' : '#A0AEC0'}
            />
            <Text style={styles.checkboxText}>J'accepte les conditions</Text>
          </TouchableOpacity>
          {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}

          {/* Bouton d'inscription */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4F46E5', '#3B82F6']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>Créer un compte</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Lien vers la connexion */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bubblesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: 16,
    color: '#E2E8F0',
    marginTop: 8,
  },
  formContainer: {
    width: width * 0.85,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 12,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#FFFFFF',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 8,
  },
  photoButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    marginVertical: 16,
    overflow: 'hidden',
  },
  photoGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxText: {
    color: '#CBD5E1',
    fontSize: 14,
    marginLeft: 8,
  },
  signUpButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    marginTop: 24,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#CBD5E1',
    fontSize: 14,
    marginRight: 4,
  },
  loginButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;