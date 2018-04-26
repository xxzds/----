$(function() {
    var nbtoplrt = setInterval(function() {
            var nbtoplrw = $('.goodsopenview').width();
            $('.nbleft').css('max-width', nbtoplrw / 8 * 1);
            $('.nbright').css('max-width', nbtoplrw / 8 * 1);
            $('.nbleft').css('right', nbtoplrw / 8 * 7);
            $('.nbright').css('left', nbtoplrw / 8 * 7);
        },
        100);
    $('.nbleft').fadeIn(500);
    $('.nbright').fadeIn(600);
    var nbtoplrw2 = $('.goodsopenview').width();
    /*$('.allpreContainer').css('height', nbtoplrw2);*/
});

$(function() {
    var price;  //在售价
    var couponPrice;  //券后价
    var jumpUrl;  //直接购买地址
    var content;  //复制的内容

    $('#nbmore').attr('data-id', UrlParm.parm("numIid"));
    $.ajax({
        type: "POST",
        url: prefix_url+"getitem/" + UrlParm.parm("id"),
        dataType: "json",
        success: function(result) {
            if (!result.success) {
                alert(result.message);
                return;
            }
            var data = result.data;
            console.log(data);
            if (data == null || data.length <= 0) {
                alert("暂无数据");
                return;
            }

            //主图
            $('#big-image>img').attr("src", data.picUrl);
            //标题
            $('#title').html(data.title);
            //券后价
            $('#couponPrice').html('￥' + data.couponPrice);
            couponPrice=data.couponPrice;
            //现价
            $('#price').html('原价 ￥' + data.price);
            price=data.price;
            //优惠券
            $('#quan').html('￥' + data.quan);
            //销量
            //$('#volume').html(data.volume);
            $('.goodsdetail>p').html(data.intro);

            //直接购买
            // var a = navigator.userAgent;
            // console.log(a);
            // if (a.indexOf('wechat') > -1 || a.indexOf("MicroMessenger") > -1) {
            //     $('#one').attr('href', "http://www.tooklili.com:81/taobao?backurl=" + encodeURIComponent(data.quanUrl));
            // } else {
            //     $('#one').attr('href', data.quanUrl);
            // }

            //直接购买
            $('#one').click(function(){
                getTwdAndShortLinkInfo(data.numIid,1);
            });

            //淘口令分享
            $('#two').click(function() {
                //getTpwd(data.title, data.quanUrl, data.picUrl)
                getTwdAndShortLinkInfo(data.numIid,2);

            });

            //超级搜地址
            $('.nb-so').attr('data-info','./superSearch.html?q='+encodeURIComponent(data.title));


        },
        error: function() {
            alert("网络异常");
        }
    });

    /**
     * 获取淘口令和短链接
     */
    function getTwdAndShortLinkInfo(numIid,type){
        if(type == 1 && jumpUrl != null){
            window.location.href = jumpUrl;
            return;
        }
        if(type ==2 && content != null){
            //打开弹层
            $('#doc-modal-1').modal({
                relatedTarget: this,
            });
            return;
        }

        $.ajax({
            type: "POST",
            url: prefix_url+"getTwdAndShortLinkInfo",
            data: {
                auctionid: numIid,
            },
            dataType: "json",
            success: function(result) {
                if(!result.success){
                    alert("调用接口失败");
                    return;
                }
                var data = result.data;

                var a = navigator.userAgent;
                if (a.indexOf('wechat') > -1 || a.indexOf("MicroMessenger") > -1) {
                    jumpUrl = "http://www.tooklili.com:81/taobao?backurl=" + encodeURIComponent(data.couponLink || data.clickUrl);
                } else {
                   jumpUrl = data.couponLink || data.clickUrl;
                }

                //复制的内容
                content=$('#title').html();
                content+="\n【在售价】"+price+"元"
                content+="\n【券后价】"+couponPrice+"元";
                content+="\n【下单链接】"+ (data.customCouponShortLinkUrl || data.shortLinkUrl);
                content+="\n-----------------";
                content+="\n复制这条信息，"+(data.couponLinkTaoToken || data.taoToken)+" ，打开【手机淘宝】即可查看";


                $('#copy_key_android').val(data.couponLinkTaoToken || data.taoToken);
                $('#copy_key_ios').html(data.couponLinkTaoToken);
                $("#copybtn").attr('data-taowords', content);

                if(type == 1 && jumpUrl != null){
                    window.location.href = jumpUrl;
                    return;
                }
                if(type ==2 && content != null){
                    //打开弹层
                    $('#doc-modal-1').modal({
                        relatedTarget: this,
                    });
                    return;
                }


            },
            error: function() {
                debugger;
                alert("网络异常");
            }
        });
    }


    /**
     * 获取淘口令
     * @param text
     * @param url
     */
    function getTpwd(text, url, logo) {
        $.ajax({
            type: "POST",
            url:  prefix_url+"tbk/getTpwdAndShortLink/",
            data: {
                text: text,
                url: url,
                logo: logo
            },
            dataType: "json",
            success: function(result) {

                if (!result.success) {
                    alert(result.message);
                    return;
                }
                var data = result.data;
                console.log(data);

                //复制的内容
                var content=$('#title').html();
                content+="\n【在售价】"+price+"元"
                content+="\n【券后价】"+couponPrice+"元";
                content+="\n【下单链接】"+data.couponShortLinkUrl;
                content+="\n-----------------";
                content+="\n复制这条信息，"+data.couponLinkTaoToken+" ，打开【手机淘宝】即可查看";

                //打开弹层
                $('#doc-modal-1').modal({
                    relatedTarget: this,
                });
                $('#copy_key_android').val(data.couponLinkTaoToken);
                $('#copy_key_ios').html(data.couponLinkTaoToken);
                $("#copybtn").attr('data-taowords', content);

            },
            error: function() {
                alert("网络异常");
            }
        });
    }

});

