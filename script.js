const PRE = "DELTA"
const SUF = "MEET"
var room_id;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
var screenStream;
var peer = null;
var currentPeer = null;
var screenSharing = false;
let host = false;
document.getElementById("room-input").value = "";

let urlParams = new URLSearchParams(window.location.search);
let idURL = urlParams.get('id');

if (idURL) {
    document.getElementById("room-input").value = idURL;
    joinRoom();
}
function createRoom() {
    host = true;
    console.log("Creating Room")
    let room = document.getElementById("room-input").value;


    // if (room == " " || room == "") {
    //     alert("Please enter room number")
    //     return;
    // }
    room_id = PRE + room + SUF;
    peer = new Peer()

    peer.on('open', (id) => {
        console.log("Peer Connected with ID: ", id)
        hideModal()
        console.log(`${window.location.href}?id=${id}`)
        document.getElementById("linkId").innerText = `${window.location.href}?id=${id}`;
        createQR(`${window.location.href}?id=${id}`);
        // getUserMedia({ video: false, audio: false }, (stream) => {
        //     local_stream = stream;
        //     setLocalStream(local_stream)
        // }, (err) => {
        //     console.log(err)
        // })
        notify("Waiting for peer to join.")
    })
    peer.on('call', (call) => {
        call.answer(local_stream);
        call.on('stream', (stream) => {
            setRemoteStream(stream)
        })
        currentPeer = call;
    })
}

function setLocalStream(stream) {

    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}
function setRemoteStream(stream) {

    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
}

function hideModal() {
    document.getElementById("entry-modal").hidden = true
}

function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
        notification.hidden = true;
    }, 3000)
}

function joinRoom() {
    console.log("Joining Room")
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }
    room_id = room;
    hideModal()
    peer = new Peer()
    peer.on('open', (id) => {
        console.log("Connected with Id: " + id)

        getUserMedia({ video: true, audio: false  }, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream)
            notify("Joining peer")
            let call = peer.call(room_id, stream)
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            })
            currentPeer = call;
        }, (err) => {
            console.log(err)
        })

    })
}

function record() {

}
function createQR(id){
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: id,
        width: 128,
        height: 128,
        correctLevel: QRCode.CorrectLevel.L
    });

}
