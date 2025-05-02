import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  FlatList,
  Share,
  Modal,
  Linking,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Données simulées pour le contenu
const MOCK_CONTENT = {
  id: '1',
  title: 'Le titre du contenu',
  description: 'Une description détaillée du contenu qui explique de quoi il s\'agit. Ce texte peut être assez long pour donner une bonne idée du contenu à l\'utilisateur.',
  longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod, nisi vel consectetur interdum, nunc nisi aliquet nunc, vitae aliquam nisl nunc vitae nunc. Sed vitae nunc sit amet nunc aliquet aliquet. Sed vitae nunc sit amet nunc aliquet aliquet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod, nisi vel consectetur interdum, nunc nisi aliquet nunc, vitae aliquam nisl nunc vitae nunc.',
  image: require('../../assets/images/slide1.png'),
  rating: 4.5,
  reviews: 128,
  genre: 'Aventure',
  year: '2023',
  duration: '2h 15min',
  platforms: ['Netflix', 'Amazon Prime', 'Disney+'],
};

// Données simulées pour les recommandations
const RECOMMENDATIONS = [
  { id: '1', image: require('../../assets/images/slide2.png'), title: 'Recommandation 1' },
  { id: '2', image: require('../../assets/images/slide3.png'), title: 'Recommandation 2' },
  { id: '3', image: require('../../assets/images/slide1.png'), title: 'Recommandation 3' },
];

// Données simulées pour les avis
const REVIEWS = [
  { id: '1', username: 'Jean D.', rating: 5, comment: 'Excellent contenu, je recommande vivement!', avatar: require('../../assets/images/slide1.png') },
  { id: '2', username: 'Marie L.', rating: 4, comment: 'Très bon contenu, quelques petits défauts.', avatar: require('../../assets/images/slide2.png') },
];

