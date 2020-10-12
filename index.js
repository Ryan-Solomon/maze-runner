const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;
const cells = 3;

const unitLength = width / cells;

const engine = Engine.create();
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
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })
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
                isStatic: true
            }
        );
        World.add(world, wall)
        
    })

});

const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength / 2,
    unitLength * .7,
    unitLength * .7,
    {
        isStatic: true
    }

)

World.add(world, goal)
