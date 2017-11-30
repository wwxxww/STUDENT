var express = require('express');
var util = require('../modules/utilities');
var db = require('../modules/mongoose');

var router = express.Router();

router.get('/student/add', util.sign, function (req, res) {
    // db.Class.find({ status: 0 }, { _id: 1, name: 1 }).exec(function (err, classes) {
    //     res.render('student/add', { classes });
    // })

    db.Class.find({ status: 0 })
    // .select('_id, name')
    .select({_id: 1, name: 1})
    .exec(function (err, classes) {
        res.render('student/add', { classes });
    })
});

router.post('/api/student/add', util.sign, function (req, res) {
    if (!req.body.name || !req.body.age || !req.body.phone) {
        util.send(res, 'error', '请输入姓名，年龄或手机号！');
        return;
    }

    var guid = new db.mongoose.Types.ObjectId;
    var now = Date.now();

    var student = {
        _id: guid,
        name: req.body.name,
        sex: req.body.sex,
        age: req.body.age,
        phone: req.body.phone,
        classid: req.body.classid,
        status: 0,
        createuserid: req.cookies.userid,
        createtime: now,
        lastupdateuserid: req.cookies.userid,
        lastupdatetime: now
    };
    db.Student.create(student, function (err, u) {
        if (err) {
            util.send(res, 'error', '保存数据时出错！Error' + err);
            return;
        }

        util.send(res, 'success', '保存数据成功！');
    });
});

router.get('/api/student/list/(:page)?', util.sign, function (req, res) {
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

    var sex = req.query.sex;
    if (sex) {
        sex = sex.trim();
        if (sex.length > 0) {
            conditions.sex = sex
        }
    }

    var ageBegin = req.query.ageBegin;
    if (ageBegin) {
        ageBegin = ageBegin.trim();
        if (ageBegin.length > 0) {
            if (!conditions.age) {
                conditions.age = {};
            }
            conditions.age["$gte"] = req.query.ageBegin;
        }
    }

    var ageEnd = req.query.ageEnd;
    if (ageEnd) {
        ageEnd = ageBegin.trim();
        if (ageEnd.length > 0) {
            if (!conditions.age) {
                conditions.age = {};
            }
            conditions.age["$lte"] = req.query.ageEnd;
        }
    }

    var phone = req.query.phone;
    if (phone) {
        phone = phone.trim();
        if (phone.length > 0) {
            conditions.phone = {
                '$regex': `.*?${phone}.*?`
            }
        }
    }

    var classid = req.query.classid;
    if (classid) {
        classid = classid.trim();
        if (classid.length > 0) {
            conditions.classid = classid
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

    db.Student.find(conditions).count(function (err, count) {
        if (err) {
            util.send(res, 'error', '查询数据出错！Error:' + err);
            return;
        }
        var pageCount = Math.ceil(count / pageSize);

        if (currentPage > pageCount) currentPage = pageCount
        if (currentPage < 1) currentPage = 1

        db.Student.find(conditions)
            .sort({ createtime: -1 })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
            .populate('classid')
            .populate('createuserid')
            .exec(function (err, stu) {
                if (err) {
                    util.send(res, 'error', '查询数据出错！Error:' + err);
                    return;
                }
                // console.log(getPages(currentPage, pageCount))
                // console.log(stu);
                util.send(res, 'success', '查询数据成功！', {
                    currentPage: currentPage,
                    pageCount: pageCount,
                    pages: util.getPages(currentPage, pageCount),
                    students: stu
                });
            })
    })
});

router.post('/api/student/remove/:id', util.sign, function (req, res) {
    db.Student.findByIdAndUpdate(req.params.id, { $set: { status: 1 } }, function (err, stu) {
        if (err) {
            util.send(res, 'error', '删除数据出错！Error:' + err);
            return;
        }
        util.send(res, 'success', '删除数据成功！');
    })
});

router.get('/student/edit/:id', util.sign, function (req, res) {
    db.Student.findById(req.params.id)
        .populate("classid")
        .exec(function (err, stu) {
            // console.log(stu);
            db.Class.find({ status: 0 }, { _id: 1, name: 1 })
                .exec(function (err, classes) {
                    // 把班级表中的信息作为扩展属性，增加到stu对象
                    // 中，然后页面上就可以通过循环stu.classes这个
                    // 属性进行数据绑定操作了。
                    stu.classes = classes;
                    res.render('student/edit', { stu: stu });
                });
        });
});

router.post('/api/student/edit/:id', util.sign, function (req, res) {
    req.body.lastupdatetime = Date.now();
    req.body.lastupdateuserid = req.cookies.userid;
    db.Student.findByIdAndUpdate(req.params.id, req.body, function (err, stu) {
        res.redirect('/student/list.html');
    })
});

module.exports = router;