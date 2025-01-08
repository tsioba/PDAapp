import React, { useRef } from 'react';
import { TextInput, StyleSheet, Animated, View, Keyboard } from 'react-native';
import colors from "../config/colors";
import { useCart } from '../context/CartContext';

const YourComponent = ({setComments, product}) => {

  const { cart } = useCart();
  const cartItem = cart.find(cartItem => cartItem.product.cartId === product.cartId);
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const condition = cartItem && product.cartId && cartItem.product.comments.length !== 0 ;
  const placeholderText = condition ? cartItem.product.comments : "Σχόλια (αν υπάρχουν ειδικές οδηγίες)";

  const handleFocus = () => {
    Animated.timing(keyboardOffset, {
      toValue: -230, // Προς τα πάνω το input
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (text) => {
    setComments(text);
    Animated.timing(keyboardOffset, {
      toValue: 0, // Επιστροφή στο αρχικό ύψος
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: keyboardOffset }] }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholderText}
            multiline={true}
            numberOfLines={4} // Περισσότερες γραμμές
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event.nativeEvent.text)}
            placeholderTextColor={colors.white}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: colors.dark,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  input: {
    width: '100%',
    height: 100, // Μεγαλύτερο ύψος για περισσότερες γραμμές
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding:10,
    textAlignVertical: 'top', 
    backgroundColor: colors.light,
    color: colors.white,
    placeholderTextColor: colors.white, // Προσθέσαμε τη ρύθμιση για το placeholder
  },
});

export default YourComponent;