$(function() {
    var taokouling_value = document.getElementById("copy_key_android").value;
    function regain() {
        document.getElementById('copy_key_android').value = taokouling_value;
    }
});

$(function() {

    var nbcopy = 1;

    $("#copybtn").on('click',
        function() {
            var taowords = $(this).attr('data-taowords');
            console.log(taowords);
            $('#share_content').html(taowords);
        });

    var ua = navigator.userAgent.toLowerCase();
    if (nbcopy == 1) {
        $('.copy_taowords').show();

        var clipboard = new Clipboard("#copybtn", {
            text: function() {
                return $(".share_content").html()
            }
        });
        clipboard.on("success",
            function(a) {
                $('.taokaocopy').html("<img src='../addons/bsht_tbk/res/images/copyok.png'  style='width:80%;max-width:650px'>");
                a.trigger.innerHTML = "复制成功";
                a.trigger.style.backgroundColor = "#9ED29E";
                $('#copybtn').hide();
                a.trigger.style.borderColor = "#9ED29E";
                $(".share_content").hide();
                console.info("Action:", a.action);
                console.info("Text:", a.text);
                console.info("Trigger:", a.trigger);
                a.clearSelection();
                setTimeout(function() {
                        $(".share").html('一键复制');
                        $(".share").css('backgroundColor', '#f54d23');
                        $(".am-close").click();
                    },
                    2000);
            });
        clipboard.on("error",
            function(a) {
                a.trigger.innerHTML = "复制失败";
                setTimeout(function() {
                        a.trigger.innerHTML = "请手工复制"
                    },
                    1000);
                a.trigger.style.backgroundColor = "#666";
                a.trigger.style.borderColor = "#9ED29E";
                $(".share_content").hide();
                console.info("Action:", a.action);
                console.info("Text:", a.text);
                console.info("Trigger:", a.trigger);
                a.clearSelection();

            });

    }

    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/iphone/i) == "iphone" || ua.match(/ipad/i) == "ipad") {

        $('.fq-explain span').html("长按框内 > 拷贝");

    } else {
        $("#copy_key_ios").hide();
        $("#copy_key_android").show();
    }

    document.addEventListener("selectionchange",
        function(e) {
            if (window.getSelection().anchorNode.parentNode.id == 'copy_key_ios' || window.getSelection().anchorNode.id == 'copy_key_ios') {
                var key = document.getElementById('copy_key_ios');
                window.getSelection().selectAllChildren(key)
            }
        },
        false)

});

