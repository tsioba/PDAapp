import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Animated, Easing } from 'react-native';
import colors from "../config/colors";
import { useCart } from '../context/CartContext';


const Dropdown = ({setKind,product}) => {

  const { cart } = useCart();
  const cartItem = cart.find(cartItem => cartItem.product.cartId === product.cartId);
  const condition = cartItem && product.cartId && !cartItem.product.sugar.includes('Σκέτος');

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(condition ? cartItem.product.kind : "Λευκή Ζάχαρη");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const selectedRef = useRef(null);
  const animation = useRef(new Animated.Value(0)).current;


  // setKind(condition?"":selectOption);

  const toggleDropdown = () => {
    if (!isOpen) {
      animation.setValue(0);
      selectedRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({ top: py + height, left: px });
        setIsAnimating(true);
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start(() => {
          setIsAnimating(false);
          setIsOpen(true);
        });
      });
    } else {
      setIsAnimating(true);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start(() => {
        setIsAnimating(false);
        setIsOpen(false);
      });
    }
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    setKind(option);
    toggleDropdown();
  };

  const dropdownStyle = {
    height: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 150], // 150px is the expanded height of the dropdown
    }),
    opacity: animation,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Επιλέξτε είδος ζάχαρης:</Text>
      <Pressable
        style={styles.selected}
        onPress={toggleDropdown}
        ref={selectedRef}
      >
        <Text style={styles.text}>{selectedOption}</Text>
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>{isOpen || isAnimating ? '▲' : '▼'}</Text>
        </View>
      </Pressable>

      {(isOpen || isAnimating) && (
        <Modal transparent={true} visible={isOpen || isAnimating} animationType="none">
          <Pressable style={styles.overlay} onPress={toggleDropdown} />
          <Animated.View
            style={[
              styles.dropdown,
              dropdownStyle,
              {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: '75%',
              },
            ]}
          >
            <ScrollView>
              {['Λευκή Ζάχαρη', 'Καστανή Ζάχαρη', 'Ζάχαρίνη', 'Στέβια', 'Μέλι'].map((option, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.pressedOption,
                  ]}
                  onPress={() => selectOption(option)}
                >
                  <Text style={styles.text}>{option}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.white,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  selected: {
    backgroundColor: '#2a2f3b',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    borderRadius: 50,
    color: colors.white,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: 20,
  },
  arrowText: {
    color: 'white',
    fontSize: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#2a2f3b',
    borderRadius: 5,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  option: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#2a2f3b',
    marginVertical: 5,
  },
  pressedOption: {
    backgroundColor: '#1e1e2f',
  },
  text: {
    color: colors.white,
    fontSize: 15,
  },
});

export default Dropdown;
