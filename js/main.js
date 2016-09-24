var RunningMan = Bmob.Object.extend("RunningMan");
var MainDom = {
    mainTable: document.getElementById("mainTable"),
    isSort: false,
    onePageItems: 8,
    pagesBtn: document.getElementById("pagesBtn"),
    mTime: document.getElementById("m_time"),
    mEp: document.getElementById("m_ep"),
    mName: document.getElementById("m_name"),
    mGuests: document.getElementById("m_guests"),
    mTips: document.getElementById("m_tips"),
    mRadio: document.getElementsByName("m-hasseen"),
    timeStarAdd: document.getElementById("m_timeStar_add"),
    timeStarAlter: document.getElementById("m_timeStar_alter"),
    alterTime: document.getElementById("m_time_alter"),
    alterEp: document.getElementById("m_ep_alter"),
    alterName: document.getElementById("m_name_alter"),
    alterGuests: document.getElementById("m_guests_alter"),
    alterTips: document.getElementById("m_tips_alter"),
    alterRadio: document.getElementsByName("m-hasseen-alter"),
    m_seen_alter: document.getElementById("m_seen_alter"),
    m_notseen_alter: document.getElementById("m_notseen_alter")
};
var ObjectCache = {
    currentEditObject: undefined, //缓存当前对象，用于修改数据
    pageCount: 1,
    currentNo: undefined, //当前数据行号
    pageNo: undefined
}
var MainModule = {
    init: function() {
        this.bind();
        this.showPages();
        this.cutPages(0);
        this.getUserInfo();
    },
    getUserInfo: function() {
        if (user) {
            $("#welcomeUser").text(user.attributes.username);
        }
    },
    showList: function(query) {
        var self = this;
        query.equalTo("user", user);
        query.ascending("rm_time");
        query.find({
            success: function(results) {
                var num = 1;
                self.delRows();
                for (let i = 0; i < results.length; i++) {
                    let object = results[i];
                    var newTr = MainDom.mainTable.insertRow();
                    var newTd0 = newTr.insertCell();
                    var newTd1 = newTr.insertCell();
                    var newTd2 = newTr.insertCell();
                    var newTd3 = newTr.insertCell();
                    var newTd4 = newTr.insertCell();
                    var newTd5 = newTr.insertCell();
                    var newTd6 = newTr.insertCell();
                    var newTd7 = newTr.insertCell();
                    var newTd8 = newTr.insertCell();
                    var newTd9 = newTr.insertCell();
                    var numStr = num.toString();
                    newTd0.innerText = i + 1;
                    newTd1.innerText = object.get('rm_time');
                    newTd2.innerText = object.get('rm_ep');
                    newTd3.innerText = object.get('rm_name');
                    newTd4.innerText = object.get('rm_guests');
                    newTd5.innerText = object.get('rm_tips');
                    newTd6.innerText = object.get('rm_seen');
                    newTd7.innerText = object.id;
                    newTd7.className = "objectId";
                    var a_alter = document.createElement('a');
                    a_alter.href = "#alterModal";
                    a_alter.innerText = "修改";
                    a_alter.onclick = function() {
                        $("#alterModal").modal();
                        ObjectCache.currentEditObject = object;
                        $("#alterModal").on('shown.bs.modal', function() {
                            MainDom.alterTime.value = object.get('rm_time');
                            MainDom.alterEp.value = object.get('rm_ep');
                            MainDom.alterName.value = object.get('rm_name');
                            MainDom.alterGuests.value = object.get('rm_guests');
                            MainDom.alterTips.value = object.get('rm_tips');
                            if (object.get('rm_seen') == "已看过") {
                                MainDom.m_seen_alter.checked = true;
                            } else {
                                MainDom.m_notseen_alter.checked = true;
                            }
                        });
                    };
                    newTd8.appendChild(a_alter);

                    var a = document.createElement('a');
                    a.href = "javascript:;";
                    a.innerText = "删除";
                    a.onclick = function() {
                        MainModule.deleteData(object);
                        ObjectCache.currentNo = i + 1;
                    };
                    newTd9.appendChild(a);
                    num++;
                }
            },
            error: function(error) {
                alert("查询失败: " + error.code + " " + error.message);
            }
        });
    },
    createItem: function() {
        var self = this;
        var rm = new RunningMan();
        var mSeen;
        for (var i = 0; i < MainDom.mRadio.length; i++) {
            if (MainDom.mRadio[i].checked) {
                mSeen = MainDom.mRadio[i].value;
            }
        }
        if (!MainDom.mGuests.value) MainDom.mGuests.value = "-";
        if (!MainDom.mTime.value) {
            $("#addModal .f1").addClass('has-error');
            MainDom.timeStarAdd.style.visibility = "visible";
        } else {
            $("#addModal .f1").removeClass('has-error');
            MainDom.timeStarAdd.style.visibility = "hidden";
            rm.set("rm_time", MainDom.mTime.value);
            rm.set("rm_ep", MainDom.mEp.value);
            rm.set("rm_name", MainDom.mName.value);
            rm.set("rm_guests", MainDom.mGuests.value);
            rm.set("rm_tips", MainDom.mTips.value);
            rm.set("rm_seen", mSeen);
            rm.set("user", user);
            rm.save(null, {
                success: function(rm) {
                    $("#addModal").modal("hide");
                    $("#addModal .f1").removeClass('has-error');
                    MainDom.timeStarAdd.style.visibility = "hidden";
                    $("#currentPage").text(ObjectCache.pageCount);
                    MainDom.mTime.value = null;
                    MainDom.mEp.value = "";
                    MainDom.mName.value = "";
                    MainDom.mGuests.value = "";
                    MainDom.mTips.value = "";
                    MainDom.mRadio[0].checked;
                    self.showPages(function() {
                        self.cutPages((ObjectCache.pageCount - 1), function() {
                            $("#currentPage").text(ObjectCache.pageCount);
                        });
                    });
                },
                error: function(rm, error) {
                    console.log('添加数据失败，返回错误信息：' + error.description);
                }
            });
        }
    },
    alterItem: function(id, callback) {
        var rm = new RunningMan();
        var query = new Bmob.Query(RunningMan);
        var self = this;
        var alterSeen;
        for (var i = 0; i < MainDom.alterRadio.length; i++) {
            if (MainDom.alterRadio[i].checked) {
                alterSeen = MainDom.alterRadio[i].value;
            }
        }
        if (!MainDom.alterGuests.value) MainDom.alterGuests.value = "-";
        if (!MainDom.alterTime.value) {
            $("#alterModal .f1").addClass('has-error');
            MainDom.timeStarAlter.style.visibility = "visible";
        } else {
            $("#alterModal .f1").removeClass('has-error');
            MainDom.timeStarAlter.style.visibility = "hidden";
            query.get(id, {
                success: function(rm) {
                    rm.fetchWhenSave(true);
                    rm.set("rm_time", MainDom.alterTime.value);
                    rm.set("rm_ep", MainDom.alterEp.value);
                    rm.set("rm_name", MainDom.alterName.value);
                    rm.set("rm_guests", MainDom.alterGuests.value);
                    rm.set("rm_tips", MainDom.alterTips.value);
                    rm.set("rm_seen", alterSeen);
                    rm.save(null, {
                        success: function(rm) {
                            $("#alterModal").modal("hide");
                            callback && callback();
                        }
                    });
                },
                error: function(error) {}
            });
        }
    },
    cutPages: function(i, callback) {
        var query = new Bmob.Query(RunningMan);
        ObjectCache.pageNo = arguments[0];
        // console.log(ObjectCache.pageNo+"pageNo")
        if (MainDom.isSort) {
            query.skip(MainDom.onePageItems * i).limit(MainDom.onePageItems);
            this.sortList(query);
        } else {
            query.skip(MainDom.onePageItems * i).limit(MainDom.onePageItems);
            this.showList(query);
        }
        (callback && typeof(callback) === "function") && callback();
    },
    removePagesBtn: function() {
        while (MainDom.pagesBtn.childNodes[1]) {
            MainDom.pagesBtn.removeChild(MainDom.pagesBtn.childNodes[1]);
        }
    },
    delRows: function() {
        var tbRows = MainDom.mainTable.rows.length;
        for (var i = tbRows - 1; i >= 0; i--) {
            MainDom.mainTable.deleteRow(i);
        }
    },
    showPages: function(callback) {
        this.removePagesBtn();
        var li1 = '<li><a href="javascript:;" id="page0" onclick="MainModule.cutPages(0)">1</a></li>';
        $("#pagesBtn").append(li1);
        var query = new Bmob.Query(RunningMan);
        query.equalTo("user", user);
        query.count({
            success: function(count) {
                // 查询成功，返回记录数量
                $("#itemsCount").text(count);
                var pages = Math.ceil(count / MainDom.onePageItems);
                ObjectCache.pageCount = pages;
                var msg;
                for (let i = 1; i < pages; i++) {
                    msg = '<li><a href="javascript:;" id="page' + i + '" onclick="MainModule.cutPages(' + i + ')">' + (i + 1) + '</a></li>';
                    $("#pagesBtn").append(msg);
                }
                for (let j = 0; j < pages; j++) {
                    $("#page" + j).click(function() {
                        $("#currentPage").text(j + 1);
                    });
                }
                callback && callback();
            },
            error: function(error) {
                // 查询失败
            }
        });
    },
    sortList: function(query) {
        this.showList(query);
        query.ascending("rm_time");
        MainDom.isSort = true;
    },
    deleteData: function(obj) {
        var self = this;
        obj.destroy({
            success: function(obj) {
                var query = new Bmob.Query(RunningMan);
                self.showPages(function() {
                    if (ObjectCache.currentNo == 1) {
                        self.cutPages((ObjectCache.pageNo - 1), function() {
                            $("#currentPage").text(ObjectCache.pageCount);
                        });
                    } else {
                        self.cutPages(ObjectCache.pageNo, function() {
                            $("#currentPage").text(ObjectCache.pageNo);
                        });
                    }
                });
            },
            error: function(obj, error) {
                alert("删除失败");
            }
        });
    },
    logout: function() {
        Bmob.User.logOut();
        window.location.href = "login.html";
    },
    bind: function() {
        var self = this;
        $("#saveItem").click(function() {
            self.createItem();
        });
        $("#addModal .cancelItem").click(function() {
            $("#addModal").modal("hide");
            $("#addModal .f1").removeClass('has-error');
            MainDom.timeStarAdd.style.visibility = "hidden";
        });
        $("#alterModal .cancelItem").click(function() {
            $("#alterModal").modal("hide");
            $("#alterModal .f1").removeClass('has-error');
            MainDom.timeStarAlter.style.visibility = "hidden";
        });
        $("#saveItem_alter").on("click", function() {
            self.alterItem(ObjectCache.currentEditObject.id, function() {
                var query = new Bmob.Query(RunningMan);
                self.showPages(function() {
                    self.cutPages(ObjectCache.pageNo);
                });
            });
        });
    }
};
MainModule.init();