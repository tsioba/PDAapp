import React, { createContext, useState, useContext, useEffect  } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Δημιουργία του Context για το καλάθι
const CartContext = createContext();

// Παρέχουμε το context στους καταναλωτές του
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0); // Αρχική τιμή 0 για τον αριθμό των προϊόντων στο καλάθι

  // Υπολογισμός του αριθμού των προϊόντων στο καλάθι
  useEffect(() => {
    // Υπολογίζουμε τον συνολικό αριθμό των προϊόντων, προσθέτοντας την ποσότητα κάθε προϊόντος
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalItems); // Ενημερώνουμε τον αριθμό των προϊόντων στο καλάθι
  }, [cart]); // Εξαρτάται από το cart, οπότε θα ενημερώνεται όταν το cart αλλάξει


  const existInCart = (product) => {
    return cart.some(item =>
      item.product.productId === product.productId 
    );
  };
  


  // Προσθήκη προϊόντος στο καλάθι
  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      if (existInCart(product) && product.cartId) {
        const existingProductIndex = prevCart.findIndex((item) => item.product.productId === product.productId);
  
        if (existingProductIndex >= 0) {
          const updatedCart = [...prevCart];
          updatedCart[existingProductIndex].quantity += quantity; // Αύξηση της ποσότητας
          return updatedCart;
        }
      } else {
        // Δημιουργία νέου προϊόντος με μοναδικό cartId
        const productWithCartId = { ...product, cartId: uuidv4() };  
        return [...prevCart, { product: productWithCartId, quantity }]; // Προσθήκη νέου προϊόντος
      }
      return prevCart; // Σε περίπτωση που δεν υπάρχει αλλαγή, επιστροφή του ίδιου καλαθιού
    });
  };
  


  // Αφαίρεση συγκεκριμένης ποσότητας προϊόντος από το καλάθι
  const removeFromCart = (productId, quantity) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.product.productId === productId);

      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        const existingProduct = updatedCart[existingProductIndex];

        if (existingProduct.quantity > quantity) {
          // Μειώνουμε την ποσότητα του προϊόντος
          existingProduct.quantity -= quantity;
        } else {
          // Αφαιρούμε το προϊόν αν η ποσότητα είναι μικρότερη ή ίση
          updatedCart.splice(existingProductIndex, 1);
        }

        return updatedCart;
      }
      return prevCart;
    });
  };


  const updateProductInCart = (tempProduct) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.product.productId === tempProduct.productId
      );
      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].product =tempProduct;

        return updatedCart;
      } else {
        return prevCart; // Αν δεν υπάρχει το προϊόν, επιστρέφεται το αρχικό καλάθι
      }
    });
  };
  

  // Συνάρτηση για ενημέρωση της ποσότητας του προϊόντος στο καλάθι
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.product.productId === productId);

      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity = quantity;  // Ενημέρωση της ποσότητας
        return updatedCart;
      }

      return prevCart;
    });
  };

  // Συνάρτηση για να επιστρέφει την ποσότητα ενός προϊόντος στο καλάθι
  const getQuantityInCart = (cartId) => {
    const productInCart = cart.find(item => item.product.cartId === cartId);
    return productInCart ? productInCart.quantity : 0; // Επιστρέφει την ποσότητα, αν το προϊόν υπάρχει
  };

  const clearCart = () => {
    setCart([]); // Καθαρίζει όλα τα στοιχεία από το καλάθι
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart,cartItemCount,getQuantityInCart,updateQuantity,existInCart ,updateProductInCart  }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook για εύκολη πρόσβαση στο Context
export const useCart = () => useContext(CartContext);
