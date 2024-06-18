
function RTC(obj) {
    var tracks = {}
    var peerConnection;
    var localStream = obj.stream != undefined ? (Array.isArray(obj.stream) ? obj.stream : [obj.stream]) : [];
    if (obj.stream)
        start(true)
    function start(isself) {
        peerConnection = new RTCPeerConnection();
        peerConnection.onicecandidate = gotIceCandidate;
        if (obj.onstream) {
            peerConnection.ontrack = trackRecive
        }
        for (var ls of localStream) {
            if (!tracks[ls.id])
                tracks[ls.id] = []
            for (const track of ls.getTracks()) {
                tracks[ls.id].push(peerConnection.addTrack(track, ls));
            }
        }
        if (isself) {
            peerConnection.createOffer().then(createdDescription).catch(errorHandler);
        }
    }
    function trackRecive(e) {
        tracks[e.streams[0].id] = e.transceiver;
        obj.onstream(e.streams[0])
    };
    function gotIceCandidate(event) {
        if (event.candidate != null) {
            obj.onreq({ ty: 2, data: event.candidate });
        }
    }
    function createdDescription(description) {
        peerConnection.setLocalDescription(description).then(function () {
            obj.onreq({ ty: 1, data: peerConnection.localDescription });
        }).catch(errorHandler);
    }
    function errorHandler(err) {
        console.log(err)
        // hangup()
        // setTimeout(() => {
        //     obj.onreq({ ty: 5 });
        // }, 9000);
    }

    function setdata(signal) {
        if (!peerConnection) start(false);
        if (signal.ty == 1) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(signal.data)).then(function () {
                if (signal.data.type == 'offer') {
                    peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
                }
            }).catch(errorHandler);
        } else if (signal.ty == 2) {
            var icec = new RTCIceCandidate(signal.data)
            peerConnection.addIceCandidate(icec).catch(errorHandler);
        } else if (signal.ty == 3) {
            hangup()
        } else if (signal.ty == 4 && signal.id) {
            removetrack(signal.id)
            if (obj.onremovestream) {
                obj.onremovestream(signal.id)
            }
        } else if (signal.ty == 5) {
            hangup(true)
            if (obj.stream)
                start(true)
        }
    }
    function hangup(e) {
        if (!peerConnection)
            return
        // for (var ls of localStream) {
        //     ls.getTracks().forEach(function (track) {
        //         track.stop();
        //     });
        // }
        localStream = [];
        peerConnection.close();
        peerConnection = undefined;
        if (e != true && obj.onclose)
            obj.onclose(true)
    }
    function closefun() {
        hangup(true)
        obj.onreq({ ty: 3 });
    }
    function addstream(ls) {
        if (!peerConnection)
            return
        if (!tracks[ls.id])
            tracks[ls.id] = []
        for (const track of ls.getTracks()) {
            try {
                tracks[ls.id].push(peerConnection.addTrack(track, ls));
            } catch (e) { }
        }
        localStream.push(ls)
        peerConnection.createOffer().then(createdDescription).catch(errorHandler);
    }
    function removetrack(ls) {
        if (!peerConnection || !(ls in tracks))
            return
        if ("stop" in tracks[ls]) {
            tracks[ls].stop();
        } else {
            try {
                for (const track of tracks[ls]) {
                    peerConnection.removeTrack(track);
                }
            } catch (e) { }
        }
        delete tracks[ls]
        if (Object.keys(tracks).length == 0) {
            hangup()
        }
    }
    function removestream(ls) {
        removetrack(ls);
        obj.onreq({ ty: 4, id: ls });
    };
    return {
        setdata: setdata,
        close: closefun,
        addstream: addstream,
        removestream: removestream
    }
}
