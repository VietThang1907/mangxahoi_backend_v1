const db = require('../config/db');

const search = (req, res) => {
    const {q, type} = req.query;

    if (!q) {
        return res.status(400).json({msg: 'Vui lòng nhập từ khóa tìm kiếm.'});
    }

    const searchQuery = `%${q}%`;
    let query = '';
    switch (type) {
        case 'users':
            query = `
                SELECT id, username, avatar_url 
                FROM Users 
                WHERE username LIKE ? 
                ORDER BY created_at DESC
            `;
            break;
        case 'posts':
            query = `
                SELECT p.id, p.content, p.media_url, p.media_type, p.created_at,
                       u.username, u.avatar_url
                FROM Posts AS p
                JOIN Users AS u ON p.user_id = u.id
                WHERE p.content LIKE ? 
                ORDER BY p.created_at DESC
            `;
            break;
        default:
            return res.status(400).json({msg: 'Loại tìm kiếm không hợp lệ.'});
    }

    db.query(query, [searchQuery], (err, results) => {
        if (err) {
            console.error('Lỗi truy cập DB:', err);
            return res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
        }
        res.json(results);
    });
};

module.exports = { search };