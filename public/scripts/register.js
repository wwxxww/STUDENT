$(function () {

    $('#btnRegister').on('click', function (ev) {
        ev.preventDefault();
        var loginname = $('#loginname');
        var password = $('#password');
        var confirmpassword = $('#confirmpassword');
        if (loginname.val().trim().length <= 0) {
            layer.alert(loginname.attr('placeholder'));
            return;
        }
        if (password.val().trim().length <= 0) {
            layer.alert(password.attr('placeholder'));
            return;
        }
        if (confirmpassword.val().trim().length <= 0) {
            layer.alert(confirmpassword.attr('placeholder'));
            return;
        }
        if (password.val().trim() != confirmpassword.val().trim()) {
            layer.alert('两次输入的密码不一致');
            return;
        }

        var data = {
            loginname: loginname.val().trim(),
            password: password.val().trim(),
            confirmpassword: confirmpassword.val().trim()
        };
        $.post({
            url: "/api/register",
            data: data,
            success: function (res) {
                if (res.code == 'success') {
                    location.href = '/login';
                } else {
                    layer.alert(res.message);
                }
            }
        });
    })
});