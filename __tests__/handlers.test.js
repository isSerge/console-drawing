const {
    createCanvasHandler,
    createLineHandler,
    createRectangleHandler,
    createBucketHandler,
    createQuitHandler,
} = require('../handlers')
const errorMessages = require('../errors')
const { stringsToIntegers, convertInputsToIndexes } = require('../utils')

describe('Handlers', () => {
    const fakeState = [[], [], []]
    const stateStub = {
        updateState: jest.fn(),
        getState: jest.fn().mockReturnValue(fakeState),
    }

    describe('createCanvasHandler', () => {
        const dependencies = {
            errorMessages, 
            state: stateStub, 
            stringsToIntegers, 
            drawCanvas: jest.fn(), 
            createMatrix: jest.fn(),
        }

        const createCanvas = createCanvasHandler(dependencies)

        it('should throw error if any parameter is missing', () => {
            expect(() => createCanvas()).toThrowError(errorMessages.missingParams)
            expect(() => createCanvas([1])).toThrowError(errorMessages.missingParams)
        })

        it('should throw error if any parameter is NOT a number', () => {
            expect(() => createCanvas([1, 'a'])).toThrowError(errorMessages.createCanvas.notNumbers)
            expect(() => createCanvas(['x', 1])).toThrowError(errorMessages.createCanvas.notNumbers)
            expect(() => createCanvas(['x', false])).toThrowError(errorMessages.createCanvas.notNumbers)
        })

        it('should call createMatrix, updateState and drawCanvas', () => {
            const width = 10
            const height = 5
            createCanvas([width, height])
            expect(dependencies.createMatrix).toHaveBeenCalledWith(width, height);
            expect(dependencies.state.updateState).toHaveBeenCalled();
            expect(dependencies.drawCanvas).toHaveBeenCalled();
        })
    })

    describe('createLineHandler', () => {
        const dependencies = {
            errorMessages, 
            state: stateStub, 
            stringsToIntegers, 
            convertInputsToIndexes,
            drawCanvas: jest.fn(), 
            addLine: jest.fn(),
        }

        const createLine = createLineHandler(dependencies)

        it('should throw error if any parameter is missing', () => {
            expect(() => createLine()).toThrowError(errorMessages.missingParams)
            expect(() => createLine([1])).toThrowError(errorMessages.missingParams)
            expect(() => createLine([1, 2])).toThrowError(errorMessages.missingParams)
            expect(() => createLine([1, 2, 3])).toThrowError(errorMessages.missingParams)
        })

        it('should throw error if any parameter is NOT a number', () => {
            expect(() => createLine([1, 2, 3, 'a'])).toThrowError(errorMessages.createLine.notNumbers)
        })

        it('should throw error if line is NOT vertical or horizontal', () => {
            expect(() => createLine([1, 2, 3, 4])).toThrowError(errorMessages.createLine.onlyVerticalAndHorizontal)
        })

        it('should call getState, addLine, updateState and drawCanvas', () => {
            const coordinates = [1, 2, 1, 4]
            createLine(coordinates)
            expect(dependencies.state.getState).toHaveBeenCalled();
            expect(dependencies.addLine).toHaveBeenCalledWith(convertInputsToIndexes(coordinates), fakeState);
            expect(dependencies.state.updateState).toHaveBeenCalled();
            expect(dependencies.drawCanvas).toHaveBeenCalled();
        })
    })

    describe('createRectangleHandler', () => {
        const dependencies = {
            errorMessages, 
            state: stateStub, 
            stringsToIntegers,
            convertInputsToIndexes, 
            drawCanvas: jest.fn(), 
            addRectangle: jest.fn(),
        }

        const createRectangle = createRectangleHandler(dependencies)

        it('should throw error if any parameter is missing', () => {
            expect(() => createRectangle()).toThrowError(errorMessages.missingParams)
            expect(() => createRectangle([1])).toThrowError(errorMessages.missingParams)
            expect(() => createRectangle([1, 2])).toThrowError(errorMessages.missingParams)
            expect(() => createRectangle([1, 2, 3])).toThrowError(errorMessages.missingParams)
        })

        it('should throw error if any parameter is NOT a number', () => {
            expect(() => createRectangle([1, 2, 3, 'a'])).toThrowError(errorMessages.createLine.notNumbers)
        })

        it('should call getState, addRectangle, updateState and drawCanvas', () => {
            const coordinates = [1, 2, 3, 4]
            createRectangle(coordinates)
            expect(dependencies.state.getState).toHaveBeenCalled();
            expect(dependencies.addRectangle).toHaveBeenCalledWith(convertInputsToIndexes(coordinates), fakeState);
            expect(dependencies.state.updateState).toHaveBeenCalled();
            expect(dependencies.drawCanvas).toHaveBeenCalled();
        })
    })

    describe('createBucketHandler', () => {
        const dependencies = {
            errorMessages, 
            state: stateStub, 
            stringsToIntegers, 
            convertInputsToIndexes,
            drawCanvas: jest.fn(), 
            applyBucketFill: jest.fn(),
        }

        const applyBucket = createBucketHandler(dependencies)

        it('should throw error if any parameter is missing', () => {
            expect(() => applyBucket()).toThrowError(errorMessages.missingParams)
            expect(() => applyBucket([1])).toThrowError(errorMessages.missingParams)
            expect(() => applyBucket([1, 2])).toThrowError(errorMessages.missingParams)
        })

        it('should throw error if any coordinate parameter is NOT a number', () => {
            expect(() => applyBucket([1, 'a', 'o'])).toThrowError(errorMessages.createBucket.notNumbers)
            expect(() => applyBucket(['x', 2, 'o'])).toThrowError(errorMessages.createBucket.notNumbers)
        })

        it('should throw error if color is not a single character', () => {
            expect(() => applyBucket([1, 2, 'not a single char'])).toThrowError(errorMessages.createBucket.colorSingleChar)
        })

        it('should call getState, applyBucketFill, updateState and drawCanvas', () => {
            const params = [1, 2, 'o']
            applyBucket(params)
            const [x, y, color] = params
            expect(dependencies.state.getState).toHaveBeenCalled();
            expect(dependencies.applyBucketFill).toHaveBeenCalledWith(convertInputsToIndexes([x, y]), color, fakeState);
            expect(dependencies.state.updateState).toHaveBeenCalled();
            expect(dependencies.drawCanvas).toHaveBeenCalled();
        })
        
    })

    describe('createQuitHandler', () => {
        const dependencies = {
            rl: {
                close: jest.fn(),
            },
        }

        const quit = createQuitHandler(dependencies)

        it('should call rl.close', () => {
            quit()
            expect(dependencies.rl.close).toHaveBeenCalled();
        })
        
    })
})