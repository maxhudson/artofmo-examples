var run = () => {
  //mo.colors.fetch({samples: [[208, 225, 212], [228, 190, 158], [242, 246, 208], [228, 190, 158], [217, 210, 182]], count: 5}).then(colors => {
    var customColors= ['black', 'rgb(255,255, 0)', 'rgb(0, 255, 255)', 'rgb(255, 0, 255)'];
    var colors = customColors || colors;

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var circles = {rows: 8};
      var offset = {x: -size.width / 2, y: -size.height / 2};

      circles.spacing = size.width / circles.rows;

      _.times(circles.rows, x => {
        _.times(circles.rows, y => {
          if (rand() < 0.5) {
            var circle = {
              position: sum(offset, {
                x: circles.spacing * (x + 0.5),
                y: circles.spacing * (y + 0.5)
              }),
              shape: 'circle',
              points: [],
              fill: 'black',
              radius: 3,
              opacity: 1,
              zIndex: 5
            };

            circle.object = new mo.FabricCanvasObject({...circle});

            canvasView.add(circle);

            var size = 2 + rand(5);

            _.times(3, i => {
              var ring = {
                shape: 'path',
                position: circle.position,
                zIndex: 5 - (i + 1),
                vertices: 5,
                radius: (i + 2) * size,
                points: [],
                fill: _.sample(colors),
                opacity: 0.4,
                rotation: randInt(360)
              };

              _.times(ring.vertices, b => {
                var alpha = Math.PI * 2 / ring.vertices * b;
                var radius = ring.radius + rand(ring.radius, -0.5) * 0.3;

                ring.points.push({
                  x: Math.cos(alpha) * radius,
                  y: Math.sin(alpha) * radius
                });
              });

              ring.points.push(ring.points[0]);

              ring.commands = mo.g.pathCommands.forCurveThrough({points: ring.points, smoothing: 2});
              ring.object = new mo.FabricCanvasObject({...ring});

              canvasView.add(ring);
            });
          }
        });
      });

      var lines = {count: 10, height: 10, spacing: 20};

      _.times(lines.count, l => {
        if (rand(1) < 0.4) {
          var line = {
            shape: 'path',
            vertices: 6 + randInt(3),
            position: sum(offset, {x: 0, y: 20}, {x: 0, y: (l + rand(0.5, -0.5)) * lines.spacing}),
            fill: 'black',
            opacity: 0.2 + rand(0.5)
          };

          var pointsFrom = [];
          var pointsTo = [];

          var width = size.width - l * (30 + rand(20, -0.5));

          _.times(line.vertices, v => {
            var spacing = width / (line.vertices - 1);
            var x = (v - rand(0.5)) * spacing;
            var radius = 10;

            pointsFrom.push({x, y: radius * -0.2 + -(radius * rand(0.5))});
            pointsTo.unshift({x, y: radius * rand(1.5)});
          });

          line.points = [...pointsFrom, ...pointsTo];

          line.commands = mo.g.pathCommands.forCurveThrough({points: line.points, smoothing: 1.4, });
          line.object = new mo.FabricCanvasObject({...line});

          canvasView.add(line);
        }
      });

      render();
    });
  //});
};

export default {run};
