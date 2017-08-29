var common = window.publicFuns = {};
//屏蔽部分默认事件
(function () {
    var touchtime = new Date().getTime();
    document.addEventListener("click", function (e) {
        if (new Date().getTime() - touchtime < 800) {
            common.preventFun(e)
        } else {
            touchtime = new Date().getTime();
        }
    }, false);
    document.addEventListener("touchmove", function (e) {
        if (e.touches.length >= 2) {
            common.preventFun(e);
        }
    }, false);
}());
common.preventFun = function (e) {
    e.preventDefault();
};
//判断body是否滚动
common.isBodyHide = false;
(function (ele) {
    if ($(document.body).hasClass("isHide")) {
        common.isBodyHide = true;
        if (!$(ele).hasClass("ft-overflow-hide")) {
            $(ele).addClass("ft-overflow-hide");
        }
    } else {
        common.isBodyHide = false;
    }
}("html,body"));
/**
 * 显示滑动动画
 * @param dom   触发元素
 * @param tag   显示元素
 */
common.animateTransform = {
    show: function (dom, tag, callback) {
        $(document).on("click", dom, function () {
            $(tag).addClass("active");
            if (callback) callback.call(tag);
        });
    },
    hide: function (dom, tag, callback) {
        $(document).on("click", dom, function () {
            $(tag).removeClass("active");
            if (callback) callback.call(tag);
        });
    }
};
/**
 * 调用Swiper
 * @param ele   元素
 * @param type  类型，1：轮播，2：横向滑动，3：竖直滑动
 * @param option 自定义参数
 */
