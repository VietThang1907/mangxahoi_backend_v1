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

module.exports = {
    createPost,
};