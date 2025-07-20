const db = require('../config/db');

const seedCategories = () => {
    const categories = [
        { id: 1, name: 'Game' },
        { id: 2, name: 'Học thuật' },
        { id: 3, name: 'Âm nhạc' }
    ];

    // Kiểm tra xem categories đã tồn tại chưa
    db.query('SELECT COUNT(*) as count FROM categories', (err, results) => {
        if (err) {
            console.error('Lỗi khi kiểm tra categories:', err);
            return;
        }

        if (results[0].count > 0) {
            console.log('Categories đã tồn tại, bỏ qua việc seed dữ liệu');
            process.exit(0);
            return;
        }

        // Insert categories
        const insertPromises = categories.map(category => {
            return new Promise((resolve, reject) => {
                const query = 'INSERT INTO categories (id, name) VALUES (?, ?)';
                db.query(query, [category.id, category.name], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`Đã thêm category: ${category.name}`);
                        resolve(result);
                    }
                });
            });
        });

        Promise.all(insertPromises)
            .then(() => {
                console.log('Đã seed tất cả categories thành công!');
                process.exit(0);
            })
            .catch(err => {
                console.error('Lỗi khi seed categories:', err);
                process.exit(1);
            });
    });
};

seedCategories();
