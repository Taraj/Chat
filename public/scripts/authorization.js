$(document).ready(function () {
    $("#authorizationTypeMenuItemGuest").click(function () {
        $("#authorizationTypeMenuItemGuest, #authorizationTypeMenuItemLogin, #authorizationTypeMenuItemRegister, #authorizationTypeAreaGuest, #authorizationTypeAreaLogin, #authorizationTypeAreaRegister").removeClass("active");
        $("#authorizationTypeMenuItemGuest, #authorizationTypeAreaGuest").addClass("active");
    });
    $("#authorizationTypeMenuItemLogin").click(function () {
        $("#authorizationTypeMenuItemGuest, #authorizationTypeMenuItemLogin, #authorizationTypeMenuItemRegister, #authorizationTypeAreaGuest, #authorizationTypeAreaLogin, #authorizationTypeAreaRegister").removeClass("active");
        $("#authorizationTypeMenuItemLogin, #authorizationTypeAreaLogin").addClass("active");
    });
    $("#authorizationTypeMenuItemRegister").click(function () {
        $("#authorizationTypeMenuItemGuest, #authorizationTypeMenuItemLogin, #authorizationTypeMenuItemRegister, #authorizationTypeAreaGuest, #authorizationTypeAreaLogin, #authorizationTypeAreaRegister").removeClass("active");
        $("#authorizationTypeMenuItemRegister, #authorizationTypeAreaRegister").addClass("active");
    });
    $("#formLogin").submit(function (e) {
        e.preventDefault();
        if (document.formLogin.login.value.length > 0 && document.formLogin.password.value.length > 0) {
            socket.emit("login", { login: document.formLogin.login.value, password: document.formLogin.password.value });
            $("#errorLogin").text("");
        } else {
            $("#errorLogin").text("Bad Login/Password!!!");
        }
    });
    $("#formRegister").submit(function (e) {
        e.preventDefault();
        if (document.formRegister.login.value.length >= 4 && document.formRegister.password.value.length >= 4 && document.formRegister.passwordRepeat.value.length >= 4 && document.formRegister.login.value.length <= 10 && document.formRegister.password.value.length <= 10 && document.formRegister.passwordRepeat.value.length <= 10) {
            $("#errorRegister").text("");
            if (document.formRegister.password.value == document.formRegister.passwordRepeat.value) {
                $("#errorRegister").text("");
                socket.emit("register", { login: document.formRegister.login.value, password: document.formRegister.password.value });
            } else {
                $("#errorRegister").text("Passwords do not match!!!");
            }
        } else {
            $("#errorRegister").text("4 to 10 characters!!!");
        }
    });
    $("#formGuest").submit(function (e) {
        e.preventDefault();
        if (document.formGuest.nickname.value.length >= 4 && document.formGuest.nickname.value.length <= 10) {
            socket.emit("connectGuest", document.formGuest.nickname.value);
            $("#errorGuest").text("");
        } else {
            $("#errorGuest").text("4 to 10 characters!!!");
        }
    });
});
socket.on("authorizationError", function (data) {
    $("#error" + data.type).text(data.details);
});
socket.on("registered", function () {
    $("#authorizationTypeMenuItemLogin").click();
});