const { stringify } = require('./utils')

const isWithinRange = (start, end, value) => value >= start && value <= end
const isFirstOrLast = (start, end, value) => value === start || value === end
const isLineCell = cell => cell === 'x'

const isOnCanvas = (x, y, width, height) =>
    isWithinRange(0, width, x) && isWithinRange(0, height, y)

const getAdjacentCells = (x, y) => [
    { x: x - 1, y: y - 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y },
    { x: x + 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
]

const createMatrix = (width, height) => 
    new Array(height).fill(' ').map(() => new Array(width).fill(' '))

const addLine = ([x1, y1, x2, y2], canvas) =>
    canvas.map((row, i) =>
        isWithinRange(y1, y2, i) // only update row within specified range of coordinates
            ? row.map((cell, i) => (isWithinRange(x1, x2, i) ? 'x' : cell)) // same for cells
            : row)

const addRectangle = ([x1, y1, x2, y2], canvas) =>
    canvas.map((row, i) =>
        isWithinRange(y1, y2, i) // only update rows within specified range of coordinates
            ? isFirstOrLast(y1, y2, i) // rows which are neither first neither last will only have first and last cells filled with 'x'
                ? row.map((cell, i) => (isWithinRange(x1, x2, i) ? 'x' : cell))
                : row.map((cell, i) =>
                    isWithinRange(x1, x2, i) && isFirstOrLast(x1, x2, i) ? 'x' : cell)
            : row)

const applyBucketFill = ([x, y], color, canvas) => {
    const selectedRow = canvas[y]
    const selectedCell = selectedRow[x]

    // early return - bucket fill only works on empty cells and cells filled with another color, but not lines
    if (isLineCell(selectedCell)) return canvas

    // pool of cells to fill
    const cellsToBucketFill = new Set()

    // add initially selected cell coordinates
    // stringify to compare objects for equality below
    cellsToBucketFill.add(stringify({ x, y }))

    const adjacentCells = getAdjacentCells(x, y)

    const addEmptyCellsToPool = cells =>
        cells.forEach(({ x, y }) => {
            const addCondition =
                isOnCanvas(y, x, canvas.length - 1, selectedRow.length - 1) && // cell should be within canvas borders
                !isLineCell(canvas[y][x]) && // should not be cell with 'x'
                !cellsToBucketFill.has(stringify({ x, y })) // skip if already in the pool

            if (addCondition) {
                cellsToBucketFill.add(stringify({ x, y }))
            }
        })

    addEmptyCellsToPool(adjacentCells)

    // iterate over cells in the pool adding adjacent empty cells
    cellsToBucketFill.forEach(cell => {
        const { x, y } = JSON.parse(cell)
        const adjacentCells = getAdjacentCells(x, y)
        addEmptyCellsToPool(adjacentCells)
    })

    // finally return updated canvas with colored cells
    return canvas.map((row, y) =>
        row.map((cell, x) => (cellsToBucketFill.has(stringify({ x, y })) ? color : cell)))
}

module.exports = {
    createMatrix,
    addLine,
    addRectangle,
    applyBucketFill,
    isWithinRange,
    isFirstOrLast,
    isLineCell,
    isOnCanvas,
    getAdjacentCells,
}
