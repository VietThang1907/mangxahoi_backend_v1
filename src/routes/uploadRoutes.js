const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: API quản lý tải lên tệp
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags: [Upload]
 *     description: Tải lên tệp
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: myFile
 *         type: file
 *         required: true
 *         description: Tệp cần tải lên
 *     responses:
 *       200:
 *         description: Tải lên tệp thành công
 *       400:
 *         description: Lỗi tải lên tệp
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', authMiddleware, uploadMiddleware.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Vui lòng chọn một file để tải lên.' });
  }
  // Trả về đường dẫn tới file đã tải lên
  res.json({ url: `/${req.file.path.replace(/\\/g, "/")}` });
}, (error, req, res, next) => {
    // Middleware xử lý lỗi từ multer
    res.status(400).json({ msg: error.message });
});

module.exports = router;