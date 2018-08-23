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
        let sql =` select workname,description,imglist,addtime,progress from publish  where wid = ? `;
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
    
    //关于我们
    router.get('/about', (req, res) => {
        res.render('about')
    });
  //产品细节页面
  router.get('/detil',(req,res)=>{
    res.render('detil')
  });  

    return router;
}