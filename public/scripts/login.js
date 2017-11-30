$(function () {

    $('#btnLogin').on('click', function (ev) {
        ev.preventDefault();
        var loginname = $('#loginname');
        var password = $('#password');

        // 客户端验证
        if (loginname.val().trim().length <= 0) {
            // prop()
            layer.alert(loginname.attr('placeholder'));
            return;
        }
        if (password.val().trim().length <= 0) {
            layer.alert(password.attr('placeholder'));
            return;
        }
        
        var data = {
            loginname: loginname.val().trim(),
            password: password.val().trim(),
        };
        $.post({
            url: "/api/login",
            data: data,
            success: function (res) {
                if (res.code == 'success') {
                    location.href = 'index.html';
                } else {
                    layer.alert(res.message);
                }
            }
        });
    })
});