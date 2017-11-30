$(function () {

    var loginname = $.cookie('loginname');
    if (!loginname) {
        location.href = '/login';
        return;
    }

});