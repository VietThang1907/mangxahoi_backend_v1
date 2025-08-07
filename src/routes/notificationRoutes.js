const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: API quản lý thông báo
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Lấy tất cả thông báo của người dùng
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', authMiddleware, getNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Đánh dấu thông báo là đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thông báo cần đánh dấu là đã đọc
 *     responses:
 *       200:
 *         description: Thông báo đã được đánh dấu là đã đọc
 *       404:
 *         description: Thông báo không tìm thấy hoặc đã được đánh dấu là đã đọc
 */
router.patch('/:id/read', authMiddleware, markAsRead);

module.exports = router;

module.exports = router;