//页数
var page=0;

//类别
var cateId=35;

//每页展示的个数
var size=10;

var template = $('#template').html();
var dropload = $('.container-fluid').dropload({
    scrollArea : window,

    loadDownFn : function(me){
        page++;

        $.ajax({
            type : "POST",
            url : "http://www.tooklili.com:81/tookApp/couponItems",
            data : {
                cateId : cateId,
                currentPage : page,
                pageSize : size
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
            },
            error:function(){
                alert("网络异常");
                // 即使加载出错，也得重置
                me.resetload();
            }
        });

    },
    loadUpFn:function (me) {
        $.ajax({
            type : "POST",
            url : "http://www.tooklili.com:81/tookApp/couponItems",
            data : {
                cateId : cateId,
                currentPage : 1,
                pageSize : size
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

                // 重置页数，重新获取loadDownFn的数据
                page = 1;
                // 解锁loadDownFn里锁定的情况
                me.unlock();
                me.noData(false);


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