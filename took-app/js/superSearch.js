$(function(){

    //设置搜索内容
    $('#J_QueryVal').val(UrlParm.parm("title"));


    $.ajax({
        type: "POST",
        url: "http://www.tooklili.com:81/tookApp/superSearchItems",
        data:{
            q:$('#J_QueryVal').val()
        },
        dataType: "json",
        success: function(result) {
            console.log(result);
            if (!result.success) {
                alert(result.message);
                return;
            }
            var data = result.data;
            if (data == null || data.length <= 0) {
                alert("暂无数据");
                return;
            }

            var template = $('#quanTemplate').html();
            var html="";

            data.forEach(function (value) {
                var userType = value.userType;
                if(userType==0){//淘宝
                    template = template.replace('${iconUrl}','./images/taobao.png');
                }else if(userType==1){ //天猫
                    template = template.replace('${iconUrl}','./images/tmall.png');
                }

                html+=template.replace("${picUrl}",value.pictUrl)
                    .replace("${zkPrice}",value.zkPrice)
                    .replace("${biz30day}",value.biz30day)
                    .replace('${title}',value.title)
                    .replace("${couponAmount}",value.couponAmount)
                    .replace("${couponLeftCount}",value.couponLeftCount)
                    .replace(/&lt;/g,"<")
                    .replace(/&gt;/g,">");



            });


            $('#allitem-panel').html(html);
        },
        error: function() {
            alert("网络异常");
        }
    });
});

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

