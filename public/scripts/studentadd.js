$(function () {

    $('#btnAddStudent').on('click', function (ev) {
        ev.preventDefault();
        var name = $('#name');
        var age = $('#age');
        var phone = $('#phone');
        if (name.val().trim().length <= 0) {
            layer.alert(name.attr('placeholder'));
            return;
        }
        if (age.val().trim().length <= 0) {
            layer.alert(age.attr('placeholder'));
            return;
        }
        if (phone.val().trim().length <= 0) {
            layer.alert(phone.attr('placeholder'));
            return;
        }

        var data = {
            name: name.val().trim(),
            age: age.val().trim(),
            sex: $('form input[name="sex"]:checked').val().trim(),
            phone: phone.val().trim(),
            classid: $('#classid').val().trim(),
        };
        $.post({
            url: "/api/student/add",
            data: data,
            success: function (res) {
                if (res.code == 'success') {
                    location.href = '/student/list.html';
                } else {
                    layer.alert(res.message);
                }
            }
        });
    })
});