//倒计时引用
(function cutDown(ele) {
    $(ele).each(function () {
        common.dayTimeDown(this);
    });
}(".ft-cutdown"));

//窗口改变
function resizeInit(callback) {
    $(window).resize(function () {
        var width = $(this).width();
        var height = $(this).height();
        if (callback) callback.call(this, width, height);
    }).trigger("resize");
}

//页面滚动
function pageScroll(opt) {
    var deafuilts = {
        element: window,
        top: "#goTop",
        hasTop: true,
        scrollFun: null,
        ajaxFun: null,
        topFun: null
    };
    var opts = $.extend({}, deafuilts, opt);
    var $top = $(opts.top), $ele = $(opts.element);
    var _isTop = false;
    var isWindow = opts.element == window;
    var beforeScrollTop = $ele.scrollTop();
    $ele.scroll(function () {
        var pageHeight = isWindow ? $(document).height() : $(this).find(".ft-overflow-box").eq(0).height();
        var windowHeight = $(this).height();
        var afterScrollTop = $(this).scrollTop();
        var delta = afterScrollTop - beforeScrollTop;
        var _dir_ = (delta > 0 ? "down" : "up");
        if (opts.hasTop) {
            afterScrollTop > 100 ? $top.fadeIn() : $top.fadeOut();
        }

        if (opts.scrollFun) opts.scrollFun.call(this, afterScrollTop, _dir_, _isTop);

        //if (afterScrollTop == 0) {
        //    console.log(0);
        //}

        if ((afterScrollTop + windowHeight) >= pageHeight) {
            if (opts.ajaxFun) opts.ajaxFun.call(this, afterScrollTop, _dir_, _isTop);
        }

        beforeScrollTop = afterScrollTop;
    }).data("scroll", true);

    $top.click(function () {
        _isTop = true;
        var scrollEle = isWindow ? "html,body" : opts.element;
        scrollToEle(scrollEle, 0, function () {
            _isTop = false;
            if (opts.topFun) opts.topFun.call($ele[0], _isTop);
        });
    });

    opts.scrollToElement = function (ele, top, callback) {
        scrollToEle(ele, top, callback);
    };


    return opts;
}

/**
 * 滚动距离
 * @param ele   需要滚动元素 默认：“html，body”
 * @param top   滚动距离
 * @param callback  回调函数
 */
function scrollToEle(ele, top, callback) {
    if ((typeof ele).toString().toLocaleLowerCase() !== "string") {
        callback = arguments[1];
        top = arguments[0];
        ele = "html,body";
    }
    $(ele).animate({"scrollTop": top + "px"}, 300, function () {
        if (callback) callback.call(this);
    });
}

//产品图片懒加载
function proImgLazyLoad(ele, cont, sucFuns, eroFuns) {
    $(ele).find("img").lazyload({
        placeholder: "../img/loading.gif",
        effect: "fadeIn",
        threshold: 50,
        container: cont,
        load: function () {
            $(this).addClass("load-success").removeAttr("data-original");
            $(this).parents(ele).find(".pro-img-loading").hide();
            if (sucFuns) sucFuns.call(this, $(this).parents(ele));
        },
        error: function () {
            $(this).addClass("load-error");
            $(this).parents(ele).find(".pro-img-loading").hide();
            if (eroFuns) eroFuns.call(this, $(this).parents(ele));
        }
    });
}

//左侧菜单
function popLeftMenu(option) {
    var defaults = {
        clickEle: "",
        diskEle: "",
        animateEle: "",
        isSwiper: false,
        swiperID: "",
        openCallback: "",
        closeCallback: ""
    };
    var opt = $.extend({}, defaults, option);
    var _timer_ = 0,
        mySwiper,
        $clickEle = $(opt.clickEle),
        $diskEle = $(opt.diskEle),
        $animateEle = $(opt.animateEle);
    $clickEle.click(function () {
        if ($animateEle.hasClass("active")) {
            $diskEle.click();
            return false;
        }
        var that = this;
        clearTimeout(_timer_);
        if (!common.isBodyHide) {
            $("html,body").addClass("ft-overflow-hide");
        }
        $diskEle.fadeIn(300);
        _timer_ = setTimeout(function () {
            $animateEle.addClass("active");
            if (opt.openCallback) opt.openCallback.call(that, opt);
        }, 200);
        if (opt.isSwiper) {
            mySwiper = common.newSwiper("#menuBox", 3);
        }
    });

    $diskEle.click(function (e) {
        var that = this;
        var _e = e || window.event;
        var _tag = $(_e.target);
        if (_tag.hasClass("ft-pop-disk")) {
            if (!common.isBodyHide) {
                $("html,body").removeClass("ft-overflow-hide");
            }
            $animateEle.removeClass("active");
            if (opt.closeCallback) opt.closeCallback.call(that, opt);
            setTimeout(function () {
                $(that).fadeOut();
            }, 300);
        }
    });
}

