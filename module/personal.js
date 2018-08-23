module.exports = function () {
    let router = express.Router();
    // 显示个人中心页面
    router.get('/', (req, res) => {
        res.render('personal'
            , {
                username: req.session.username, uid: req.session.uid
            }
        );
    });
    //显示注册页面
    router.get('/reg', (req, res) => {
        res.render('reg');
    });

    //处理注册的数据
    router.post('/regsubmit', (req, res) => {
        //检查账号是否已经存在
        let p = req.body;
        if (!p.passwd) {
            res.json({ r: 'passwd_no' });
            return;
        }
        let sql = `SELECT uid FROM user WHERE username = ? LIMIT 1`;
        mydb.query(sql, p.username, (err, result) => {
            if (result.length) {
                res.json({ r: 'username_existed' });
            } else {
                let sql = 'INSERT INTO user(username, passwd, tel, email, ip, regtime) VALUES (?,?,?,?,?,?)';
                mydb.query(sql, [p.username, md5(p.passwd), p.tel, p.email, req.ip, new Date().toLocaleString()], (err, result) => {
                    if (err) {
                        res.json({ r: 'db_err' });
                    } else {
                        res.json({ r: 'success' });
                    }
                });
            }
        });
    });

    //显示登录页面
    router.get('/login', (req, res) => {
        res.render('login');
    });

    //处理登录页面
    router.post('/login', (req, res) => {
        //验证验证码是否正确
        let q = req.body;
        if (req.session.captcha.toLowerCase() != q.coder.toLowerCase()) {
            res.json({ r: 'coder_err' });
            return;
        }
        //验证账号或者手机号是否存在
        let sql = `SELECT uid, username, passwd, tel, header FROM user WHERE username = ? OR tel = ? LIMIT 1`;
        mydb.query(sql, [q.username, q.username], (err, result) => {
            console.log(err);
            if (!result.length) {
                res.json({ r: 'not_exist' });
                return;
            }
            //验证密码是否正确
            if (md5(q.passwd) != result[0].passwd) {
                res.json({ r: 'pw_err' });
                return;
            }
            console.log(result[0].header);
            //登录成功后做什么事情
            req.session.uid = result[0].uid;
            req.session.username = result[0].username;
            req.session.header = result[0].header;
            //更新个人登录信息
            let upsql = 'UPDATE user SET loginnum = loginnum + 1, ip=?, lasttimes=? WHERE uid = ?';
            mydb.query(upsql, [req.ip, new Date().toLocaleString(), result[0].uid], (err, result) => {
                res.json({ r: 'ok' });
            });
        });
    });


    //验证码
    router.get('/coderimg', (req, res) => {
        var captcha = svgCaptcha.create({
            size: 4,
            ignoreChars: '0o1i',
            noise: 5,
            color: true,
            background: '#fff',
            width: 100,
            height: 40
        });
        req.session.captcha = captcha.text;

        res.type('svg');
        res.status(200).send(captcha.data);
    })

    //进到个人资料修改中心的前提是登录
    router.use((req, res, next) => {
        if (!req.session.uid) {
            res.redirect('/personal/login');
            return;
        }
        next();
    });

    //进入个人资料修改中心
    router.get('/user', (req, res) => {
        let sql = 'SELECT * FROM publish WHERE status=0';
        mydb.query(sql, (err, results) => {
            if (err) {
                console.log(err);
            }
            // console.log(results);
            res.render('user', {
                postlist: results,
                username: req.session.username
            });
        });
    });

    // 删除我的发布
    router.post('/delmypost',(req,res)=>{
        let delsql='UPDATE publish SET status=1 WHERE pid=?';
        mydb.query(delsql,req.body.pid,(err,result)=>{
            if (err) {
                console.log(err);
                res.json({ r: 'db_err' });
                return;
            }
            res.json({ r: 'ok' });
        });
    });






    //上传头像
    router.post('/saveheader', (req, res) => {
        let header = req.body.header;
        let sql = 'UPDATE user SET header = ? WHERE uid = ? LIMIT 1';
        mydb.query(sql, [header, req.session.uid], (err, result) => {
            res.json({ r: 'ok' });
        });
    });


    //修改密码操作
    router.post('/changepw', (req, res) => {
        //接收post过来的数据
        let oldpw = req.body.passwd;
        let passwd = req.body.passwd1;
        //验证历史密码是不是正确

        let sql = 'SELECT passwd FROM user WHERE uid = ?';
        mydb.query(sql, req.session.uid, (err, data) => {
            if (err) {
                //数据库操作错误
                console.log(err);
                res.json({
                    r: 'db_err'
                });
                return;
            }
            //验证原始密码是不是正确
            if (md5(oldpw) != data[0].passwd) {
                //原始密码错误
                res.json({
                    r: 'oldpw_err'
                });
                return;
            }
            console.log(12345);
            //更新新密码到数据库
            let upsql = 'UPDATE user SET passwd = ? WHERE uid = ? LIMIT 1';
            mydb.query(upsql, [md5(passwd), req.session.uid], (err, data) => {
                if (err) {
                    res.json({
                        r: 'update_db_err'
                    });
                    return;
                }
                res.json({
                    r: 'ok'
                });
            });
        });
    })


    //处理退出登录操作
    router.get('/logout', (req, res) => {
        //清除session信息
        delete req.session.uid;
        //跳转到登录页面
        res.redirect('/personal/login');
    })

    router.get('/publish', (req, res) => {
        res.render('publish');
    });
    router.post('/publish', (req, res) => {
        let p = req.body;
        console.log(req.session.username, req.session.uid);
        let sql = `INSERT INTO  publish(workname,description,keywords,progress,addtime,imglist,wname,uid,username) VALUES (?,?,?,?,?,?,?,?,?)`
        mydb.query(sql, [p.workname, p.desc, p.kwd, p.progress, new Date().toLocaleString(), JSON.stringify(p.dialogImageUrl), p.wname, req.session.uid, req.session.username], (err, result) => {
            if (err) {
                res.json({ r: 'db_err' });
            } else {
                res.json({ r: 'success' });
            }
        })
    });

    //把添加的数据渲染到我的发布中
    // 将数据库的数据渲染到页面

    return router;
}