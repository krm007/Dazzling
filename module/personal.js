module.exports=function(){
    let router=express.Router();
    // 显示个人中心页面
    router.get('/',(req,res)=>{
      res.render('personal');
    });
    return router;
}