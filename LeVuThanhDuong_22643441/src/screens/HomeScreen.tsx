import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import ExpenseItem from '../components/ExpenseItem';
import { Expense } from '../types/Expense';
import { initDB, getExpenses, deleteExpense } from '../database/database';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const isFocused = useIsFocused();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeDB = async () => {
            try {
                await initDB();
                await loadExpenses();
            } catch (error) {
                console.error('Error initializing database:', error);
            } finally {
                setIsLoading(false);
            }
        };
        initializeDB();
    }, []);

    useEffect(() => {
        if (isFocused) {
            loadExpenses();
        }
    }, [isFocused]);

    const loadExpenses = async () => {
        try {
            const data = await getExpenses();
            setExpenses(data as Expense[]);
        } catch (error) {
            console.error('Error loading expenses:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách thu/chi');
        }
    };

    const handleAddExpense = () => {
        navigation.navigate('AddEditExpense', { isEdit: false });
    };

    const handleEditExpense = (expense: Expense) => {
        navigation.navigate('AddEditExpense', { expense, isEdit: true });
    };

    const handleLongPress = (expense: Expense) => {
        Alert.alert(
            'Xóa khoản chi',
            `Bạn có muốn xóa "${expense.title}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteExpense(expense.id!);
                            await loadExpenses();
                            Alert.alert('Thành công', 'Đã xóa khoản chi');
                        } catch (error) {
                            console.error('Error deleting expense:', error);
                            Alert.alert('Lỗi', 'Không thể xóa khoản chi');
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Đang tải...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>EXPENSE TRACKER</Text>
                <Text style={styles.subtitle}>Quản lý chi tiêu cá nhân</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                        Tổng số: {expenses.length} khoản
                    </Text>
                </View>

                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    renderItem={({ item }) => (
                        <ExpenseItem
                            expense={item}
                            onPress={() => handleEditExpense(item)}
                            onLongPress={() => handleLongPress(item)}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>📊</Text>
                            <Text style={styles.emptyText}>Chưa có khoản thu/chi nào</Text>
                            <Text style={styles.emptySubText}>
                                Nhấn "Thêm khoản chi" để bắt đầu
                            </Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                />

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddExpense}
                    >
                        <Text style={styles.addButtonText}>➕ Thêm khoản chi</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

// Styles giữ nguyên...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#2196F3',
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'white',
        opacity: 0.9,
    },
    content: {
        flex: 1,
    },
    statsContainer: {
        backgroundColor: 'white',
        padding: 12,
        margin: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4a5568',
        textAlign: 'center',
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#a0aec0',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#cbd5e0',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    addButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;