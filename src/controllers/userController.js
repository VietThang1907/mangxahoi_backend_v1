const db = require('../config/db');

const getMe = (req, res) => {
    const userId = req.user.id;

    const query = 'SELECT id, username, email, full_name, avatar_url, bio, created_at FROM Users WHERE id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi truy cập DB:', err);
            return res.status(500).send('Lỗi máy chủ');
        }

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Không tìm thấy người dùng.'});
        }

        res.json(results[0]);
    });
};

module.exports = {
    getMe,
};