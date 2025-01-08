import React from 'react';
import { BaseToast } from 'react-native-toast-message';
import colors from './colors';

const toastConfig = {
  success: ({ text1 }) => (
    <BaseToast
      style={{
        backgroundColor: '#14cc60', // Πράσινο χρώμα για επιτυχία
        borderRadius: 50, // Στρογγυλεμένες γωνίες
        paddingVertical: 10, // Μόνο κάθετο padding
        paddingHorizontal: 20, // Σωστό οριζόντιο padding
        borderWidth: 0, // Αφαίρεση του border
        overflow: 'hidden', // Αποφυγή περίσσιου περιγράμματος
        borderLeftWidth:-10

      }}
      contentContainerStyle={{
        paddingHorizontal: 0, // Αφαίρεση του padding
        marginLeft: 0, // Αφαίρεση του περιθωρίου αριστερά
        marginRight: 0, // Αφαίρεση του περιθωρίου δεξιά
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color:colors.white,
        textAlign: 'center',
      }}
      
      text1={text1}
    />
  ),

  error: ({ text1 }) => (
    <BaseToast
      style={{
        backgroundColor: '#E02C2C', // Κόκκινο χρώμα για σφάλμα
        borderRadius: 50, // Στρογγυλεμένες γωνίες
        paddingVertical: 10, // Μόνο κάθετο padding
        paddingHorizontal: 20, // Σωστό οριζόντιο padding
        borderWidth: 0, // Αφαίρεση του border
        overflow: 'hidden', // Αποφυγή περίσσιου περιγράμματος
        borderLeftWidth:-10
      }}
      contentContainerStyle={{
        paddingHorizontal: 0, // Αφαίρεση του padding
        marginLeft: 0, // Αφαίρεση του περιθωρίου αριστερά
        marginRight: 0, // Αφαίρεση του περιθωρίου δεξιά 
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
        flexWrap: 'wrap',
        textAlign: 'center',
      }}
     
      text1={text1}
    />
  ),

  update: ({ text1}) => (
    <BaseToast
      style={{
        backgroundColor: '#3CB397', // Μπλε χρώμα για ενημέρωση
        borderRadius: 50, // Στρογγυλεμένες γωνίες
        paddingVertical: 10, // Μόνο κάθετο padding
        paddingHorizontal: 20, // Σωστό οριζόντιο padding
        borderWidth: 0, // Αφαίρεση του border
        overflow: 'hidden', // Αποφυγή περίσσιου περιγράμματος
        borderLeftWidth:-10

      }}
      contentContainerStyle={{
        paddingHorizontal: 0, // Αφαίρεση του padding
        marginLeft: 0, // Αφαίρεση του περιθωρίου αριστερά
        marginRight: 0, // Αφαίρεση του περιθωρίου δεξιά
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
      }}
      
      text1={text1}
    />
  ),
};

export default toastConfig;


