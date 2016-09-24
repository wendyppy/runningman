Bmob.initialize("eebad35c848f68f15226ec4f11a8e5bd", "0b65a92b98ad91e6d3051ad231467815");
var EventUtil = {
    addHandler: function(ele, type, handler) {
        if (ele.addEventListener) {
            ele.addEventListener(type, handler, false);
        } else if (ele.attachEvent) {
            ele.attachEvent("on" + type, handler);
        } else {
            ele["on" + type] = handler;
        }
    },
    //返回对event对象的引用
    getEvent: function(event) {
        return event ? event : window.event;
    },
    //返回事件的目标
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    //取消事件的默认行为
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    removeHandler: function(ele, type, handler) {
        if (ele.removeEventListener) {
            ele.removeEventListener(type, handler, false);
        } else if (ele.detachEvent) {
            ele.detachEvent("on" + type, handler);
        } else {
            ele["on" + type] = null;
        }
    },
    //阻止事件冒泡
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};
var RegDom = {
    email: document.getElementById("u-reg-email"),
    username: document.getElementById("u-reg-uname"),
    password: document.getElementById("u-reg-pwd"),
    signBtn: document.getElementById("signBtn"),
    reg_emailLabel: document.getElementById("reg_emailLabel"),
    reg_unameLabel: document.getElementById("reg_unameLabel"),
    reg_pwdLabel: document.getElementById("reg_pwdLabel")
};
var sliderDom = {
    drag: $("#drag"),
    handler: $("#drag").find('.handler'),
    drag_bg: $("#drag").find('.drag_bg'),
    text: $("#drag").find('.drag_text'),
    handlerTop: undefined,
    handlerBtm: undefined,
    isMove: false,
    isSuccess: false
};
var sliderModule = {
    init: function() {
        this.bind();
    },
    sliderInitPos: function() {
        sliderDom.isSuccess = false;
        sliderDom.handler.removeClass('handler_ok_bg').addClass('handler_bg');
        sliderDom.handler.css('left', '0');
        sliderDom.drag_bg.css('width', '0');
    },
    bind: function() {
        var xPos;
        var maxWidth = sliderDom.drag.width() - sliderDom.handler.width();
        var self = this;
        // 鼠标点击时x轴位置
        sliderDom.handler.mousedown(function(event) {
            sliderDom.isMove = true;
            xPos = event.pageX - parseInt(sliderDom.handler.css('left'), 10);
        });
        sliderDom.drag.mousemove(function(event) {
            var _x = event.pageX - xPos;
            if (sliderDom.isMove) {
                if (_x > 0 && _x <= maxWidth) {
                    sliderDom.handler.css('left', _x);
                    sliderDom.drag_bg.css('width', _x);
                } else if (_x > maxWidth) {
                    self.dragOk();
                }
            }
        }).mouseup(function(event) {
            sliderDom.isMove = false;
            var _x = event.pageX - xPos;
            if (_x < maxWidth) {
                self.sliderInitPos();
            }
        }).mouseleave(function(event) {
            self.sliderInitPos();
        });
    },
    dragOk: function() {
        sliderDom.handler.removeClass('handler_bg').addClass('handler_ok_bg');
        sliderDom.text.text('验证通过');
        sliderDom.drag.css('color', '#fff');
        sliderDom.handler.unbind('mousedown');
        sliderDom.drag.unbind('mousemove');
        sliderDom.drag.unbind('mouseup');
        sliderDom.drag.unbind('mouseleave');
        sliderDom.isSuccess = true;
        sliderDom.drag.removeClass('dragLight');
    }
};
var SigninModule = {
    init: function() {
        this.bind();
        this.serverValidate();
        sliderModule.init();
    },
    bind: function() {
        var self = this;
        EventUtil.addHandler(RegDom.signBtn, "click", function() {
            $(".form-group").removeClass('has-error');
            RegDom.reg_emailLabel.style.visibility = "hidden";
            RegDom.reg_unameLabel.style.visibility = "hidden";
            RegDom.reg_pwdLabel.style.visibility = "hidden";
            self.validateInput();
            if (!self.validateEmail) {
                sliderModule.sliderInitPos();
                sliderModule.init();
                sliderDom.drag.removeClass('dragLight');
                $(".u-reg-emailBox").addClass('has-error');
                RegDom.reg_emailLabel.style.visibility = "visible";
            }
            if (!self.validateUsername) {
                sliderModule.sliderInitPos();
                sliderModule.init();
                sliderDom.drag.removeClass('dragLight');
                $(".u-reg-unameBox").addClass('has-error');
                RegDom.reg_unameLabel.style.visibility = "visible";
            }
            if (!self.validatePassword) {
                sliderModule.sliderInitPos();
                sliderModule.init();
                sliderDom.drag.removeClass('dragLight');
                $(".u-reg-pwdBox").addClass('has-error');
                RegDom.reg_pwdLabel.style.visibility = "visible";
            }
            if ((!sliderDom.isSuccess) && self.validateUsername && self.validatePassword && self.validateEmail) {
                sliderDom.drag.addClass('dragLight');
            }
            if (self.validateEmail && self.validateUsername && self.validatePassword && sliderDom.isSuccess) {
                self.storeData();
            }
        });
    },
    validateInput: function() {
        var validateEmail = function() {
            var reg = /\w+([-w+.]\w+)*@\w+([-.]\+)*\.\w+([-.]\w+)*/;
            if (reg.test(RegDom.email.value)) {
                return true;
            }
            return false;
        };
        var validateUsername = function() {
            if (RegDom.username.value) {
                return true;
            }
            return false;
        };
        var validatePassword = function() {
            if (RegDom.password.value) {
                return true;
            }
            return false;
        };
        this.validateEmail = validateEmail();
        this.validateUsername = validateUsername();
        this.validatePassword = validatePassword();
    },
    storeData: function() {
        var self = this;
        var user = new Bmob.User();
        user.set("username", RegDom.username.value);
        user.set("password", RegDom.password.value);
        user.set("email", RegDom.email.value);
        user.signUp(null, {
            success: function(user) {
                if (user.attributes.error) {
                    $('#errorModal').modal("show");
                    $("#errorAlert").text(user.attributes.error);
                    // 清空当前用户
                    Bmob.User.logOut();
                } else {
                    self.insertExampleData(user, function(rm, err) {
                        window.location.href = "main.html";
                    });
                }
            },
            error: function(user, error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },
    serverValidate: function() {
        var query = new Bmob.Query(Bmob.User);
        query.count({
            success: function(count) {
                console.log(count);
            }
        });
    },
    insertExampleData: function(user, callback) {
        var RunningMan = Bmob.Object.extend("RunningMan");
        var rm = new RunningMan();
        rm.save({
            rm_time: "130127",
            rm_ep: "E130",
            rm_name: "还生（复活）特辑",
            rm_guests: "-",
            rm_tips: "情节前后呼应，带一点推理元素。HAHA有出色表现。",
            rm_seen: "已看过",
            user: user
        }, {
            success: function(rm) {
                callback && callback(rm, null);
            },
            error: function(rm, error) {
                callback && callback(rm, error);
            }
        });
    }
};
SigninModule.init();