function send(res, code, message, data) {
    res.status(200).json({ code, message, data });
}

function sign(req, res, next) {
    if (req.cookies.loginname) {
        next();
        return;
    }
    res.redirect('/login');
}

function getPages(currentPage, pageCount) {
    var pages = [currentPage]
    // [nn3mm]

    // 当前页左边的第1个页码
    var left = currentPage - 1// 2
    // 当前页右边的第1个页码
    var right = currentPage + 1// 4

    // 左右两边各加1个页码，直到页码够10个或
    // 左边到1、右边到总页数
    while (pages.length < 10 && (left >= 1 || right <= pageCount)) {
        if (left >= 1) pages.unshift(left--)
        // [2,3]
        if (right <= pageCount) pages.push(right++)
        // [1,2,3,4,5,6,7,8,9,10]
    }
    // console.log(pages);
    return pages
}

module.exports = { send, sign, getPages };
