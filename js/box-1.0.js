/**
 * 弹出提示框插件
 * 提供{关闭函数$.jClose，简单提示$.jAlert，按钮提示$.jConfirm}
 * v1.0
 * 2017-04-16
 * xjq
 */
;
(function ($) {
    var _timer_ = 0;
    clearTimeout(_timer_);
    /**
     * 重新设置元素的模块
     * @param ele
     * @param w
     * @param h
     * @returns {boolean}
     * @private
     */
    function _setBoxLayout(ele, w, h) {
        if (!ele) return false;
        $(ele).css({
            "width": w + "px",
            "height": h + "px",
            "marginTop": -h / 2 + "px",
            "marginLeft": -w / 2 + "px"
        });
    }

    //添加样式到页面
    (function _setBoxCss() {
        var str = "\
            .j-alert-box{position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 10000;}\
            .j-alert{display: table; position: absolute; top: 50%; left: 50%; z-index: 1000; background: rgba(0,0,0,0.7); text-align: center; border-radius: 3px;}\
            .j-alert span{display: table-cell; vertical-align: middle; padding: 15px; font-size: 14px; color: #FFFFFF; line-height: 20px;}\
            .j-confirm-box{position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 10000; background: rgba(0,0,0,0.5);}\
            .j-confirm{position: absolute;  top: 50%; left: 50%; z-index: 1000; background: #FFF; text-align: center; border-radius: 5px; box-shadow: 2px 2px 3px #444040;}\
            .j-confirm-text{display: table; margin: 0; padding: 15px; width: 100%;}\
            .j-confirm-text.j-confirm-hasTitle{padding-top: 0;}\
            .j-confirm-title{display: block; width: 100%; margin: 15px 0 5px 0; padding: 0; font-weight: bold; font-size: 14px; text-align: center; color: #3c3c3c;}\
            .j-confirm-text >div{display: table-cell; width: 100%; font-weight: normal; vertical-align: middle; font-size: 12px; color: #3c3c3c;}\
            .j-confirm-text >div.j-intro-big{font-weight: bold; font-size: 14px;}\
            .j-confirm-btn{width: 100%; overflow: hidden;}\
            .j-confirm-btn.j-confirm-h{border-top: 1px solid #dcdcdc;}\
            .j-confirm-v .j-btn{display: block; width: 100%; height: 38px; line-height: 38px; font-size: 14px; color: #f56423; text-align: center; border-top: 1px solid #dcdcdc;}\
            .j-confirm-h .j-btn{display: block; width: 50%; float: left; height: 38px; line-height: 38px; font-size: 14px; color: #f56423; text-align: center; border-right: 1px solid #dcdcdc;}\
            .j-confirm-h .j-btn:last-child{border-right: 0 none;}\
            ";
        var style = document.createElement("style");
        style.type = "text/css";
        if (style.styleSheet) {
            style.styleSheet.cssText = str;
        } else {
            style.innerHTML = str;
        }
        document.getElementsByTagName("head")[0].appendChild(style);
    })();

    $.extend({
        /**
         * 关闭弹窗
         * @param opt {type,time,callback}
         * @returns {boolean}
         */
        jClose: function (opt) {
            var _time = opt ? (!opt.time ? 1500 : opt.time) : 1500;
            var _type = opt ? (!opt.type ? 1 : opt.type) : 1;
            var _callback = opt ? (!opt.callback ? null : opt.callback) : null;
            var ele = $("#jDisk");
            if (!ele || ele.length == 0) {
                console.error("找不到元素：'jDisk'");
                return false;
            } else {
                clearTimeout(_timer_);
                if (_type == 1) {
                    _timer_ = setTimeout(function () {
                        ele.fadeOut(function () {
                            $(this).remove();
                        });
                    }, _time);
                } else if (_type == 2) {
                    ele.fadeOut(300, function () {
                        $(this).remove();
                        if (_callback) _callback.call(ele[0]);
                    });
                }
            }
        },
        /**
         * 弹出层（不带确定）
         * @param intro  提示信息文字
         * @param w  提示框宽度 默认：100px
         * @param h   提示框高度 默认：30px
         * @param animate  提示动画效果 css名称
         */
        jAlert: function (intro, w, h, animate) {
            var _w = !w ? 150 : w;
            var _h = !h ? 50 : h;
            var _a = !animate ? "j-alert-ani" : animate;
            var _html = "";
            _html += '<div id="jDisk" class="j-alert-box">';
            _html += '<div class="j-alert ' + _a + ' animated" style="width: ' + _w + 'px; height: ' + _h + 'px; line-height:' + _h + 'px; margin: -' + _h / 2 + 'px 0 0  -' + _w / 2 + 'px; ">';
            _html += '<span>' + intro + '</span>';
            _html += '</div>';
            _html += '</div>';
            $(document.body).append(_html);

            //重新计算
            var _newHeight = $(".j-alert span").outerHeight(true);
            if (!h) {
                _h = _newHeight;
                _setBoxLayout("#jDisk .j-alert", _w, _h);
            }
            $.jClose();
        },
        /**
         * 确认框
         * 回调函数支持两种，默认寻找btnAry.callback，其次寻找callbacks
         * @param textObj  提示信息 {title,intro}或者"intro"
         * @param btnAry    按钮组 [{id,text,src,callback,css}]
         * @param btnType   按钮类型  V/H
         * @param callbacks 回掉函数组
         * @param css  样式
         * css格式说明：
         * css:{
         *        width:"",
         *        height:"",
         *        animate:"",
         *       titleCss:{},
          *     tipsBarCss:{},
          *     tipsCss:{},
          *     btnBarCss:[{},{},{}.....{}]
         * }
         */
        jConfirm: function (textObj, btnAry, btnType, callbacks, css) {
            var _w = !css ? 210 : !css.width ? 210 : css.width;
            var _h = !css ? 70 : !css.height ? 70 : css.height;
            var _a = !css ? "j-alert-ani" : !css.animate ? "j-alert-ani" : css.animate;
            var _type = !btnType ? "H" : btnType;
            var intro = (typeof textObj).toString().toLowerCase() == "string" ? textObj : textObj.intro;
            var title = textObj ? textObj.title : "";
            var intro_cls = textObj.title ? "j-intro-normal" : "j-intro-big";
            var _html = "", btnStr = "", titleStr = "";

            //判断按钮形式
            var btn_cls = _type.toString().toLowerCase() == "v" ? "j-confirm-v" : "j-confirm-h";
            btnStr += '<div class="j-confirm-btn ' + btn_cls + '">';
            for (var i = 0; i < btnAry.length; i++) {
                var src = !btnAry[i].src ? "javascript:;" : btnAry[i].src;
                var bnt_id = !btnAry[i].id ? "" : btnAry[i].id;
                btnStr += '<a id="' + bnt_id + '" class="j-btn" href="' + src + '">' + btnAry[i].text + '</a>';
            }
            btnStr += '</div>';

            //判断是否含有标题
            var title_cls = "";
            if (textObj.title) {
                title_cls = "j-confirm-hasTitle";
                titleStr += '<label class="j-confirm-title">' + title + '</label>';
            } else {
                title_cls = "j-confirm-noTitle";
                titleStr = "";
            }

            _html += '<div id="jDisk" class="j-confirm-box">';
            _html += '<div class="j-confirm ' + _a + ' animated" style="height: ' + _h + 'px; width: ' + _w + 'px; margin: -' + _h / 2 + 'px 0 0 -' + _w / 2 + 'px;">';

            _html += titleStr;
            _html += '<div class="j-confirm-text ' + title_cls + '">';
            _html += '<div class="' + intro_cls + '">' + intro + '</div>';
            _html += '</div>';
            _html += btnStr;
            _html += '</div>';
            _html += '</div>';
            $(document.body).append(_html);

            //添加样式
            var textBar = $(".j-confirm-text"), btnBar = $(".j-confirm-btn"), titleBar = $(".j-confirm-title"), btnBox = $(".j-btn");
            //按钮加样式-首先读取按钮组中设置的样式，
            //其次读取css中btnCss数组
            btnBox.each(function(i){
                if(btnAry[i].css){
                    $(this).css(btnAry[i].css);
                }else{
                    if(css) {
                        if (css.btnCss) $(this).css(css.btnCss[i]);
                    }
                }
            });
            if (css) {
                if (css.titleCss) titleBar.css(css.titleCss);
                if (css.tipsBarCss) textBar.css(css.tipsBarCss);
                if (css.tipsCss) textBar.find("div").css(css.tipsCss);
            }

            //重新计算
            var padHeight = (!titleBar || titleBar.length == 0) ? 30 : 15;
            var _tipsHeight = textBar.find("span").outerHeight(true);
            var _textHeight = css ? (css.height ? parseInt(css.height) : _tipsHeight) : _tipsHeight;
            var __h = css ? (css.height ? parseInt(css.height) + padHeight : textBar.outerHeight(true)) : textBar.outerHeight(true);
            var _newHeight = btnBar.outerHeight(true);
            textBar.height(_textHeight);
            _setBoxLayout("#jDisk .j-confirm", _w, __h + _newHeight + ((!titleBar || titleBar.length == 0) ? 0 : titleBar.outerHeight(true)));

            //绑定函数
            btnBar.find("a.j-btn").each(function (i) {
                if (btnAry[i].callback) {
                    $(this).click(function () {
                        $.jClose({
                            type: 2,
                            time: 300,
                            callback: btnAry[i].callback
                        });
                    });
                } else if (callbacks && Object.prototype.toString.call(callbacks) == '[object Array]') {
                    $(this).click(function () {
                        $.jClose({
                            type: 2,
                            time: 300,
                            callback: callbacks[i]
                        });
                    });
                } else {
                    $(this).click(function () {
                        $.jClose({
                            type: 2,
                            time: 300,
                            callback: function () {
                                console.log("没有回调函数")
                            }
                        });
                    });
                }
            });
        }
    });
})(jQuery);