//购物车相关操作
function shopCarHandle(option) {
    var self = this;
    var defaults = {
        shopItem: ".shop-item",
        quantity: ".item-quantity",
        selectEle: ".shop-img-box",
        editEle: ".edit-btn",
        inputEle: ".num-input input",
        carBtn: ".ft-cart-btn",
        deleteFun: ""
    };
    var opt = self.opt = $.extend({}, defaults, option);
    self.init = function () {

        //绑定选择
        $(opt.selectEle).click(function () {
            $(this).find(".ft-radio").toggleClass("active");
            self.statistics();
        });

        //绑定编辑
        $(document).on("click", opt.editEle, function () {
            var that = $(this).parents(opt.shopItem);
            var _val = that.find(opt.quantity).text();
            var numStr = "\
                    <div class='shop-num-bar'>\
                        <a class='num-cut' href='javascript:;'><i class='ft-sprite'></i></a>\
                        <label class='num-input' data-max='999' data-min='1'>\
                            <input type='number' value='" + _val + "'>\
                        </label>\
                         <a class='num-add' href='javascript:;'><i class='ft-sprite'></i></a>\
                    </div>\
                   ";
            $.jConfirm({
                title: "Quantity",
                intro: numStr
            }, [
                {
                    text: "Cancel",
                    css: {
                        "color": "#666666",
                        "borderRight": "0 none"
                    }
                },
                {
                    text: "Done",
                    css: {
                        "color": "#ffffff",
                        "backgroundColor": "#f56423"
                    },
                    callback: function () {
                        var _num = $(this).find(opt.inputEle).val();
                        that.find(opt.quantity).text(_num);
                        that.find(".ft-radio").addClass("active");
                        self.statistics();
                    }
                }
            ], "H", "", {
                tipsBarCss: {"paddingBottom": "5px"}
            });
        });

        //输入数量-限制输入
        $(document).on("change keyup", opt.inputEle, function () {
            var tag = $(this).parent();
            var _val = $(this).val();
            if (_val >= Number(tag.data("max"))) {
                $(this).val(Number(tag.data("max")));
            } else if (_val <= Number(tag.data("min"))) {
                $(this).val(Number(tag.data("min")));
            }
        });

        //绑定减数量
        $(document).on("click", "a.num-cut", function () {
            var tag = $(this).nextAll(".num-input");
            common.numberCalculate(tag, Number(tag.data("max")), Number(tag.data("min")), "cut");
        });

        //绑定加数量
        $(document).on("click", "a.num-add", function () {
            var tag = $(this).prevAll(".num-input");
            common.numberCalculate(tag, Number(tag.data("max")), Number(tag.data("min")), "add");
        });

        //绑定删除
        $(document).on("click", ".delete-btn", function () {
            var that = $(this).parents(opt.shopItem);
            $.jConfirm({title: "Are you sure?", intro: "Do you want to remove this from your cart?"}, [{
                text: "No"
            }, {
                text: "Yes",
                callback: function () {
                    that.animate({"left": "-100%"}, 300, function () {
                        $(this).remove();
                        self.statistics();
                        if (opt.deleteFun) opt.deleteFun.call(that[0], opt);
                    })
                }
            }]);
        });

        self.statistics();
    };

    self.statistics = function () {
        var shopCount = 0;
        $(opt.shopItem).find(".ft-radio").each(function () {
            var item = $(this).parents(opt.shopItem);
            if ($(this).hasClass("active")) {
                if (!$(this).find("input").prop("checked")) {
                    $(this).find("input").prop("checked", true);
                }
                shopCount += Number(item.find(opt.quantity).text());
            } else {
                if ($(this).find("input").prop("checked")) {
                    $(this).find("input").prop("checked", false);
                }
            }
        });
        $(opt.carBtn).find("i").text(shopCount);
    };

    self.init();
}

