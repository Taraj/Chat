
socket.on("connectedUserList", function (data) {
    $("#userList").html("");
    for (var i = 0; i < data.length; i++)
        createUserListItem(data[i]);
});
function createUserListItem(user) {
    var userListItem = document.createElement("div");
    userListItem.className = "userListItem ";
    if (user.nickname == myNickname) {
        userListItem.className += "self";
    } else {
        if (user.registered == true) {
            userListItem.className += "registered";
        } else {
            userListItem.className += "unregistered";
        }
    }
    userListItem.id = "userListItem" + user.nickname;
    userListItem.innerText = user.nickname;
    userListItem.addEventListener("click", function (e) {
        e.stopPropagation();
        $(".userOptionContainer").remove();
        var userOptionContainer = document.createElement("div");
        userOptionContainer.id = "userOptionContainer" + e.target.id.replace("userListItem", "");
        userOptionContainer.className = "userOptionContainer";
        userOptionContainer.style.top = e.clientY + "px";
        userOptionContainer.style.left = (e.pageX - $('#' + e.target.id).offset().left) + "px";
        var userOptionNickname = document.createElement("div");
        userOptionNickname.className = "userOptionNickname";
        userOptionNickname.innerText = e.target.id.replace("userListItem", "");
        userOptionContainer.appendChild(userOptionNickname);
        var userOptionPoke = document.createElement("div");
        userOptionPoke.className = "userOptionPoke";
        userOptionPoke.innerText = "Poke";
        userOptionPoke.addEventListener("click", pokeSend);
        userOptionContainer.appendChild(userOptionPoke);
        var userOptionMessage = document.createElement("div");
        userOptionMessage.className = "userOptionMessage";
        userOptionMessage.innerHTML = "Private&nbsp;Message";
        userOptionMessage.addEventListener("click", function (e) { createChatTab(e.target.parentNode.id.replace("userOptionContainer", ""), true); });
        userOptionContainer.appendChild(userOptionMessage);

        var userOptionVoiceCall = document.createElement("div");
        userOptionVoiceCall.className = "userOptionVoiceCall";
        userOptionVoiceCall.innerHTML = "Voice&nbsp;Call";
        userOptionVoiceCall.addEventListener("click", function (e) { voiceCall(e.target.parentNode.id.replace("userOptionContainer", ""), true); });
        userOptionContainer.appendChild(userOptionVoiceCall);
        
        var userOptionVideoCall = document.createElement("div");
        userOptionVideoCall.className = "userOptionVideoCall";
        userOptionVideoCall.innerHTML = "Video&nbsp;Call";
        userOptionVideoCall.addEventListener("click", function (e) { videoCall(e.target.parentNode.id.replace("userOptionContainer", ""), true); });
        userOptionContainer.appendChild(userOptionVideoCall);

        $("#" + e.target.id).append(userOptionContainer);
        if (e.pageX + userOptionContainer.clientWidth > document.body.clientWidth) {
            userOptionContainer.style.left = (e.pageX - $('#' + e.target.id).offset().left) - userOptionContainer.clientWidth + "px";
            if (e.pageX - userOptionContainer.clientWidth < document.body.clientWidth - $("#userList").innerWidth()) {
                userOptionContainer.style.left = ($("#userList").innerWidth() / 2 - userOptionContainer.clientWidth / 2 + "px");
            }
        }
        window.addEventListener("click", function () { $(".userOptionContainer").remove() });
    });
    $("#userList").append(userListItem)
}

socket.on("disconnectUser", function (data) {
    var disconnect = document.createElement("div");
    disconnect.className = "disconnect";
    if (data.registered) {
        disconnect.innerHTML = "<strong><" + dataString() + "> " + data.nickname + " disconected.";
    } else {
        disconnect.innerHTML = "<strong><" + dataString() + "> " + data.nickname + " disconected. Take care!!! Now everyone can take this nickname!!!</strong>";
    }
    $("#chatTab" + data.nickname).append(disconnect)
    $("#chatTab" + data.nickname).clearQueue();
    $("#chatTab" + data.nickname).animate({ scrollTop: $('#chatTab' + data.nickname).prop("scrollHeight") }, 1000);
    var disconnect = document.createElement("div");
    disconnect.className = "disconnect";
    if (data.registered) {
        disconnect.innerHTML = "<strong><" + dataString() + "> " + data.nickname + " disconected.";
    } else {
        disconnect.innerHTML = "<strong><" + dataString() + "> " + data.nickname + " disconected. Take care!!! Now everyone can take this nickname!!!</strong>";
    }
    $("#chatTabMain").append(disconnect)
    $("#chatTabMain").clearQueue();
    $("#chatTabMain").animate({ scrollTop: $('#chatTab').prop("scrollHeight") }, 1000);
});
