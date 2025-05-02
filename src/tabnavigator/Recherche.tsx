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
    TextInput,
    ScrollView,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Remplacez par vos assets
const PLACEHOLDER_IMAGE = require('../../assets/images/slide1.png');

const { width } = Dimensions.get('window');
const SPACING = 12;

// Données simulées pour les résultats de recherche
const MOCK_RESULTS = [
    { id: '1', image: PLACEHOLDER_IMAGE, title: 'Résultat 1', genre: 'Action', language: 'Français', year: 2024 },
    { id: '2', image: PLACEHOLDER_IMAGE, title: 'Résultat 2', genre: 'Comédie', language: 'Anglais', year: 2023 },
    { id: '3', image: PLACEHOLDER_IMAGE, title: 'Résultat 3', genre: 'Drame', language: 'Espagnol', year: 2022 },
    { id: '4', image: PLACEHOLDER_IMAGE, title: 'Résultat 4', genre: 'Science-Fiction', language: 'Français', year: 2021 },
    { id: '5', image: PLACEHOLDER_IMAGE, title: 'Résultat 5', genre: 'Action', language: 'Anglais', year: 2024 },
    { id: '6', image: PLACEHOLDER_IMAGE, title: 'Résultat 6', genre: 'Comédie', language: 'Français', year: 2023 },
];

// Options de filtres
const GENRES = ['Tous', 'Action', 'Comédie', 'Drame', 'Science-Fiction', 'Horreur'];
const LANGUAGES = ['Tous', 'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'];
const YEARS = ['Tous', '2024', '2023', '2022', '2021', '2020'];

