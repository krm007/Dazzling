const async = require('async');
module.exports = function () {
    let router = express.Router();
    //首页
    router.get('/', (req, res) => {
        res.render('index');
    });


// 招商合作页面
router.get('/business',(req,res)=>{
res.render('business')
});
// 精选社区页面
router.get('/perfect',(req,res)=>{
res.render('perfect');
});
//眼影页面
router.get('/eshadow',(req,res)=>{
        let q=req.query;
        console.log(q.id);
        // res.render('eshadow');
        let sql =` select pid,workname,description,imglist,addtime,progress from publish  where wid = ? `;
        mydb.query(sql,q.id,(err,result)=>{
            if(err){
                console.log(err);
                return;
            }
            // console.log(result);
            res.render('eshadow',
            {result:result}); 
        });
        
    });
    //口红页面
    router.get('/lipgloss',(req,res)=>{
        let q=req.query;
        console.log(q.id);
        // res.render('eshadow');
        let sql =` select pid,workname,description,imglist,addtime,progress from publish  where wid = ? `;
        mydb.query(sql,q.id,(err,result)=>{
            if(err){
                console.log(err);
                return;
            }
            // console.log(result);
            res.render('lipgloss',
            {result:result}); 
        });
        
    });


    //关于我们
    router.get('/about', (req, res) => {
        res.render('about')
    });
  //产品细节页面
//   router.get('/detil',(req,res)=>{
//     let q=req.query;
//     let sql =` select * from publish  where pid = ? `;
//     mydb.query(sql,q.pid,(err,result)=>{
//         // console.log(result[0]);
//         let keywd=result[0].keywords.split("，");
//         let imglist=JSON.parse(result[0].imglist);
//         let progress1=result[0].progress.replace(/<\/?.+?>/g,"");
//         let progress=progress1.replace(/ /g,"")
//         console.log(progress);
//         // console.log(imglist);
//         if(err){
//             console.log(err);
//             return;
//         }
       
//         res.render('detil',
//             {
//                 result: result[0],
//                 keywd: keywd,
//                 imglist:imglist,
//                 progress:progress
//             });
//     });
    
//   });  
router.get('/detil',(req,res)=>{
    let q=req.query;
    let pid=q.pid;
    async.series({
        publish:function(cb){
            let sql =` select * from publish  where pid = ? limit 1 `;
            mydb.query(sql,pid,(err,results)=>{
                cb(null,results)
            });
        },
        discuss:function(cb){
            let sql=`select * from discuss where pid = ? limit 5`;
            mydb.query(sql,pid,(err,results)=>{
                cb(null,results)
            })
        }
        

    },(err,results)=>{
        let publish=results.publish[0];
        let discuss=results.discuss;
        console.log(discuss);
        let keywd=publish.keywords.split("，");
                let imglist=JSON.parse(publish.imglist);
                let progress1=publish.progress.replace(/<\/?.+?>/g,"");
                let progress=progress1.replace(/ /g,"")
        // console.log(results.publish[0].imglist);
        res.render('detil',{
            results:results,
            keywd: keywd,
            imglist:imglist,
            progress:progress,
            publish:publish,
            discuss:discuss
        })
    })
});
  //发表评论
  router.post('/detil',(req,res)=>{
    let p=req.body;
    console.log(req.session.username,req.session.uid);
    console.log(p.pid,p.textarea);

    let sql=`INSERT INTO  discuss(pid,dcontent,disstime,uid,username) VALUES (?,?,?,?,?)`;
    mydb.query(sql,[p.pid,p.textarea,new Date().toLocaleString(),req.session.uid,req.session.username],(err,result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
        }else{
            res.json({r:'success'});
        }
    })
});
// 点赞处理
router.post('/detil/givelike',(req,res)=>{
    let p=req.body;
    let zannums=p.myzannums;
    console.log(p.pid,zannums);
    let sql=`update  publish set zannums = zannums+1 where pid = ? limit 1`;
    mydb.query(sql,p.pid,(err,result)=>{
        if(err){
            console.log(err);
            return;
        }else{
            res.json({
                r:'ok'
            });
        }
    })
});
// 收藏处理
router.post('/detil/collection',(req,res)=>{
    let p=req.body;
    let collectnums=p.mycollectnums;
    console.log(p.pid,collectnums);
    let sql=`update  publish set collectnums = ? where pid= ? limit 1`;
    mydb.query(sql,[collectnums++,p.pid],(err,result)=>{
        if(err){
            console.log(err);
            return;
        }else{
            res.json({
                r:'ok'
            });
        }
    })
});
    return router;
}