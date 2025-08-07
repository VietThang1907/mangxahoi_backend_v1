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

const getUserById = (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT u.id, u.username, u.full_name, u.avatar_url, u.bio, u.created_at,(SELECT COUNT(*) FROM Follows WHERE following_id = u.id) AS followers_count,(SELECT COUNT(*) FROM Follows WHERE follower_id = u.id) AS following_count FROM Users u WHERE u.id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi truy cập DB:', err);
            return res.status(500).send('Lỗi máy chủ');
        }
        if (results.length === 0) {
            return res.status(404).json({ msg: 'Không tìm thấy người dùng.' });
        }
        res.json(results[0]);
    });
};

const getFollowers = (req, res) => {
    const userId = req.params.id;
    const query = `
        SELECT u.id, u.username, u.full_name, u.avatar_url 
        FROM Users u 
        JOIN Follows f ON u.id = f.follower_id 
        WHERE f.following_id = ?
    `; 
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi truy cập DB:', err);
            return res.status(500).send('Lỗi máy chủ');
        }
        if (results.length === 0) {
            return res.status(404).json({ msg: 'Không tìm thấy người dùng.' });
        }
        res.json(results);
    });
};

const getFollowing = (req, res) => {
    const userId = req.params.id;
    const query = `
        SELECT u.id, u.username, u.full_name, u.avatar_url 
        FROM Users u 
        JOIN Follows f ON u.id = f.following_id 
        WHERE f.follower_id = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi truy cập DB:', err);
            return res.status(500).send('Lỗi máy chủ');
        }
        if (results.length === 0) {
            return res.status(404).json({ msg: 'Không tìm thấy người dùng.' });
        }
        res.json(results);
    });
};

const updateMe = (req, res) => {
    const userId = req.user.id;
    const { full_name, avatar_url, bio } = req.body; 
    const filedsToUpdate = {};
    if (full_name) filedsToUpdate.full_name = full_name;
    if (avatar_url) filedsToUpdate.avatar_url = avatar_url;
    if (bio) filedsToUpdate.bio = bio;
    if (Object.keys(filedsToUpdate).length === 0) {
        return res.status(400).json({ msg: 'Không có trường nào để cập nhật.' });
    }
    const query = 'UPDATE Users SET ? WHERE id = ?';
    db.query(query, [filedsToUpdate, userId], (err, result) => {
        if (err) {
            console.error('Lỗi truy cập DB:', err);
            return res.status(500).send('Lỗi máy chủ');
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Không tìm thấy người dùng.' });
        }
        res.json({ msg: 'Thông tin người dùng đã được cập nhật thành công.' });
    });
};

const followUser = (req, res) => {
    const followerId = req.user.id;
    const followingId = req.params.id;

    if (followerId === followingId) {
        return res.status(400).json({ msg: 'Bạn không thể theo dõi chính mình.' });
    }

    const newFollow = {
        follower_id: followerId,
        following_id: followingId
    };

    const query = 'INSERT INTO Follows SET ?';
    db.query(query, newFollow, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ msg: 'Bạn đã theo dõi người dùng này rồi.' });
            }
            console.error('Lỗi khi theo dõi:', err);
            return res.status(500).send('Lỗi máy chủ');
        }
        
        // Gửi response thành công
        res.json({ msg: 'Đã theo dõi người dùng thành công.' });
        
        // Xử lý notification (không ảnh hưởng đến response)
        const notification = { 
            recipient_id: followingId, 
            sender_id: followerId, 
            type: 'follow' 
        };
        db.query('INSERT INTO Notifications SET ?', notification, (err, notifResult) => {
            if (err) {
                console.error('Lỗi khi tạo thông báo:', err);
                return;
            }
            // Gửi sự kiện qua socket (nếu có socket.io)
            try {
                const io = req.app.get('socketio');
                const getUser = req.app.get('getUser');
                if (io && getUser) {
                    const receiver = getUser(followingId);
                    if (receiver) {
                        io.to(receiver.socketId).emit('getNotification', {
                            senderId: followerId,
                            type: 'follow',
                        });
                    }
                }
            } catch (socketError) {
                console.error('Lỗi khi gửi socket notification:', socketError);
            }
        });
    });
};

const unfollowUser = (req, res) =>  {
    const followerId = req.user.id;
    const followingId = req.params.id;
    
    const query = 'DELETE FROM Follows WHERE follower_id = ? AND following_id = ?';
    db.query(query, [followerId, followingId], (err, result) => {
        if (err) {
            console.error('Lỗi khi bỏ theo dõi:', err);
            return res.status(500).send('Lỗi máy chủ');
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({ msg: 'Bạn chưa theo dõi người dùng này.' });
        }
        res.json({ msg: 'Đã bỏ theo dõi người dùng thành công.' });
    });
};

module.exports = {
    getMe,
    followUser,
    unfollowUser,
    getUserById,
    getFollowers,
    getFollowing,
    updateMe
};