//筛选操作
function filtrateHandle() {
    var _filtrateTag;
    $(".filtrate-list1 a").click(function () {
        _filtrateTag = this;
        if ($(this).find("span")) {
            $(".filtrate-list2").addClass("active");
            setTimeout(function () {
                $(".filtrate-title").addClass("active");
            }, 500);
            $(".filtrate-clear,.filtrate-apply").addClass("active");
        }
    });

    $(".filtrate-list2 a").click(function () {
        $(this).toggleClass("active");
    });

    //返回
    $(".filtrate-title a").click(function () {
        $(".filtrate-title").removeClass("active");
        $(".filtrate-list2").removeClass("active");
        $(".filtrate-clear,.filtrate-apply").removeClass("active");
    });

    //清除
    $(document).on("click", ".filtrate-clear", function () {
        if ($(this).hasClass("active")) {
            $(".filtrate-list2 a").removeClass("active");
        } else {
            $(".filtrate-list1 a span").text("");
        }
    });

    //选中确定
    $(document).on("click", ".filtrate-apply", function () {
        if ($(this).hasClass("active")) {
            var _text = "";
            $(".filtrate-list2 a.active").each(function () {
                _text += $(this).text() + ", ";
            });
            $(_filtrateTag).find("span").text(_text.substr(0, _text.length - 2));
            $(".filtrate-title a").click();
        } else {
            //筛选条件成功
            console.log("按照筛选选项查询");
        }
    });
}

//顶部横向导航
function slideHorizontalNav(ele, option) {
    var defaults = {
        showLength: 5,
        hasPlaceholder: false,
        leftPlaceholder: ".nav-left-placeholder",
        rightPlaceholder: ".nav-right-placeholder",
        placeholderFun: null,
        initFun: null,
        clickFun: null
    };
    var self = this;
    var opt = self.opt = $.extend({}, defaults, option);
    var navSwiper = opt.swiper = common.newSwiper(ele, 2);
    var navBox = $(ele),
        navEle = opt.element = navBox.find(".swiper-slide"),
        navActiveEle = navBox.find(".swiper-slide.active"),
        leftPlaceholder = opt.hasPlaceholder ? $(opt.leftPlaceholder) : "",
        rightPlaceholder = opt.hasPlaceholder ? $(opt.rightPlaceholder) : "";
    opt.length = navEle.length;
    self._init = function () {
        opt.navID = [];
        navEle.each(function () {
            opt.navID.push($(this).attr("data-id"));
        });
        if (opt.hasPlaceholder) {
            navEle.length >= opt.showLength ? rightPlaceholder.show() : rightPlaceholder.hide();
            navActiveEle.index() >= (opt.showLength - 1) ? leftPlaceholder.show() : leftPlaceholder.hide();
        }
        var _width = $(window).width();
        var _index = navActiveEle.index();
        var _left = navActiveEle.offset().left + navActiveEle.outerWidth(true);
        if (_left > _width) {
            navSwiper.slideTo((_index - 1), 100, false);
        }
        navEle.on("click", self._click);
        if (opt.initFun) opt.initFun.call(navBox[0], _index, opt);
    };

    self._click = function () {
        if ($(this).hasClass("active")) return false;
        $(this).addClass("active").siblings().removeClass("active");
        var _curBar = navBox.find(".swiper-slide.active");
        var _index = _curBar.index();
        var _width = _curBar.offset().left + _curBar[0].offsetWidth + 60;
        if (_width > $(window).width()) {
            navSwiper.slideNext();
        } else if ((_width - 60) < _curBar[0].offsetWidth * 2) {
            navSwiper.slidePrev();
        }
        if (opt.hasPlaceholder) self._placeholder();
        if (opt.clickFun) opt.clickFun.call(this, _index, opt);
    };

    self._placeholder = function () {
        var index = navBox.find(".swiper-slide.active").index();
        if (navEle.length >= opt.showLength) {
            index >= (opt.showLength - 3) ? leftPlaceholder.show() : leftPlaceholder.hide();
            index <= (navEle.length - (opt.showLength - 1)) ? rightPlaceholder.show() : rightPlaceholder.hide();
        }
        if (opt.placeholderFun) opt.placeholderFun.call(this, opt);
    };
    self._init();


    return opt;
}

