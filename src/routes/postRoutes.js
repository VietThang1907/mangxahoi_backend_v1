const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: API quản lý bài đăng
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Tạo một bài đăng mới
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *             properties:
 *               category_id:
 *                 type: integer
 *                 description: "ID của danh mục (1: Game, 2: Học thuật, 3: Âm nhạc)"
 *                 example: 1
 *               content:
 *                 type: string
 *                 description: Nội dung văn bản của bài đăng
 *                 example: "Check out my new gameplay!"
 *               media_url:
 *                 type: string
 *                 description: URL tới hình ảnh hoặc video
 *                 example: "https://example.com/image.jpg"
 *               media_type:
 *                 type: string
 *                 enum: [image, video]
 *                 description: Loại media
 *                 example: "image"
 *     responses:
 *       201:
 *         description: Tạo bài đăng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', authMiddleware, createPost);

module.exports = router;