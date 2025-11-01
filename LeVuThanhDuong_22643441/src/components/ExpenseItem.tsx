import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Expense } from '../types/Expense';

interface ExpenseItemProps {
    expense: Expense;
    onPress: () => void;
    onLongPress: () => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onPress, onLongPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <View style={styles.content}>
                <Text style={styles.title}>{expense.title}</Text>
                <Text style={[
                    styles.amount,
                    expense.type === 'income' ? styles.income : styles.expense
                ]}>
                    {expense.type === 'income' ? '+' : '-'}${expense.amount}
                </Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.date}>{expense.createdAt}</Text>
                <Text style={styles.type}>
                    {expense.type === 'income' ? 'Thu' : 'Chi'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    income: {
        color: '#4CAF50',
    },
    expense: {
        color: '#F44336',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    type: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },
});

export default ExpenseItem;