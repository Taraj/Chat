
function createChatTab(name, canClose) {
    if ($("#chatTabMenuItem" + name).length == 0) {
        var chatTabMenuItem = document.createElement("div");
        chatTabMenuItem.className = "chatTabMenuItem";
        chatTabMenuItem.id = "chatTabMenuItem" + name;
        chatTabMenuItem.innerHTML = name;
        if (canClose) {
            var chatTabMenuItemCloseButton = document.createElement("div");
            chatTabMenuItemCloseButton.className = "chatTabMenuItemCloseButton";
            chatTabMenuItemCloseButton.id = "chatTabMenuItemCloseButton" + name;
            chatTabMenuItemCloseButton.addEventListener("click", deleteChatTabHelper);
            chatTabMenuItem.appendChild(chatTabMenuItemCloseButton);
        }
        chatTabMenuItem.addEventListener("click", function (e) {
            switchChatTab(e.target.id.replace("chatTabMenuItem", ""));
        });
        $("#chatTabMenu").append(chatTabMenuItem);
        $("#chatTabMenu").width($("#chatTabMenu").width() + $(".chatTabMenuItem").width() + parseInt($(".chatTabMenuItem").css("margin-right")));
        var chatTab = document.createElement("div");
        chatTab.className = "chatTab";
        chatTab.id = "chatTab" + name;
        $("#chatContainer").append(chatTab);
        switchChatTab(name);
        if (parseInt($("#chatTabMenu").css("margin-left")) * -1 < $("#chatTabMenu").width() - $("#chatTabMenuContainer").width() / 1.5) {
            $("#chatTabMenuScrollRight").show();
        }
    } else {
        switchChatTab(name);
    }
}
function deleteChatTabHelper(e) {
    e.stopPropagation();
    deleteChatTab(e.target.id.replace("chatTabMenuItemCloseButton", ""));
}
function deleteChatTab(name) {
    if ($("#chatTabMenuItem" + name).hasClass("active"))
        switchChatTab("Main");
    $("#chatTabMenuItem" + name).remove();
    $("#chatTab" + name).remove();
    $("#chatTabMenu").width($("#chatTabMenu").width() - $(".chatTabMenuItem").width() + parseInt($(".chatTabMenuItem").css("margin-right")));
    if (parseInt($("#chatTabMenu").css("margin-left")) * -1 > $("#chatTabMenu").width() - $("#chatTabMenuContainer").width() / 1.5) {
        $("#chatTabMenuScrollRight").hide();
    }
}
function switchChatTab(name) {
    $(".chatTabMenuItem").removeClass("active");
    $("#chatTabMenuItem" + name).addClass("active");
    $(".chatTab").removeClass("active");
    $("#chatTab" + name).addClass("active");
    $("#chatTabMenu").clearQueue();
    if (-($(".chatTabMenuItem.active").position().left - (parseInt($("#chatTabMenu").css("margin-left")))) + $("#chatTabMenuContainer").width() / 1.5 < 0) {
        $("#chatTabMenu").animate({ 'margin-left': -($(".chatTabMenuItem.active").position().left - (parseInt($("#chatTabMenu").css("margin-left")))) + $("#chatTabMenuContainer").width() / 1.5 }, 'slow').promise().done(function () {
            $("#chatTabMenuScrollLeft").show();
            if (parseInt($("#chatTabMenu").css("margin-left")) >= 0) {
            } else {
                $("#chatTabMenuScrollLeft").show();
            }
        });
    } else {
        $("#chatTabMenu").animate({ 'margin-left': 0 }, 'slow').promise().done(function () {
            if (parseInt($("#chatTabMenu").css("margin-left")) >= 0) {
                $("#chatTabMenuScrollLeft").hide();
            } else {
                $("#chatTabMenuScrollLeft").show();
            }
        });
    }
}
function scrollChatTabMenuLeft() {
    $("#chatTabMenu").clearQueue().finish();
    if (parseInt($("#chatTabMenu").css("margin-left")) < 0) {
        if (parseInt($("#chatTabMenu").css("margin-left")) + $("#chatTabMenuContainer").width() / 3 < 0) {
            $("#chatTabMenu").animate({ 'margin-left': parseInt($("#chatTabMenu").css("margin-left")) + $("#chatTabMenuContainer").width() / 3 }, 'slow').promise().done(function () {
                if (parseInt($("#chatTabMenu").css("margin-left")) >= 0) {
                    $("#chatTabMenuScrollLeft").hide();
                } else {
                    $("#chatTabMenuScrollLeft").show();
                }
                if (parseInt($("#chatTabMenu").css("margin-left")) * -1 < $("#chatTabMenu").width() - $("#chatTabMenuContainer").width() / 1.5) {
                    $("#chatTabMenuScrollRight").show();
                } else {
                    $("#chatTabMenuScrollRight").hide();
                }
            });
        } else {
            $("#chatTabMenu").animate({ 'margin-left': parseInt($("#chatTabMenu").css("margin-left")) - parseInt($("#chatTabMenu").css("margin-left")) }, 'slow').promise().done(function () {
                if (parseInt($("#chatTabMenu").css("margin-left")) >= 0) {
                    $("#chatTabMenuScrollLeft").hide();
                } else {
                    $("#chatTabMenuScrollLeft").show();
                }
                if (parseInt($("#chatTabMenu").css("margin-left")) * -1 < $("#chatTabMenu").width() - $("#chatTabMenuContainer").width() / 1.5) {
                    $("#chatTabMenuScrollRight").show();
                } else {
                    $("#chatTabMenuScrollRight").hide();
                }
            });
        }
    } else {
        $("#chatTabMenuScrollLeft").hide();
    }
}
function scrollChatTabMenuRight() {
    $("#chatTabMenu").clearQueue().finish();
    if (parseInt($("#chatTabMenu").css("margin-left")) * -1 < $("#chatTabMenu").width() - $("#chatTabMenuContainer").width() / 1.5) {
        $("#chatTabMenu").animate({ 'margin-left': parseInt($("#chatTabMenu").css("margin-left")) - $("#chatTabMenuContainer").width() / 3 }, 'slow').promise().done(function () {
            if (parseInt($("#chatTabMenu").css("margin-left")) >= 0) {
                $("#chatTabMenuScrollLeft").hide();
            } else {
                $("#chatTabMenuScrollLeft").show();
            }
            if (parseInt($("#chatTabMenu").css("margin-left")) * -1 < $("#chatTabMenu").width() - $("#chatTabMenuContainer").width() / 1.5) {
                $("#chatTabMenuScrollRight").show();
            } else {
                $("#chatTabMenuScrollRight").hide();
            }
        });;
    } else {
        $("#chatTabMenuScrollRight").hide();
    }
}

