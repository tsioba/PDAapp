import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";  // Εισαγωγή axios για την αίτηση στο backend
import colors from "../config/colors";
import SPACING from "../config/SPACING";

const Categories = ({ onChange }) => {
  const [categories, setCategories] = useState([]);  // Αποθήκευση κατηγοριών από το backend
  const [loading, setLoading] = useState(true); // Για να παρακολουθείς αν φορτώνουν οι κατηγορίες
  const [error, setError] = useState(null); // Για να αποθηκεύσεις τυχόν σφάλματα
  const [activeCategoryId, setActiveCategoryId] = useState(1);

  useEffect(() => {
    // Λήψη των κατηγοριών από το backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://192.168.1.7:8080/categories"); // Αντικατέστησε με το πραγματικό URL
        setCategories(response.data);  // Αποθήκευση των δεδομένων στο state
      } catch (err) {
        setError("Something went wrong: " + err.message);  // Σφάλμα αν η αίτηση αποτύχει
      } finally {
        setLoading(false);  // Αλλάζουμε το loading σε false όταν ολοκληρωθεί η αίτηση
      }
    };

    fetchCategories();  // Καλούμε τη συνάρτηση για να πάρουμε τις κατηγορίες
  }, []);  // Καλείται μόνο μία φορά κατά την εκκίνηση του component

  // Εάν φορτώνει ή υπάρχει σφάλμα, εμφάνισε μηνύματα
  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handlePress = (id) => {
    setActiveCategoryId(id);  // Αποθηκεύει την ενεργή κατηγορία
    if (onChange) {
      onChange(id);  // Καλεί την callback συνάρτηση αν παρέχεται
    }
  };

  return (
    <FlatList
      horizontal
      data={categories}  // Χρησιμοποιούμε τις κατηγορίες από το backend
      keyExtractor={(item) => item.id.toString()}  // Χρησιμοποιούμε το id ως κλειδί
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handlePress(item.id)}  // Όταν πατηθεί η κατηγορία, ενημερώνεται το activeCategoryId
          style={styles.categoryButton}
        >
          <Text
            style={[
              styles.categoryText,
              activeCategoryId === item.id && styles.activeCategoryText,
            ]}
          >
            {item.name}  {/* Εμφανίζει το όνομα της κατηγορίας */}
          </Text>
          {activeCategoryId === item.id && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      )}
    />
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING,
    
  },
  categoryButton: {
    marginRight: SPACING * 2,
    alignItems: "center",
  },
  categoryText: {
    color: colors.secondary,
    fontSize: SPACING * 2,
    textAlign: "center",
  },
  activeCategoryText: {
    color: colors.primary,
  },
  activeIndicator: {
    height: 2,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: SPACING / 2,
    marginTop: SPACING / 2,
    // backgroundColor:"red"
  },
});

