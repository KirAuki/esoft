import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

type InputProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  keyboardType?: any;
  placeholder?: string;
  isRequired?: boolean;
};

function Input({ label, value, onChange, placeholder, keyboardType, isRequired }: InputProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label}{isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 4,
    borderRadius: 4,
  },
});

export default Input;