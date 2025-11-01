import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Tạo database instance
let db: any;

if (Platform.OS === 'web') {
    // Mock database cho web
    db = {
        transaction: (callback: any) => {
            callback({
                executeSql: (sql: string, params: any[] = [], success: any, error: any) => {
                    console.log('Mock SQL on web:', sql, params);

                    // Xử lý các loại SQL khác nhau
                    if (sql.trim().toUpperCase().startsWith('SELECT')) {
                        if (success) success(null, { rows: { _array: getMockData(sql) } });
                    } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
                        if (success) success(null, { insertId: Date.now() });
                    } else {
                        if (success) success();
                    }
                }
            });
        }
    };
} else {
    // Database thật cho mobile
    db = SQLite.openDatabaseSync('expense.db');
}

// Dữ liệu mẫu cho web
const getMockData = (sql: string): any[] => {
    const mockData = [
        {
            id: 1,
            title: 'Lương tháng',
            amount: 15000000,
            type: 'income',
            createdAt: '2024-01-15',
            deleted: 0
        },
        {
            id: 2,
            title: 'Ăn sáng',
            amount: 30000,
            type: 'expense',
            createdAt: '2024-01-15',
            deleted: 0
        },
        {
            id: 3,
            title: 'Xăng xe',
            amount: 200000,
            type: 'expense',
            createdAt: '2024-01-14',
            deleted: 0
        }
    ];

    if (sql.includes('deleted = 1')) {
        return []; // Không có dữ liệu đã xóa trong mock
    }

    return mockData;
};

export const initDB = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'web') {
            console.log('Web environment - using mock database');
            resolve();
            return;
        }

        // Sử dụng transaction để tạo bảng trên mobile
        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            amount REAL,
            type TEXT,
            createdAt TEXT,
            deleted INTEGER DEFAULT 0
          );`,
                    [],
                    () => {
                        console.log('Database initialized successfully');
                        resolve();
                    },
                    (tx: any, error: any) => {
                        console.log('Error creating table:', error);
                        reject(error);
                        return true;
                    }
                );
            },
            (error: any) => {
                console.log('Transaction error:', error);
                reject(error);
            }
        );
    });
};

// Thêm expense mới
export const addExpense = (expense: {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    createdAt: string;
}): Promise<number> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'web') {
            console.log('Web: Adding expense', expense);
            resolve(Date.now());
            return;
        }

        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    'INSERT INTO expenses (title, amount, type, createdAt) VALUES (?, ?, ?, ?)',
                    [expense.title, expense.amount, expense.type, expense.createdAt],
                    (tx: any, result: any) => {
                        resolve(result.insertId);
                    },
                    (tx: any, error: any) => {
                        reject(error);
                        return true;
                    }
                );
            },
            (error: any) => {
                reject(error);
            }
        );
    });
};

// Lấy tất cả expenses
export const getExpenses = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'web') {
            console.log('Web: Getting expenses');
            resolve(getMockData('SELECT'));
            return;
        }

        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    'SELECT * FROM expenses WHERE deleted = 0 ORDER BY createdAt DESC',
                    [],
                    (tx: any, { rows }: any) => {
                        resolve(rows._array);
                    },
                    (tx: any, error: any) => {
                        reject(error);
                        return true;
                    }
                );
            },
            (error: any) => {
                reject(error);
            }
        );
    });
};

// Cập nhật expense
export const updateExpense = (
    id: number,
    expense: {
        title: string;
        amount: number;
        type: 'income' | 'expense';
        createdAt: string;
    }
): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'web') {
            console.log('Web: Updating expense', id, expense);
            resolve();
            return;
        }

        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    'UPDATE expenses SET title = ?, amount = ?, type = ?, createdAt = ? WHERE id = ?',
                    [expense.title, expense.amount, expense.type, expense.createdAt, id],
                    () => {
                        resolve();
                    },
                    (tx: any, error: any) => {
                        reject(error);
                        return true;
                    }
                );
            },
            (error: any) => {
                reject(error);
            }
        );
    });
};

// Xóa mềm expense
export const deleteExpense = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'web') {
            console.log('Web: Deleting expense', id);
            resolve();
            return;
        }

        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    'UPDATE expenses SET deleted = 1 WHERE id = ?',
                    [id],
                    () => {
                        resolve();
                    },
                    (tx: any, error: any) => {
                        reject(error);
                        return true;
                    }
                );
            },
            (error: any) => {
                reject(error);
            }
        );
    });
};

// Lấy expenses đã xóa
export const getDeletedExpenses = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'web') {
            console.log('Web: Getting deleted expenses');
            resolve([]);
            return;
        }

        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    'SELECT * FROM expenses WHERE deleted = 1 ORDER BY createdAt DESC',
                    [],
                    (tx: any, { rows }: any) => {
                        resolve(rows._array);
                    },
                    (tx: any, error: any) => {
                        reject(error);
                        return true;
                    }
                );
            },
            (error: any) => {
                reject(error);
            }
        );
    });
};

// Khôi phục expense
export const restoreExpense = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'web') {
            console.log('Web: Restoring expense', id);
            resolve();
            return;
        }

        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    'UPDATE expenses SET deleted = 0 WHERE id = ?',
                    [id],
                    () => {
                        resolve();
                    },
                    (tx: any, error: any) => {
                        reject(error);
                        return true;
                    }
                );
            },
            (error: any) => {
                reject(error);
            }
        );
    });
};

// Xóa vĩnh viễn expense
export const permanentDeleteExpense = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'web') {
            console.log('Web: Permanent deleting expense', id);
            resolve();
            return;
        }

        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    'DELETE FROM expenses WHERE id = ?',
                    [id],
                    () => {
                        resolve();
                    },
                    (tx: any, error: any) => {
                        reject(error);
                        return true;
                    }
                );
            },
            (error: any) => {
                reject(error);
            }
        );
    });
};

export default db;