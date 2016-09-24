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
    }
};
var LogDom = {
    username: document.getElementById("logUsername"),
    password: document.getElementById("logPwd"),
    loginBtn: document.getElementById("logBtn"),
    usernameLabel: document.getElementById("log_unameLabel"),
    passwordLabel: document.getElementById("log_pwdLabel")
};
var LoginModule = {
    init: function() {
        this.bind();
    },
    bind: function() {
        var self = this;
        EventUtil.addHandler(LogDom.loginBtn, "click", function() {
            $(".form-group").removeClass('has-error');
            LogDom.usernameLabel.style.visibility = "hidden";
            LogDom.passwordLabel.style.visibility = "hidden";
            self.validateInput();
            if (!self.validateUsername) {
                $(".logUnameBox").addClass('has-error');
                LogDom.usernameLabel.style.visibility = "visible";
            }
            if (!self.validatePassword) {
                $(".logPwdBox").addClass('has-error');
                LogDom.passwordLabel.style.visibility = "visible";
            }
            if (self.validateUsername && self.validatePassword) {
                self.logIn();
            }
        });
    },
    validateInput: function() {
        var validateUsername = function() {
            if (LogDom.username.value) {
                return true;
            }
            return false;
        };
        var validatePassword = function() {
            if (LogDom.password.value) {
                return true;
            }
            return false;
        };
        this.validateUsername = validateUsername();
        this.validatePassword = validatePassword();
    },
    logIn: function() {
        Bmob.User.logIn(LogDom.username.value, LogDom.password.value, {
            success: function(user) {
                if (user.attributes.error) {
                    $('#errorModalLog').modal("show");
                    $("#errorAlertLog").text(user.attributes.error);
                    // 清空当前用户
                    Bmob.User.logOut();
                } else {
                    window.location.href = "main.html";
                }
            },
            error: function(user, error) {
                alert("登录失败");
            }
        });
    }
};
LoginModule.init();