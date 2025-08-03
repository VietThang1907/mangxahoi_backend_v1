const express = require('express');
const router = express.Router();
const { search } = require('../controllers/searchController');

/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Tìm kiếm người dùng và bài viết
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Tìm kiếm người dùng hoặc bài viết theo từ khóa
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: Từ khóa tìm kiếm
 *         schema:
 *           type: string
 *           example: "game"
 *       - in: query
 *         name: type
 *         required: true
 *         description: Loại tìm kiếm (users hoặc posts)
 *         schema:
 *           type: string
 *           enum: [users, posts]
 *           example: "posts"
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       avatar_url:
 *                         type: string
 *                   - type: object
 *                     properties:
 *                       id:
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
 *       400:
 *         description: Lỗi nếu không có từ khóa tìm kiếm hoặc loại tìm kiếm không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', search);

module.exports = router;