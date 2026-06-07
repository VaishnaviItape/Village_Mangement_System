import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const CustomInput = ({ 
  label, 
  iconName, 
  error, 
  password, 
  onFocus = () => {}, 
  ...props 
}) => {
  const [hidePassword, setHidePassword] = useState(password);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? Colors.danger
              : isFocused
              ? Colors.primary
              : Colors.lightGray,
            backgroundColor: isFocused ? Colors.white : Colors.background,
          },
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            style={styles.icon}
            color={isFocused ? Colors.primary : Colors.gray}
          />
        )}
        <TextInput
          style={styles.input}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          placeholderTextColor={Colors.gray}
          {...props}
        />
        {password && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
              style={styles.icon}
              color={Colors.gray}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '600',
  },
  inputContainer: {
    height: 55,
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
  },
  input: {
    color: Colors.text,
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    marginTop: 7,
    color: Colors.danger,
    fontSize: 12,
  },
});

export default CustomInput;
