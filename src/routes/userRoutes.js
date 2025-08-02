const express = require('express');
const router = express.Router();
const { getMe, getUserById, followUser, unfollowUser, getFollowers, getFollowing, updateMe } = require('../controllers/userController');
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
 */
router.get('/me', authMiddleware, getMe);

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
 * /api/user/{id}:
 * get 
 * summary: Lấy thông tin người dùng theo ID
 * tags: [Users]
 * security:
 *   - bearerAuth: []
 * parameters:
 *   - in: path
 *   name: id
 * required: true
 * schema:
 *   type: integer
 *   example: 1
 * description: ID của người dùng cần lấy thông tin
 * responses:
 *   200:
*     description: Thông tin người dùng
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             full_name:
 *               type: string
 *   401:
 *     description: Chưa xác thực (không có token hoặc token không hợp lệ)
 *   404:
 *     description: Không tìm thấy người dùng
 *   500:
 *     description: Lỗi máy chủ
*/
router.get('/:id', authMiddleware, getUserById);

/**
 * @swagger
 * api/users/{id}/followers:
 * get 
 * summary: Lấy danh sách người theo dõi của người dùng
 * tags: [Users]
 * security:
 *  - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 *  type: integer
 * example: 1
 * description: ID của người dùng cần lấy danh sách người theo dõi
 * responses:
 * 200:
 * description: Danh sách người theo dõi
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * username:
 * type: string
 * full_name:
 * type: string
 * avatar_url:
 *  type: string
 * 401:
 * description: Chưa xác thực (không có token hoặc token không hợp lệ)
 * 404:
 * description: Không tìm thấy người dùng
 * 500:
 * description: Lỗi máy chủ
*/
router.get('/:id/followers', authMiddleware, getFollowers);

/**
 * @swagger
 * /api/users/{id}/following:
 *   get:
 *  summary: Lấy danh sách người dùng mà người dùng đang theo dõi
 *   tags: [Users]
 *  security:
 *   - bearerAuth: []
 *  parameters:
 *  - in: path
 *  name: id
 *  required: true
 *  schema:
 *  type: integer
 *  example: 1
 *  description: ID của người dùng cần lấy danh sách người đang theo dõi
 *  responses:
 *  200:
 *  description: Danh sách người dùng mà người dùng đang theo dõi
 *  content:
 *  application/json:
 *  schema:
 * type: array
 * items:
 *  type: object
 *  properties:
 *   id:
 *    type: integer
 *   username:
 *    type: string
 *   full_name:
 *    type: string
 *   avatar_url:
 *    type: string
 *  401:
 *  description: Chưa xác thực (không có token hoặc token không hợp lệ)
 *  404:
 * description: Không tìm thấy người dùng
 *  500:
 * description: Lỗi máy chủ
 */
router.get('/:id/following', authMiddleware, getFollowing);

/**
 * @swagger
 * /api/users/me:
 * put:
 *   summary: Cập nhật thông tin người dùng
 * tags: [Users]
 * security:
 *   - bearerAuth: []
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           full_name:
 *             type: string
 *           avatar_url:
 *             type: string
 *           bio:
 *             type: string
 * example:
 *   full_name: "Nguyen Van A"
 *   avatar_url: "https://example.com/avatar.jpg"
 *   bio: "Đây là tiểu sử của tôi."
 * responses:
 * 200: 
 * description: Thông tin người dùng đã được cập nhật thành công
 * content:
 * application/json:
 * schema:
 * type: object
 *  properties:
 *   msg:
 *    type: string
 *  example: "Thông tin người dùng đã được cập nhật thành công."
 * 400:     
 * description: Không có trường nào để cập nhật
 * content:
 * application/json:
 * schema:
 *  type: object
 *  properties:
 *   msg:
 *    type: string
 *  example: "Không có trường nào để cập nhật."
 * 401:
 * description: Chưa xác thực (không có token hoặc token không hợp lệ)
 * content:
 * application/json:    
 * schema:
 * type: object
 * properties:
 *   msg:
 * type: string
 * example: "Chưa xác thực."
 */
router.put('/me', authMiddleware, updateMe);
module.exports = router;