//显示大图
function showBigImg(option) {
    var self = this;
    var defaults = {
        scaleMode: false,
        swiperEle: null,
        clickEle: "",
        animateEle: ".product-big",
        closeEle: ".ft-close-btn",
        imgIndex: null,
        imgNumber: null,
        numEle: "#bannerNum",
        showNum: "#productLength",
        container: "#productBig",
        loadingEle: ".swiper-loading",
        initFun: null
    };
    var opt = self.opt = $.extend({}, defaults, option);
    var imgSwiper, str = "";
    var clickEle = $(opt.clickEle),
        closeEle = $(opt.closeEle),
        parentsEle = clickEle.parent(),
        activeEle = opt.swiperEle ? clickEle.find(".swiper-slide-active") : clickEle,
        showIndex = $(opt.showNum).find("i").eq(0),
        showAllNum = $(opt.showNum).find("i").eq(1);
    var num = !!opt.imgNumber ? opt.imgNumber : (parseInt($(opt.numEle).text()) || parseInt(parentsEle.find("li").length));
    var index = !!opt.imgIndex ? opt.imgIndex : (opt.swiperEle ? activeEle.data("swiper-slide-index") : clickEle.index());
    var isLoaded = activeEle.find("img").hasClass("swiper-lazy-loaded") || activeEle.find("img").hasClass("load-success");
    showIndex.text(index + 1);
    showAllNum.text(num);

    self.showFun = function () {
        if (!$(opt.container).find(".swiper-wrapper").is(":empty")) return false;
        $(opt.loadingEle).hide();
        for (var i = 0; i < num; i++) {
            var $img = opt.swiperEle ? clickEle.find(".swiper-slide:not('.swiper-slide-duplicate')").eq(i).find("img")
                : (clickEle.data("index") ? clickEle.parents(".img-details").find("img:not([class])").eq(i) : parentsEle.find("li").eq(i).find("img"));
            if (isLoaded) {
                str += "<div class='swiper-slide'>";
                str += "    <div class='box-cell'>" + $img[0].outerHTML + "</div>";
                str += "</div>";
            } else {
                if (i == index) {
                    $(opt.loadingEle).show();
                    //此处加载出图片利用swiper  lazy功能
                    str += "<div class='swiper-slide'>";
                    str += "    <div class='box-cell'>" + $img[0].outerHTML + "</div>";
                    str += "</div>";

                    //此处用于没有加载图片（非swiper）
                    self.loadImg($img, function () {
                        $(opt.loadingEle).hide();
                    });
                } else {
                    str += "<div class='swiper-slide'>";
                    str += "    <div class='box-cell'>" + $img[0].outerHTML + "</div>";
                    str += "</div>";
                }
            }
        }
        $(opt.container).find(".swiper-wrapper").append(str);
        $(".box-cell img").each(function () {
            var $img = $(this);
            if ($img.data("original")) {
                $img.addClass("swiper-lazy").attr("data-src", $img.data("original")).removeAttr("data-original");
            }
            if ($img.hasClass("swiper-lazy-loading")) {
                $img.removeClass("swiper-lazy-loading");
            }
            $(this).removeAttr("style");
            common.setImageLayout(this, $(window).width(), $(window).height() - 41);
        });

        imgSwiper = new Swiper(opt.container, {
            autoplay: 0,
            loop: false,
            lazyLoading: true,
            lazyLoadingInPrevNext: true,
            initialSlide: index,
            onLazyImageReady: function () {
                $(opt.container).find("img.swiper-lazy-loaded").each(function () {
                    $(this).removeAttr("style");
                    common.setImageLayout(this, $(window).width(), $(window).height() - 41);
                })
            },
            onSlideNextStart: function (swiper) {
                swiper.update(true);
                showIndex.text(swiper.activeIndex + 1);
            },
            onSlidePrevStart: function (swiper) {
                swiper.update(true);
                showIndex.text(swiper.activeIndex + 1);
            }
        });

        $(opt.container).find(".swiper-wrapper").show();
        $(opt.animateEle).addClass("active");
    };

    self.closeFun = function () {
        str = "";
        $(opt.animateEle).removeClass("active");
        $(opt.container).find(".swiper-wrapper").fadeOut(300, function () {
            if (imgSwiper) {
                imgSwiper.update(true);
                imgSwiper.destroy(false, true);
            }
            $(this).empty();
            closeEle.off("click");
            $(opt.container).off("click");
        });
    };

    self.loadImg = function (img, callback, state) {
        var image = new Image();
        var imgStr = "";
        var _state_ = state || false;
        var src = img.data("src") || img.data("original") || img.attr("src");
        if (!img.complete || !_state_) {
            if (src) {
                image.src = src;
                image.onload = function () {
                    console.log("image load success!");
                    var realWidth = image.width;
                    var realHeight = image.height;
                    image.width = img[0].width;
                    image.height = img[0].height;
                    imgStr = "<img class='swiper-lazy swiper-lazy-loaded load-success' src='" + image.src + "'>";
                    if (callback) callback.call(image, realWidth, realHeight);
                };
                image.onerror = function () {
                    console.log("image load error!");
                };
            }
        }
    };

    $(opt.container).on("click", function () {
        self.closeFun();
    });

    closeEle.on("click", function () {
        self.closeFun();
    });
    self.showFun();
}

