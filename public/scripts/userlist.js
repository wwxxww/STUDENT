
// 用来分页
// page => currentPage 当前页
// pageCount => 总页数
function showPage(page, pageCount) {
    if (page < 1) page = 1
    if (page > pageCount) page = pageCount

    $.get({
        url: '/api/user/list/' + page + '/' + 5,
        data: $('#searchForm').serialize(),
        success: function (res) {
            if (res.code == 'success') {
                var html = template('userList', res.data);
                $('#showList').html(html);
            } else {
                layer.alert(res.message);
            }
        }
    });
}

// 删除数据
function removeData(id, name) {
    $('#removeModal .modal-body').text('点击确定将删除' + name);
    // modal() 是bootstrap框架调起modal框的方法
    $('#removeModal').modal();

    $('#removeModal .btn-danger')
        .off('click')                   //移除所有点击事件监听函数
        .on('click', function () {        //添加一个点击事件监听函数
            $.post({
                url: '/api/user/remove/' + id,
                // data: null,
                success: function (res) {
                    if (res.code == 'success') {
                        location.reload();
                    }
                    else {
                        layer.alert(res.message);
                    }
                }
            });
        });

}

$(function () {

    var loginname = $.cookie('loginname');
    if (!loginname) {
        location.href = '/login';
        return;
    }

    showPage(1, 1);

});