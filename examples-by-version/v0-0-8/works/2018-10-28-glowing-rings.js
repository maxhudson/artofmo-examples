var run = () => {
  mo.colors.fetch({samples: [[123, 158, 135]], count: 5}).then(colors => {
    var customColors = ["rgb(245, 177, 43)","rgb(226, 177, 110)","rgb(167, 137, 95)","rgb(102, 95, 92)","rgb(60, 61, 73)"];
    var colors = customColors || colors;
    var originalColors = _.clone(colors); //eslint-disable-line;

    //["rgb(245, 177, 43)","rgb(226, 177, 110)","rgb(167, 137, 95)","rgb(102, 95, 92)","rgb(60, 61, 73)"]
    //["rgb(245, 177, 43)","rgb(226, 177, 111)","rgb(170, 140, 98)","rgb(106, 98, 94)","rgb(59, 63, 73)"]

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var rings = {count: 20};

      rings.spacing = size.width / (rings.count * 0.5);

      _.times(rings.count, r => {
        if (r > -1) {
          var ring = {
            vertices: 1 + (r + 1) * 2,
            position: {x: 0, y: 0},
            stroke: 'white',
            points: [],
            shape: 'path',
            zIndex: 1,
            closed: true,
            strokeWidth: 2,
          };

          var rotation = rand(Math.PI * 2);

          _.times(ring.vertices + 1, v => {
            var angle = (Math.PI * 2) / ring.vertices * v + rotation;
            var radius = (r + 1) * rings.spacing;
            var point = product({x: Math.cos(angle), y: Math.sin(angle)}, radius);

            ring.points.push({smoothing: 0.2 + rand(0.2), ...point});

            if (v > 0) {
              canvasView.add({
                object: new mo.FabricCanvasObject({
                  shape: 'circle',
                  radius: 5 + rand(2) + (rand() < 0.3 ? 5 : 0) + (rand() < 0.2 ? 15 + rand(10) : 0),
                  position: point,
                  stroke: 'white',
                  strokeDashArray: [3, 5],
                  fill: _.sample(colors),
                  strokeWidth: 1,
                  zIndex: 2,
                  // shadow: {
                  //   color: 'white',
                  //   blur: 10
                  // }
                })
              });
            }
          });

          ring.commands = mo.g.pathCommands.forCurveThrough({points: ring.points, smoothing: 0});
          ring.object = new mo.FabricCanvasObject({...ring});

          canvasView.add(ring);
        }
      });

      render();
    });
  });
};

export default {run};
