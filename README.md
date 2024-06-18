 
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
- `setData()`: for setting data that you get on the other client
- `close()`: to close the RTC connection
- `addStream()`: to add more  [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)  to the RTC  connection 
- `removeStream()` to remove a stream from the RTC connection

## example 
