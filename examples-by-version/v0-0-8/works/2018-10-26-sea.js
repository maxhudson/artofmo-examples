var run = () => {
  //mo.colors.fetch({samples: [[208, 225, 212], [228, 190, 158], [242, 246, 208], [228, 190, 158], [217, 210, 182]], count: 5}).then(colors => {
    var customColors= ['#ffeede', '#ffdddc', '#feeecc', '#fececa'];
    // var customColors = [[248, 226, 217], [160, 140, 157], [126, 122, 144], [125, 123, 142]].map(([a, b, c]) => {
    //   return `rgba(${a + (255 - b) * 0.7}, ${b + (255 - b) * 0.7}, ${c + (255 - c) * 0.7})`;
    // });
    var colors = customColors || colors;

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var blotches = {rows: 20};
      var offset = {x: -size.width / 2, y: -size.height / 2};

      blotches.count = blotches.rows ** 2;
      blotches.spacing = size.width / (blotches.rows - 10);

      _.times(blotches.rows, x => {
        _.times(blotches.rows, y => {
          var blotch = {
            position: sum(offset, {
              x: blotches.spacing * (x + 0.5) + rand(blotches.spacing * 3, -0.5),
              y: blotches.spacing * (y + 0.5) + rand(blotches.spacing * 3, -0.5)}),
            shape: 'path',
            points: [],
            fill: colors[Math.floor(y / colors.length)],
            vertices: 10 + randInt(10),
            radius: blotches.spacing * 3 * (0.3 + rand(0.9)),
            opacity: 0.5 + rand(0.4)
          };

          blotch.zIndex = 1 - blotch.radius

          _.times(blotch.vertices, b => {
            var alpha = Math.PI * 2 / blotch.vertices * (b + rand(1, -0.2));
            var radius = blotch.radius + rand(blotch.radius, -0.5) * 0.1;

            blotch.points.push({
              x: Math.cos(alpha) * radius + rand(20),
              y: Math.sin(alpha) * radius + rand(20)
            });
          });

          blotch.points.push(blotch.points[0]);
          blotch.commands = mo.g.pathCommands.forCurveThrough({points: blotch.points, smoothing: 1.2, });
          blotch.object = new mo.FabricCanvasObject({...blotch});

          canvasView.add(blotch);
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
