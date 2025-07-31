const express = require('express');
const router = express.Router();
const { createPost, getAllPost, getPostById, deletePost, likePost, unlikePost } = require('../controllers/postController');
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

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Lấy chi tiết một bài đăng theo ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài đăng
 *     responses:
 *       200:
 *         description: Chi tiết bài đăng
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy bài đăng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id', authMiddleware, getPostById);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Xóa một bài đăng (chỉ chủ sở hữu mới có quyền)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài đăng cần xóa
 *     responses:
 *       200:
 *         description: Đã xóa bài đăng thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền xóa
 *       404:
 *         description: Không tìm thấy bài đăng
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id', authMiddleware, deletePost);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Thích một bài đăng
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài đăng cần thích
 *     responses:
 *       200:
 *         description: Đã thích bài đăng thành công
 *       401:
 *         description: Chưa xác thực
 *       400:
 *         description: Bạn đã thích bài đăng này rồi
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/:id/like', authMiddleware, likePost);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   delete:
 *     summary: Bỏ thích một bài đăng
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài đăng cần bỏ thích
 *     responses:
 *       200:
 *         description: Đã bỏ thích bài đăng thành công
 *       401:
 *         description: Chưa xác thực
 *       400:
 *         description: Bạn chưa thích bài đăng này
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id/like', authMiddleware, unlikePost);
module.exports = router;