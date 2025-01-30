import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Δημιουργία του context
export const ProductContext = createContext();

// Provider για να περνάς τα δεδομένα του context
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Για να παρακολουθείς το αν φορτώνουν τα δεδομένα
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Φόρτωμα των προϊόντων από το backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.1.64:8080/api/products');  // Χρησιμοποιούμε το Axios για την αίτηση
        setProducts([...response.data]);
      } catch (err) {
        console.error('Something went wrong: ' + err.message);
      } finally {
        setLoading(false);  // Αλλάζουμε την κατάσταση του loading όταν ολοκληρωθεί
      }
    };

    fetchProducts();
  }, []); // Καλείται μόνο μια φορά κατά την εκκίνηση της εφαρμογής

  // Κλήση στον endpoint με βάση το searchQuery
  const fetchProductsBySearchQuery = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await axios.get(`http://192.168.1.64:8080/api/products/search?name=${searchQuery}`); 
        const searchedProducts = response.data;
        if (searchedProducts.length > 0) {
          setProducts(searchedProducts);  // Αν υπάρχει αποτέλεσμα, ενημερώνει τα προϊόντα με τα αποτελέσματα
        } else {
          setProducts([...products]);  // Αν δεν υπάρχει αποτέλεσμα, εμφανίζονται όλα τα προϊόντα
        }
      } catch (err) {
        console.error('Something went wrong: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setProducts([...products]);  // Εμφανίζει όλα τα προϊόντα αν το searchQuery είναι κενό
    }
  };

  // Κλήση κάθε φορά που αλλάζει το searchQuery
  useEffect(() => {
    fetchProductsBySearchQuery();
  }, [searchQuery]);

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading, 
      error,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </ProductContext.Provider>
  );
};
