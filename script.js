var NUM_SHADES = 20;
var dx = 400;
var dy = 400;
var neg = "#f59322";
var neut = "#e8eaeb";
var pos = "#0877bd";

function generate_data(numPoints) {
  var dataPoints = [];
  for (var i = 0; i < numPoints; i++) {
    dataPoints.push({x: Math.random() * dx, y: Math.random() * dy, v: Math.sign(Math.random() - 0.5)});
  }
  return dataPoints;
}

function plot_data(dataPoints) {

  var tmpScale = d3.scale.linear()
      .domain([0, .5, 1])
      .range([pos, neut, neg])
      .clamp(true);

  var colors = d3.range(0, 1 + 1E-9, 1/NUM_SHADES).map(function(a) {
    return tmpScale(a);
  });

  var data = [];
  for (var i=0; i < dx; i++) {
    data[i] = [];
    for (j=0; j < dy; j++) {
      data[i][j] = 0;
    }
  }

  for (var p=0; p < dataPoints.length; p++) {
    var d = dataPoints[p];
    for (var i=0; i < dx; i++) {
      for (var j=0; j < dy; j++) {
        data[i][j] += d.v * Math.exp(-(i - d.x) * (i - d.x) / dx - (j - d.y) * (j - d.y) / dy)
      }
    }
  }
  var color = d3.scale.quantize().domain([-1, 1]).range(colors);
  var canvas = document.getElementById("myCanvas");
  canvas.width = dx;
  canvas.height = dy;
  var context = canvas.getContext("2d");
  var image = context.createImageData(dx, dy);
  for (var y = 0, p = -1; y < dy; ++y) {
    for (var x = 0; x < dx; ++x) {
      var value = data[x][y];
      var c = d3.rgb(color(value))
      image.data[++p] = c.r;
      image.data[++p] = c.g;
      image.data[++p] = c.b;
      image.data[++p] = 160;
    }
  }
  context.putImageData(image, 0, 0);
}

function updatePoints(points) {
  document.getElementById('nPoints').innerHTML = points;
  plot_data(generate_data(points));
}

updatePoints(50);