$(function() {
    $(".nb-camera").click(function() {

        if ($('.imgData').attr('src') == "") {
            $('.image_loading').show();
            $('.image_show').hide();
        }
        $(".nb-sharecanvas").css("display", "flex");

        //生成二维码
        $.ajax({
            type: "POST",
            url:  prefix_url+"getQrCodeBase64",
            data: {
                url: window.location.href
            },
            dataType: "json",
            success: function(result) {

                $('#codeimageBase64').val(result.data);

                //生成图片
                canvasApp();

            },
            error: function() {
                alert("网络异常");
            }
        });
    });

    $(".nb-canvas .icon-close").click(function() {
        $(".nb-sharecanvas").css("display", "none");
    });

    function canvasApp() {
        var canvas = document.getElementById('sharecanvas');
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        canvas.width = (document.documentElement.clientWidth * 0.9) * 2;
        canvas.height = canvas.width / 2 + 680;
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] == 0) {
                imageData.data[i] = 255;
                imageData.data[i + 1] = 255;
                imageData.data[i + 2] = 255;
                imageData.data[i + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        var item_img = new Image();
        item_img.setAttribute('crossOrigin', 'anonymous');
        item_img.src = $('#big-image>img').attr("src");
        item_img.onerror = function() {
            $('.image_loading').hide();
            $('.image_show').hide();
            $('.nb-sharecanvas').hide();
            return false;
        }
        item_img.onload = function() {
            ctx.drawImage(item_img, 0, 0, canvas.width, canvas.width);
            var code_img = new Image();
            code_img.setAttribute('crossOrigin', 'anonymous');
            code_img.src = $('#codeimageBase64').val();
            code_img.onerror = function() {
                $('.image_loading').hide();
                $('.image_show').hide();
                $('.nb-sharecanvas').hide();
                return false;
            }
            code_img.onload = function() {
                ctx.drawImage(code_img, canvas.width - 220, canvas.width + 20, 200, 200);
                var str = $('#title').html();
                ctx.fillStyle = '#605761';
                ctx.lineWidth = 1;
                ctx.textAlign = 'left';
                ctx.textBaseline = "top";
                ctx.font = '28px Helvetica';
                var lineWidth = 0;
                var canvasWidth = canvas.width - 60;
                var initHeight = canvas.width + 30;
                var lastSubStrIndex = 0;
                for (var i = 0; i <= str.length; i++) {
                    lineWidth += ctx.measureText(str[i]).width;
                    if (lineWidth > canvasWidth - 230) {
                        ctx.fillText(str.substring(lastSubStrIndex, i), 20, initHeight);
                        initHeight += 40;
                        lineWidth = 0;
                        lastSubStrIndex = i;
                    }
                    if (i == str.length - 1) {
                        ctx.fillText(str.substring(lastSubStrIndex, i + 1), 20, initHeight);
                    }
                }

                var price = $('#price').html();
                ctx.fillStyle = '#aba0ac';
                ctx.textAlign = 'left';
                ctx.font = '30px Helvetica';
                ctx.textBaseline = "top";
                ctx.fillText(price, 20, initHeight + 30);
                ctx.strokeStyle = '#aba0ac';
                ctx.lineWidth = 2;
                ctx.moveTo(20, initHeight + 46);
                ctx.lineTo(200, initHeight + 46);
                ctx.stroke();
                var end_price_title = "券后价:";
                ctx.fillStyle = '#aba0ac';
                ctx.textAlign = 'left';
                ctx.font = '30px Helvetica';
                ctx.textBaseline = "top";
                ctx.fillText(end_price_title, 20, initHeight + 80);
                //券后价
                var end_price = $('#couponPrice').html();
                ctx.fillStyle = '#fba137';
                ctx.textAlign = 'left';
                ctx.font = '42px Helvetica';
                ctx.textBaseline = "top";
                ctx.fillText(end_price, 120, initHeight + 72);
                ctx.setLineDash([10, 5]);
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#aba0ac';
                ctx.beginPath();
                ctx.moveTo(10, canvas.height - 50);
                ctx.lineTo(canvas.width - 10, canvas.height - 50);
                ctx.stroke();
                ctx.fillStyle = 'white';
                ctx.lineWidth = 0;
                ctx.beginPath();
                ctx.moveTo((canvas.width - 308) / 2 - 10, canvas.height - 64);
                ctx.lineTo((canvas.width - 308) / 2 + 320, canvas.height - 64);
                ctx.lineTo((canvas.width - 308) / 2 + 320, canvas.height - 46);
                ctx.lineTo((canvas.width - 308) / 2 - 10, canvas.height - 46);
                ctx.lineTo((canvas.width - 308) / 2 - 10, canvas.height - 64);
                ctx.fill();
                var code_title = '长按二维码识别查看商品';
                ctx.fillStyle = '#aba0ac';
                ctx.font = '28px Helvetica';
                ctx.fillText(code_title, (canvas.width - 308) / 2, canvas.height - 64);
                var image = new Image();
                image.setAttribute('crossOrigin', 'anonymous');
                image.src = canvas.toDataURL("img/jpeg");
                $(".imgData").attr("background", "white");
                $(".imgData").attr("src", image.src);
                //$(".imgData").attr("id",image.src);
                $(".imgData").show();

                if ($('.imgData').attr('src') != "") {
                    $('.image_loading').hide();
                    $('.image_show').show();
                    $('.am-icon-close').show();
                }

            }
        }

    }

});

