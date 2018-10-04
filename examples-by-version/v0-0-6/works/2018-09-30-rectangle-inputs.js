var run = () => {
  mo.colors.fetch({samples: [[0, 0, 0]], count: 10}).then(colors => {
    var customColors;

    colors = customColors || colors;

    console.log(colors); //eslint-disable-line

    mo.ui.init.basic({
      backgroundColor: colors[0],
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, min, max, rand, randInt, render, canvasView, size, images}) => { //eslint-disable-line
      _.pullAt(colors, 0);

      var rects = {
        rows: 6,
        columns: 7,
        spacing: 24,
        size: {width: 31, height: 60},
        offset: {
          x: -size.width / 2 + size.width / 3 + 2 - 41,
          y: -size.height / 2 + 10
        }
      };

      _.times(rects.rows, y => {
        _.times(rects.columns, x => {
          var rect = {
            position: sum(rects.offset, {
              x: x * (rects.size.width + rects.spacing),
              y: y * (rects.size.height + rects.spacing)
            }),
            rotation: rand(3) - 1.5,
            size: rects.size,
            x, y
          };

          var baseRect = {
            type: 'shape',
            shape: 'rect',
            color: _.sample(colors),
            strokeWidth: 2,
            zIndex: 1,
            ...rect,
            position: sum(rect.position, {x: rect.size.width / 2, y: rect.size.height / 2})
          };

          baseRect.stroke = baseRect.color;

          if (randInt(4) === 0) {
            baseRect.fill = baseRect.color;
          }
          else {
            var circles = {rows: 4, columns: 2, fill: !randInt(2)};

            _.times(circles.columns, x => {
              _.times(circles.rows, y => {
                var circle = {
                  type: 'shape',
                  shape: 'circle',
                  radius: 4 - rand(2),
                  position: sum(rect.position, {x: 10, y: 10}, {x: x * 10, y: y * 13}, {x: rand(1) - 0.5, y: rand(1) - 0.5}),
                  strokeWidth: 2,
                  zIndex: 1,
                  color: _.sample(colors)
                };

                circle.stroke = circle.color;

                if (circles.fill) circle.fill = circle.stroke;

                canvasView.add({object: new mo.FabricCanvasObject(circle)});
              });
            });
          }

          baseRect.object = new mo.FabricCanvasObject(baseRect);

          baseRect.object.fabricObject.set({rx: 1, ry: 1});

          canvasView.add(baseRect);

          //sinew paths
          if (rect.x < rects.columns - 1 && rect.y < rects.rows - 1) {
            var commands = [];

            _.times(35, x => commands.push({point: {x: x * 1, y: Math.sin(x) * 1}}));

            var sinew = {
              type: 'shape',
              shape: 'path',
              stroke: _.sample(colors),
              rotation: 45,
              zIndex: -1,
              position: {x: rect.position.x + rect.size.width, y: rect.position.y + rect.size.height},
              commands
            };

            sinew.object = new mo.FabricCanvasObject(sinew);

            canvasView.add(sinew);

            sinew.object.fabricObject.set({width: 10, height: 10}).setCoords();
          }
        });
      });

      render();
    });
  });
};

export default {run};
