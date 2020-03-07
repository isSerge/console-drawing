const { createInterface } = require('readline')
const errorMessages = require('./errors')
const { createState } = require('./state')
const { help, createCanvasHandler, createLineHandler, createRectangleHandler, createBucketHandler, createQuitHandler } = require('./handlers')
const { drawCanvas } = require('./output')
const { createMatrix, addLine, addRectangle, applyBucketFill } = require('./canvas')
const { stringsToIntegers, convertInputsToIndexes } = require('./utils')
const greeting = require('./greeting')

// create interface to read and output using stdin and stdout streams
const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Enter command: ',
})

console.clear()
drawCanvas(greeting)
rl.prompt()

// instantiate state
// currently use naive in-memory implementation
const state = createState()

// create command handlers passing relevant dependencies as an object
const commands = {
    help,
    C: createCanvasHandler({ errorMessages, state, stringsToIntegers, createMatrix, drawCanvas }),
    L: createLineHandler({ errorMessages, state, stringsToIntegers, convertInputsToIndexes, drawCanvas, addLine }),
    R: createRectangleHandler({ errorMessages, state, stringsToIntegers, convertInputsToIndexes, drawCanvas, addRectangle }),
    B: createBucketHandler({ errorMessages, state, stringsToIntegers, convertInputsToIndexes, drawCanvas, applyBucketFill }),
    Q: createQuitHandler({ rl }),
}

rl.on('line', line => {
    const [commandName, ...args] = line.trim().split(' ')
    const command = commands[commandName]
    console.clear()

    if (command) {
        try {
            command(args)
        } catch ({ message }) {
            console.log('Error: ', message)
        }
    } else {
        console.log(`Unknown command: ${commandName}. Type "help" to see available commands`)
    }

    rl.prompt()
}).on('close', () => {
    console.clear()
    console.log('Bye!')
    process.exit(0)
})
