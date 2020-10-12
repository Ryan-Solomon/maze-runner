const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const width = 600;
const height = 600;
const cells = 3;

const unitLength = width / cells;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
    width,
    height
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true })
];
World.add(world, walls);

// Maze Generation

const shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        const idx = math.floor(Math.random() * counter)
        counter--;
        const tmp = arr[counter]
        arr[counter] = arr[idx]
        arr[idx] = tmp
    }
    return arr;
}

const grid = new Array(cells).fill(null).map(() => new Array(cells).fill(false))
const verticals = new Array(cells).fill(null).map(() => new Array(cells - 1).fill(false))
const horizontals = new Array(cells).fill(null).map(() => new Array(cells - 1).fill(false))

const startRow = Math.floor(Math.random() * cells)
const startCol = Math.floor(Math.random() * cells)

const stepThroughCell = (row, col) => {
    if (grid[row][col]) return;
    grid[row][col] = true;
    
    const neighbors = shuffle([
        [row - 1, col, 'up'],
        [row, col + 1, 'right'],
        [row + 1, col, 'down'],
        [row, col - 1, 'left']
    ]);

    for (let neighbor of neighbors) {
        const [nxtRow, nxtCol, direction] = neighbor;
        if (nxtRow < 0 || nxtRow >= cells || nxtCol < 0 || nxtCol >= cells) continue;

        if (grid[nxtRow][nxtCol]) continue;
       
        if (direction === 'left') {
            verticals[row][col - 1] = true;
        } else if (direction === 'right') {
            verticals[row][col] = true;
        } else if (direction === 'up') {
            horizontals[row - 1][col] = true;
        } else if (direction === 'down') {
            horizontals[row][col] = true;
        }
    }

stepThroughCell(nxtRow,nxtCol)




}

stepThroughCell(startRow, startCol)

horizontals.forEach((row) => {
    row.forEach((open) => {
        if (open) return;
        
        const wall = Bodies.rectangle(

            colIdx * unitLength + unitLength / 2,
            rowIdx * unitLength + unitLength,
            unitLength,
            10,
            {
                label: 'wall',
                isStatic: true
            }
        );
        World.add(world, wall)
    })
})

verticals.forEach((row, rowIdx) => {
    row.forEach((open, colIdx) => {
        if (open) {
            return;
        }
        const wall = Bodies.rectangle(
            colIdx * unitLength + unitLength,
            rowIdx + unitLength + unitLength / 2,
            10,
            unitLength,
            {
                label: 'wall',
                isStatic: true
            }
        );
        World.add(world, wall)
        
    })

});

// Goal

const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength / 2,
    unitLength * .7,
    unitLength * .7,
    {
        isStatic: true,
        label: 'goal'
    }

)

World.add(world, goal)

// Ball

const ball = Bodies.circle(
    unitLength / 2,
    unitLength / 2,
    unitLength / 4, {
        label: 'ball'
    }

)

World.add(world, ball)


document.addEventListener('keydown', event => {


    const { x, y } = ball.velocity;



    if (event.keyCode === 87) {
        Body.setVelocity(ball, {x,y: y - 5})
    }
    if (event.keyCode === 68) {
        Body.setVelocity(ball, {x: x+5,y})
        
    }
    if (event.keyCode === 83) {
        Body.setVelocity(ball, {x,y: y + 5})
        
    }
    if (event.keyCode === 65) {
        Body.setVelocity(ball, {x: x - 5,y})
    }
    
})

// Win Condition

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach((collision) => {
        const labels = ['ball', 'goal']

        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            world.gravity.y = 1;
            world.bodies.forEach((body) => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            })
        }
    })
})