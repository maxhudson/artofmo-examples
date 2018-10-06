var run = () => {
  mo.colors.fetch({samples: [[88, 164, 176], [55, 63, 81], [218, 164, 154]], count: 10}).then(colors => {
    var customColors = ["rgb(89, 165, 177)","rgb(55, 65, 82)","rgb(221, 165, 156)","rgb(245, 229, 199)","rgb(233, 217, 120)"];

    //["rgb(89, 165, 177)","rgb(55, 65, 82)","rgb(221, 165, 156)","rgb(245, 229, 199)","rgb(233, 217, 120)"]
    //["rgb(234, 195, 71)","rgb(92, 129, 190)","rgb(52, 96, 164)","rgb(114, 156, 144)","rgb(188, 172, 119)"]

    colors = customColors || colors;

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500},
      images: {
        rock: '../../assets/images/circle-1.png'
      }
    }).then(({sum, difference, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var offset = {x: -size.width / 2, y: size.height / 2};
      var mountains = {count: 5 + randInt(5)};

      _.times(mountains.count, m => {
        var scale = 1 + rand(1);
        var rawWidth = (size.width / mountains.count) * 1;
        var width = rawWidth * scale;

        var mountain = {
          size: {width, height: width * (0.5 + rand(0.2, -0.1))}
        };

        mountain.zIndex = -mountain.size.height;
        mountain.position = {x: rawWidth * (m + 0.5 + rand(0.4, -0.5)) * 0.5, y: -mountain.size.height};

        var ridges = {count: 9, groundCenter: {x: rand(mountain.size.width / 4, -0.5), y: mountain.size.height}};

        ridges.spacing = mountain.size.width / ridges.count;

        _.times(ridges.count, r => {
          var radius = mountain.size.width - (mountain.size.width * 0.2 * (r - ridges.count / 2));

          var ridge = {
            type: 'shape',
            shape: 'path',
            stroke: '#ffffff',
            fill: _.sample(colors),
            zIndex: mountain.zIndex * 10 + Math.abs(r / 2 - r),
            position: sum(mountain.position, {x: 0, y: 0}),
            strokeWidth: 1,
            strokeWidth: 0.5
          };

          var scalar = (r < ridges.count / 2 ? -1 : 1);
          var transform = {x: scalar * radius, y: mountain.size.height};
          var groundCenter = {...ridges.groundCenter};
          var randFactor = mountain.size.width / 40;

          var isLeftCenter = r === _.floor(ridges.count / 2);
          if (isLeftCenter) {
            groundCenter.x += 15;

            ridge.zIndex += 2;
          }

          var bumps = {count: 5};

          var points = [
            groundCenter,

            ..._.times(bumps.count, t => sum(
              product(groundCenter, 1 / bumps.count * (t + 1)),
              randPoint({x: isLeftCenter ? randFactor * 2 : 3, y: 0}, -0.5))
            ).reverse(),

            {x: 0, y: 0},

            ..._.times(bumps.count, t => sum(
              product(transform, 1 / bumps.count * (t + 1)),
              randPoint({x: randFactor, y: randFactor * 4}))
            ),

            transform
          ];


          ridge.position = sum(ridge.position, offset, {x: mountain.position.x});

          ridge.commands = mo.g.pathCommands.forCurveThrough({points, smoothing: 1});

          ridge.object = new mo.FabricCanvasObject(ridge);

          canvasView.add(ridge);
        });
      });

      render();
    });
  });
};

export default {run};
