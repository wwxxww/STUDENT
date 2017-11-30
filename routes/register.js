var express = require('express');
var util = require('../modules/utilities');
var db = require('../modules/mongoose');

var router = express.Router();

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/api/register', function (req, res) {
    if (!req.body.loginname || !req.body.password || !req.body.confirmpassword) {
        util.send(res, 'error', '请输入帐号或密码！');
        return;
    }

    if (req.body.password != req.body.confirmpassword) {
        util.send(res, 'error', '两次输入的密码不一致！');
        return;
    }


    var guid = new db.mongoose.Types.ObjectId;
    var now = Date.now();

    var user = {
        _id: guid,
        loginname: req.body.loginname,
        password: req.body.password,
        status: 0,
        createuserid: guid,
        createtime: now,
        lastupdateuserid: guid,
        lastupdatetime: now
    };
    // save()  var User = new db.User(); User.save();
    db.User.create(user, function (err, u) {
        if (err) {
            util.send(res, 'error', '保存数据时出错！Error' + err);
            return;
        }

        util.send(res, 'success', '保存数据成功！');
    });
});

module.exports = router;