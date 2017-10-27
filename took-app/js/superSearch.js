/*校验表单提交*/
function checkForm (obj) {
    var val = $.trim($('.search-ipt').val()), err = '';
    if (/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g.test(val)) {
        err = '粘贴商品标题试试~（链接地址不支持）！';
    }
    if (val == '') {
        err = '搜索内容不能为空！';
    }
    if (err) {
        layer.open({
            content: err,
            btn: ['我知道了','返回首页'],
            //,shadeClose:false
            btn2: function(){
                window.location.href = './index.html';
            }
        });
    }
    return !err;
}

/*清除表单内容*/
$('.search-reset').on('click', function () {
    $('.search-ipt').val('');
});

/*返回*/
$('.search-cancel').on('click', function () {
    window.location.href = './index.html';
})

