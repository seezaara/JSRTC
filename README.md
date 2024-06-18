
 
# JSRTC
a simple plugin for create peer to peer connection in browser by javascript

## usage 

 - add sript to the HTML document
	```html
	<script src="./functions.js"></script>
	```
- call main function 
	```js
	var rtc = JSRTC(options)
	```
- options
	- `stream`:  a  [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) object to broadcast 
	- `onstream`: a function event for getting broadcasted stream 
	- `onclose`: a function event is fired when RTC is closing
	- `ondata`: a function event for getting data for connecting to the other client by using `setdata()`
	-  `onremovestream`: a function event fired when a stream was removed
- return
- `setData()`: for setting data that you get on the other client (parameter object)
- `close()`: to close the RTC connection
- `addStream()`: to add more  [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)  to the RTC  connection  (parameter MediaStream)
- `removeStream()` to remove a stream from the RTC connection

## example
use this code to transmit a stream :
```js
var rtc = JSRTC({
    ondata: function (e) {
        console.log(JSON.stringify(e))
    }
})

navigator.mediaDevices.getDisplayMedia({
    video: {
        cursor: "always"
    },
    audio: true
}).then(function (e) {
    rtc.addStream(e)
    rtc.start()
});

//also you must use `rtc.setData(...)` function to set that data you get in receive`console.log`
// rtc.setData(...)
```


use this code to receive a that stream :
```js
var rtc = JSRTC({
    ondata: function (e) {
        console.log(JSON.stringify(e))
    },
    onstream: function () {
	const video = document.createElement('video');
	document.body.appendChild(video)
	const stream = video.captureStream();
	peer.addStream(stream);
    }
})
// also you must use `rtc.setData(...)` function to set that data you get in transmitter `console.log`
// rtc.setData(...)
```
