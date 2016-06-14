import $ from 'jquery';


function drawFace(ctx, radius) {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.lineWidth = radius*0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0,0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}

function drawTime(ctx, radius, position) {
  position = (position * 2 * Math.PI / 250); // 250m
  drawHand(ctx, position, radius * 0.9, radius * 0.02);
}

function drawClock(ctx, radius, position) {
  drawFace(ctx, radius);
  drawTime(ctx, radius, position);
}

function createWebsocketClient(ctx, radius, $info, $speed) {
  var client = new WebSocket("ws://localhost:8765/");

  client.onmessage = function (event) {
    var data = JSON.parse(event.data);
    drawClock(ctx, radius, data.position);
    $speed.text(`${data.speedKmh} km/h | ${data.position} m`);
  };

  client.onopen = function (event) {
    $info.text('Connected');
  };

  client.onerror = function (event) {
    $info.text('Error');
  };

  client.onclose = function (event) {
    $info.text('Connection closed');
    setTimeout(function () {
      createWebsocketClient(ctx, radius, $info, $speed);
    }, 2500);
  };
}

$(document).ready(function() {
  var $info = $('#info');
  var $speed = $("#speed");
  var $canvas = $("#canvas")[0];

  var ctx = $canvas.getContext("2d");
  var radius = $canvas.height / 2;
  ctx.translate(radius, radius);
  radius = radius * 0.9;

  createWebsocketClient(ctx, radius, $info, $speed);
});
