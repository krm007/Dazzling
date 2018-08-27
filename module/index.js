const async = require('async');
module.exports = function () {
    let router = express.Router();
    //首页
    router.get('/', (req, res) => {
        res.render('index');
    });


    // 招商合作页面
    router.get('/business', (req, res) => {
        res.render('business')
    });
    // 精选社区页面
    router.get('/perfect', (req, res) => {
        async.series({
            mostcollect: function (cb) {
                let sql = `select workname,description,addtime,imglist,pid from publish order by collectnums  asc limit 10`;
                mydb.query(sql, (err, results) => {
                    cb(null, results)
                })
            },
            mostlike: function (cb) {
                let sql = `select workname,description,addtime,imglist,pid from publish order by zannums  asc limit 8`;
                mydb.query(sql, (err, results) => {
                    cb(null, results)
                })
            }
        }, (err, results) => {
            let mostcollect = results.mostcollect;
            let mostlike = results.mostlike;

            console.log(mostlike);
            // console.log(mostcollect);
            res.render('perfect',
                {
                    results: results,
                    mostcollect: mostcollect,
                    mostlike: mostlike
                });
        })

    });
    //眼影页面
    router.get('/eshadow', (req, res) => {
        let q = req.query;
        console.log(q.id);
        // res.render('eshadow');
        let sql = ` select pid,workname,description,imglist,addtime,progress from publish  where wid = ? `;
        mydb.query(sql, q.id, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            // console.log(result);
            res.render('eshadow',
                { result: result });
        });

    });
    //口红页面
    router.get('/lipgloss', (req, res) => {
        let q = req.query;
        console.log(q.id);
        // res.render('eshadow');
        let sql = ` select pid,workname,description,imglist,addtime,progress from publish  where wid = ? `;
        mydb.query(sql, q.id, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            // console.log(result);
            res.render('lipgloss',
                { result: result });
        });

    });


    //关于我们
    router.get('/about', (req, res) => {
        res.render('about')
    });
    //产品细节页面

    router.get('/detil', (req, res) => {
        let q = req.query;
        let pid = q.pid;
        async.series({
            publish: function (cb) {
                let sql = ` select * from publish  where pid = ? limit 1 `;
                mydb.query(sql, pid, (err, results) => {
                    //查询关联信息
                    let allkws = results[0].keywords.split('，');
                    let sql1 = `select publish.pid, publish.workname, user.header,user.uid,user.username from publish left join user on user.uid = publish.uid where 1 AND (0 `;
                    for (const k of allkws) {
                        sql1 += `OR keywords like "%${k}%" `;
                    }
                    sql1 += `) limit 3`;
                    mydb.query(sql1, (err, results1) => {
                        // console.log(results1);
                        results.maybe = results1;
                        cb(null, results);
                    });

                });
            },
            discuss: function (cb) {
                let sql = `select * from discuss where pid = ? limit 5`;
                mydb.query(sql, pid, (err, results) => {
                    cb(null, results)
                })
            }


        }, (err, results) => {
            let publish = results.publish[0];
            // console.log(results);
            let discuss = results.discuss;
            let maybe = results.publish.maybe;
            let keywd = publish.keywords.split("，");
            let imglist = JSON.parse(publish.imglist);
            let progress1 = publish.progress.replace(/<\/?.+?>/g, "");
            let progress = progress1.replace(/ /g, "");
            // console.log(maybe);
            res.render('detil', {
                keywd: keywd,
                imglist: imglist,
                progress: progress,
                publish: publish,
                discuss: discuss,
                maybe: maybe


            })
        })
    });

    //发表评论
    router.post('/detil', (req, res) => {
        let p = req.body;
        if (!req.session.username) {
            res.redirect('/personal/login');
            return;
        }
        console.log(req.session.username, req.session.uid);
        console.log(p.pid, p.textarea);

        let sql = `INSERT INTO  discuss(pid,dcontent,disstime,uid,username) VALUES (?,?,?,?,?)`;
        mydb.query(sql, [p.pid, p.textarea, new Date().toLocaleString(), req.session.uid, req.session.username], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ r: 'db_err' });
            } else {
                res.json({ r: 'success' });
            }
        })
    });
    // 点赞处理
    router.post('/detil/givelike', (req, res) => {
        let p = req.body;
        let zannums = p.myzannums;
        console.log(p.pid, zannums);
        let sql = `update  publish set zannums = zannums+1 where pid = ? limit 1`;
        mydb.query(sql, p.pid, (err, result) => {
            if (err) {
                console.log(err);
                return;
            } else {
                res.json({
                    r: 'ok'
                });
            }
        })
    });

    // 收藏处理
    router.post('/detil/collection', (req, res) => {
        async.series({
            publish: function (cb) {
                let p = req.body;                
                let collectnums = p.mycollectnums;
                console.log(p.pid, collectnums);
                let sql = `update  publish set collectnums = collectnums+1  where pid= ? limit 1`;
                mydb.query(sql, p.pid, (err, result) => {
                    cb(null, result);
                })
            },
            collection: function (cb) {
                let p = req.body;                
                // let collectnums = p.mycollectnums;
                let sql = `INSERT INTO  collection(uid,pid,addtime) VALUES (?,?,?)`;
                mydb.query(sql, [req.session.uid,p.pid,new Date().toLocaleString()], (err, result) => {
                    cb(null, result);
                })
            }
        }, (err, results) => {
            if (err) {
                console.log(err);
                res.json({ r: 'db_err' });
                return;
            } else {
                res.json({ r: 'ok' });
            }
        })

    });
    return router;
}