common.newSwiper = function (ele, type, option) {
    var opt = "";
    if (type == 1) {
        opt = {
            autoplay: 4000,
            pagination: ".swiper-pagination",
            loop: true,
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else if (type == 2) {
        opt = {
            freeMode: true,
            slidesPerView: "auto",
            lazyLoading: true,
            watchSlidesVisibility: true
        }
    } else if (type == 3) {
        opt = {
            direction: 'vertical',
            freeMode: true,
            slidesPerView: "auto",
            lazyLoading: true,
            watchSlidesVisibility: true
        }
    } else if (type == 4) {
        opt = {
            pagination: ".swiper-pagination",
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else if (type == 5) {
        opt = {
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    }
    var newOpt = $.extend({}, opt, option);
    return new Swiper(ele, newOpt);
};
/**
 * 数字加减法
 * @param tag
 * @param maxNum
 * @param minNum
 * @param type   add加法   cut减法
 * @param callback
 */
common.numberCalculate = function (tag, maxNum, minNum, type, callback) {
    var _num = parseInt(tag.find("input").val());
    var _max = maxNum;
    if (type == "add") {
        if (tag.find("input").val() == "") {
            tag.find("input").val(minNum);
        } else {
            _num++;
            if (_num == (_max + 1)) {
                tag.find("input").val(_max);
            } else {
                tag.find("input").val(_num);
                if (callback)  callback.call(tag[0], _num, _max);
            }
        }
    } else if (type == "cut") {
        if (tag.find("input").val() == "") {
            tag.find("input").val(minNum);
        } else {
            _num--;
            if (_num == 0) {
                tag.find("input").val(minNum);
            } else {
                tag.find("input").val(_num);
                if (callback)  callback.call(tag[0], _num);
            }
        }
    }
};
/**
 * 补零
 * @param num 补零的数字
 * @param n 补零的位数
 * @returns {num}   补零之后的字符
 */
common.padZero = function (num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
};
/**
 * 倒计时(包含天)
 * @param tags   目标
 * @param time
 * @param Fun
 */
common.dayTimeDown = function (tags, time, Fun) {
    var boxEle, dayEle, hourEle, minEle, secEle;
    if ((typeof tags) == "string" || $(tags).data("time")) {
        boxEle = $(tags);
        dayEle = ".ft-time-day";
        hourEle = ".ft-time-hour";
        minEle = ".ft-time-minute";
        secEle = ".ft-time-second";
    } else {
        boxEle = $(tags.boxEle);
        dayEle = tags.dayEle;
        hourEle = tags.hourEle;
        minEle = tags.minEle;
        secEle = tags.secEle;
    }

    var dayFormat = (dayEle ? (boxEle.find(dayEle).data("format") ? boxEle.find(dayEle).data("format") : "") : "");
    var hourFormat = (hourEle ? (boxEle.find(hourEle).data("format") ? boxEle.find(hourEle).data("format") : "") : "");
    var minFormat = (minEle ? (boxEle.find(minEle).data("format") ? boxEle.find(minEle).data("format") : "") : "");
    var secFormat = (secEle ? (boxEle.find(secEle).data("format") ? boxEle.find(secEle).data("format") : "") : "");

    if (dayEle) boxEle.find(dayEle).html("00" + dayFormat);
    if (hourEle) boxEle.find(hourEle).html("00" + hourFormat);
    if (minEle) boxEle.find(minEle).html("00" + minFormat);
    if (secEle) boxEle.find(secEle).html("00" + secFormat);
    var countTime = 0;
    if (time) {
        if ((typeof time) == "number") {
            countTime = time / 1000;
        } else {
            countTime = parseInt((new Date("" + time + "") - new Date()) / 1000);
        }
    } else {
        countTime = parseInt((new Date("" + boxEle.data("time") + "") - new Date()) / 1000);
    }
    var int_day = Math.floor(countTime / 60 / 60 / 24);
    var int_hour = Math.floor(countTime / (60 * 60));
    var int_minute = Math.floor(countTime / 60) - (int_hour * 60);
    var int_second = Math.floor(countTime) - (int_hour * 60 * 60) - (int_minute * 60);
    var _time;
    _time = setInterval(function () {
        countTime--;
        if (countTime > 0) {
            int_day = Math.floor(countTime / 60 / 60 / 24);
            int_hour = Math.floor(countTime / (60 * 60));
            int_minute = Math.floor(countTime / 60) - (int_hour * 60);
            int_second = Math.floor(countTime) - (int_hour * 60 * 60) - (int_minute * 60);
        } else {
            int_day = 0;
            int_hour = 0;
            int_minute = 0;
            int_second = 0;
            if (Fun) Fun.call(boxEle[0]);
            clearInterval(_time);
        }
        if (dayEle) boxEle.find(dayEle).html(common.padZero(int_day, 2) + dayFormat);
        if (hourEle) boxEle.find(hourEle).html(common.padZero(int_hour % 24, 2) + hourFormat);
        if (minEle) boxEle.find(minEle).html(common.padZero(int_minute, 2) + minFormat);
        if (secEle) boxEle.find(secEle).html(common.padZero(int_second, 2) + secFormat);
    }, 1000);
    return _time;
};
/**
 * 计算图片大小
 * @param w 获取图片宽度
 * @param h 获取图片的高度
 * @param referW    参考宽度
 * @param referH    参考高度
 * @returns {{w,h}} 返回计算后大小
 */
common.countImgSize = function (w, h, referW, referH) {
    var _w = referW || $(window).width();
    var _h = referH || $(window).height();
    var __w, __h;
    if (w >= h) {
        __w = _w;
        __h = _w / (w / h);
        if (__h > _h) {
            __h = _h;
            __w = __h * (w / h);
        }
    } else if (w < h) {
        __h = _h;
        __w = _h * (w / h);
        if (__w > _w) {
            __w = _w;
            __h = _w / (w / h);
        }
    }
    return {w: __w, h: __h};
};
/**
 * 清除文字
 * @param tag   清楚元素
 */
common.clearText = function (tag) {
    if (tag[0].nodeName.toLowerCase() == "input" || tag[0].nodeName.toLowerCase() == "textarea") {
        $(tag).val("");
    } else {
        $(tag).html("");
    }
};
/**
 * 设置图片元素的大小
 * @param imgEle
 * @param referW
 * @param referH
 * @param imgW
 * @param imgH
 * @param type
 */
common.setImageLayout = function (imgEle, referW, referH, imgW, imgH, type) {
    var $img = $(imgEle);
    var ceil_w = Math.ceil(referW);
    var ceil_h = Math.ceil(referH);
    var w = imgW || $img.width();
    var h = imgH || $img.height();
    var width, height, top, left;
    var _type = type || "all";
    if (_type == "width") {
        width = ceil_w;
        height = Math.ceil(ceil_w / w * h);
        top = -Math.floor((height - ceil_h) / 2);
        left = 0;
    } else if (_type == "height") {
        height = ceil_h;
        width = Math.ceil(ceil_h * w / h);
        top = 0;
        left = -Math.floor((width - ceil_w) / 2);
    } else if (_type == "all") {
        var size = common.countImgSize(w, h, ceil_w, ceil_h);
        width = size.w;
        height = size.h;
        top = -Math.floor((height - ceil_h) / 2);
        left = -Math.floor((width - ceil_w) / 2);
    }
    if (imgEle) {
        $img.css({
            "width": width + "px",
            "height": height + "px",
            "margin-top": top + "px",
            "margin-left": left + "px"
        });
    } else {
        return {
            "width": width + "px",
            "height": height + "px",
            "margin-top": top + "px",
            "margin-left": left + "px"
        }
    }
};

common.timeCountDown = function (timeEle, time, endFun, countFun) {
    var _set_timer_ = 0;
    var minutes, seconds;
    var $this = $(timeEle);
    clearInterval(_set_timer_);
    var _times_ = !time ? 120 : time;
    _set_timer_ = setInterval(function () {
        if (countFun) countFun.call($this[0], _times_);
        _times_--;
        if (_times_ > 0) {
            minutes = Math.floor(_times_ / 60);
            seconds = _times_ - minutes * 60;
        } else {
            minutes = 0;
            seconds = 0;
            if (endFun) endFun.call($this[0]);
            clearInterval(_set_timer_);
        }
        if ($this.hasClass("split-time")) {
            var $minutes = $this.find(".minutes-bar");
            var $seconds = $this.find(".seconds-bar");
            if (seconds >= 10) {
                $seconds.find("i:eq(0)").text(Math.floor(seconds / 10));
            } else {
                $seconds.find("i:eq(0)").text(0);
            }
            if (minutes >= 10) {
                $minutes.find("i:eq(0)").text(Math.floor(minutes / 10));
            } else {
                $minutes.find("i:eq(0)").text(0);
            }

            $minutes.find("i:eq(1)").text(minutes % 10);
            $seconds.find("i:eq(1)").text(seconds % 10);
        }
    }, 1000);
};


