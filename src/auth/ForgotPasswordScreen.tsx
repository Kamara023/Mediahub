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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  // États pour gérer les inputs et la validation
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Nouveau mot de passe
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmNewPassword, setHideConfirmNewPassword] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

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

  // Réinitialiser les erreurs lors du changement d'étape
  useEffect(() => {
    setEmailError('');
    setOtpError('');
    setNewPasswordError('');
    setConfirmNewPasswordError('');
  }, [step]);

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

  // Fonction de validation du code OTP
  const validateOtp = (text) => {
    if (!text) {
      setOtpError('Code OTP requis');
      return false;
    } else if (text !== '123456') { // Simuler un OTP valide
      setOtpError('Code OTP incorrect');
      return false;
    } else {
      setOtpError('');
      return true;
    }
  };

  // Fonction de validation du nouveau mot de passe
  const validateNewPassword = (text) => {
    if (!text) {
      setNewPasswordError('Mot de passe requis');
      return false;
    } else if (text.length < 6) {
      setNewPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    } else {
      setNewPasswordError('');
      return true;
    }
  };

  // Fonction de validation de la confirmation du mot de passe
  const validateConfirmNewPassword = (text) => {
    if (!text) {
      setConfirmNewPasswordError('Confirmation du mot de passe requise');
      return false;
    } else if (text !== newPassword) {
      setConfirmNewPasswordError('Les mots de passe ne correspondent pas');
      return false;
    } else {
      setConfirmNewPasswordError('');
      return true;
    }
  };

  // Fonction pour l'étape 1 : Envoyer l'email
  const handleSendEmail = () => {
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      return;
    }

    setIsLoading(true);
    // Simuler l'envoi d'un email
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Code envoyé',
        text2: 'Un code OTP a été envoyé à votre email.',
        visibilityTime: 3000,
        position: 'bottom',
        bottomOffset: 20,
      });
      setStep(2); // Passer à l'étape OTP
    }, 2000);
  };

  // Fonction pour l'étape 2 : Valider l'OTP
  const handleVerifyOtp = () => {
    const isOtpValid = validateOtp(otp);
    if (!isOtpValid) {
      return;
    }

    setIsLoading(true);
    // Simuler la vérification de l'OTP
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Code vérifié',
        text2: 'Le code OTP est correct.',
        visibilityTime: 3000,
        position: 'bottom',
        bottomOffset: 20,
      });
      setStep(3); // Passer à l'étape du nouveau mot de passe
    }, 2000);
  };

  // Fonction pour renvoyer l'OTP
  const handleResendOtp = () => {
    setIsLoading(true);
    // Simuler le renvoi de l'OTP
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Code renvoyé',
        text2: 'Un nouveau code OTP a été envoyé à votre email.',
        visibilityTime: 3000,
        position: 'bottom',
        bottomOffset: 20,
      });
      setOtp(''); // Réinitialiser le champ OTP
    }, 2000);
  };

  // Fonction pour l'étape 3 : Réinitialiser le mot de passe
  const handleResetPassword = () => {
    const isNewPasswordValid = validateNewPassword(newPassword);
    const isConfirmNewPasswordValid = validateConfirmNewPassword(confirmNewPassword);
    if (!isNewPasswordValid || !isConfirmNewPasswordValid) {
      return;
    }

    setIsLoading(true);
    // Simuler la réinitialisation du mot de passe
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Mot de passe réinitialisé',
        text2: 'Votre mot de passe a été mis à jour avec succès.',
        visibilityTime: 3000,
        position: 'bottom',
        bottomOffset: 20,
      });
      // Redirection vers l'écran de connexion
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
          <Text style={styles.appTitle}>StreamFlex</Text>
          <Text style={styles.tagline}>
            {step === 1
              ? 'Réinitialisez votre mot de passe'
              : step === 2
              ? 'Entrez votre code OTP'
              : 'Définissez un nouveau mot de passe'}
          </Text>
        </Animatable.View>

        {/* Formulaire */}
        <Animatable.View
          ref={formAnim}
          animation="fadeInUp"
          delay={500}
          style={styles.formContainer}
        >
          <Text style={styles.welcomeText}>
            {step === 1
              ? 'Réinitialisation'
              : step === 2
              ? 'Vérification OTP'
              : 'Nouveau mot de passe'}
          </Text>

          {/* Étape 1 : Saisie de l'email */}
          {step === 1 && (
            <>
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

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSendEmail}
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
                    <Text style={styles.actionButtonText}>Envoyer le code</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* Étape 2 : Saisie du code OTP */}
          {step === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={22} color="#A0AEC0" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Code OTP"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={otp}
                  onChangeText={(text) => {
                    setOtp(text);
                    validateOtp(text);
                  }}
                />
              </View>
              {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleVerifyOtp}
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
                    <Text style={styles.actionButtonText}>Vérifier le code</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOtp}
                disabled={isLoading}
              >
                <Text style={styles.resendButtonText}>Renvoyer le code</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Étape 3 : Nouveau mot de passe */}
          {step === 3 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#A0AEC0" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nouveau mot de passe"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={hideNewPassword}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    validateNewPassword(text);
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setHideNewPassword(!hideNewPassword)}
                >
                  <Ionicons
                    name={hideNewPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#A0AEC0"
                  />
                </TouchableOpacity>
              </View>
              {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#A0AEC0" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer mot de passe"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={hideConfirmNewPassword}
                  value={confirmNewPassword}
                  onChangeText={(text) => {
                    setConfirmNewPassword(text);
                    validateConfirmNewPassword(text);
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setHideConfirmNewPassword(!hideConfirmNewPassword)}
                >
                  <Ionicons
                    name={hideConfirmNewPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#A0AEC0"
                  />
                </TouchableOpacity>
              </View>
              {confirmNewPasswordError ? (
                <Text style={styles.errorText}>{confirmNewPasswordError}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleResetPassword}
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
                    <Text style={styles.actionButtonText}>Réinitialiser</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* Lien pour revenir à la connexion */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Retour à la connexion</Text>
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
  actionButton: {
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
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  resendButtonText: {
    color: '#3B82F6',
    fontSize: 14,
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

export default ForgotPasswordScreen;