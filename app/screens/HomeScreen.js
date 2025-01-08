import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useContext } from "react";
import SPACING from "../config/SPACING";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import SearchField from "../components/SearchField";
import Categories from "../components/Categories";
import ProductList from "../components/ProductList";

import { ProductContext } from '../context/ProductContext'; // Εισαγωγή του ProductContext
import imagePaths from '../imagePaths';
import { Image } from 'expo-image';
import Cart from "../components/Cart";
import CartIcon from "../svgs/CartIcon";
import ArrowDownIcon from "../svgs/ArrowDownIcon";
import { useCart } from '../context/CartContext';
import QuantityDisplay from '../components/QuantityDisplay'; // Εισαγωγή του QuantityDisplay component
import  Animated,{ useSharedValue, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';

import ProductSection from "../components/ProductSection";



const { width,height } = Dimensions.get("window");



const HomeScreen = () => {
  const { products, loading, error } = useContext(ProductContext);
  const [activeCategoryId, setActiveCategoryId] = useState(1);
  const navigation = useNavigation();
  const { cartItemCount,cart,removeFromCart,addToCart } = useCart();
  const [cartVisible, setCartVisible] = useState(false); // Διαχείριση αν το modal είναι ανοιχτό ή κλειστό
  const modalTranslateY = useSharedValue(1000); // Αρχική θέση του modal

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslateY.value }],
  }));

  const handleOpenCart = () => {
    setCartVisible(true);
    modalTranslateY.value = withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) });
  };
  
  const handleCloseCart = () => {
    modalTranslateY.value = withTiming(2000, { duration: 1200, easing: Easing.inOut(Easing.ease) });
    setTimeout(() => {
      setCartVisible(false);
    }, 500); // Δώσε χρόνο στο animation πριν κλείσεις το modal
  };
  
  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>{error}</Text>;
  }

  

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Animated.ScrollView style={styles.scrollView} > */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Find the best coffee for you</Text>
          </View>
          <View style={styles.avatarContainer}>
            <BlurView style={styles.blurPadding}>
              <TouchableOpacity onPress={handleOpenCart}>
                <CartIcon style={styles.cartIcon} />
              </TouchableOpacity>
            </BlurView>
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </View>
        </View>

        <ProductSection style={styles.productsection} />

        <Modal visible={cartVisible} onRequestClose={handleCloseCart} transparent={true}>
          <Animated.View style={[styles.modalBackground, animatedStyle]}>

              <View style={styles.cartModalContainer}>
                <Cart onOrderComplete={handleCloseCart} />
                <TouchableOpacity style={styles.closeButton} onPress={handleCloseCart}>
                  <ArrowDownIcon />
                </TouchableOpacity>
              </View>
          </Animated.View>
        </Modal>
      {/* </Animated.ScrollView> */}


    </SafeAreaView>
  );
};

export default HomeScreen;



const styles = StyleSheet.create({
  
  safeArea: {
    backgroundColor: colors.dark,
    flex: 1,
    paddingBottom: 3,
  },
  scrollView: {
    padding: SPACING,
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal:15,
  },
  menuButton: {
    borderRadius: SPACING,
    overflow: "hidden",
    width: SPACING * 4,
    height: SPACING * 4,
  },
  blurCenter: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    width: SPACING * 4.5,
    height: SPACING * 4.5,
    overflow: "visible",
    borderRadius: SPACING * 2.25,
    marginVertical: SPACING * 3,
    color:colors.white,
    
  },
  blurPadding: {
    height: "100%",
    padding: SPACING / 4,
    borderRadius: SPACING * 2.25,
    overflow: "hidden",
  },
  
  cartIcon: {
    width: SPACING * 2,
    height: SPACING * 2,
    tintColor: colors.white, // Αν θέλεις να αλλάξεις το χρώμα
  },
  
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.primary,
    borderRadius: SPACING * 2.25,
    width: SPACING * 2,
    height: SPACING * 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex:100,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: SPACING * 1.2,
    fontWeight: "bold",
    zIndex:100,

  },
  titleContainer: {
    width: "80%",
    marginVertical: SPACING*2,
  },
  title: {
    color: "#e2e8ce",
    fontSize: SPACING * 3.5,
    fontWeight: "600",
  },
  coffeesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  coffeeCard: {
    width: (width / 2 - SPACING * 2)+6,
    // height: height/3 - SPACING*2,
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor:"#0A414C",
  },
  cardBlur: {
    padding: SPACING,
    // height: height/3 - SPACING*2,
    overflow: "hidden",

  },
  cardImageContainer: {
    height: 180,
    width: "100%",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: SPACING * 2,
  },
  ratingContainer: {
    position: "absolute",
    right: 0,
    borderBottomStartRadius: SPACING * 3,
    borderTopEndRadius: SPACING * 2,
    overflow: "hidden",
  },
  
  coffeeName: {
    color: colors.white,
    fontWeight: "600",
    fontSize: SPACING * 1.7,
    marginTop: SPACING,
  },
  coffeeIncluded: {
    color: colors.secondary,
    fontSize: SPACING * 1.2,
  },
  priceRow: {
    marginVertical: SPACING / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height:35,
    // borderColor:"red",
    // borderWidth:1,
  },
  priceNameContainer: {
    flexDirection: "column",
    paddingVertical:5,
  },
  priceContainer: {
    flexDirection: "row",
    
  },
  priceSymbol: {
    color: colors.primary,
    marginRight: SPACING / 2,
    fontSize: SPACING * 1.6,
  },
  priceText: {
    color: colors.white,
    fontSize: SPACING * 1.6,
  },
  
  quantityBox: {
    backgroundColor: colors.dark,
    borderRadius: SPACING,
    borderColor:colors.white,
    borderWidth:1,
    height:35,
    width:35,   
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SPACING,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white, // Default color
  },
  
  
  //////////////////////////////////////////////////////////////
  modalBackground: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: "100%",
  },
  
  productImageModal: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  addToOrderButton: {
    backgroundColor: '#6a8d92',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  cartButton: {
    padding: 10,
  },
  cartModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 17,
    width: "100%",
    height: "85%",
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
