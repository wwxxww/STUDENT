$(function () {

    $('#btnAddClass').on('click', function (ev) {
        ev.preventDefault();
        var name = $('#name');
        var description = $('#description');
        if (name.val().trim().length <= 0) {
            layer.alert(name.attr('placeholder'));
            return;
        }
        if (description.val().trim().length <= 0) {
            layer.alert(description.attr('placeholder'));
            return;
        }

        var data = {
            name: name.val().trim(),
            description: description.val().trim()
        };
        $.post({
            url: "/api/class/add",
            data: data,
            success: function (res) {
                if (res.code == 'success') {
                    location.href = '/class/list.html';
                } else {
                    layer.alert(res.message);
                }
            }
        });
    })
});