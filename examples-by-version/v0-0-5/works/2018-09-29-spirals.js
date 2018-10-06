var run = () => {
  mo.colors.fetch({samples: [[113, 97, 239], [239, 217, 206], [222, 192, 241]], count: 5}).then(colors => {
    var customColors;

    colors = customColors || colors;

    console.log(colors); //eslint-disable-line

    mo.ui.init.basic({
      backgroundColor: colors[0],
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, min, max, rand, randInt, render, canvasView, size, images}) => { //eslint-disable-line
      _.pullAt(colors, 0);

      var plants = {count: 5, spacing: 30};

      _.times(plants.count, p => {
        var plant = {
          position: {x: p * plants.spacing - (plants.count - 1) * plants.spacing / 2, y: rand(100) - 50},
        };

        var {positions} = mo.g.positions.spiral({count: 1000, a: 0, b: 3});

        positions.forEach(position => {
          var distanceFromCenter = Math.abs(position.y);
          var permitY = randInt(1 + max(0, distanceFromCenter - 50) / 20) === 0;

          if (permitY) {
            var circle = {
              type: 'shape',
              shape: 'circle',
              position: sum(position, plant.position),
              radius: 1,
              fill: _.sample(colors)
            };

            canvasView.add({object: new mo.FabricCanvasObject(circle)});
          }
        });
      });

      render();
    });
  });
};

export default {run};
