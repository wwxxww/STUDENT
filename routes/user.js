var express = require('express');
var util = require('../modules/utilities');
var db = require('../modules/mongoose');

var router = express.Router();

router.get('/user/add', util.sign, function (req, res) {
    res.render('user/add');
});

router.post('/api/user/add', util.sign, function (req, res) {
    if (!req.body.loginname || !req.body.password) {
        util.send(res, 'error', '请输入帐号或密码！');
        return;
    }

    var guid = new db.mongoose.Types.ObjectId;
    var now = Date.now();

    var user = {
        _id: guid,
        loginname: req.body.loginname,
        password: req.body.password,
        status: 0,
        createuserid: req.cookies.userid,
        createtime: now,
        lastupdateuserid: req.cookies.userid,
        lastupdatetime: now
    };
    db.User.create(user, function (err, u) {
        if (err) {
            util.send(res, 'error', '保存数据时出错！Error' + err);
            return;
        }

        util.send(res, 'success', '保存数据成功！');
    });
});

// ? 参数可有可无
router.get('/api/user/list/(:page)/:pageSize', util.sign, function (req, res) {
    var conditions = {};

    var loginname = req.query.name;
    if (loginname) {
        loginname = loginname.trim();
        if (loginname.length > 0) {
            //conditions.loginname["$regex"] = `.*?${loginname}.*?`;
            // conditions.loginname["$regex"] = new RegExp(`.*?${loginname}.*?`);
            conditions.loginname = {
                // testadminaaaa, admin, testadmin, adminaaa,
                '$regex': `.*?${loginname}.*?`// 字符串模板 es6中的新语法
                // 正则表达式：
                // .表示除回车换行外的任意字符
                // *表示0个或多个任意字符
                // ?表示可以有也可以没有
            }
        }
    }

    var status = req.query.status;
    if (status) {
        // status = status.trim();
        if (status.length > 0) {
            conditions.status = status;
        }
    }
    //  以上代码是封装查询的条件

    var currentPage = req.params.page || 1;
    currentPage = parseInt(currentPage, 10);

    var pageSize = parseInt(req.params.pageSize);
    // console.log(pageSize)

    // console.log(currentPage)
    // console.log(conditions)

    db.User.find(conditions).count(function (err, count) {
        if (err) {
            util.send(res, 'error', '查询数据出错！Error:' + err);
            return;
        }
        // 获取页面的总页数
        var pageCount = Math.ceil(count / pageSize);

        if (currentPage > pageCount) currentPage = pageCount
        if (currentPage < 1) currentPage = 1

        db.User.find(conditions)
            // sort() 排序 
            .sort({ createtime: -1 })
            // 跳过几条数据后，返回后面的数据
            .skip((currentPage - 1) * pageSize)
            // 只让显示pageSize条数据
            .limit(pageSize)
            .exec(function (err, u) {
                if (err) {
                    util.send(res, 'error', '查询数据出错！Error:' + err);
                    return;
                }
                // console.log(u);
                // console.log(getPages(currentPage, pageCount))
                util.send(res, 'success', '查询数据成功！', {
                    currentPage: currentPage,
                    pageCount: pageCount,
                    pages: util.getPages(currentPage, pageCount),
                    users: u
                });
            })
    })
});

router.post('/api/user/remove/:id', util.sign, function (req, res) {
    db.User.findByIdAndUpdate(req.params.id, { $set: { status: 1 } }, function (err, u) {
        if (err) {
            util.send(res, 'error', '删除数据出错！Error:' + err);
            return;
        }
        util.send(res, 'success', '删除数据成功！');
    })
});

router.get('/user/edit/:id', util.sign, function (req, res) {
    db.User.findById(req.params.id, function (err, u) {
        res.render('user/edit', u);
    })
});

router.post('/api/user/edit/:id', util.sign, function (req, res) {
    req.body.lastupdatetime = Date.now();
    req.body.lastupdateuserid = req.cookies.userid;
    // console.log(req.body.lastupdatetime);
    // console.log(req.body.lastupdateuserid);
    db.User.findByIdAndUpdate(req.params.id, req.body, function (err, u) {
        // redirect()不仅可以跳转到api接口，还可以直接跳转html页面
        res.redirect('/user/list.html');
    })
});

module.exports = router;