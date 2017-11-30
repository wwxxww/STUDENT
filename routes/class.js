var express = require('express');
var util = require('../modules/utilities');
var db = require('../modules/mongoose');

var router = express.Router();

router.get('/class/add', util.sign, function (req, res) {
    res.render('class/add');
});

router.post('/api/class/add', util.sign, function (req, res) {
    if (!req.body.name || !req.body.description) {
        util.send(res, 'error', '请输入班级名称或班级描述！');
        return;
    }

    var guid = new db.mongoose.Types.ObjectId;
    var now = Date.now();

    var cls = {
        _id: guid,
        name: req.body.name,
        description: req.body.description,
        status: 0,
        createuserid: req.cookies.userid,
        createtime: now,
        lastupdateuserid: req.cookies.userid,
        lastupdatetime: now
    };
    db.Class.create(cls, function (err, u) {
        if (err) {
            util.send(res, 'error', '保存数据时出错！Error' + err);
            return;
        }

        util.send(res, 'success', '保存数据成功！');
    });
});

router.get('/api/class/list/(:page)?', util.sign, function (req, res) {
    var conditions = {};

    var name = req.query.name;
    if (name) {
        name = name.trim();
        if (name.length > 0) {
            conditions.name = {
                '$regex': `.*?${name}.*?`
                // 正则表达式：
                // .表示除回车换行外的任意字符
                // *表示0个或多个
                // ?表示可以有也可以没有
            }
        }
    }

    var status = req.query.status;
    if (status) {
        status = status.trim();
        if (status.length > 0) {
            conditions.status = status;
        }
    }

    var currentPage = req.params.page || 1;
    currentPage = parseInt(currentPage);

    var pageSize = 5

    db.Class.find(conditions).count(function (err, count) {
        if (err) {
            util.send(res, 'error', '查询数据出错！Error:' + err);
            return;
        }
        var pageCount = Math.ceil(count / pageSize);

        if (currentPage > pageCount) currentPage = pageCount
        if (currentPage < 1) currentPage = 1

        db.Class.find(conditions)
            .sort({ createtime: -1 })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
            .exec(function (err, c) {
                if (err) {
                    util.send(res, 'error', '查询数据出错！Error:' + err);
                    return;
                }
                util.send(res, 'success', '查询数据成功！', {
                    currentPage: currentPage,
                    pageCount: pageCount,
                    pages: util.getPages(currentPage, pageCount),
                    classes: c
                });
            })
    })
});

router.post('/api/class/remove/:id', util.sign, function (req, res) {
    db.Class.findByIdAndUpdate(req.params.id, { $set: { status: 1 } }, function (err, c) {
        if (err) {
            util.send(res, 'error', '删除数据出错！Error:' + err);
            return;
        }
        util.send(res, 'success', '删除数据成功！');
    })
});

router.get('/class/edit/:id', util.sign, function (req, res) {
    db.Class.findById(req.params.id, function (err, c) {
        res.render('class/edit', c);
    })
});

router.post('/api/class/edit/:id', util.sign, function (req, res) {
    req.body.lastupdatetime = Date.now();
    req.body.lastupdateuserid = req.cookies.userid;
    db.Class.findByIdAndUpdate(req.params.id, req.body, function (err, c) {
        res.redirect('/class/list.html');
    })
});

module.exports = router;