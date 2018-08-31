const async = require("async");
module.exports = function () {
    let router = express.Router();

//处理APP跨域问题
router.all('*', (req ,res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods","*");
  //  res.setHeader("Content-Type", "application/json;charset=utf-8");
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
    // 显示精选页面的内容
   router.get('/perfect',(req,res)=>{
    async.series({
        mostcollect: function (cb) {
            let sql = `select workname,addtime,imglist,pid from publish order by collectnums  desc limit 3`;
            mydb.query(sql, (err, results) => {
                cb(null, results)
            })
        },
        lowcollect: function (cb) {
            let sql = `select workname,addtime,imglist,pid from publish order by collectnums  asc limit 3`;
            mydb.query(sql, (err, results) => {
                cb(null, results)
            })
        },
        mostlike: function (cb) {
            let sql = `select workname,addtime,imglist,pid from publish order by zannums  desc limit 3`;
            mydb.query(sql, (err, results) => {
                cb(null, results)
            })
        }
    }, (err, results) => {
        let mostcollect = results.mostcollect;
        let mostlike = results.mostlike;
        let lowcollect=results.lowcollect;
        for (let ind = 0; ind < mostlike.length; ind++) {
            mostlike[ind].imglist = JSON.parse(mostlike[ind].imglist)[0].replace(/\\/g,'/');
            mostlike[ind].addtime = mostlike[ind].addtime.toLocaleString();
        }
        for (let ind = 0; ind < mostcollect.length; ind++) {
            mostcollect[ind].imglist = JSON.parse(mostcollect[ind].imglist)[0].replace(/\\/g,'/');
          
        }
        for (let ind = 0; ind < lowcollect.length; ind++) {
            lowcollect[ind].imglist = JSON.parse(lowcollect[ind].imglist)[0].replace(/\\/g,'/');
          
        }
       
       
        res.json(
            {
                mostcollect: mostcollect,
                list: mostlike,
                lowcollect:lowcollect
            }
        );
    })
   });
   //显示分类页面
router.get('/sort',(req,res)=>{
     async.series({
   eshadow: function (cb) {
        let sql=`select workname,keywords,imglist from publish where wid =1 limit 6`; 
        mydb.query(sql, (err, results) => {
            cb(null, results)
        })
    },
   lipgloss: function (cb) {
    let sql=`select workname,keywords,imglist from publish where wid =0 limit 6`; 
        mydb.query(sql, (err, results) => {
            cb(null, results)
        })
    },
   
}, (err, results) => {
    let lipgloss = results.lipgloss;
    let eshadow = results.eshadow; 
    for (let ind = 0; ind < eshadow.length; ind++) {
        eshadow[ind].imglist = JSON.parse(eshadow[ind].imglist);
        // console.log( eshadow[ind].imglist)
    }
    for (let ind = 0; ind < lipgloss.length; ind++) {
        lipgloss[ind].imglist = JSON.parse(lipgloss[ind].imglist);
        // console.log( lipgloss[ind].imglist)
    }
  
   
    res.json(
        {
            lipgloss: lipgloss,
            eshadow: eshadow,
           
        }
    );
})
});
// 显示细节页面
router.get('/detil',(req,res)=>{
    let q=req.query;
    let pid=q.pid;
    async.series({
        publish:function(cb){
       let sql =`select keywords,imglist,workname from publish where pid=? limit 1`
       mydb.query(sql,pid,(err,results)=>{
        cb(null,results);
       })
        },
        discuss:function(cb){
            let sql=`select username,dcontent, pid,did from  discuss where pid = ? limit 1`
            mydb.query(sql,pid,(err,results)=>{
                cb(null,results);
               })
        } 
    },(err,results)=>{
        let publish=results.publish[0];
        let discuss=results.discuss[0];
        let imglist= JSON.parse(results.publish[0].imglist);
        console.log(results.discuss);
        // console.log(imglist);
        console.log(publish.workname);
        res.json({
            publish:publish,
            discuss:discuss,
            imglist:imglist
        });
    })
});


    return router;
}