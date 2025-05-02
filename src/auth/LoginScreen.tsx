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
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    // États pour gérer les inputs et la validation
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

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

    // Fonction de connexion
    const handleLogin = async () => {
        // Validation des champs
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        // Animation du bouton et affichage du spinner
        setIsLoading(true);

        // Simuler une requête API
        setTimeout(() => {
            setIsLoading(false);

            // Simuler une erreur pour démontrer le Toast
            if (email === 'test@test.com' && password === 'password') {
                // Navigation vers l'écran principal
                navigation.navigate('Drawer');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur de connexion',
                    text2: 'Email ou mot de passe incorrect',
                    visibilityTime: 3000,
                    position: 'bottom',
                    bottomOffset: 20,
                });
            }
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
                    <Text style={styles.tagline}>Tous vos films préférés en un clic</Text>
                </Animatable.View>

                {/* Formulaire */}
                <Animatable.View
                    ref={formAnim}
                    animation="fadeInUp"
                    delay={500}
                    style={styles.formContainer}
                >
                    <Text style={styles.welcomeText}>Connexion</Text>

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

                    {/* Bouton de connexion */}
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
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
                                <Text style={styles.loginButtonText}>Se connecter</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Mot de passe oublié */}
                    <TouchableOpacity
                        style={styles.forgotPasswordButton}
                        onPress={() => navigation.navigate('ForgotPasswordScreen')}
                    >
                        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>

                    {/* Création de compte */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Pas encore de compte ?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SinUpScreen')}>
                            <Text style={styles.signupButtonText}>Créer un compte</Text>
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
        shadowOffset: {
            width: 0,
            height: 8,
        },
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
        shadowOffset: {
            width: 0,
            height: 10,
        },
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
    loginButton: {
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
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPasswordButton: {
        marginTop: 16,
        alignSelf: 'center',
    },
    forgotPasswordText: {
        color: '#A0AEC0',
        fontSize: 14,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    signupText: {
        color: '#CBD5E1',
        fontSize: 14,
        marginRight: 4,
    },
    signupButtonText: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default LoginScreen;