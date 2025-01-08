import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import colors from "../config/colors";
import { useCart } from '../context/CartContext';

const Checkbox = ({setChoice, product}) => {

  const { cart } = useCart();
  const cartItem = cart.find(cartItem => cartItem.product.cartId === product.cartId);
  const condition = cartItem && product.cartId && cartItem.product.choice.includes('decaffeine');


  const [checked, setChecked] = useState(condition);

  const toggleCheckbox = () => {
    setChecked(!checked);
    if (checked) {
      setChoice(""); 
    } else {
      setChoice('decaffeine'); 
    }
  };

  return (
    <TouchableOpacity onPress={toggleCheckbox} style={styles.wrapper}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.text}>Decaffeine</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.white,
    fontWeight:"600",
  },
});

export default Checkbox;
