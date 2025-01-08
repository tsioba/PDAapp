import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Slider from '@react-native-community/slider';
import colors from "../config/colors";
import DropdownExample from "../components/DropdownExample ";
import { useCart } from '../context/CartContext';


const SweetnessSlider = ({ setSugar, setKind, product }) => {
  const sweetnessLevels = ['Σκέτος', 'Μέτριος', 'Γλυκός', 'Πολύ Γλυκός'];
  const { cart } = useCart();
  const cartItem = cart.find(cartItem => cartItem.product.cartId === product.cartId);
  const condition = cartItem && product.cartId;

  const [sliderValue, setSliderValue] = useState(condition ? sweetnessLevels.indexOf(cartItem.product.sugar):0);
  const [dropdownHeight, setDropdownHeight] = useState(new Animated.Value(0));
  const [dropdownOpacity, setDropdownOpacity] = useState(new Animated.Value(0));
 
  
  


  useEffect(() => {

    setSugar(sweetnessLevels[sliderValue]); // Ενημερώνει το setSugar prop


    if (sliderValue !== 0) {
      Animated.parallel([
        Animated.timing(dropdownHeight, {
          toValue: 80,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(dropdownOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(dropdownHeight, {
          toValue: 0,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(dropdownOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [sliderValue]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Επιλέξτε ζάχαρη:</Text>

      <View style={styles.marksContainer}>
        {['Σκέτος', 'Μέτριος', 'Γλυκός', 'Πολύ Γλυκός'].map((mark, index) => (
          <View key={index} style={styles.markContainer}>
            <Text 
              style={[styles.mark, sliderValue === index ? styles.markSelected : {}]}
            >
              {mark}
            </Text>
          </View>
        ))}
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={3}
        step={1}
        thumbStyle={styles.thumb}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.grey}
        value={sliderValue}
        onValueChange={(value) => setSliderValue(Math.floor(value))}
      />

      <Animated.View style={[styles.dropdown, { height: dropdownHeight, opacity: dropdownOpacity }]}>
        {sliderValue !== 0 && (
          <DropdownExample setKind={setKind} product={product} />
        )}
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 0,
    marginBottom:10,
  },
  label: {
    fontSize: 18,
    marginBottom: 0,
    color: colors.white,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  slider: {
    width: '80%',
    height: 50,
    borderRadius: 50,
    backgroundColor: colors.lightGrey,
    borderColor: colors.primary,
    borderWidth: 2,
    marginTop: 20,
    alignSelf: 'center',
    paddingRight: 15,
    paddingTop:1,
    marginBottom:20,
  },
  thumb: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 50,
  },
  marksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15,
    width: '100%',
    marginLeft: 7,
  },
  markContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  mark: {
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
  },
  markSelected: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    transform: [{ scale: 1.1 }],
    transition: 'all 7s ease-in-out',
  },
});

export default SweetnessSlider;
