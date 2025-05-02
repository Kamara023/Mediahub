import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Ionicons } from '@expo/vector-icons';

// Remplacez par vos assets
const LOGO = require('../../assets/images/logo.png');
const NOTIFICATION_ICON = require('../../assets/images/logo.png');
const TRENDING_IMAGES = [
  require('../../assets/images/slide1.png'),
  require('../../assets/images/slide2.png'),
  require('../../assets/images/slide3.png'),
];
const NEW_IMAGES = [
  { id: '1', image: require('../../assets/images/slide1.png'), title: 'Nouveauté 1' },
  { id: '2', image: require('../../assets/images/slide2.png'), title: 'Nouveauté 2' },
  { id: '3', image: require('../../assets/images/slide3.png'), title: 'Nouveauté 3' },
];
const RECOMMENDED_IMAGES = [
  { id: '1', image: require('../../assets/images/slide1.png'), title: 'Recommandé 1' },
  { id: '2', image: require('../../assets/images/slide2.png'), title: 'Recommandé 2' },
  { id: '3', image: require('../../assets/images/slide3.png'), title: 'Recommandé 3' },
];

const { width } = Dimensions.get('window');
const SPACING = 12;
const ITEM_WIDTH = width * 0.72;
const ITEM_HEIGHT = 220;

const HomeScreen = ({ navigation }) => {
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 5],
    extrapolate: 'clamp',
  });

  // État pour le carrousel actif
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Référence pour le carousel
  const carouselRef = useRef(null);

  // Animation pour les items qui apparaissent
  const [itemAppear] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Animation de démarrage
    Animated.stagger(150, [
      Animated.timing(itemAppear, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Données simulées pour le carrousel
  const trendingData = [
    { id: '1', image: TRENDING_IMAGES[0], title: 'Tendance 1', category: 'Populaire' },
    { id: '2', image: TRENDING_IMAGES[1], title: 'Tendance 2', category: 'Nouveau' },
    { id: '3', image: TRENDING_IMAGES[2], title: 'Tendance 3', category: 'Exclusif' },
  ];

  // Données pour la FlatList principale
  const sections = [
    { type: 'trending', data: trendingData },
    { type: 'new', data: NEW_IMAGES },
    { type: 'recommended', data: RECOMMENDED_IMAGES },
  ];

  // Fonction pour gérer le toucher des éléments
  const handleItemPress = (id) => {
    navigation.navigate('DetailScreen', { id });
  };

  // Rendu d'un élément du carrousel
  const renderCarouselItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.carouselItem}
        onPress={() => handleItemPress(item.id)}
      >
        <Image source={item.image} style={styles.carouselImage} resizeMode="cover" />
        <View style={styles.cardGradient}>
          <View style={styles.cardContent}>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.carouselTitle}>{item.title}</Text>
            <View style={styles.cardButton}>
              <Text style={styles.cardButtonText}>Découvrir</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" style={styles.cardButtonIcon} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Rendu d'un élément de grille animé
  const renderGridItem = ({ item, index }) => {
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
          styles.gridItemContainer,
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <TouchableOpacity
          style={styles.gridItem}
          activeOpacity={0.9}
          onPress={() => handleItemPress(item.id)}
        >
          <Image source={item.image} style={styles.gridImage} resizeMode="cover" />
          <View style={styles.gridOverlay}>
            <Text style={styles.gridTitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Rendu des indicateurs de pagination du carrousel
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {trendingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { opacity: activeSlide === index ? 1 : 0.4 }
            ]}
          />
        ))}
      </View>
    );
  };

  // Rendu d'une section
  const renderSection = ({ item, index }) => {
    const translateY = itemAppear.interpolate({
      inputRange: [0, 1],
      outputRange: [30 * (index + 1), 0],
    });
    
    const opacity = itemAppear.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    switch (item.type) {
      case 'trending':
        return (
          <Animated.View 
            style={[
              styles.section,
              { opacity, transform: [{ translateY }] }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Tendance</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            
            {item.data.length > 0 ? (
              <>
                <Carousel
                  ref={carouselRef}
                  data={item.data}
                  renderItem={renderCarouselItem}
                  sliderWidth={width}
                  itemWidth={ITEM_WIDTH}
                  containerCustomStyle={styles.carouselContainer}
                  inactiveSlideOpacity={0.7}
                  inactiveSlideScale={0.9}
                  onSnapToItem={(index) => setActiveSlide(index)}
                  loop={true}
                  autoplay={true}
                  autoplayInterval={4000}
                />
                {renderPagination()}
              </>
            ) : (
              <Text style={styles.errorText}>Aucune tendance disponible</Text>
            )}
          </Animated.View>
        );
      case 'new':
        return (
          <Animated.View 
            style={[
              styles.section,
              { opacity, transform: [{ translateY }] }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🆕 Nouveautés</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={item.data}
              renderItem={renderGridItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.grid}
              scrollEnabled={false} // Désactiver le défilement interne
            />
          </Animated.View>
        );
      case 'recommended':
        return (
          <Animated.View 
            style={[
              styles.section,
              { opacity, transform: [{ translateY }] }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Recommandés</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={item.data}
              renderItem={renderGridItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.grid}
              scrollEnabled={false} // Désactiver le défilement interne
            />
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header animé */}
      <Animated.View 
        style={[
          styles.header,
          { 
            opacity: headerOpacity,
            elevation: headerElevation,
            shadowOpacity: headerElevation,
          }
        ]}
      >
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications" size={22} color="#333" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Contenu principal */}
      <Animated.FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.type}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    zIndex: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  searchButton: {
    padding: 8,
    marginRight: 12,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  carouselContainer: {
    marginVertical: 10,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundGradient: {
      colors: ['transparent', 'rgba(0,0,0,0.8)'],
    },
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardContent: {
    padding: 16,
  },
  cardCategory: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
  },
  cardButtonIcon: {
    marginTop: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginHorizontal: 4,
  },
  grid: {
    paddingHorizontal: 10,
  },
  gridItemContainer: {
    flex: 1,
    padding: SPACING / 2,
  },
  gridItem: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 160,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default HomeScreen;
