var run = () => {
  mo.colors.fetch({samples: [[255, 255, 255]], count: 10}).then(colors => {
    var customColors = ["rgb(20, 25, 28)", "rgb(96, 120, 58)", "rgb(144, 141, 62)", "rgb(191, 158, 106)", "rgb(155, 42, 20)"];

    //["rgb(155, 28, 12)", "rgb(210, 211, 155)", "rgb(124, 140, 120)", "rgb(111, 144, 122)", "rgb(156, 174, 99)"]
    //["rgb(12, 12, 10)", "rgb(38, 48, 48)", "rgb(139, 148, 127)", "rgb(159, 161, 121)", "rgb(144, 105, 63)"]
    //["rgb(20, 25, 28)", "rgb(96, 120, 58)", "rgb(144, 141, 62)", "rgb(191, 158, 106)", "rgb(155, 42, 20)"]
    //["rgb(20, 20, 22)", "rgb(44, 65, 63)", "rgb(165, 172, 145)", "rgb(215, 205, 158)", "rgb(190, 106, 33)"]
    //["rgb(10, 10, 11)", "rgb(40, 22, 25)", "rgb(96, 146, 131)", "rgb(205, 200, 154)", "rgb(223, 90, 21)"]
    //["rgb(23, 20, 26)", "rgb(25, 44, 59)", "rgb(106, 88, 92)", "rgb(216, 162, 150)", "rgb(211, 168, 87)"]

    colors = customColors || colors;

    console.log(colors); //eslint-disable-line

    mo.ui.init.basic({
      backgroundColor: colors[0],
      containerId: 'mo-container',
      size: {width: 500, height: 500},
      images: {
        rock: '../../assets/images/circle-1.png'
      }
    }).then(({sum, min, max, rand, randInt, render, canvasView, size, images}) => { //eslint-disable-line
      _.pullAt(colors, 0);

      var offset = {x: -250 + size.width * 0.05, y: 0};
      var rocks = {count: 20};

      rocks.spacing = size.width * 0.9 / rocks.count;

      _.times(rocks.count, r => {
        var width = rocks.spacing / 2 + rand(rocks.spacing);

        var rock = {
          type: 'image',
          image: images.rock,
          position: sum(offset, {
            x: r * rocks.spacing + rand(10, -0.5),
            y: rand(size.width / 3, -1) + r ** 1.5 * 2,
          }),
          zIndex: 1,
          rotation: _.sample([0, 180]),
          fill: _.sample(colors),
          size: {width, height: width - rand(width / 3)},
        };

        canvasView.add({object: new mo.FabricCanvasObject(rock)});

        //sinew paths
        var sinews = {count: 11};

        sinews.spacing = (size.height / 2 - rock.position.y) / sinews.count * (1 + rand(0.5));

        _.times(sinews.count, s => {
          var plainOffset = (s - sinews.count) * sinews.spacing / 2;

          var sinew = {
            type: 'shape',
            shape: 'path',
            stroke: _.sample(colors),
            zIndex: rock.position.y - size.height / 2,
            position: sum(rock.position, {x: 0, y: 0}),
            strokeWidth: 1
          };

          sinew.commands = mo.g.pathCommands.forCurveThrough({points: [
            {x: 0, y: 0},
            {x: rock.position.x + plainOffset * 0.1, y: size.height * 0.2 - rock.position.y},
            {x: rock.position.x + plainOffset * 0.5, y: size.height * 0.5 - rock.position.y}
          ]});

          sinew.object = new mo.FabricCanvasObject(sinew);

          canvasView.add(sinew);
        });
      });

      render();
    });
  });
};

export default {run};
