// QuantityDisplay.js
import React, {useState} from 'react';
import { Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import colors from "../config/colors";


const QuantityDisplay = ({
  product,
  quantity,
  removeFromCart,
  addToCart,
  
}) => {
    const [animations, setAnimations] = useState({});
    const [borderWidth] = useState(new Animated.Value(1));
    const currentAnimation = animations[product.productId] || new Animated.Value(0); 
    const [editingItemId, setEditingItemId] = useState(null);
    const [opacity] = useState(new Animated.Value(0)); // Initial opacity for buttons (hidden)


    const toggleAnimation = (itemId) => {
        
    
        if (editingItemId === itemId) {
          // Close the expanded item
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0, // Fade out buttons
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.spring(currentAnimation, {
              toValue: 0, // Close the width expansion
              friction: 20,
              tension: 30,
              useNativeDriver: false,
            }),
          ]).start();
    
          setEditingItemId(null);
        } else {
          // Open the expanded item
          setEditingItemId(itemId);
          
          // Update the animation object with a new value for the specific item
          setAnimations({
            ...animations,
            [itemId]: currentAnimation, // Store the animation for the specific item
          });
    
          // Animate the container width first, then fade in the buttons
          Animated.spring(currentAnimation, {
            toValue: 1, // Open the width of the container
            friction: 20,
            tension: 30,
            useNativeDriver: false,
          }).start();
      
          // After opening the container, fade in the buttons
          Animated.timing(opacity, {
            toValue: 1, // Fade in buttons
            duration: 700,
            useNativeDriver: true,
          }).start();
        }
      };
  return (
    <TouchableOpacity onPress={() => toggleAnimation(product.productId)}>
      <Animated.View
        style={[
          styles.quantityContainer,
          {
            width: currentAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 110], // Animate the width
            }),
            borderWidth: borderWidth,
            borderColor: '#6a8d92',
          },
        ]}
      >
        {quantity != null ? (
          <>
            <TouchableOpacity
              style={styles.quantityButton}
        
              onPress={() =>{console.log(product.productId); removeFromCart(product.productId, 1)}}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>{console.log(product.productId); addToCart(product, 1)}}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.quantityText}>0</Text> // Αν δεν υπάρχει ποσότητα, εμφάνιση 0
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Styles for QuantityDisplay component
const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    height: 40,
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
    color: '#e2e8ce',
  },
});

export default QuantityDisplay;
