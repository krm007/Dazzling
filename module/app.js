const async = require("async");
module.exports = function () {
    let router = express.Router();
    //处理跨域
    router.all('*', (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        // res.setHeader("Content-Type", "application/json;charset=utf-8");
        next()
    });

    router.get('/user', (req, res) => {
        console.log(req.query);
        let sql = 'SELECT * FROM publish WHERE uid=?';
        // console.log(req.session.uid);
        mydb.query(sql, req.query.uid, (err, result) => {
            if (err) {
                console.log(err);
            }
            res.json({ r: result });
        });
    });

    //处理登录页面
    router.post('/login', (req, res) => {
        //验证验证码是否正确
        let q = req.body;
        console.log(q);
        
        //验证账号或者手机号是否存在
        let sql = `SELECT uid, username, passwd, tel, header FROM user WHERE username = ? OR tel = ? LIMIT 1`;
        mydb.query(sql, [q.username, q.username], (err, result) => {
            console.log(err);
            if (!result.length) {
                console.log(result);
                res.json({ r: 'not_exist' });
                return;
            }
            //验证密码是否正确
            if (md5(q.passwd) != result[0].passwd) {
                res.json({ r: 'pw_err' });
                return;
            }
            // console.log(result[0].header);
            // console.log(result[0].uid);
            //登录成功后做什么事情
            req.session.uid = result[0].uid;
            req.session.username = result[0].username;
            req.session.header = result[0].header;
            //更新个人登录信息
            let upsql = 'UPDATE user SET loginnum = loginnum + 1, ip=?, lasttimes=? WHERE uid = ?';
            mydb.query(upsql, [req.ip, new Date().toLocaleString(), result[0].uid], (err, result1) => {
                res.json({ r: 'ok', user: result[0]});
            });
        });
    });


    return router;
}