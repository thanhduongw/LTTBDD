import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { addExpense, updateExpense } from '../database/database';

type AddEditExpenseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddEditExpense'>;

const AddEditExpenseScreen = () => {
    const navigation = useNavigation<AddEditExpenseScreenNavigationProp>();
    const route = useRoute();
    const { expense, isEdit } = route.params as { expense?: any; isEdit?: boolean };

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');

    // Sử dụng useRef để clear input
    const titleInputRef = useRef<TextInput>(null);
    const amountInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (isEdit && expense) {
            setTitle(expense.title);
            setAmount(expense.amount.toString());
            setType(expense.type);
        }
    }, [isEdit, expense]);

    const handleSave = async () => {
        // Validate input
        if (!title.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên khoản chi');
            return;
        }

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
            return;
        }

        const expenseData = {
            title: title.trim(),
            amount: parseFloat(amount),
            type: type,
            createdAt: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
        };

        try {
            if (isEdit && expense) {
                await updateExpense(expense.id, expenseData);
                Alert.alert('Thành công', 'Đã cập nhật khoản chi');
            } else {
                await addExpense(expenseData);
                Alert.alert('Thành công', 'Đã thêm khoản chi mới');

                // Clear input fields after successful add (dùng useRef)
                clearInputs();
            }

            // Navigate back to refresh list
            navigation.goBack();
        } catch (error) {
            console.error('Error saving expense:', error);
            Alert.alert('Lỗi', 'Không thể lưu khoản chi');
        }
    };

    // Hàm clear input sử dụng useRef
    const clearInputs = () => {
        setTitle('');
        setAmount('');
        setType('expense');
        // Focus lại vào title input
        titleInputRef.current?.focus();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên khoản chi</Text>
                        <TextInput
                            ref={titleInputRef}
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Nhập tên khoản chi..."
                            placeholderTextColor="#999"
                            returnKeyType="next"
                            onSubmitEditing={() => amountInputRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Số tiền</Text>
                        <TextInput
                            ref={amountInputRef}
                            style={styles.input}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="Nhập số tiền..."
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Loại</Text>
                        <View style={styles.typeContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    type === 'income' && styles.typeButtonActive
                                ]}
                                onPress={() => setType('income')}
                            >
                                <Text style={[
                                    styles.typeButtonText,
                                    type === 'income' && styles.typeButtonTextActive
                                ]}>
                                    📈 Thu
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    type === 'expense' && styles.typeButtonActive
                                ]}
                                onPress={() => setType('expense')}
                            >
                                <Text style={[
                                    styles.typeButtonText,
                                    type === 'expense' && styles.typeButtonTextActive
                                ]}>
                                    📉 Chi
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>
                                {isEdit ? '💾 Cập nhật' : '➕ Thêm mới'}
                            </Text>
                        </TouchableOpacity>

                        {!isEdit && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={clearInputs}
                            >
                                <Text style={styles.clearButtonText}>🗑️ Xóa nội dung</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
    },
    form: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#2d3748',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#2d3748',
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    typeButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    typeButtonActive: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    typeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#718096',
    },
    typeButtonTextActive: {
        color: 'white',
    },
    buttonContainer: {
        gap: 12,
        marginTop: 8,
    },
    saveButton: {
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
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearButton: {
        backgroundColor: '#e53e3e',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddEditExpenseScreen;