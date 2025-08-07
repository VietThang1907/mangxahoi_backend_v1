const db = require('../config/db');

const getNotifications = (req, res) => {
    const userId = req.user.id;
    const query = `
        SELECT 
            n.id, n.type, n.is_read, n.created_at,
            u.id as sender_id, u.username as sender_username, u.avatar_url as sender_avatar,
            n.post_id
        FROM Notifications n
        JOIN Users u ON n.sender_id = u.id
        WHERE n.recipient_id = ?
        ORDER BY n.created_at DESC
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy thông báo:', err);
            return res.status(500).json({ msg: 'Lỗi máy chủ' });
        }
        res.json(results);
    });
};

//danh dau mot thong bao da doc
const markAsRead = (req, res) => {
    const notificationId = req.params.id;
    const userId = req.user.id;
    const query = 'UPDATE Notifications SET is_read = TRUE WHERE id = ? AND recipient_id = ?';
    db.query(query, [notificationId, userId], (err, results) => {
        if (err) {
            console.error('Lỗi khi đánh dấu thông báo là đã đọc:', err);
            return res.status(500).json({ msg: 'Lỗi máy chủ' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ msg: 'Thông báo không tìm thấy hoặc đã được đánh dấu là đã đọc' });
        }
        res.json({ msg: 'Thông báo đã được đánh dấu là đã đọc' });
    });
};

module.exports = {
    getNotifications,
    markAsRead
};