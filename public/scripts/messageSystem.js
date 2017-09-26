function pokeSend(e) {
    var pokeReason = prompt("Poke Reason");
    if (pokeReason != null)
        socket.emit("pokeSend", { targetNickname: e.target.parentNode.id.replace("userOptionContainer", ""), message: pokeReason });
}
function messageSend(message) {
    if ($(".chatTabMenuItem.active").attr('id').replace("chatTabMenuItem", "") == "Main") {
        socket.emit("messageSend", message);
    } else {
        socket.emit("messageSendPrivate", { targetNickname: $(".chatTabMenuItem.active").attr('id').replace("chatTabMenuItem", ""), message: message });
    }
}
socket.on("messageSended", function (data) {
    var message = document.createElement("div");
    message.className = "myMessage";
    message.innerHTML = "<strong><" + dataString() + ">" + data.invokerNickname + "</strong>: " + data.message;
    $("#chatTabMain").append(message);
    $("#chatTabMain").clearQueue();
    $("#chatTabMain").animate({ scrollTop: $('#chatTabMain').prop("scrollHeight") }, 1000);
});
socket.on("messageSendedPrivate", function (data) {
    var message = document.createElement("div");
    message.className = "myMessage";
    message.innerHTML = "<strong><" + dataString() + ">" + data.invokerNickname + "</strong>: " + data.message;
    $("#chatTab" + data.targetNickname).append(message);
    $("#chatTab" + data.targetNickname).clearQueue();
    $("#chatTab" + data.targetNickname).animate({ scrollTop: $('#chatTab' + data.targetNickname).prop("scrollHeight") }, 1000);

});
socket.on("messageReceivedPrivate", function (data) {
    var message = document.createElement("div");
    message.className = "anotherMessage";
    message.innerHTML = "<strong><" + dataString() + ">" + data.invokerNickname + "</strong>: " + data.message;
    createChatTab(data.invokerNickname, true);
    switchChatTab(data.invokerNickname);
    $("#chatTab" + data.invokerNickname).append(message)
    $("#chatTab" + data.invokerNickname).clearQueue();
    $("#chatTab" + data.invokerNickname).animate({ scrollTop: $('#chatTab' + data.invokerNickname).prop("scrollHeight") }, 1000);
});
socket.on("messageReceived", function (data) {
    var message = document.createElement("div");
    message.className = "anotherMessage";
    message.innerHTML = "<strong><" + dataString() + ">" + data.invokerNickname + "</strong>: " + data.message;
    $("#chatTabMain").append(message);
    $("#chatTabMain").clearQueue();
    $("#chatTabMain").animate({ scrollTop: $('#chatTabMain').prop("scrollHeight") }, 1000);
});
socket.on("pokeReceived", function (data) {
    alert(data.invokerNickname + " - poke you: " + data.message);
});
function dataString() {
    var date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}