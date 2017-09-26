var receiver;
var transmitter;
var localStream;
var iceServers;
var callTarget;

socket.on("iceServer", function (iceServer) {
    iceServers = iceServer;
});
function voiceCall(nickname) {
    if (callTarget == null) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
            localStream = stream;
            callTarget = nickname;
            socket.emit("callVoiceRequest", nickname);
        }, function (e) {
            alert("You can't because: " + e);
        });
    } else {
        alert("You alredy calling!!!");
    }
}

function videoCall(nickname) {
    if (callTarget == null) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (stream) {
            localStream = stream;
            callTarget = nickname;
            socket.emit("callVideoRequest", nickname);
        }, function (e) {
            alert("You can't because: " + e);
        });
    } else {
        alert("You alredy calling!!!");
    }
}

socket.on("callVoiceRequest", function (nickname) {
    if (callTarget == null) {
        if (confirm("Voice Call from " + nickname)) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
                createVideo(nickname);
                callTarget = nickname;
                receiver = new RTCPeerConnection(iceServers);
                transmitter = new RTCPeerConnection(iceServers);
                localStream = stream;
                socket.emit("callVoiceAccept", nickname);
                receiver.ontrack = function (e) {
                    document.getElementById("video" + nickname).srcObject = e.streams[0];
                };
                receiver.onicecandidate = function (e) {
                    socket.emit('receiverOnicecandidate', { targetNickname: nickname, ct: e.candidate });
                };
                transmitter.onicecandidate = function (e) {
                    socket.emit('transmitterOnicecandidate', { targetNickname: nickname, ct: e.candidate });
                };

                localStream.getTracks().forEach(
                    function (track) {
                        transmitter.addTrack(track, localStream);
                    }
                );
                transmitter.createOffer().then(function (desc) {
                    socket.emit('transmitterCreateOffer', { targetNickname: nickname, ct: desc });
                    transmitter.setLocalDescription(desc);
                });
            }, function (e) {
                socket.emit("callRejected", { targetNickname: nickname, reason: "Parter reject media devices t because: " + e });
                alert("You can't because: " + e);
            });

        } else {
            socket.emit("callRejected", { targetNickname: nickname, reason: "Parter reject calling" });
        }
    } else {
        socket.emit("callRejected", { targetNickname: nickname, reason: "Parter alredy calling" });
    }
});
socket.on("callVideoRequest", function (nickname) {
    if (callTarget == null) {
        if (confirm("Video Call from " + nickname)) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (stream) {
                createVideo(nickname);
                callTarget = nickname;
                receiver = new RTCPeerConnection(iceServers);
                transmitter = new RTCPeerConnection(iceServers);
                localStream = stream;
                socket.emit("callVideoAccept", nickname);
                receiver.ontrack = function (e) {
                    document.getElementById("video" + nickname).srcObject = e.streams[0];
                };
                receiver.onicecandidate = function (e) {
                    socket.emit('receiverOnicecandidate', { targetNickname: nickname, ct: e.candidate });
                };
                transmitter.onicecandidate = function (e) {
                    socket.emit('transmitterOnicecandidate', { targetNickname: nickname, ct: e.candidate });
                };

                localStream.getTracks().forEach(
                    function (track) {
                        transmitter.addTrack(track, localStream);
                    }
                );
                transmitter.createOffer().then(function (desc) {
                    socket.emit('transmitterCreateOffer', { targetNickname: nickname, ct: desc });
                    transmitter.setLocalDescription(desc);
                });
            }, function (e) {
                socket.emit("callRejected", { targetNickname: nickname, reason: "Parter reject media devices t because: " + e });
                alert("You can't because: " + e);
            });
        } else {
            socket.emit("callRejected", { targetNickname: nickname, reason: "Parter reject calling" });
        }
    } else {
        socket.emit("callRejected", { targetNickname: nickname, reason: "Parter alredy calling" });
    }
});