function gotop() {
    setTimeout('$("html,body").animate({scrollTop:$("body").offset().top},500);', 500);
    $(".go-top").addClass("top-button-hide").removeClass("top-button-show");
}
window.addEventListener("scroll",
    function(event) {
        var scrollTop = window.pageYOffset
            || document.documentElement.scrollTop
            || document.body.scrollTop
            || 0
        if (scrollTop > 500) {
            $(".go-top").removeClass("top-button-hide").addClass("top-button-show");
        } else {
            $(".go-top").addClass("top-button-hide").removeClass("top-button-show");
        }
    });

$(function() {
    //采集pics
    $(document).delegate("#nbmore", "click",
        function() {
            var $thisid = $(this);
            var itemid = $thisid.data("id");
            var nbok = $thisid.attr("nbok");
            if (nbok == 1) {
                $("#tabtxt").html('商品图文详情（点击查看）');
                setTimeout('$("html,body").animate({scrollTop:$(".allpreContainer").offset().top},500);', 500);
                $('.am-tab-panel').hide();
                $("#nbmore").attr('nbok', '0');
                return false;
            }
            $("#tabtxt").removeClass('jump');
            $("#nbmore").attr('nbok', '1');
            $("#tab1").fadeIn();
            $("#tabtxt").html('商品图文详情（加载完毕，请您查阅）');
            $("#nbmore").css('text-decoration', 'none');
            //$("#back_top2").fadeIn(500);
            setTimeout('$("html,body").animate({scrollTop:$("#tabtxtthis").offset().top},500);', 500);
            $.ajax({
                url: "https://hws.m.taobao.com/cache/mtop.wdetail.getItemDescx/4.1/?data=%7Bitem_num_id%3A" + itemid + "%7D&type=jsonp&dataType=jsonp",
                dataType: 'jsonp',
                jsonp: 'callback',
                success: function(result) {
                    if (result.ret[0] == "SUCCESS::接口调用成功") {
                        var len = result.data.images.length;
                        var image = new Array();
                        for (var i = 0; i < len; i++) {
                            image[i] = "<img src='" + result.data.images[i] + "' style='width:100%;max-width:100%'>";
                        }
                        $('.am-tab-panel').show();
                        $('.am-tab-panel').html(image);
                    }
                }
            });
        });
    //采集pics
});

var code = "<img style='width: 240px;height: auto;' src='./images/IMG_1543.JPG'/>";
function kf() {
    layer.open({
        title: false,
        type: 1,
        closeBtn: 2,
        shadeClose: true,
        content: code,
        shade: [0.8, '#000']
    });

    $('.layer-anim').css('position', 'fixed');
    $('.layer-anim').css('top', '20%');
    $('.layer-anim').css('left', '0');
    $('.layer-anim').css('right', '0');
    $('.layer-anim').css('width', '100%');
    $('.layer-anim').css('max-width', '250px');
    $('.layer-anim').css('margin', 'auto');

}

//本栏目更多精品
$(function(){
    $.ajax({
        type: "POST",
        url:  prefix_url+"getRandomItemByCateId",
        dataType: "json",
        data:{
            cateId:UrlParm.parm("cateId"),
            size:4
        },
        success: function (result) {

            var html="";
            var data = result.data;
            var template = $('#moreItemTemplate').html();

            if(data.length>0){
                data.forEach(function (value,index) {
                    var itemDetailUrl='./itemDetail.html?numIid='+value.numIid+"&id="+value.id+"&cateId="+value.cateId;
                    html+=template.replace(/\${itemDetailUrl}/g,itemDetailUrl)
                        .replace("${picUrl}",value.picUrl)
                        .replace("${couponPrice}",value.couponPrice)
                        .replace("${volume}",parseInt(value.volume)+parseInt(100))
                        .replace("${quan}",value.quan)
                        .replace("${title}",value.title)
                        .replace("&lt;","<")
                        .replace("&gt;",">");
                });
            }
            $('#list_box').html(html);

            //设置图片的宽度和高度相等
            $('.loazd').each(function () {
                $(this).css('height',$(this).css('width'));
            });
        },
        error: function () {
            alert("网络异常");
        }
    });

    //屏幕改变时，改变图片的高度
    window.onresize=function(){
        $('.loazd').each(function () {
            $(this).css('height',$(this).css('width'));
        });
    }
});

//超级搜
$(function(){
    $(document).delegate(".nb-so", "click", function () {
        var thisdatainfo = $('.nb-so').attr('data-info');

        layer.open({
            title:'确认操作'
            ,content: '是否使用 <b>超级搜索</b> 查询本商品更多优惠？'
            ,btn: ['确认', '取消']
            ,yes: function(index){
                window.location.href=thisdatainfo;
                layer.close(index);
            }
        });
    });
});
