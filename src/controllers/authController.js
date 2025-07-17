const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 

const register = (req, res) => {
    try {
        const {username, password, email, full_name} = req.body;

        if(!username || !password || !email) {
            return res.status(400).json({msg: "Vui lòng nhập đầy đủ username, password và email"});
        }

        const checkUserQuery = 'SELECT * FROM Users Where username = ? OR email = ?';
        db.query(checkUserQuery, [username, email], (err, results) => {
            if(err) {
                console.log('Lỗi truy vấn DB:', err);
                return res.status(500).send('Lỗi máy chủ');
            }

            if(results.length > 0){
                return res.status(400).json({msg : "Username hoặc email đã tồn tại"});
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const newUser = {
                username, 
                email,
                password_hash: hashedPassword,
                full_name: full_name || null,
            };

            const insertUserQuery = 'INSERT INTO Users SET ?';
            db.query(insertUserQuery, newUser, (err, results) => {
                if(err) {
                    console.error('Lỗi khi thêm người dùng:', err);
                    return res.status(500).send('Lỗi máy chủ');
                }
                res.status(201).json({
                    msg: "Đăng ký thành công!", 
                    userId: results.insertId,
                });
            });
        });
    } catch (error) {
        console.error('Lỗi tại controller đăng ký:', error);
        res.status(500).send('Lỗi máy chủ');
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({msg: 'Vui lòng nhập đầy đủ email và password. '});
        } 
        const findUserQuery = 'SELECT * FROM Users WHERE email = ?';
        db.query(findUserQuery, [email], async (err, results) => {
            if (err) {
                console.error('Lỗi truy vấn DB:', err);
                return res.status(500).send('Lỗi máy chủ');
            }

            //kiem tra user co ton tai khong
            if (results.length === 0) {
                return res.status(404).json({msg: 'Người dùng không tồn tại.'});
            }

            const user = results[0];

            //so sanh mk da nhap voi mk ma hoa trong db
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({msg: 'Mật khẩu không chính xác.'});
            }

            //nei thong tin hop le
            const payload = {
                user: {
                    id: user.id,
                    username: user.username
                }
            };

            jwt.sign(
                payload, 
                process.env.JWT_SECRET, 
                { expiresIn: '7d' },
                (err, token) => {
                    if (err) throw err;
                    res.json({token});
                }
            );
        });
    } catch (error) {
        console.error('Lỗi tại controller đăng nhập:', error);
        res.status(500).send('Lỗi máy chủ');
    }
};

module.exports = {
    register,
    login
};