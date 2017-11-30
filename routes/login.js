var express = require('express');
var util = require('../modules/utilities');
var db = require('../modules/mongoose');

var router = express.Router();

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/api/login', function (req, res) {
    // 进行服务器端验证
    if (!req.body.loginname || !req.body.password) {
        util.send(res, 'error', '请输入帐号或密码！');
        return;
    }
    // req.body.status = 0;
    db.User.findOne(req.body, function (err, u) {
        // 捕获未知的错误
        if (err) {
            util.send(res, 'error', '查询用户出错！Error:' + err);
            return;
        }

        // 进行服务器端验证
        if(!u){
            util.send(res, 'error', '帐号或密码错误！');
            return;
        }
        if(u.status == 1){
            util.send(res, 'error', '帐号被禁用！');
            return;
        }

        // 在此处保留userid的目的是为了添加或修改其他表时
        // 给其他表中的createuserid和lastupdateuserid
        // 赋值
        res.cookie('userid', u._id);
        res.cookie('loginname', u.loginname);
        util.send(res, 'success', '登录成功！');
    });
})

router.get('/api/logout', function (req, res) {
    res.clearCookie('userid');
    res.clearCookie('loginname');
    res.redirect('/login');
});

module.exports = router;