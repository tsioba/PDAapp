import React, { useState, useRef, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import SPACING from "../config/SPACING";
import { ProductContext } from '../context/ProductContext';  // Προσθήκη εισαγωγής του context

const SearchField = () => {
  const [isFocused, setIsFocused] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const { setSearchQuery } = useContext(ProductContext);  // Χρήση του context για το setSearchQuery
  const inputRef = useRef(null);  // Χρήση useRef για να καθαρίσει το TextInput
  const [text, setText] = useState('');  // Χρήση κατάστασης για το περιεχόμενο του TextInput

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(scale, {
      toValue: 1.04,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(scale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    inputRef.current.clear(); 
    setText('');  
  };

  const handleSearchChange = (text) => {
    setText(text);  // Ενημερώνει την κατάσταση του κειμένου
    setSearchQuery(text);  // Ενημερώνει το context με το query
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.blurContainer, { transform: [{ scale }] }]}
      >
        <BlurView intensity={30} style={styles.blurView}>
          <Ionicons
            style={styles.icon}
            name="search"
            color={colors.white}
            size={SPACING * 2}
          />
          <TextInput
            ref={inputRef}
            style={[styles.input, isFocused && styles.inputFocused]}
            placeholder="Find Your Coffee..."
            placeholderTextColor={colors.white}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleSearchChange}  // Εισαγωγή χειριστή αλλαγής τιμής
            value={text}  // Εισαγωγή τιμής από την κατάσταση
          />
          {text.length > 0 && (
            <Ionicons
              style={styles.clearIcon}
              name="close-circle"
              color={colors.white}
              size={SPACING * 2}
              onPress={() => { 
                inputRef.current.clear(); 
                setText('');  // Καθαρίζει και την κατάσταση του κειμένου
                setSearchQuery('');  // Καθορίζει το setSearchQuery σε κενό string
              }}  // Χειριστής για τον καθαρισμό του TextInput
            />
          )}
        </BlurView>
      </Animated.View>
    </View>
  );
};

export default SearchField;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
  },
  blurContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  blurView: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: SPACING,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: SPACING * 1.7,
    padding: SPACING,
    paddingLeft: SPACING * 3.5,
  },
  inputFocused: {
    shadowColor: "#969696",
    shadowOffset: { width: 13, height: 13 },
    shadowOpacity: 1,
    shadowRadius: 100,
  },
  icon: {
    position: "absolute",
    left: SPACING,
  },
  clearIcon: {
    position: "absolute",
    right: SPACING,
  },
});
