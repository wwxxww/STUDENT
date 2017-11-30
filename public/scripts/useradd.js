$(function () {

    $('#btnAddUser').on('click', function (ev) {
        ev.preventDefault();
        var loginname = $('#loginname');
        var password = $('#password');
        if (loginname.val().trim().length <= 0) {
            layer.alert(loginname.attr('placeholder'));
            return;
        }
        if (password.val().trim().length <= 0) {
            layer.alert(password.attr('placeholder'));
            return;
        }

        var data = {
            loginname: loginname.val().trim(),
            password: password.val().trim()
        };
        $.post({
            url: "/api/user/add",
            data: data,
            success: function (res) {
                if (res.code == 'success') {
                    location.href = '/user/list.html';
                } else {
                    layer.alert(res.message);
                }
            }
        });
    })
});