const Recherche = ({ navigation }) => {
    // États pour la recherche et les filtres
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('Tous');
    const [selectedLanguage, setSelectedLanguage] = useState('Tous');
    const [selectedYear, setSelectedYear] = useState('Tous');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState(['action', 'comédie française', 'nouveautés 2024']);

    // Animations
    const searchBarWidth = useRef(new Animated.Value(width - 80)).current;
    const filterHeight = useRef(new Animated.Value(0)).current;
    const resultsOpacity = useRef(new Animated.Value(0)).current;
    const loadingItems = useRef(new Animated.Value(0)).current;

    // Référence pour l'input de recherche
    const searchInputRef = useRef(null);

    // Effet pour simuler le chargement des résultats
    useEffect(() => {
        if (searchQuery.length > 0) {
            // Simuler un délai de recherche
            const timer = setTimeout(() => {
                const filteredResults = MOCK_RESULTS.filter(item => {
                    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesGenre = selectedGenre === 'Tous' || item.genre === selectedGenre;
                    const matchesLanguage = selectedLanguage === 'Tous' || item.language === selectedLanguage;
                    const matchesYear = selectedYear === 'Tous' || item.year.toString() === selectedYear;

                    return matchesSearch && matchesGenre && matchesLanguage && matchesYear;
                });

                setResults(filteredResults);

                // Animation d'apparition des résultats
                Animated.sequence([
                    Animated.timing(resultsOpacity, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.stagger(100,
                        filteredResults.map((_, i) =>
                            Animated.timing(loadingItems, {
                                toValue: filteredResults.length,
                                duration: 400,
                                useNativeDriver: true,
                            })
                        )
                    )
                ]).start();

            }, 500);

            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [searchQuery, selectedGenre, selectedLanguage, selectedYear]);

    // Fonction pour gérer la recherche
    const handleSearch = () => {
        if (searchQuery.trim() !== '') {
            // Ajouter aux recherches récentes s'il n'existe pas déjà
            if (!recentSearches.includes(searchQuery.toLowerCase())) {
                setRecentSearches(prev => [searchQuery.toLowerCase(), ...prev.slice(0, 4)]);
            }
        }
        Keyboard.dismiss();
    };

    // Fonction pour gérer les filtres
    const toggleFilters = () => {
        Animated.timing(filterHeight, {
            toValue: showFilters ? 0 : 165,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setShowFilters(!showFilters);
    };

    // Fonction pour ouvrir le détail d'un résultat
    const handleResultPress = (id) => {
        navigation.navigate('ContentDetail', { id });
    };

    // Animation pour l'input de recherche
    useEffect(() => {
        Animated.timing(searchBarWidth, {
            toValue: isSearchFocused ? width - 130 : width - 80,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isSearchFocused]);

    // Rendu d'un filtre
    const renderFilterOption = (options, selectedOption, setSelectedOption) => {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
            >
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.filterOption,
                            selectedOption === option && styles.filterOptionSelected
                        ]}
                        onPress={() => setSelectedOption(option)}
                    >
                        <Text
                            style={[
                                styles.filterOptionText,
                                selectedOption === option && styles.filterOptionTextSelected
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    // Rendu d'un résultat de recherche
    const renderResultItem = ({ item, index }) => {
        const itemAnimatedValue = Animated.multiply(
            Animated.min(loadingItems, new Animated.Value(index + 1)),
            new Animated.Value(1)
        );

        const translateY = itemAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
        });

        const opacity = itemAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        return (
            <Animated.View
                style={[
                    styles.resultItemContainer,
                    { opacity, transform: [{ translateY }] }
                ]}
            >
                <TouchableOpacity
                    style={styles.resultItem}
                    activeOpacity={0.9}
                    onPress={() => handleResultPress(item.id)}
                >
                    <Image source={item.image} style={styles.resultImage} />
                    <View style={styles.resultInfo}>
                        <Text style={styles.resultTitle}>{item.title}</Text>
                        <View style={styles.resultMeta}>
                            <View style={styles.tagContainer}>
                                <Text style={styles.tagText}>{item.genre}</Text>
                            </View>
                            <View style={styles.tagContainer}>
                                <Text style={styles.tagText}>{item.language}</Text>
                            </View>
                            <View style={styles.tagContainer}>
                                <Text style={styles.tagText}>{item.year}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    // Rendu d'une recherche récente
    const renderRecentSearch = (search, index) => (
        <TouchableOpacity
            key={index}
            style={styles.recentSearchItem}
            onPress={() => {
                setSearchQuery(search);
                handleSearch();
            }}
        >
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.recentSearchText}>{search}</Text>
            <TouchableOpacity
                style={styles.recentSearchRemove}
                onPress={() => {
                    setRecentSearches(prev => prev.filter((_, i) => i !== index));
                }}
            >
                <Ionicons name="close" size={16} color="#999" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header de recherche */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Animated.View style={[styles.searchBar, { width: searchBarWidth }]}>
                        <Ionicons name="search" size={22} color="#777" style={styles.searchIcon} />
                        <TextInput
                            ref={searchInputRef}
                            style={styles.searchInput}
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => setSearchQuery('')}
                            >
                                <Ionicons name="close-circle" size={20} color="#999" />
                            </TouchableOpacity>
                        )}
                    </Animated.View>

                    {isSearchFocused && (
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setIsSearchFocused(false);
                                searchInputRef.current.blur();
                            }}
                        >
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bouton de filtre */}
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={toggleFilters}
                >
                    <Ionicons
                        name={showFilters ? "options" : "options-outline"}
                        size={24}
                        color={showFilters ? "#007AFF" : "#333"}
                    />
                </TouchableOpacity>
            </View>

            {/* Section des filtres animée */}
            <Animated.View style={[styles.filtersContainer, { height: filterHeight }]}>
                <View style={styles.filterSection}>
                    <Text style={styles.filterTitle}>Genre</Text>
                    {renderFilterOption(GENRES, selectedGenre, setSelectedGenre)}
                </View>

                <View style={styles.filterSection}>
                    <Text style={styles.filterTitle}>Langue</Text>
                    {renderFilterOption(LANGUAGES, selectedLanguage, setSelectedLanguage)}
                </View>

                <View style={styles.filterSection}>
                    <Text style={styles.filterTitle}>Année</Text>
                    {renderFilterOption(YEARS, selectedYear, setSelectedYear)}
                </View>
            </Animated.View>

            {/* Contenu principal */}
            <Animated.View style={[styles.resultsContainer, { opacity: resultsOpacity }]}>
                {searchQuery.length > 0 ? (
                    results.length > 0 ? (
                        <FlatList
                            data={results}
                            renderItem={renderResultItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.resultsList}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.noResultsContainer}>
                            <Ionicons name="search-outline" size={60} color="#CCC" />
                            <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
                            <Text style={styles.noResultsSubText}>Essayez avec d'autres mots-clés ou filtres</Text>
                        </View>
                    )
                ) : (
                    <View style={styles.recentSearchesContainer}>
                        <Text style={styles.recentSearchesTitle}>Recherches récentes</Text>
                        {recentSearches.map((search, index) => renderRecentSearch(search, index))}

                        {recentSearches.length > 0 && (
                            <TouchableOpacity
                                style={styles.clearAllButton}
                                onPress={() => setRecentSearches([])}
                            >
                                <Text style={styles.clearAllText}>Effacer l'historique</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </Animated.View>
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
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        paddingTop: Platform.OS === 'ios' ? 50 : 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 45,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        height: '100%',
        color: '#333',
    },
    clearButton: {
        padding: 4,
    },
    cancelButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    cancelText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    filterButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    filtersContainer: {
        backgroundColor: '#FFF',
        overflow: 'hidden',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    filterSection: {
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    filterScrollContent: {
        paddingVertical: 4,
        paddingRight: 20,
    },
    filterOption: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
        marginRight: 8,
    },
    filterOptionSelected: {
        backgroundColor: '#007AFF',
    },
    filterOptionText: {
        fontSize: 14,
        color: '#555',
    },
    filterOptionTextSelected: {
        color: '#FFF',
        fontWeight: '500',
    },
    resultsContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    resultsList: {
        padding: SPACING,
    },
    resultItemContainer: {
        marginBottom: SPACING,
    },
    resultItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resultImage: {
        width: 100,
        height: 100,
    },
    resultInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    resultMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagContainer: {
        backgroundColor: '#F0F2F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 6,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        color: '#555',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
    },
    noResultsSubText: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginTop: 8,
    },
    recentSearchesContainer: {
        padding: 20,
    },
    recentSearchesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    recentSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    recentSearchText: {
        flex: 1,
        fontSize: 15,
        color: '#444',
        marginLeft: 10,
    },
    recentSearchRemove: {
        padding: 4,
    },
    clearAllButton: {
        alignSelf: 'center',
        marginTop: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    clearAllText: {
        color: '#007AFF',
        fontSize: 15,
        fontWeight: '500',
    }
});

export default Recherche;