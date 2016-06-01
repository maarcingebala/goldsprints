import $ from 'jquery';

$(document).ready(function() {
  var ws = new WebSocket("ws://localhost:8765/");
  ws.onmessage = function (event) { console.log(event.data); }
});
