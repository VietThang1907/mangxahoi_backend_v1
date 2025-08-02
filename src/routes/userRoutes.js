const express = require('express');
const router = express.Router();
const { getMe, followUser, unfollowUser, getUserById, getFollowers, getFollowing, updateMe } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API quản lý người dùng
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Lấy thông tin hồ sơ của người dùng đang đăng nhập
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin hồ sơ người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 full_name:
 *                   type: string
 *       401:
 *         description: Chưa xác thực (không có token hoặc token không hợp lệ)
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi máy chủ
 *   put:
 *     summary: Cập nhật thông tin hồ sơ của người dùng đang đăng nhập
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               bio:
 *                 type: string
 *                 example: "Tôi là một developer"
 *               avatar_url:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin công khai của một người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *                 created_at:
 *                   type: string
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/users/{id}/follow:
 *   post:
 *     summary: Theo dõi một người dùng khác
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của người dùng cần theo dõi
 *     responses:
 *       200:
 *         description: Đã theo dõi người dùng thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/:id/follow', authMiddleware, followUser);

/**
 * @swagger
 * /api/users/{id}/follow:
 *   delete:
 *     summary: Bỏ theo dõi một người dùng khác
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của người dùng cần bỏ theo dõi
 *     responses:
 *       200:
 *         description: Đã bỏ theo dõi người dùng thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id/follow', authMiddleware, unfollowUser);

/**
 * @swagger
 * /api/users/{id}/followers:
 *   get:
 *     summary: Lấy danh sách người theo dõi của một người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Danh sách người theo dõi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   full_name:
 *                     type: string
 *                   avatar_url:
 *                     type: string
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id/followers', getFollowers);

/**
 * @swagger
 * /api/users/{id}/following:
 *   get:
 *     summary: Lấy danh sách người dùng mà người dùng đang theo dõi
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Danh sách người dùng đang theo dõi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   full_name:
 *                     type: string
 *                   avatar_url:
 *                     type: string
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id/following', getFollowing);

module.exports = router;
