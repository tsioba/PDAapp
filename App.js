import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./app/screens/HomeScreen";  // Ανάλογα με το path του αρχείου σου
import CoffeeDetailsScreen from "./app/screens/CoffeeDetailsScreen";  // Ανάλογα με το path του αρχείου σου
import { ProductProvider } from './app/context/ProductContext'; // Ανάλογα με το πού αποθηκεύεις το context
import { CartProvider } from './app/context/CartContext'; // Εισαγωγή του CartProvider
import Toast from 'react-native-toast-message';
import toastConfig from './app/config/toastConfig';
import 'react-native-get-random-values';



const Stack = createStackNavigator();

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <ProductProvider>
          <Stack.Navigator initialRouteName="Home" >
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={CoffeeDetailsScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
          <Toast config={toastConfig} />
        </ProductProvider>
      </NavigationContainer>
    </CartProvider> 
  );
};

export default App;

const styles = StyleSheet.create({});
