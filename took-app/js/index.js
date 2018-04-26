//页数
var page=0;

//类别
var cateId;

//每页展示的个数
var size=10;

$.ajax({
    type : "POST",
    url : prefix_url+"queryItemCates",
    dataType: "json",
    async:false,
    success : function(result) {
        if(result.success){
            var data = result.data;

            if(UrlParm.parm('cateId')){
                cateId = UrlParm.parm('cateId');
            }else if(! UrlParm.parm('keyWords')){
                cateId = data[0].id;
            }

            var html ='';
            data.forEach(function (value) {
                if(cateId && cateId == value.id){
                    html += '<a href="javascript:;" style="overflow: hidden;" id="id'+value.id+'" class="item cur" onclick="clickCate('+value.id+');">'+value.itemCateName+'</a>'
                }else{
                    html += '<a href="javascript:;" style="overflow: hidden;" id="id'+value.id+'" class="item" onclick="clickCate('+value.id+');">'+value.itemCateName+'</a>'
                }

            });
           // $('#footer').html(html);
            $('.tab').html(html);
        }
    },
    error:function(){

    }
});


var keyWords =null;
if(UrlParm.parm('keyWords')){
    keyWords = UrlParm.parm('keyWords');
    $('#keyWords').val(keyWords);
}
var template = $('#template').html();
var dropload = $('#content').dropload({
    scrollArea : window,
    autoLoad : true,
    loadDownFn : function(me){
        page++;

        var url='';
        if(keyWords ==null || keyWords == ''){
            url = prefix_url+"couponItems";
        }else{
            url = prefix_url+"queryCouponItemsByKeyWords"
        }
        $.ajax({
            type : "POST",
            url : url,
            data : {
                cateId : cateId,
                currentPage : page,
                pageSize : size,
                keyWords  : keyWords
            },
            dataType: "json",
            success : function(result) {

                var html="";
                var data = result.data;

                if(data.length>0){
                    data.forEach(function (value,index) {
                        html+=template.replace("${picUrl}",value.picUrl)
                            .replace("${numIid}",value.numIid)
                            .replace("${id}",value.id)
                            .replace("${quanUrl}",value.quanUrl)
                            .replace("${price}",value.price)
                            .replace("${couponPrice}",value.couponPrice)
                            .replace("${quan}",value.quan)
                            .replace("${title}",value.title)
                            .replace("${cateId}",value.cateId)
                            .replace("&lt;","<")
                            .replace("&gt;",">");
                    });
                }else{
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }


                $('.lists').append(html);
                // 每次数据加载完，必须重置
                me.resetload();


                if(keyWords ==null || keyWords == ''){
                    history.pushState(null,null,location.pathname+"?cateId="+cateId);
                }else{
                    history.pushState(null,null,location.pathname+"?keyWords="+keyWords);
                }

            },
            error:function(){
                alert("网络异常");
                // 即使加载出错，也得重置
                me.resetload();
            }
        });

    },
    loadUpFn:function (me) {
        // 重置页数，重新获取loadDownFn的数据
        page = 1;
        var url='';
        if(keyWords ==null || keyWords == ''){
            url = prefix_url+"couponItems";
        }else{
            url = prefix_url+"queryCouponItemsByKeyWords"
        }
        $.ajax({
            type : "POST",
            url : url,
            data : {
                cateId : cateId,
                currentPage : page,
                pageSize : size,
                keyWords  : keyWords
            },
            dataType: "json",
            success : function(result) {
                var html="";
                var data = result.data;

                data.forEach(function (value,index) {
                    html+=template.replace("${picUrl}",value.picUrl)
                        .replace("${numIid}",value.numIid)
                        .replace("${id}",value.id)
                        .replace("${quanUrl}",value.quanUrl)
                        .replace("${price}",value.price)
                        .replace("${couponPrice}",value.couponPrice)
                        .replace("${quan}",value.quan)
                        .replace("${title}",value.title)
                        .replace("${cateId}",value.cateId)
                        .replace("&lt;","<")
                        .replace("&gt;",">");
                })

                $('.lists').html(html);
                // 每次数据加载完，必须重置
                me.resetload();

                // 解锁loadDownFn里锁定的情况
                me.unlock();
                me.noData(false);

                if(keyWords ==null || keyWords == ''){
                    history.pushState(null,null,location.pathname+"?cateId="+cateId);
                }else{
                    history.pushState(null,null,location.pathname+"?keyWords="+keyWords);
                }
            },
            error:function(){
                alert("网络异常");
                // 即使加载出错，也得重置
                me.resetload();
            }
        });
    },
    threshold : 50
});


/**
 * tab的点击事件
 * @param id
 */
function clickCate(id){
    cateId=id;
    $('.lists').html("");

    $('.item').removeClass('cur');
    $('#id'+id).addClass('cur');
    keyWords = null;
    $('#keyWords').val('');
    page=0;
    // 解锁
    dropload.unlock();
    dropload.noData(false);
    // 重置
    dropload.resetload();
}


/**
 * 跳转到商品详情页
 * @param object
 */
function toItemDetail(object){
    var numIid = $(object).find('input[name="numIid"]').val();
    var id =  $(object).find('input[name="id"]').val();
    var cateId = $(object).find('input[name="cateId"]').val();
    window.location.href='./itemDetail.html?numIid='+numIid+"&id="+id+"&cateId="+cateId;
}



$('form').on('submit', function(e){
    keyWords = $('#keyWords').val();

    if(keyWords ==null || keyWords == '') return;

    $('.lists').html("");
    $('.item').removeClass('cur');
    $('#keyWords').blur();
    page=0;
    // 解锁
    dropload.unlock();
    dropload.noData(false);
    // 重置
    dropload.resetload();
    return false;
});