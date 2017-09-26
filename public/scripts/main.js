var socket = io.connect();
var myNickname;
socket.on('disconnect', function () {
    alert("Disconnect from server");
    location.reload();
});
socket.on("connected", function (nickname) {
    $("body").html("");
    document.title = "Połączono jako: " + nickname;
    myNickname = nickname;
    initialize();
});

$(window).resize(function () {
    if ($("#userListSwitch").css("display") == "none") {
        $("#userList").show();
    }
});
/////////////////////////
function initialize() {
    var chat = document.createElement("main");
    chat.className = "chat";
    var userList = document.createElement("div");
    userList.className = "userList";
    userList.id = "userList";
    chat.appendChild(userList);
    var chatContainer = document.createElement("div");
    chatContainer.className = "chatContainer";
    chatContainer.id = "chatContainer";
    chat.appendChild(chatContainer);
    var chatTabMenu = document.createElement("div");
    chatTabMenu.className = "chatTabMenu";
    chatTabMenu.id = "chatTabMenu";
    var chatTabMenuScrollLeft = document.createElement("div");
    chatTabMenuScrollLeft.className = "chatTabMenuScrollLeft";
    chatTabMenuScrollLeft.id = "chatTabMenuScrollLeft";
    chatTabMenuScrollLeft.addEventListener("click", scrollChatTabMenuLeft);
    var chatTabMenuScrollRight = document.createElement("div");
    chatTabMenuScrollRight.className = "chatTabMenuScrollRight";
    chatTabMenuScrollRight.id = "chatTabMenuScrollRight";
    chatTabMenuScrollRight.addEventListener("click", scrollChatTabMenuRight);
    var chatTabMenuContainer = document.createElement("div");
    chatTabMenuContainer.className = "chatTabMenuContainer";
    chatTabMenuContainer.id = "chatTabMenuContainer";
    chatTabMenuContainer.appendChild(chatTabMenuScrollLeft);
    chatTabMenuContainer.appendChild(chatTabMenuScrollRight);
    chatTabMenuContainer.appendChild(chatTabMenu);
    chat.appendChild(chatTabMenuContainer);
    var chatForm = document.createElement("form");
    chatForm.name = "chatForm";
    chatForm.className = "chatForm";
    var textarea = document.createElement("textarea");
    textarea.name = "text";
    textarea.addEventListener("keydown", function (e) { if (e.keyCode == 13) { messageSend(e.target.value); e.target.value = ""; e.preventDefault(); } });
    chatForm.appendChild(textarea);
    chat.appendChild(chatForm);
    var userListSwitch = document.createElement("div");
    userListSwitch.className = "userListSwitch";
    userListSwitch.id = "userListSwitch";
    userListSwitch.addEventListener("click", function () {
        $("#userList").toggle();
    })
    chat.appendChild(userListSwitch);
    document.body.appendChild(chat);
    createChatTab("Main", false)
}