import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Expense } from '../types/Expense';

interface ExpenseItemProps {
  expense: Expense;
  onPress?: () => void;
  onLongPress?: () => void;
  showType?: boolean;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ 
  expense, 
  onPress, 
  onLongPress,
  showType = true 
}) => {
  const isIncome = expense.type === 'income';
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <View style={styles.iconContainer}>
        <View style={[
          styles.iconBackground,
          { backgroundColor: isIncome ? '#E8F5E8' : '#FFEBEE' }
        ]}>
          <Ionicons 
            name={isIncome ? 'arrow-down' : 'arrow-up'} 
            size={20} 
            color={isIncome ? '#4CAF50' : '#F44336'} 
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {expense.title}
        </Text>
        <Text style={styles.date}>
          {new Date(expense.createdAt).toLocaleDateString('vi-VN')}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[
          styles.amount,
          { color: isIncome ? '#4CAF50' : '#F44336' }
        ]}>
          {isIncome ? '+' : '-'}${expense.amount.toLocaleString()}
        </Text>
        {showType && (
          <Text style={styles.type}>
            {isIncome ? 'Thu nhập' : 'Chi tiêu'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
    color: '#666',
  },
});
