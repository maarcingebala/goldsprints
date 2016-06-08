import $ from 'jquery';


function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius*0.15 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  for(num = 1; num < 13; num++){
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
}

function drawFace(ctx, radius) {
  var grad;
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
  position = (position * Math.PI / 30);
  drawHand(ctx, position, radius * 0.9, radius * 0.02);
}

function drawClock(ctx, radius, position) {
  drawFace(ctx, radius);
  drawTime(ctx, radius, position);
}

function createWebsocketClient($info, ctx, radius) {
  var client = new WebSocket("ws://localhost:8765/");

  client.onmessage = function (event) {
    var data = JSON.parse(event.data);
    drawClock(ctx, radius, data.position);
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
      createWebsocketClient($info, ctx, radius);
    }, 2500);
  };
}

$(document).ready(function() {
  var $info = $('#info');
  var $canvas = $("#canvas")[0];
  var ctx = $canvas.getContext("2d");
  var radius = $canvas.height / 2;
  ctx.translate(radius, radius);
  radius = radius * 0.90;

  createWebsocketClient($info, ctx, radius);
});
