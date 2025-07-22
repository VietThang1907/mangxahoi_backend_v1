const express = require('express');
const router = express.Router();
const { createPost, getAllPost } = require('../controllers/postController');
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
 *   get:
 *     summary: Lấy danh sách tất cả bài đăng (có phân trang)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số bài đăng trên mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách bài đăng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       category_id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       media_url:
 *                         type: string
 *                       media_type:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar_url:
 *                         type: string
 *                       category_name:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       500:
 *         description: Lỗi máy chủ
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
router.get('/', getAllPost);
router.post('/', authMiddleware, createPost);

module.exports = router;