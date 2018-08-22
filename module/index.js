module.exports = function () {
    let router = express.Router();
    //首页
    router.get('/', (req, res) => {
        res.render('index');
    });


router.get('/about',(req,res)=>{
    res.render('about')
});

router.get('/business',(req,res)=>{
res.render('business')
});

router.get('/perfect',(req,res)=>{
res.render('perfect');
});
=======
    //关于我们
    router.get('/about', (req, res) => {
        res.render('about')
    });
    

    return router;
}