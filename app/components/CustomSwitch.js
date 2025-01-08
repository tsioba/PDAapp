import React, { useState, useRef,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../config/colors";
import { useCart } from '../context/CartContext';


const CustomSwitch = ({ onToggle,product }) => {
  const { cart } = useCart();
  const cartItem = cart.find(cartItem => cartItem.product.cartId === product.cartId);
  const condition = cartItem && product.cartId && cartItem.product.coffeeQuantity.includes('Διπλός');

  const [isDarkMode, setIsDarkMode] = useState(condition);
  const position = useRef(condition ? new Animated.Value(102) : new Animated.Value(2)).current;
  const iconSize = useRef(condition ? new Animated.Value(1.5) : new Animated.Value(1)).current;
  

  
  

  


  const toggleSwitch = () => {

    Animated.timing(position, {
      toValue: isDarkMode ? 2 : 102,
      duration: 400,
      useNativeDriver: false,
    }).start();

    Animated.timing(iconSize, {
      toValue: isDarkMode ? 1:1.5,
      duration: 400,
      useNativeDriver: false,
    }).start();

    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: iconSize }] }}>
        <Icon 
          name={'coffee'} 
          size={26} 
          color={'#8E6704'} 
          style={styles.icon}
        />
      </Animated.View>
      <TouchableOpacity style={styles.switchWrapper} onPress={() => {toggleSwitch(); onToggle();}}>
      <View
          style={[
            styles.switchBackground,
            isDarkMode ? styles.darkBackground : styles.lightBackground,
          ]}
        />
        <Animated.View
          style={[
            styles.switchCircle,
            { transform: [{ translateX: position }] },
            isDarkMode && styles.switchCircleDark,
          ]}
        />
        <Text style={[styles.switchLabel, isDarkMode && styles.darkLabel]}>
          {isDarkMode ? 'Διπλός' : 'Μονός'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    marginBottom:10,
  },
  icon: {
    marginRight: 10,
  },
  switchWrapper: {
    position: 'relative',
    width: 140,
    height: 40,
    justifyContent: 'center',
  },
  switchBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  lightBackground: {
    backgroundColor: colors.white,
  },
  darkBackground: {
    backgroundColor:"#00323E",
  },
  switchCircle: {
    width: 36,
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: 18,
    position: 'absolute',
    top: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  switchCircleDark: {
    backgroundColor:colors.primary,
  },
  switchLabel: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
    width: '100%',
  },
  darkLabel: {
    color: '#FFFFFF',
  },
});

export default CustomSwitch;
