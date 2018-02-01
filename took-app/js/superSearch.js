$(function(){

    //设置搜索内容
    $('#q').val(UrlParm.parm("q"));
    $('#sortType').val(UrlParm.parm("sortType"));
    $('#dpyhq').val(UrlParm.parm("dpyhq"));

    var sortType = $('#sortType').val();
    if(sortType!=null && sortType!=''){
        $('#xiaoliang').css('background','#f11').css('color','#fff');
        $('#zkyq').css('background',' #fff').css('color','#404040');
        $('#znpx').css('background',' #fff').css('color','#404040');
    }
    var dpyhq = $('#dpyhq').val();
    if(dpyhq!=null && dpyhq!=''){
        $('#zkyq').css('background','#f11').css('color','#fff');
        $('#xiaoliang').css('background',' #fff').css('color','#404040');
        $('#znpx').css('background',' #fff').css('color','#404040');
    }

    if((sortType==null || sortType=='') && (dpyhq==null || dpyhq=='')){
        $('#znpx').css('background','#f11').css('color','#fff');
        $('#xiaoliang').css('background',' #fff').css('color','#404040');
        $('#zkyq').css('background',' #fff').css('color','#404040');
    }


    search();

    //默认排序
    $('#znpx').click(function () {
        $('#sortType').val('');
        $('#zn').val('');
        $('#tm').val('');
        $('#dpyhq').val('');

        $('#search-form').submit();
    });

    //销量最高
    $('#xiaoliang').click(function(){
        $('#sortType').val(9);
        $('#zn').val('');
        $('#tm').val('');
        $('#dpyhq').val('');

        $('#search-form').submit();
    });

    //天猫优先
    $('#tmyx').click(function () {
        
    });

    //只看有券
    $('#zkyq').click(function () {
        $('#dpyhq').val(1);
        $('#sortType').val('');
        $('#zn').val('');
        $('#tm').val('');
        $('#search-form').submit();
    });



    //搜索
    function search() {
        $.ajax({
            type: "POST",
            url: prefix_url+"superSearchItems",
            data:$('#search-form').serialize(),
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

                var quanTemplate = $('#quanTemplate').html();
                var noquanTemplate = $('#noquanTemplate').html();
                var template="";
                var html="";

                data.forEach(function (value) {
                    var superDetailUrl='./superSearchDetail.html?title='+encodeURIComponent(value.title)
                        +"&picUrl="+encodeURIComponent(value.pictUrl)
                    +"&zkPrice="+encodeURIComponent(value.zkPrice)
                    +"&numIid="+encodeURIComponent(value.auctionId)
                    +"&couponPrice="+encodeURIComponent((value.zkPrice - value.couponAmount).toFixed(2))
                    +"&quan="+encodeURIComponent(value.couponAmount);
                    var couponAmount =value.couponAmount;
                    if(couponAmount>0){  //有优惠券
                        template=quanTemplate;
                    }else{
                        template=noquanTemplate;
                    }

                    var userType = value.userType;
                    if(userType==0){//淘宝
                        template = template.replace('${iconUrl}','./images/taobao.png');
                    }else if(userType==1){ //天猫
                        template = template.replace('${iconUrl}','./images/tmall.png');
                    }

                    html+=template.replace("${picUrl}",value.pictUrl)
                        .replace("${couponPrice}",(value.zkPrice - value.couponAmount).toFixed(2))
                        .replace(/\${zkPrice}/g,value.zkPrice)
                        .replace(/\${biz30day}/g,value.biz30day)
                        .replace('${title}',value.title)
                        .replace("${couponAmount}",value.couponAmount)
                        .replace("${couponLeftCount}",value.couponLeftCount)
                        .replace(/\${superDetailUrl}/g,superDetailUrl)
                        .replace(/&lt;/g,"<")
                        .replace(/&gt;/g,">");



                });


                $('#allitem-panel').html(html);
            },
            error: function() {
                alert("网络异常");
            }
        });
    }


    /*清除表单内容*/
    $('.search-reset').on('click', function () {
        $('.search-ipt').val('');
    });

    /*返回*/
    $('.search-cancel').on('click', function () {
        window.location.href = './index.html';
    })
    
    
    
    
    
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



