import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>Назад</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Имя"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Фамилия"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Электронная почта"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Пароль"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.togglePassword}>{showPassword ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Зарегистрироваться</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('./')} style={styles.loginLink}>
        <Text style={styles.loginText}>Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: 'blue',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  passwordInput: {
    flex: 1,
  },
  togglePassword: {
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  registerText: {
    color: 'white',
    textAlign: 'center',
  },
  loginLink: {
    marginTop: 10,
  },
  loginText: {
    color: 'blue',
    textAlign: 'center',
  },
});
