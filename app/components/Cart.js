import React, { useState  } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { Linking } from 'react-native';
import { Image } from 'expo-image';
import imagePaths from '../imagePaths';
import QuantityDisplay from './QuantityDisplay'; // Εισαγωγή του QuantityDisplay component
import colors from "../config/colors";
import CommentPlaceholder from "../components/CommentPlaceholder";
import Toast from 'react-native-toast-message';


export default function Cart({ onOrderComplete }) {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [editingItemId, setEditingItemId] = useState(null);
  const [animations, setAnimations] = useState({}); // Object to store animation values for each item
  const [borderWidth] = useState(new Animated.Value(1)); // Animated value for border width

  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const [opacity] = useState(new Animated.Value(0)); // Initial opacity for buttons (hidden)



  const handleOrderComplete = async () => {
    const orderItems = cart.map((item) => {
      const { product, quantity } = item;
      const specialInstructions = [
        product?.coffeeQuantity,
        product?.sugar,
        product?.kind,
        product?.choice,
        product?.comments,
      ]
        .filter(Boolean)
        .join(', ');

      return {
        productId: product.productId,
        quantity: quantity,
        specialInstructions: specialInstructions,
      };
    });

    const order = {
      tableId: 1,
      totalAmount: totalPrice,
      orderItems: orderItems,
    };

    try {
      const response = await fetch('http://192.168.1.64:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Απάντηση από τον διακομιστή:", result);

        // Εμφάνιση επιτυχίας με toast
        Toast.show({
          type: 'success',
          text1: 'Η παραγγελία σας ολοκληρώθηκε!',
          position: 'top',
          topOffset: 50,
          autoHide: true,
          visibilityTime: 3000,
        });

        // Άδειασμα του καλαθιού
        clearCart();

        if (onOrderComplete) {
          onOrderComplete(); // Κλήση για κλείσιμο
        }
          
        
      } else {
        const errorMessage = await response.text();
        console.error("Σφάλμα κατά την αποστολή της παραγγελίας:", errorMessage);

        // Εμφάνιση αποτυχίας με toast
        Toast.show({
          type: 'error',
          text1: 'Η παραγγελία απέτυχε. Προσπαθήστε ξανά.',
        });
      }
    } catch (error) {
      console.error("Σφάλμα σύνδεσης:", error);

      // Εμφάνιση αποτυχίας με toast
      Toast.show({
        type: 'error',
        text1: 'Αποτυχία σύνδεσης με τον διακομιστή.',
      });
    }
  };

    
    
  

 

 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Το Καλάθι Σας</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item?.product?.cartId?.toString() || '0'}
        renderItem={({ item }) => {
          // Έλεγχος αν το product υπάρχει
          if (!item.product) {
            console.error("Product is missing:", item);
            return null; // Ή μπορείς να επιστρέψεις κάποιο fallback στοιχείο
          }


          return (
            <View style={styles.cartItem}>
              <Image
                source={imagePaths[item.product.filename]}
                style={styles.productImage}
                contentFit="cover"
                transition={500}
              />
              <View style={styles.itemDetails}>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemPrice}>{item.product.price.toFixed(2)} €</Text>
                  <Text style={styles.itemDetails2}>
                    {[
                      item.product?.coffeeQuantity,
                      item.product?.sugar,
                      item.product?.kind,
                      item.product?.choice,
                      item.product?.comments
                    ].filter(Boolean).join(', ')}
                  </Text>
                </View>
                <QuantityDisplay
                  product={item.product} // Pass the productId
                  quantity={item.quantity} // Pass the quantity
                  removeFromCart={removeFromCart}
                  addToCart={addToCart}
                />
              </View>
            </View>

            
          );
        }}
      />
      
      <View style={{ marginBottom: 25 }}> 
        <Text style={styles.total}>Σύνολo: {totalPrice.toFixed(2)} €</Text>
        <TouchableOpacity style={styles.completeOrderButton} onPress={handleOrderComplete}>
          <Text style={styles.completeOrderButtonText}>Ολοκλήρωση Παραγγελίας</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#001C23",
    borderRadius: 15,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e2e8ce',
    marginBottom: 20,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
    marginVertical: 8,
    borderTopColor:colors.white,
    borderTopWidth: 2,
    backgroundColor: "#001C23",
   
    
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginLeft: 6,
  },
  itemDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginVertical: 5,
    paddingRight:12,
    // borderWidth:2
  },
  itemTextContainer: {
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 7,
    marginVertical: 8,
    width:'60%',
    // borderWidth:2

  },
  itemName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#e2e8ce',
  },
  itemPrice: {
    fontSize: 16,
    color: '#e2e8ce',
    marginTop: 4,
  },
  itemDetails2:{
    fontSize: 10,
    flexDirection: 'row',
    flexWrap:'wrap',
    color: '#e2e8ce',
    borderColor:"red",
    // borderWidth:2
  },
 
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e2e8ce',
    textAlign: 'right',
    padding:10,
    
  },
  completeOrderButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 15,
  },
  completeOrderButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
