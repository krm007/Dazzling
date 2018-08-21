module.exports = function () {
    let router = express.Router();
    //首页
    router.get('/', (req, res) => {
        res.render('index');
    });
    //关于我们
    router.get('/about', (req, res) => {
        res.render('about')
    });
    

    return router;
}