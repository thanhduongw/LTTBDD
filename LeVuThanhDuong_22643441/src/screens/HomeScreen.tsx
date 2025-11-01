import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExpenseItem } from '../components/ExpenseItem';
import { Expense } from '../types/Expense';

export const HomeScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, title: 'Mua cà phê', amount: 45000, createdAt: '2025-11-01', type: 'expense' },
    { id: 2, title: 'Lương tháng 10', amount: 12000000, createdAt: '2025-11-01', type: 'income' },
    { id: 3, title: 'Ăn trưa', amount: 35000, createdAt: '2025-11-01', type: 'expense' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EXPENSE TRACKER</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ExpenseItem
              expense={item}
              onPress={() => console.log('Nhấn vào:', item.title)}
              onLongPress={() => console.log('Giữ lâu:', item.title)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});