socket.on("callVideoAccept", function (nickname) {
    createVideo(nickname);
 
    receiver = new RTCPeerConnection(iceServers);
    transmitter = new RTCPeerConnection(iceServers);
    receiver.ontrack = function (e) {
        document.getElementById("video" + nickname).srcObject = e.streams[0];
    };
    receiver.onicecandidate = function (e) {
        socket.emit('receiverOnicecandidate', { targetNickname: nickname, ct: e.candidate });
    };
    transmitter.onicecandidate = function (e) {
        socket.emit('transmitterOnicecandidate', { targetNickname: nickname, ct: e.candidate });

    }; 

    localStream.getTracks().forEach(
        function (track) {
            transmitter.addTrack(track, localStream);
        }
    );
    transmitter.createOffer().then(function (desc) {
        socket.emit('transmitterCreateOffer', { targetNickname: nickname, ct: desc });
        transmitter.setLocalDescription(desc);
    });
});
socket.on("callVoiceAccept", function (nickname) {
    createVideo(nickname);
    receiver = new RTCPeerConnection(iceServers);
    transmitter = new RTCPeerConnection(iceServers);
    receiver.ontrack = function (e) {
        document.getElementById("video" + nickname).srcObject = e.streams[0];
    };
    receiver.onicecandidate = function (e) {
        socket.emit('receiverOnicecandidate', { targetNickname: nickname, ct: e.candidate });
    };
    transmitter.onicecandidate = function (e) {
        socket.emit('transmitterOnicecandidate', { targetNickname: nickname, ct: e.candidate });
    }; 

    localStream.getTracks().forEach(
        function (track) {
            transmitter.addTrack(track, localStream);
        }
    );
    transmitter.createOffer().then(function (desc) {
        socket.emit('transmitterCreateOffer', { targetNickname: nickname, ct: desc });
        transmitter.setLocalDescription(desc);
    });

});
socket.on('transmitterOnicecandidate', function (data) {
    receiver.addIceCandidate(data.ct);
});
socket.on('receiverOnicecandidate', function (data) {
    transmitter.addIceCandidate(data.ct);
});
socket.on('receiverCreateAnswer', function (data) {
    transmitter.setRemoteDescription(data.ct);
});
socket.on('transmitterCreateOffer', function (data) {
    receiver.setRemoteDescription(data.ct);
    receiver.createAnswer().then(function (desc) {
        socket.emit('receiverCreateAnswer', { targetNickname: data.nickname, ct: desc });
        receiver.setLocalDescription(desc);
    });
});
socket.on("callRejected", function (reason) {
    alert("Call Rejected: " + reason);
    callTarget = null;
});
socket.on("callStop", function () {
    closeVideo();
});

function closeVideo() {
    var videoClose = document.createElement("div");
    videoClose.className = "disconnect";
    videoClose.innerHTML = "Call Stop";
    $("#chatTab" + callTarget).append(videoClose)
    $("#chatTab" + callTarget).clearQueue();
    $("#chatTab" + callTarget).animate({ scrollTop: $('#chatTab' + callTarget).prop("scrollHeight") }, 1000);
    $("#stopVideoButon").remove();
    $("#muteVideoButon").remove();
    document.getElementById("chatTabMenuItemCloseButton" + callTarget).removeEventListener("click", closeVideoLocal);
    transmitter.close();
    receiver.close();
    transmitter = null;
    receiver = null;
    document.getElementById("video" + callTarget).id += "old";
    callTarget = null;
}

function closeVideoLocal() {
    var nickname = callTarget;
    closeVideo();
    socket.emit("callStop", nickname);
}

function createVideo(nickname) {
    var videoFrame = document.createElement("div");
    videoFrame.className = "videoFrame";
    var buttonFrame = document.createElement("div");
    var stop = document.createElement("button");
    stop.innerText = "Stop";
    stop.id = "stopVideoButon";
    stop.addEventListener("click", closeVideoLocal);
    var mute = document.createElement("button");
    mute.innerText = "Mute";
    mute.id = "muteVideoButon";
    mute.addEventListener("click", function () {
        if (document.getElementById("video" + callTarget).muted == true) {
            document.getElementById("video" + callTarget).muted = false;
        } else {
            document.getElementById("video" + callTarget).muted = true;
        }
        
    });

    var video = document.createElement("video");
    video.id = "video" + nickname;
    video.autoplay = true;
    createChatTab(nickname, true);
    switchChatTab(nickname);
    buttonFrame.appendChild(stop);
    videoFrame.appendChild(video);
    buttonFrame.appendChild(mute);
    buttonFrame.className = "buttonFrame";
    videoFrame.appendChild(buttonFrame);
    $("#chatTab" + nickname).append(videoFrame)
    $("#chatTab" + nickname).clearQueue();
    $("#chatTab" + nickname).animate({ scrollTop: $('#chatTab' + nickname).prop("scrollHeight") }, 1000);
    var close = document.getElementById("chatTabMenuItemCloseButton" + nickname); 
    close.removeEventListener("click", deleteChatTabHelper);
    close.addEventListener("click", closeVideoLocal);
    close.addEventListener("click", deleteChatTabHelper);
}