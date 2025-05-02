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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dimensions de l'écran pour les calculs de taille
const { width } = Dimensions.get('window');
const SPACING = 12;

// Données simulées pour les favoris
const FAVORITE_ITEMS = [
  { 
    id: '1', 
    image: require('../../assets/images/slide1.png'), 
    title: 'Titre de la vidéo 1', 
    category: 'Catégorie 1', 
    duration: '5:24',
    dateAdded: '2 jan 2025',
    views: '15K'
  },
  { 
    id: '2', 
    image: require('../../assets/images/slide2.png'), 
    title: 'Titre de la vidéo 2', 
    category: 'Catégorie 2', 
    duration: '3:10',
    dateAdded: '28 déc 2024',
    views: '7.2K'
  },
  { 
    id: '3', 
    image: require('../../assets/images/slide3.png'), 
    title: 'Titre de la vidéo 3', 
    category: 'Catégorie 3', 
    duration: '8:45',
    dateAdded: '15 déc 2024',
    views: '32K'
  },
  { 
    id: '4', 
    image: require('../../assets/images/slide1.png'), 
    title: 'Titre de la vidéo 4', 
    category: 'Catégorie 1', 
    duration: '4:18',
    dateAdded: '10 déc 2024',
    views: '9.5K'
  },
  { 
    id: '5', 
    image: require('../../assets/images/slide2.png'), 
    title: 'Titre de la vidéo 5', 
    category: 'Catégorie 2', 
    duration: '2:57',
    dateAdded: '5 déc 2024',
    views: '21K'
  },
];

// Données simulées pour l'historique
const HISTORY_ITEMS = [
  { 
    id: '6', 
    image: require('../../assets/images/slide3.png'), 
    title: 'Vidéo vue récemment 1', 
    category: 'Catégorie 3', 
    duration: '6:12',
    viewedDate: 'Aujourd\'hui',
    progress: 0.7, // Représente 70% de la vidéo visualisée
  },
  { 
    id: '7', 
    image: require('../../assets/images/slide1.png'), 
    title: 'Vidéo vue récemment 2', 
    category: 'Catégorie 1', 
    duration: '4:50',
    viewedDate: 'Hier',
    progress: 1, // Vidéo entièrement visualisée
  },
  { 
    id: '8', 
    image: require('../../assets/images/slide2.png'), 
    title: 'Vidéo vue récemment 3', 
    category: 'Catégorie 2', 
    duration: '7:30',
    viewedDate: 'Il y a 2 jours',
    progress: 0.3, // Représente 30% de la vidéo visualisée
  }
];

const FavoritesScreen = ({ navigation }) => {
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

  // Animation pour l'apparition des éléments
  const [itemAppear] = useState(new Animated.Value(0));
  
  // État pour le mode d'affichage (favoris ou historique)
  const [activeTab, setActiveTab] = useState('favorites');
  
  // États pour gérer la suppression
  const [favorites, setFavorites] = useState(FAVORITE_ITEMS);
  const [history, setHistory] = useState(HISTORY_ITEMS);
  
  useEffect(() => {
    // Animation de démarrage
    Animated.timing(itemAppear, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Fonction pour naviguer vers la vue détaillée
  const handleOpenDetail = (id) => {
    navigation.navigate('DetailScreen', { id });
  };

  // Fonction pour supprimer un élément des favoris
  const handleRemoveFavorite = (id) => {
    Alert.alert(
      "Supprimer des favoris",
      "Êtes-vous sûr de vouloir retirer cet élément de vos favoris ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            setFavorites(favorites.filter(item => item.id !== id));
          }
        }
      ]
    );
  };
  
  // Fonction pour supprimer un élément de l'historique
  const handleRemoveFromHistory = (id) => {
    Alert.alert(
      "Supprimer de l'historique",
      "Êtes-vous sûr de vouloir retirer cet élément de votre historique ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            setHistory(history.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  // Rendu d'un élément des favoris
  const renderFavoriteItem = ({ item, index }) => {
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
          styles.itemContainer,
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <TouchableOpacity
          style={styles.favoriteCard}
          activeOpacity={0.9}
          onPress={() => handleOpenDetail(item.id)}
        >
          <View style={styles.thumbnailContainer}>
            <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />
            <View style={styles.duration}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.textContent}>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <View style={styles.metaContainer}>
                <Text style={styles.metaText}>Ajouté le {item.dateAdded}</Text>
                <Text style={styles.metaText}>{item.views} vues</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleRemoveFavorite(item.id)}
              >
                <Ionicons name="close-circle-outline" size={24} color="#FF4757" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleOpenDetail(item.id)}
              >
                <Ionicons name="arrow-forward-circle-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Rendu d'un élément de l'historique
  const renderHistoryItem = ({ item, index }) => {
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
          styles.itemContainer,
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <TouchableOpacity
          style={styles.favoriteCard}
          activeOpacity={0.9}
          onPress={() => handleOpenDetail(item.id)}
        >
          <View style={styles.thumbnailContainer}>
            <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />
            <View style={styles.duration}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
            
            {/* Barre de progression pour les vidéos de l'historique */}
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${item.progress * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.textContent}>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.viewedDate}>Vu {item.viewedDate}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleRemoveFromHistory(item.id)}
              >
                <Ionicons name="close-circle-outline" size={24} color="#FF4757" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleOpenDetail(item.id)}
              >
                <Ionicons name="arrow-forward-circle-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Rendu du contenu principal selon l'onglet actif
  const renderContent = () => {
    if (activeTab === 'favorites') {
      return (
        favorites.length > 0 ? (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart" size={60} color="#E0E0E0" />
            <Text style={styles.emptyText}>Aucun favori</Text>
            <Text style={styles.emptySubText}>
              Les vidéos que vous aimez apparaîtront ici
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.navigate('HomeScreen')}
            >
              <Text style={styles.exploreButtonText}>Explorer du contenu</Text>
            </TouchableOpacity>
          </View>
        )
      );
    } else {
      return (
        history.length > 0 ? (
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="time" size={60} color="#E0E0E0" />
            <Text style={styles.emptyText}>Historique vide</Text>
            <Text style={styles.emptySubText}>
              Les vidéos que vous regardez apparaîtront ici
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.navigate('HomeScreen')}
            >
              <Text style={styles.exploreButtonText}>Explorer du contenu</Text>
            </TouchableOpacity>
          </View>
        )
      );
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
        <Text style={styles.headerTitle}>Mes collections</Text>
        {/* Actions du header */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => Alert.alert("Information", "Fonctionnalité de tri à venir")}
          >
            <Ionicons name="filter" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Tabs de navigation */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'favorites' && styles.activeTab
          ]}
          onPress={() => setActiveTab('favorites')}
        >
          <Ionicons 
            name={activeTab === 'favorites' ? "heart" : "heart-outline"} 
            size={18} 
            color={activeTab === 'favorites' ? "#007AFF" : "#666"} 
            style={styles.tabIcon}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'favorites' && styles.activeTabText
          ]}>Favoris</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'history' && styles.activeTab
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons 
            name={activeTab === 'history' ? "time" : "time-outline"} 
            size={18} 
            color={activeTab === 'history' ? "#007AFF" : "#666"} 
            style={styles.tabIcon}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'history' && styles.activeTabText
          ]}>Historique</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    padding: SPACING,
    paddingBottom: 30,
  },
  itemContainer: {
    marginBottom: 16,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 180,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  duration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF4757',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  textContent: {
    flex: 1,
    paddingRight: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  viewedDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  actionButtons: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FavoritesScreen;