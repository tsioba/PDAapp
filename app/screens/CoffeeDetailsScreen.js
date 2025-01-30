import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,

} from "react-native";
import React, { useState, useEffect,useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import SPACING from "../config/SPACING";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { Image } from 'expo-image';
import imagePaths from '../imagePaths';
import { useCart } from '../context/CartContext';
import Toast from 'react-native-toast-message';
import CustomSwitch from "../components/CustomSwitch";
import Checkbox from "../components/Checkbox";
import SweetnessSlider from "../components/SweetnessSlider";
import CommentPlaceholder from "../components/CommentPlaceholder";
import { ProductContext } from '../context/ProductContext'; // Εισαγωγή του ProductContext



const { height, width } = Dimensions.get("window");


const CoffeeDetailsScreen = ({ route }) => {
  const { cart, addToCart, removeFromCart,updateQuantity, getQuantityInCart,existInCart,updateProductInCart,cartItemCount } = useCart();
  const { product } = route.params || {}; 

  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState(true);
  const { products} = useContext(ProductContext);
  





  const slideAnimImage = useState(new Animated.Value(height))[0]; // Για την εικόνα
  const slideAnimDescription = useState(new Animated.Value(height))[0]; // Για την περιγραφή
  const slideAnimSize = useState(new Animated.Value(height))[0]; // Για το μέγεθος
  const slideAnimFooter = useState(new Animated.Value(height))[0]; // Για το footer
  const fadeAnimHeader = useState(new Animated.Value(0))[0]; // Για το header fade-in
  const fadeAnimBlurView = useState(new Animated.Value(0))[0]; // Για το blur view fade-in
  const shouldHide = product.category_id !== "1" && product.category_id !== "4";

  const cartItem = cart.find(cartItem => cartItem.product.cartId === product.cartId);
  const cond = cartItem !== undefined && product.cartId !== undefined;
  
  const [coffeeQuantity, setcoffeeQuantity] = useState((cond&&cartItem.product.coffeeQuantity.includes('Διπλός')?'Διπλός':'Μονός' ));
  const [sugar, setSugar] = useState(cond? cartItem.product.sugar:'Σκέτος');
  const [kind, setKind] = useState((cond && !cartItem.product.sugar.includes('Σκέτος'))?cartItem.product.kind:"Λευκή Ζάχαρη");
  const [choice, setChoice] = useState((cond && cartItem.product.choice.includes('decaffeine'))?"decaffeine":"");
  const [comments, setComments] = useState((cond && cartItem.product.comments.length !== 0)?cartItem.product.comments:"");

  const toggleQuantity = () => {
    setcoffeeQuantity((prev) => (prev === "Μονός" ? "Διπλός" : "Μονός"));
  };


  const tempProduct = shouldHide
  ? product
  : {
      ...product,
      coffeeQuantity,
      sugar,
      kind,
      choice,
      comments,
    };

  const [temp2, setTemp2] = useState(tempProduct);

  useEffect(() => {
    if (tempProduct) {

      setCondition(tempProduct.productId === temp2.productId && 
        tempProduct.coffeeQuantity === temp2.coffeeQuantity && 
        tempProduct.sugar === temp2.sugar &&
        tempProduct.kind === temp2.kind && 
        tempProduct.choice === temp2.choice && 
        tempProduct.comments === temp2.comments); 
    }
  }, [tempProduct, temp2]);

  
  useEffect(() => {
    // Πρώτο animation (π.χ. για την εικόνα)
    Animated.timing(slideAnimImage, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  
    // Δεύτερο animation (π.χ. για την περιγραφή) που ξεκινάει πριν ολοκληρωθεί το πρώτο
    setTimeout(() => {
      Animated.timing(slideAnimDescription, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 500);  // Ξεκινάει μετά από 400ms από την αρχή

    // Τρίτο animation (π.χ. για το μέγεθος) που ξεκινάει πριν ολοκληρωθεί το δεύτερο
    setTimeout(() => {
      Animated.timing(slideAnimSize, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 400);  // Ξεκινάει μετά από 800ms
  
    // Τέταρτο animation (footer) που ξεκινάει μετά από 1200ms
    setTimeout(() => {
      Animated.timing(slideAnimFooter, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 650);  // Ξεκινάει μετά από 1200ms
  
    // Fade-in για το header και το blur view
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnimHeader, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimBlurView, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1200);  // Ξεκινάει μετά από 1600ms, όταν όλα τα προηγούμενα έχουν ξεκινήσει
  }, []);

  
  const quantityInCart = getQuantityInCart(tempProduct.cartId);  // Αν υπάρχει, παίρνουμε την ποσότητα

  // Χρησιμοποιούμε useEffect για να ρυθμίσουμε το quantity
  useEffect(() => {
    if (quantityInCart === 0 && quantity !== quantityInCart) {
      // Case 1: Αν το προϊόν δεν είναι στο καλάθι, θέλουμε να το θέσουμε σε 1
      setQuantity(1);
    } else if (quantityInCart !== 0 && quantity !== quantityInCart) {
      // Case 2: Αν το προϊόν υπάρχει στο καλάθι και η ποσότητα δεν ταιριάζει, θέλουμε να το θέσουμε ίσο με την ποσότητα στο καλάθι
      setQuantity(quantityInCart);
    }
  }, [quantityInCart]);



  const handleAddToCart = (quantity) => {
    addToCart(tempProduct, quantity);
    navigation.popToTop();
    Toast.show({
      type: 'success',
      text1: 'Το προϊόν προστέθηκε στο καλάθι!',
      position: 'top',
      topOffset: 50, // Ή όσο θέλεις
      autoHide: true,
      visibilityTime: 3000,
    });
    
  };
  const handleUpdate = (tempProduct,newQuantity) => {
    if (!condition) {
      updateProductInCart(tempProduct);
      navigation.goBack();
    } else {
      updateQuantity(tempProduct.productId, newQuantity);
      navigation.goBack();
    }
    // Εμφάνιση Toast μηνύματος
    Toast.show({
      type: 'update',
      text1: 'Η Παραγγελία Ενημερώθηκε!',
      position: 'top',
      topOffset: 50,
      autoHide: true,
      visibilityTime: 3000,
    });
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.productId,1);  // Αφαίρεση του προϊόντος από το καλάθι
    navigation.goBack();
    // Εμφάνιση Toast μηνύματος
    Toast.show({
      type: 'error',
      text1: 'Το προϊόν αφαιρέθηκε από το καλάθι.',
      position: 'top',
      topOffset: 50,
      autoHide: true,
      visibilityTime: 3000,
    });
  };

  const handleRemoveAll = (quantity) => {
    removeFromCart(product.productId,quantity);  // Αφαίρεση του προϊόντος από το καλάθι
    navigation.goBack();
    // Εμφάνιση Toast μηνύματος
    Toast.show({
      type: 'error',
      text1: 'Τα προϊόντα αφαιρέθηκαν.',
      position: 'top',
      topOffset: 50,
      autoHide: true,
      visibilityTime: 3000,
    });
  };

  const handleNewOrder = () => {
    // Βρες το προϊόν
    const newProduct = products.find(
      (product) => product.productId === tempProduct.productId
    );
  
    // Έλεγχος αν βρέθηκε προϊόν
    if (!newProduct) {
      console.error("Product not found with productId:", tempProduct.productId);
      return; // Τερματίζουμε αν δεν βρέθηκε προϊόν
    }
  
    // Αν βρέθηκε, πηγαίνουμε στην οθόνη "Details"
    navigation.push("Details", { product: newProduct });
  };



  



  if (!product) {
    return <Text>Δεν βρέθηκαν τα δεδομένα του προϊόντος</Text>;
  }

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.scrollContent}>
          {/* Εικόνα animation */}
          <Animated.View style={[styles.imageBackgroundContainer, { transform: [{ translateY: slideAnimImage }] }]}>
            <Image
              source={imagePaths[product.filename]} 
              style={styles.imageBackground}
              contentFit="cover" 
              transition={500} 
            />
            <Animated.View style={[styles.header, { opacity: fadeAnimHeader }]}>
              <TouchableOpacity style={styles.iconButton} onPress={() =>     navigation.popToTop()}>
                <Ionicons name="arrow-back" color={colors.light} size={SPACING * 2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart" color={colors.light} size={SPACING * 2} />
              </TouchableOpacity>
            </Animated.View>
    
            
            <Animated.View style={[styles.blurContainer, { opacity: fadeAnimBlurView }]}>
              <BlurView intensity={80} tint="dark" style={styles.blurContent}>
                <View>
                  <Text style={styles.productName}>{product.name}</Text>
                </View>
                <View >
                  <Text style={styles.productName}>{product.price.toFixed(2)} €</Text>
                </View>
              </BlurView>
            </Animated.View>
          </Animated.View>

          {!shouldHide && (

            
            <Animated.View style={[
              styles.sizeContainer, {transform: [{ translateY: slideAnimSize }],opacity:shouldHide?0:1}]}>
                
                <View style={styles.flexContainer}>
                  <Text style={styles.textStyle}>Επιλέξτε ποσότητα:</Text>
                  <CustomSwitch onToggle={toggleQuantity} product={tempProduct} />
                </View>
                  
            </Animated.View>
          )}
            <Animated.View style={[styles.descriptionContainer, { transform: [{ translateY: slideAnimDescription }],opacity:shouldHide?0:1}]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width:'100%',padding:10  }}>
              <SweetnessSlider setSugar={setSugar} setKind={setKind} product={tempProduct} />
              </View>
            </Animated.View>
            
          {!shouldHide && (

            <Animated.View style={[styles.descriptionContainer, { transform: [{ translateY: slideAnimDescription }],opacity:shouldHide?0:1 }]}>
              <Text style={[styles.textStyle,{padding:10}]}>Προαιρετική επιλογή:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', width:'100%',paddingLeft:30,marginBottom:30}}>
                <Checkbox setChoice={setChoice} product={tempProduct} />
                
              </View>
            </Animated.View>
            )}
            

            <Animated.View style={[styles.descriptionContainer, { transform: [{ translateY: slideAnimDescription }], }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width:'100%',marginTop: shouldHide?30:0 }}>
                <CommentPlaceholder setComments={setComments} product={tempProduct} />
              </View>
            </Animated.View>
        </ScrollView> 

        <Animated.View style={[styles.footer, { transform: [{ translateY: slideAnimFooter }] }]}>

          {(quantityInCart!== 0) && (
                    <TouchableOpacity
                      style={[styles.newProduct]}
                      onPress={() => handleNewOrder()}
                    >
                      <Text style={styles.newProductText}>Προσθέστε ακόμα ένα με διαφορετικές επιλογές</Text>
                    </TouchableOpacity>
                  )} 
        </Animated.View>

          {/* Footer animation */}
          <Animated.View style={[styles.footer, { transform: [{ translateY: slideAnimFooter }] }]}>
          
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(quantity - 1)}
                    disabled={quantity === 1}
                  >
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{quantity}</Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Συνθήκες για την εμφάνιση του κουμπιού */}
                {quantityInCart === 0 && quantity !== quantityInCart ? (
                  // Case 1: Αν quantityInCart == 0 και η ποσότητα είναι διαφορετική από αυτή του καλαθιού
                  <TouchableOpacity style={styles.buyButton} onPress={() => handleAddToCart(quantity)}>
                    <Text style={styles.buyButtonText}>Προσθήκη στο Καλάθι</Text>
                  </TouchableOpacity>
                ) : (quantity !== quantityInCart && quantityInCart !== 0 || !condition) ?
                (
                  // Case 2: Αν quantityInCart != 0 και η ποσότητα είναι διαφορετική από την ποσότητα στο καλάθι
                  <TouchableOpacity style={[styles.buyButton, { backgroundColor: "#3CB397" }]} onPress={() => handleUpdate(tempProduct,quantity)}>
                    <Text style={styles.buyButtonText}>Ενημέρωση Παραγγελίας</Text>
                  </TouchableOpacity>
                ) : quantity === quantityInCart && quantityInCart > 1 && product.cartId ? (
                  // Case 3: Αν quantity == quantityInCart και η ποσότητα στο καλάθι είναι μεγαλύτερη από 1
                  <TouchableOpacity
                    style={[styles.buyButton, { backgroundColor: "#E02C2C" }]}
                    onPress={() => handleRemoveAll(quantity)}
                  >
                    <Text style={styles.buyButtonText}>Αφαίρεση Όλων</Text>
                  </TouchableOpacity>
                ) : quantity === quantityInCart && quantityInCart === 1 && product.cartId ? (
                  // Case 4: Αν quantity == quantityInCart και η ποσότητα στο καλάθι είναι 1
                  <TouchableOpacity
                    style={[styles.buyButton, { backgroundColor: "#E02C2C" }]}
                    onPress={handleRemoveFromCart}
                  >
                    <Text style={styles.buyButtonText}>Αφαίρεση Προϊόντος</Text>
                  </TouchableOpacity>
                ) : null}
               
          </Animated.View>
          
      </SafeAreaView>
    </View>
  );
};

export default CoffeeDetailsScreen;



const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
    flex:1,
    flexDirection:"column",
    // borderColor:'red', borderWidth:2,
    padding:0,

  },
  scrollContent: {
    paddingBottom: -1, 
    // borderColor:'red', borderWidth:2
  },
  imageBackgroundContainer: {
    width: '100%',
    height: height / 2.5 + SPACING * 2, // Adjust height as necessary for your layout
    position: 'relative',
    justifyContent: "space-between",
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: SPACING * 3,
  },
  imageBorderRadius: {
    borderRadius: SPACING * 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING * 2,
    zIndex: 5,
  },
  iconButton: {
    backgroundColor: colors.dark,
    padding: SPACING,
    borderRadius: SPACING * 1.5,
  },
  blurContainer: {
    height:100,
    borderRadius: SPACING * 3,
    overflow: "hidden",
    zIndex: 5,
  },
  blurContent: {
    flex:1,
    paddingHorizontal: SPACING * 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    height:100,

  },
  productName: {
    fontSize: SPACING * 2,
    color: colors.white,
    fontWeight: "800",
    marginBottom: SPACING,
  },
  coffeeIncluded: {
    fontSize: SPACING * 1.8,
    color: colors["white-smoke"],
    fontWeight: "500",
    marginBottom: SPACING,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: SPACING,
  },
  ratingText: {
    color: colors.white,
    marginLeft: SPACING,
  },
  infoIconsContainer: {
    width: "35%",
    justifyContent: "space-between",
  },
  infoIcon: {
    padding: SPACING / 2,
    width: SPACING * 5,
    height: SPACING * 5,
    backgroundColor: colors.dark,
    borderRadius: SPACING,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    color: colors["white-smoke"],
    fontSize: SPACING,
  },
  descriptionContainer: {
    // flex:1,
    // flexDirection:"row"
    // padding: SPACING,
  },
  input: {
    width: "98%",
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: colors.white,
    margin:5,
    backgroundColor:colors.dark
  },
  sectionTitle: {
    color: colors["white-smoke"],
    fontSize: SPACING * 1.7,
    marginBottom: SPACING,
  },
  descriptionText: {
    color: colors.white,
  },

  pickerStyle: {
    height: 50,
    width: "50%",
    margin:0,
    padding:0
  },
  
  sizeContainer: {
    marginVertical: 0,
    // paddingHorizontal:5,
    flexDirection: 'row',
    alignItems: 'center',
    },
    flexContainer: {
      flexDirection: 'column', // Στοιχεία στη σειρά
      justifyContent: 'flex-start', // Απόσταση μεταξύ των στοιχείων
      alignItems: 'flex-start', // Κεντρική ευθυγράμμιση κατακόρυφα
      width: '100%', // Κάλυψη του διαθέσιμου πλάτους
      padding: 10, // Προαιρετικά, padding για καλύτερη εμφάνιση
    },

    textContainer: {
      marginLeft: 10, // Προσθέτει απόσταση ανάμεσα στο Checkbox/Toggle και το κείμενο
    },
    textStyle: {
      fontSize: 18,
      color: colors.white,
      fontWeight:"bold",
    },

  sizeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sizeOption: {
    borderWidth: 2,
    paddingVertical: SPACING / 3,
    borderRadius: SPACING,
    backgroundColor: colors["dark-light"],
    width: width / 3 - SPACING * 2,
    alignItems: "center",
  },
  activeSizeOption: {
    borderColor: colors.primary,
    backgroundColor: colors.dark,
  },
  sizeText: {
    color: colors["white-smoke"],
    fontSize: SPACING * 1.9,
  },
  activeSizeText: {
    color: colors.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: colors.dark,
    marginBottom:10,    
    paddingTop:0.2,
    // borderColor:'red', borderWidth:2,

  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:"#001C23",
    padding: 5,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    height: 60,
   

  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  quantityButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  buyButton: {
    backgroundColor: colors.primary,
    width: width / 2 + SPACING * 2,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SPACING * 2,
    paddingHorizontal: SPACING, // Εξασφαλίζει χώρο για wrapping
  },
  buyButtonText: {
    color: colors.white,
    fontSize: SPACING * 2,
    fontWeight: "700",
    flexWrap: "wrap",
    textAlign: "center",
    maxWidth: "90%", // Περιορίζει το πλάτος του κειμένου
  },
  newProduct:{
    marginBottom: 0 ,
    width:"100%",
    color:colors.white,
    backgroundColor:"#001C23",
    padding:SPACING,
    borderTopLeftRadius: 20, // Ακτίνα καμπύλης για την πάνω αριστερή γωνία
    borderTopRightRadius: 20,
    borderBottomWidth:2,
    borderBottomColor:colors.primary,

  },
  newProductText:{
    color:colors.white,
    fontSize: SPACING+3,
    fontWeight: "700",
    flexWrap: "nowrap",
    textAlign: "center",
    maxWidth: "100%",
  }
  
  });