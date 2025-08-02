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
            console.err('Lỗi truy cập DB:', err);
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
}

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
            console.error('Lỗi truy cập DB:', err);
            return res.status(500).send('Lỗi máy chủ');
        }
        res.json({ msg: 'Đã theo dõi người dùng thành công.' });
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
    getFollowing
};