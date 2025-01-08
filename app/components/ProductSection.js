import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle } from 'react-native-reanimated';
import SearchField from "./SearchField";
import Categories from "./Categories";
import ProductList from "./ProductList";
import colors from "../config/colors";

const { width } = Dimensions.get("window");

const ProductSection = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(1);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const stickyHeaderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: 0 }], // Σταθερό header
  }));

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]}>

        
        <SearchField />
        <Categories onChange={(id) => setActiveCategoryId(id)} />
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <ProductList activeCategoryId={activeCategoryId} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    position: "absolute",
    backgroundColor:colors.dark,
    top: 0,
    left: 0,
    right: 0,
    padding: 5,
    zIndex: 10,
    elevation: 4, // Shadow για Android
    shadowColor: "#000", // Shadow για iOS
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  scrollViewContent: {
    paddingTop: 100, // Δώσε χώρο για το sticky header
    zIndex: 10,

  },
});

export default ProductSection;