//单选按钮组
function selectRadio(ele) {
    var $ele = ele || ".ft-radio";
    $($ele).on("click", function (e) {
        e.stopPropagation();
        if ($(this).hasClass("ft-radio")) {
            var name = $(this).find("input[type='radio']").attr("name");
            $("input[name='" + name + "']").parents($ele).removeClass("active");
            $(this).addClass("active");
        } else {
            var $input = $(this).find("input[type='radio']");
            var $name = $input.attr("name");
            $("input[name='" + $name + "']").prop("checked", false).parents(".ft-radio").removeClass("active");
            $input.prop("checked", true).parents(".ft-radio").addClass("active");
        }
    })
}

//选择框
function selectCheckbox() {
    $(document).on("click", ".edit-box.active,.buy-intro-money", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).find(".ft-radio").click();
    });

    $(document).on("click", ".ft-radio input", function (e) {
        e.stopPropagation();
    });
    $(document).on("click", ".ft-radio", function (e) {
        e.stopPropagation();
        $(this).toggleClass("active");
        var click_type = $(this).find("input").data("select") || "normal";
        var input_type = $(this).find("input").attr("type");
        var input_name = $(this).find("input").attr("name");
        var allNumber = $(".ft-radio input.normal").length;
        var selectedNumber = $(".ft-radio.active input.normal").length;
        if (input_type == "checkbox") {
            if (click_type == "all") {
                selectAll("input[name='" + input_name + "']", $(this).hasClass("active"));
            } else {
                if (selectedNumber == allNumber) {
                    $("#allCheckbox").addClass("active");
                } else {
                    $("#allCheckbox").removeClass("active");
                }
            }
        }
    });

    function selectAll(ele, type) {
        if (type) {
            $(ele).parents(".ft-radio").addClass("active");
        } else {
            $(ele).parents(".ft-radio").removeClass("active");
        }
    }
}

//手风琴
function slideDownNav(ele, type, time) {
    var _ele = ele || ".ft-slide-bar dt a";
    var _type = type || false;
    var _time = time || "normal";
    $(document).on("click", _ele, function () {
        var $parent = $(this).parent();
        var $parents = $(this).parents(".ft-slide-bar");
        if (_type) {
            if (!$(this).hasClass("active")) {
                $parents.find("dt").removeClass("current");
                $parents.find("dt a").removeClass("active");
                $parents.find("dd").slideUp(_time);
            }
        }
        $(this).toggleClass("active");
        $parent.toggleClass("current");
        $parent.next().stop(true, true).slideToggle(_time);
    });

    $(document).on("click", ".ft-slide-bar dd a", function () {
        $(this).toggleClass("active").siblings().removeClass("active");
    });
}
