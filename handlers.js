const { write, positionAtRow } = require('./output')

// pretty obvious - no need for testing and factory
const help = () => {
    positionAtRow(1)
    write('Command 	Description')
    positionAtRow(3)
    write('C w h           Should create a new canvas of width w and height h.')
    positionAtRow(5)
    write('L x1 y1 x2 y2   Should create a new line from (x1,y1) to (x2,y2).')
    positionAtRow(6)
    write('                Currently only horizontal or vertical lines are supported.')
    positionAtRow(7)
    write('                Horizontal and vertical lines will be drawn using the \'x\' character.')
    positionAtRow(9)
    write('R x1 y1 x2 y2   Should create a new rectangle, whose upper left corner is (x1,y1) and lower right corner is (x2,y2).')
    positionAtRow(10)
    write('                Horizontal and vertical lines will be drawn using the \'x\' character.')
    positionAtRow(12)
    write('B x y c         Should fill the entire area connected to (x,y) with "colour" c.')
    positionAtRow(13)
    write('                The behavior of this is the same as that of the "bucket fill" tool in paint programs.')
    positionAtRow(15)
    write('Q               Should quit the program.')
    positionAtRow(17)
}

const createCanvasHandler = ({ errorMessages, state, stringsToIntegers, drawCanvas, createMatrix }) => params => {
    if (!params || params.length < 2) {
        throw new Error(errorMessages.missingParams)
    }

    const [ width, height ] = stringsToIntegers(params)

    if (isNaN(width) || isNaN(height)) {
        throw new Error(errorMessages.createCanvas.notNumbers)
    }

    const canvas = createMatrix(width, height)
    state.updateState(canvas)
    drawCanvas(state.getState())
}

const createLineHandler = ({ 
    errorMessages,
    state,
    stringsToIntegers,
    convertInputsToIndexes,
    drawCanvas,
    addLine,
}) => params => {
    if (!params || params.length < 4) {
        throw new Error(errorMessages.missingParams)
    }

    const [x1, y1, x2, y2] = stringsToIntegers(params)

    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        throw new Error(errorMessages.createLine.notNumbers)
    }

    if (x1 !== x2 && y1 !==y2) {
        throw new Error(errorMessages.createLine.onlyVerticalAndHorizontal)
    }

    const newCanvas = addLine(convertInputsToIndexes([x1, y1, x2, y2]), state.getState())
    state.updateState(newCanvas)
    drawCanvas(state.getState())
}

const createRectangleHandler = ({ 
    errorMessages,
    state,
    stringsToIntegers,
    convertInputsToIndexes,
    drawCanvas,
    addRectangle,
}) => params => {
    if (!params || params.length < 4) {
        throw new Error(errorMessages.missingParams)
    }

    const [x1, y1, x2, y2] = stringsToIntegers(params)

    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        throw new Error(errorMessages.createLine.notNumbers)
    }

    const newCanvas = addRectangle(convertInputsToIndexes([x1, y1, x2, y2]), state.getState())
    state.updateState(newCanvas)
    drawCanvas(state.getState())
}

const createBucketHandler = ({ 
    errorMessages, 
    state, 
    stringsToIntegers, 
    convertInputsToIndexes, 
    drawCanvas, 
    applyBucketFill,
}) => params => {
    if (!params || params.length < 3) {
        throw new Error(errorMessages.missingParams)
    }

    const [x, y, color] = params

    const [xInt, yInt] = stringsToIntegers([x, y])

    // color value should be single character
    if (!/^.$/.test(color)) {
        throw new Error(errorMessages.createBucket.colorSingleChar)
    }

    if (isNaN(xInt) || isNaN(yInt)) {
        throw new Error(errorMessages.createBucket.notNumbers)
    }

    const newCanvas = applyBucketFill(convertInputsToIndexes([xInt, yInt]), color, state.getState())
    state.updateState(newCanvas)
    drawCanvas(state.getState())
}

const createQuitHandler = ({ rl }) => () => rl.close()

module.exports = {
    help,
    createCanvasHandler,
    createLineHandler,
    createRectangleHandler,
    createBucketHandler,
    createQuitHandler,
}
