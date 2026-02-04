import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// We export Colors so the main file can use them for Icons
export const Colors = {
  primary: '#3F51B5',
  background: '#F5F7FB',
  textDark: '#1A1A1A',
  textLight: '#999999',
  white: '#FFFFFF',
  red: '#FF5A5F',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerLocationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginHorizontal: 5,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  // --- Search Styles ---
  searchContainerRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 50,
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
  },
  filterBtn: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- Category Styles ---
  categoriesList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  categoryItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  // --- Section Styles ---
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  // --- Property Card Styles ---
  cardHorizontal: {
    width: width * 0.7, // 70% of screen width
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginRight: 15,
    padding: 12,
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardVertical: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 20,
    padding: 12,
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  imageContainer: {
      position: 'relative',
  },
  cardImageHorizontal: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },
  cardImageVertical: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    marginBottom: 10,
  },
  heartIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: Colors.white,
      padding: 6,
      borderRadius: 20,
  },
  typeTag: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: Colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
  },
  typeTagText: {
      color: Colors.white,
      fontSize: 10,
      fontWeight: 'bold',
  },
  cardContent: {
      paddingHorizontal: 5,
      paddingBottom: 5
  },
  houseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceSuffix: {
      fontSize: 12,
      color: Colors.textLight,
      fontWeight: 'normal'
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextCard: {
    fontSize: 12,
    color: Colors.textLight,
  },
  // --- Ads Banner Styles ---
  adsBannerContainer: {
      paddingHorizontal: 20,
      marginBottom: 25,
  },
  dummyAdsBanner: {
      width: '100%',
      height: 140,
      backgroundColor: '#003366', // Dark blue placeholder
      borderRadius: 20,
      justifyContent: 'center',
      paddingLeft: 25,
  }
});