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
  router.get('/detil',(req,res)=>{
    let q=req.query;
    let sql =` select * from publish  where pid = ? `;
    mydb.query(sql,q.pid,(err,result)=>{
        // console.log(result[0]);
        let keywd=result[0].keywords.split("，");
        let imglist=JSON.parse(result[0].imglist);
        let progress1=result[0].progress.replace(/<\/?.+?>/g,"");
        let progress=progress1.replace(/ /g,"")
        console.log(progress);
        // console.log(imglist);
        if(err){
            console.log(err);
            return;
        }
       
        res.render('detil',
            {
                result: result[0],
                keywd: keywd,
                imglist:imglist,
                progress:progress
            });
    });
    
  });  
  //发表评论
  router.post('/detil',(req,res)=>{
    let p=req.body;
    console.log(req.session.username,req.session.uid);
    console.log(p.pid,p.textarea);

    let sql=`INSERT INTO  discuss(pid,dcontent,disstime,uid,username) VALUES (?,?,?,?,?)`
    mydb.query(sql,[p.pid,p.textarea,new Date().toLocaleString(),req.session.uid,req.session.username],(err,result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
        }else{
            res.json({r:'success'});
        }
    })
});

    return router;
}