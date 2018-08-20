module.exports=function(){
    let router = express.Router();
    router.get('/', (req ,res)=>{
        res.render('index');
    });

    return router;
}