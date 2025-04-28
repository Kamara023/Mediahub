// Onboarding.js
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Swiper from 'react-native-swiper';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

// Composant pour les points indicateurs personnalisés
const DotIndicator = ({ activeIndex, count }) => {
  return (
    <View style={styles.dotContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

// Données des slides
const slides = [
  {
    id: '1',
    title: 'Bienvenue sur StreamTrend',
    description: 'Découvrez une nouvelle façon de regarder vos vidéos préférées. Des milliers de films, séries et documentaires en un seul endroit.',
    image: require('../../assets/images/slide1.png'),
    //animationSource: require('../assets/animations/streaming.json')
    animationSource: require('../../assets/animations/loading.json')

  },
  {
    id: '2',
    title: 'Top Tendances',
    description: 'Restez informé des contenus les plus populaires. Découvrez ce que tout le monde regarde en ce moment.',
    image: require('../../assets/images/slide2.png'),
    //animationSource: require('../assets/animations/trending.json')
    animationSource: require('../../assets/animations/loading1.json')

  },
  {
    id: '3',
    title: 'Personnalisation',
    description: 'Notre algorithme apprend de vos goûts pour vous recommander le contenu parfait, adapté à vos préférences.',
    image: require('../../assets/images/slide3.png'),
    //animationSource: require('../assets/animations/personalization.json')
    animationSource: require('../../assets/animations/loading.json')

  },
];

const Onboarding = ({ navigation }) => {
  // État pour suivre l'index actif du swiper
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Animation pour le bouton
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation des slides lors du changement
  const animateSlide = () => {
    Animated.sequence([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };
  
  // Animation du bouton "Commencer"
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(buttonAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  // Animation de scale pour le bouton
  const buttonScale = buttonAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1]
  });

  // Charger les polices personnalisées
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Attendre le chargement des polices
  }

  // Fonction pour gérer le clic sur le bouton Commencer
  const handleGetStarted = () => {
    navigation.replace('Home'); // Naviguer vers l'écran principal
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Swiper
        loop={false}
        onIndexChanged={(index) => {
          setActiveIndex(index);
          animateSlide();
        }}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={styles.pagination}
      >
        {slides.map((slide, index) => (
          <Animated.View 
            key={slide.id} 
            style={[
              styles.slide,
              { 
                opacity: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0]
                }),
                transform: [{ 
                  translateY: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20]
                  }) 
                }] 
              }
            ]}
          >
            <View style={styles.imageContainer}>
              <LottieView
                source={slide.animationSource}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </Animated.View>
        ))}
      </Swiper>
      
      <DotIndicator activeIndex={activeIndex} count={slides.length} />
      
      <Animated.View 
        style={[
          styles.buttonContainer,
          { transform: [{ scale: buttonScale }] }
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Commencer</Text>
          <MaterialIcons name="arrow-forward" size={22} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.4,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#BDBDBD',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#FF5252', // Couleur principale du thème
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#525252',
  },
  pagination: {
    bottom: 120,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FF5252',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    shadowColor: '#FF5252',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFF',
    marginRight: 8,
  },
});

export default Onboarding;