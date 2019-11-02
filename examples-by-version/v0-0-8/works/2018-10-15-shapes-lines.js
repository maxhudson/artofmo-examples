var run = () => {
  //mo.colors.fetch({samples: [[70, 99, 101]], count: 10}).then(colors => {
    var customColors = ["rgb(70, 98, 101)","rgb(163, 179, 139)","rgb(232, 210, 138)"];

    //["rgb(220, 28, 25)","rgb(243, 142, 45)","rgb(234, 183, 77)","rgb(132, 142, 81)","rgb(37, 31, 39)"]
    //["rgb(66, 98, 99)","rgb(139, 129, 105)","rgb(197, 154, 107)","rgb(202, 155, 102)","rgb(205, 158, 94)"]

    var colors = customColors || colors;

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var solids = [];
      var offset = {x: size.width / -2, y: size.height / -2};
      var counterOffset = product(offset, -1);

      _.times(2, s => {
        var diameter = size.width / 5 * (0.5 + rand(1));

        var solid = {
          type: 'shape',
          shape: 'path',
          vertices: 3 + s,
          position: sum({x: rand(size.width * 0.5, -0.5), y: rand(size.width * 0.5, -0.5)}),
          fill: colors[s],
          stroke: 'white',
          commands: [],
          points: [],
          closed: true,
          zIndex: 2,
          rotation: 45 + randInt(90)
        };

        var alpha = 360 / solid.vertices;
        var point = {x: 0, y: 0};

        _.times(solid.vertices, v => {
          solid.commands.push({point});
          solid.points.push(point);

          point = mo.util.trig.translate({point, by: diameter, alpha: alpha * v});
        });

        solid.points = _.map(solid.points, point => mo.util.trig.rotate({point, byDegrees: solid.rotation}));

        solid.object = new mo.FabricCanvasObject({...solid});

        canvasView.add(solid);
        solids.push(solid);
      });

      var lines = {count: 60};

      var solidPoints = _.sortBy(_.flatten(_.map(solids, solid => _.map(solid.points, point => sum(solid.position, point, counterOffset)))), ({x}) => x);

      _.times(lines.count, l => {
        var line = {
          type: 'shape',
          shape: 'path',
          stroke: 'white',
          points: [],
          zIndex: 1,
          strokeDashArray: [1, 2],
          position: sum(offset, {x: 0, y: (l + 0.5) * size.height / lines.count})
        };

        line.points.push({x: -20, y: 0});
        line.points.push({x: 0, y: 0});

        solidPoints.forEach(point => {
          var linePoint = sum(line.position, counterOffset);
          var lastLinePoint = sum(linePoint, _.last(line.points));

          if (Math.abs(lastLinePoint.y - point.y) < 50) {
            line.points.push({x: point.x, y: point.y - linePoint.y});
          }
        });

        line.points.push({x: size.width, y: 0});
        line.points.push({x: size.width + 20, y: 0});

        line.commands = mo.g.pathCommands.forCurveThrough({points: line.points, smoothing: 2});

        line.object = new mo.FabricCanvasObject({...line});

        canvasView.add(line);
      });

      render();
    });
  //});
};

export default {run};