const DetailScreen = ({ route, navigation }) => {
  // Récupération de l'ID du contenu depuis les paramètres de navigation
  const { id } = route.params || {};
  
  // État pour le contenu et son chargement
  const [content, setContent] = useState(MOCK_CONTENT);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [0, 0, -50],
    extrapolate: 'clamp',
  });

  // Animation pour l'apparition des éléments
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  // Effet pour charger les données et lancer les animations
  useEffect(() => {
    // Simuler un chargement de données
    setLoading(true);
    const timer = setTimeout(() => {
      // Ici vous pourriez faire un appel API réel avec l'ID
      // fetchContentDetails(id).then(data => setContent(data));
      setLoading(false);
      
      // Lancer les animations d'apparition
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Fonction pour partager le contenu
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvre "${content.title}" sur notre application!`,
        title: content.title,
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  // Fonction pour ajouter/retirer des favoris
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Ici vous pourriez implémenter la logique pour sauvegarder l'état dans votre stockage
  };

  // Données simulées pour les plateformes de streaming
  const PLATFORMS = [
    { id: '1', name: 'Netflix', icon: 'logo-netflix', color: '#E50914', url: 'https://www.netflix.com' },
    { id: '2', name: 'Amazon Prime', icon: 'logo-amazon', color: '#00A8E1', url: 'https://www.primevideo.com' },
    { id: '3', name: 'Disney+', icon: 'tv-outline', color: '#113CCF', url: 'https://www.disneyplus.com' },
  ];
  
  // État pour le modal des plateformes
  const [platformModalVisible, setPlatformModalVisible] = useState(false);
  
  // Fonction pour ouvrir le modal des plateformes
  const handleWatchNow = () => {
    // Dans une vraie application, vous récupéreriez les plateformes disponibles pour ce contenu via API
    setPlatformModalVisible(true);
  };
  
  // Fonction pour ouvrir une plateforme externe
  const openPlatform = (url) => {
    // En production, utilisez Linking.openURL pour ouvrir des URLs externes
    // Linking.openURL(url);
    console.log(`Ouverture de ${url}`);
    setPlatformModalVisible(false);
  };

  // Rendu d'un élément de recommandation
  const renderRecommendationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recommendationItem} 
      onPress={() => navigation.replace('DetailScreen', { id: item.id })}
    >
      <Image source={item.image} style={styles.recommendationImage} />
      <Text style={styles.recommendationTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Rendu d'un avis
  const renderReview = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={item.avatar} style={styles.reviewAvatar} />
        <View>
          <Text style={styles.reviewUsername}>{item.username}</Text>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <FontAwesome 
                key={index}
                name="star" 
                size={14} 
                color={index < item.rating ? "#FFD700" : "#E0E0E0"} 
                style={{ marginRight: 2 }}
              />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  // Rendu des étoiles pour la note
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    return (
      <View style={styles.ratingStars}>
        {Array(5).fill(0).map((_, i) => {
          if (i < fullStars) {
            return <FontAwesome key={i} name="star" size={16} color="#FFD700" style={{marginRight: 3}} />;
          } else if (i === fullStars && halfStar) {
            return <FontAwesome key={i} name="star-half-o" size={16} color="#FFD700" style={{marginRight: 3}} />;
          } else {
            return <FontAwesome key={i} name="star-o" size={16} color="#FFD700" style={{marginRight: 3}} />;
          }
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header animé transparent -> opaque au scroll */}
      <Animated.View style={[
        styles.header, 
        { opacity: headerOpacity }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{content.title}</Text>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Bouton de retour (visible au début) */}
      <Animated.View 
        style={[
          styles.floatingBackButton,
          { opacity: Animated.subtract(1, headerOpacity) }
        ]}
      >
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Image de couverture avec animation */}
        <View style={styles.heroContainer}>
          <Animated.Image 
            source={content.image} 
            style={[
              styles.heroImage,
              {
                transform: [
                  { scale: imageScale },
                  { translateY: imageTranslateY }
                ]
              }
            ]} 
            resizeMode="cover"
          />
          
          {/* Dégradé pour le texte */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.gradient}
          />
          
          {/* Informations du contenu */}
          <View style={styles.contentInfo}>
            <Text style={styles.contentGenre}>{content.genre} • {content.year}</Text>
            <Text style={styles.contentTitle}>{content.title}</Text>
            <View style={styles.ratingContainer}>
              {renderRatingStars(content.rating)}
              <Text style={styles.ratingText}>{content.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsCount}>({content.reviews} avis)</Text>
            </View>
          </View>
        </View>
        
        {/* Contenu principal (animé à l'apparition) */}
        <Animated.View 
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateY }]
            }
          ]}
        >
          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.watchButton}
              onPress={handleWatchNow}
            >
              <Ionicons name="play" size={20} color="#FFF" />
              <Text style={styles.watchButtonText}>Voir maintenant</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#FF4757" : "#333"} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {expanded ? content.longDescription : `${content.description.substring(0, 120)}...`}
            </Text>
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => setExpanded(!expanded)}
            >
              <Text style={styles.expandButtonText}>
                {expanded ? "Voir moins" : "Voir plus"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Section d'informations */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{content.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{content.year}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="film-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{content.genre}</Text>
            </View>
          </View>
          
          {/* Avis des utilisateurs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Avis des utilisateurs</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            
            {REVIEWS.map(review => renderReview({ item: review }))}
            
            <TouchableOpacity style={styles.addReviewButton}>
              <Ionicons name="create-outline" size={16} color="#007AFF" />
              <Text style={styles.addReviewText}>Ajouter un avis</Text>
            </TouchableOpacity>
          </View>
          
          {/* Recommandations */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vous aimerez aussi</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={RECOMMENDATIONS}
              renderItem={renderRecommendationItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsList}
            />
          </View>
        </Animated.View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 10,
    backgroundColor: '#000',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  floatingBackButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    left: 20,
    zIndex: 5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroContainer: {
    height: height * 0.6,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  contentInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  contentGenre: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginLeft: 8,
  },
  mainContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  watchButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 12,
  },
  watchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  expandButton: {
    marginTop: 8,
  },
  expandButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  reviewItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewUsername: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  addReviewText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  recommendationsList: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  recommendationItem: {
    width: 140,
    marginRight: 16,
  },
  recommendationImage: {
    width: 140,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default DetailScreen;