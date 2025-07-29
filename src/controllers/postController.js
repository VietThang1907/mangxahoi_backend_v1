const db = require('../config/db');

const createPost = (req, res) => {
    const userId = req.user.id;
    const { category_id, content, media_url, media_type } = req.body;

    if (!category_id) {
        return res.status(400).json({ msg: 'Vui lòng chọn danh mục bài đăng.'});
    }
    if (!content && !media_url) {
        return res.status(400).json({ msg: 'Bài đăng phải có nội dung hoặc hình ảnh/video.'});
    }

    const newPost = {
        user_id: userId,
        category_id,
        content: content || null,
        media_url: media_url || null,
        media_type: media_type || null,
    }

    const query = 'INSERT INTO Posts SET ?';

    db.query(query, newPost, (err, result) => {
        if(err){
            console.error('Lỗi khi tạo bài đăng:', err);
            return res.status(500).send('Lỗi máy chủ');
        }
        const createdPost = {
            id: result.insertId,
            user_id: userId,
            category_id,
            content: content || null,
            media_url: media_url || null,
            media_type: media_type || null,
        };
        res.status(201).json(createdPost);
    });
};

const getAllPost = (req, res) => {
    // Phan trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const query = `
        SELECT 
            p.id, p.user_id, p.category_id, p.content, p.media_url, p.media_type, p.created_at,
            u.username, u.avatar_url, 
            c.name as category_name
        FROM Posts AS p
        JOIN Users AS u ON p.user_id = u.id
        JOIN Categories AS c ON p.category_id = c.id
        ORDER BY p.created_at DESC
        LIMIT ? 
        OFFSET ?
    `;
    
    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            console.error('Lỗi truy cập DB:', err);
            return res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
        }

        // Không cần trả về 404 nếu không có bài đăng, trả về mảng rỗng
        res.json({
            posts: results,
            pagination: {
                page: page,
                limit: limit,
                total: results.length
            }
        });
    });
};

const getPostById = (req, res) => {
    const postId = req.params.id; 
    const query = `
        SELECT 
            p.id, p.user_id, p.category_id, p.content, p.media_url, p.media_type, p.created_at,
            u.username, u.avatar_url,
            c.name as category_name
        FROM Posts AS p
        JOIN Users AS u ON p.user_id = u.id
        JOIN Categories AS c ON p.category_id = c.id
        WHERE p.id = ?
    `;

    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error('Lỗi truy cập DB:', err);
            return res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Bài đăng không tồn tại' });
        }

        res.json(results[0]);
    });
};

const deletePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    const checkQwnerQuery = 'SELECT user_id FROM Posts WHERE id = ?';
    db.query(checkQwnerQuery, [postId], (err, results) => {
        if (err) {
            return res.status(500).send('Lỗi máy chủ');
        }
        if (results.length === 0) {
            return res.status(404).json({ msg: 'Bài đăng không tồn tại.' });
        }

        const postOwnerId = results[0].user_id;
        if (postOwnerId !== userId) {
            return res.status(403).json({ msg: 'Bạn không có quyền xóa bài đăng này.' });
        }

        const deleteQuery = 'DELETE FROM Posts WHERE id = ?';
        db.query(deleteQuery, [postId], (err, results) => {
            if (err) {
                console.error('Lỗi khi xóa bài đăng:', err);
                return res.status(500).send('Lỗi máy chủ. Có thể do ràng buộc khóa ngoại');
            }
            res.json({ msg: 'Bài đăng đã được xóa thành công.' });
        });
    });
};

module.exports = {
    createPost,
    getAllPost,
    getPostById,
    deletePost,
};