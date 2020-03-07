const createWrite = stdout => s => stdout.write(s)
const createPositionAtRow = write => row => write(`\x1b[${row};0H`)

const borders = [
    '┌', // 0
    '┐', // 1
    '─', // 2
    '│', // 3
    '└', // 4
    '┘', // 5
]

const write = createWrite(process.stdout)
const positionAtRow = createPositionAtRow(write)

const getUpperBorders = width => borders[0] + borders[2].repeat(width) + borders[1]
const getLowerBorders = width => borders[4] + borders[2].repeat(width) + borders[5]
const getRowWithBorders = row => borders[3] + row.join('') + borders[3]

const createDrawCanvas = ({ getUpperBorders, getLowerBorders, getRowWithBorders, positionAtRow, write }) => canvas => {
    const height = canvas.length
    const width = canvas[0].length

    positionAtRow(1)
    write(getUpperBorders(width))

    canvas.forEach((row, i) => {
        positionAtRow(i + 2)
        write(getRowWithBorders(row))
    })

    positionAtRow(height + 2)
    write(getLowerBorders(width))
    positionAtRow(height + 3)
}

module.exports = {
    write,
    positionAtRow,
    drawCanvas: createDrawCanvas({ getUpperBorders, getLowerBorders, getRowWithBorders, positionAtRow, write }),
    createWrite,
    createPositionAtRow,
    createDrawCanvas,
    getUpperBorders,
    getLowerBorders,
    getRowWithBorders,
}
