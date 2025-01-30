import React, { useContext,useEffect,useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";import Animated, { useSharedValue, useAnimatedRef, useDerivedValue, scrollTo,withTiming  } from 'react-native-reanimated';
import SPACING from "../config/SPACING";
import colors from "../config/colors";
import { ProductContext } from "../context/ProductContext";
import { BlurView } from "expo-blur";
import { useCart } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import imagePaths from "../imagePaths";


const { width } = Dimensions.get("window");
const ProductList = ({ activeCategoryId }) => {
  const { products } = useContext(ProductContext);
  const categories = [...new Set(products.map((product) => product.category_id))];
  const { cart } = useCart();
  const navigation = useNavigation();
  const [categoryHeights, setCategoryHeights] = useState([]);
  // products.forEach(product => {
  //   console.log(`Product: ${product.name}, Price: €${product.price}, Category: ${product.category_id}, Filename: ${product.filename}`);
  // });


  const animatedRef = useAnimatedRef();
  const scrollValue = useSharedValue(0);


  useEffect(() => {
    const measureCategoryHeights = async () => {
      const heights = await Promise.all(
        categories.map(async (category) => {
          const categoryView = sortedProducts.find(
            (product) => product.category_id === category
          );
          if (categoryView) {
            const height = await new Promise((resolve) => {
              categoryView.measure((x, y, width, height) => resolve(height));
            });
            return height;
          }
          return 0; // Εάν δεν βρεθεί η κατηγορία, επιστρέφεται 0
        })
      );
      setCategoryHeights(heights);
    };
  
    measureCategoryHeights();
  }, [categories, sortedProducts]);
  
  


  useEffect(() => {
  }, [activeCategoryId]);

  useDerivedValue(() => {
    let totalHeight = 0;
    for (let i = 0; i <= activeCategoryId-1; i++) {
      totalHeight += categoryHeights[i]+20 || 0; // Προσθέτει το ύψος για κάθε κατηγορία, αν υπάρχει
    }
    
    scrollValue.value = totalHeight;;    
    scrollTo(animatedRef, 0, scrollValue.value, true);
  });
  
   
  

    
  
// Συνδυασμός προϊόντων
const combinedProducts = [
  ...products.filter(
    (product) => !cart.some((item) => item.product.productId === product.productId)
  ), // Προϊόντα που δεν είναι στο καλάθι
  ...cart.map((item) => ({
    ...item.product,
    cartId: item.product.cartId || item.cartId,
  })), // Όλα τα αντικείμενα του καλαθιού
];


// Ταξινόμηση προϊόντων
const sortedProducts = [...combinedProducts].sort((a, b) => {
  // Πρώτα ταξινόμηση κατά `category_id`
  if (a.category_id !== b.category_id) {
    return a.category_id - b.category_id;
  }
  // Στη συνέχεια αλφαβητική ταξινόμηση με βάση το `name`
  return a.name.localeCompare(b.name);
});
const categoryNames = [
  "Coffees",
  "Fresh Juices",
  "Beers",
  "Chocolates",
  "Water",
  "Energy Drinks"
];


  

  return (
    <Animated.ScrollView ref={animatedRef} style={styles.scrollView}>
      {categories.map((category) => (
          <View
            key={category}
            style={styles.categoryContainer}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setCategoryHeights((prev) => {
                const updatedHeights = {
                  ...prev,
                  [category]: height,
                };
                return updatedHeights;
              });
            }}
          >
            <Text style={styles.categoryText}>{categoryNames[category-1]}</Text>
            <View style={styles.productsRow}>
              {sortedProducts
                .filter((product) => product.category_id === category)
                .map((product, index) => (
                  <View
                    key={`${product.productId}-${product.cartId || "noCart"}`}
                    style={[
                      styles.coffeeCard,
                      index % 2 === 0 ? styles.leftColumn : styles.rightColumn,
                      cart.some((item) => item.product.productId === product.productId && item.product.cartId === product.cartId) && {
                        backgroundColor: "#0D687B",
                      },
                    ]}
                  >
                    <BlurView tint="dark" intensity={95} style={styles.cardBlur}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Details", { product })}
                        style={styles.cardImageContainer}
                      >
                        <Image
                          source={imagePaths[product.filename]}
                          style={styles.cardImage}
                          contentFit="cover"
                          transition={500}
                        />
                      </TouchableOpacity>
                      <Text numberOfLines={2} style={styles.coffeeName}>
                        {product.name}
                      </Text>
                      <View style={styles.priceRow}>
                        <View style={styles.priceContainer}>
                          <Text style={styles.priceText}>{product.price.toFixed(2)}</Text>
                          <Text style={styles.priceSymbol}> €</Text>
                        </View>
                        {cart.some((item) => item.product.productId === product.productId) && (
                          <View style={styles.quantityBox}>
                            <Text style={styles.quantityText}>
                              {
                                cart.find(
                                  (item) =>
                                    item.product.productId === product.productId &&
                                    item.product.cartId === product.cartId
                                )?.quantity
                              }
                            </Text>
                          </View>
                        )}
                      </View>
                    </BlurView>
                  </View>
                ))}
            </View>



          </View>
        ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height:600,
  },
  content: {
    width: '100%',
    height: 3000,
  },
  item: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  itemText: {
    fontSize: 20,
    color:"white",
    },

    container: {
      flex: 1,
      backgroundColor: colors.dark,
    },
    categoryContainer: {
      marginBottom: SPACING * 2,
    },
    coffeeCard: {
      width: width / 2 - SPACING * 2,
      margin: SPACING,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: "#0A414C",
    },
    cardBlur: {
      padding: SPACING,
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
    coffeeName: {
      color: colors.white,
      fontWeight: "600",
      fontSize: SPACING * 1.7,
      marginTop: SPACING,
    },
    priceRow: {
      marginVertical: SPACING / 2,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 35,
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
      borderColor: colors.white,
      borderWidth: 1,
      height: 35,
      width: 35,
      justifyContent: "center",
      alignItems: "center",
    },
    quantityText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.white,
    },
    productsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    categoryText: {
      color: colors.white,
      fontSize: SPACING * 1.8,
      fontWeight: "bold",
      paddingVertical: SPACING,
      paddingHorizontal: SPACING,
      borderBottomWidth: 1,
      borderColor: colors.white,
      marginHorizontal: 15,
    },
});

export default ProductList;
