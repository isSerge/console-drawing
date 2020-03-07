const {
    createMatrix,
    addLine,
    addRectangle,
    applyBucketFill,
    isWithinRange,
    isFirstOrLast,
    isLineCell,
    isOnCanvas,
    getAdjacentCells,
} = require('../canvas')

describe('Canvas', () => {
    const emptyCanvas = [
        [' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' '],
    ]

    describe('addLine', () => {        
        it('Should create a new horyzontal line from (x1,y1) to (x2,y2)', () => {
            const result = addLine([1, 1, 2, 1], emptyCanvas)
            const expected = [
                [' ', ' ', ' ', ' '],
                [' ', 'x', 'x', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ]
            expect(result).toEqual(expected)
        })

        it('Should create a new vertical line from (x1,y1) to (x2,y2)', () => {
            const result = addLine([1, 1, 1, 2], emptyCanvas)
            const expected = [
                [' ', ' ', ' ', ' '],
                [' ', 'x', ' ', ' '],
                [' ', 'x', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ]
            expect(result).toEqual(expected)
        })
    })

    describe('addRectangle', () => {
        it('Should create a new rectangle, whose upper left corner is (x1,y1) and lower right corner is (x2,y2)', () => {
            const result = addRectangle([1, 1, 3, 3], emptyCanvas)
            const expected = [
                [' ', ' ', ' ', ' '],
                [' ', 'x', 'x', 'x'],
                [' ', 'x', ' ', 'x'],
                [' ', 'x', 'x', 'x'],
            ]

            expect(result).toEqual(expected)
        })
    })

    describe('applyBucketFill', () => {
        it('Should not add color if selected cell is line cell (has "x")', () => {
            const canvas = [
                [' ', ' ', ' ', ' '],
                [' ', 'x', ' ', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ]
            const color = 'b'
            const result = applyBucketFill([1, 1], color, canvas)
            expect(result).toEqual(canvas)
        })

        it('Should fill the entire area connected to (x,y) with "colour"', () => {
            const color = 'b'
            const result = applyBucketFill([1, 1], color, emptyCanvas)
            const expected = [
                ['b', 'b', 'b', 'b'],
                ['b', 'b', 'b', 'b'],
                ['b', 'b', 'b', 'b'],
                ['b', 'b', 'b', 'b'],
            ]

            expect(result).toEqual(expected)
        })

        it('Should NOT fill area inside rectangle', () => {
            const canvasWithRectangle = [
                [' ', ' ', ' ', ' '],
                [' ', 'x', 'x', 'x'],
                [' ', 'x', ' ', 'x'],
                [' ', 'x', 'x', 'x'],
            ]
            const color = 'b'
            const result = applyBucketFill([0, 0], color, canvasWithRectangle)
            const expected = [
                ['b', 'b', 'b', 'b'],
                ['b', 'x', 'x', 'x'],
                ['b', 'x', ' ', 'x'],
                ['b', 'x', 'x', 'x'],
            ]

            expect(result).toEqual(expected)
        })

        it('Should NOT fill area separated by lines', () => {
            const canvasWithRectangle = [
                [' ', ' ', ' ', ' '],
                [' ', 'x', 'x', 'x'],
                [' ', 'x', ' ', ' '],
                [' ', 'x', ' ', ' '],
            ]
            const color = 'b'
            const result = applyBucketFill([0, 0], color, canvasWithRectangle)
            const expected = [
                ['b', 'b', 'b', 'b'],
                ['b', 'x', 'x', 'x'],
                ['b', 'x', ' ', ' '],
                ['b', 'x', ' ', ' '],
            ]

            expect(result).toEqual(expected)
        })
    })

    describe('createMatrix', () => {
        it('should return two-dimensional array if "width" and "height" parameters provided', () => {
            const width = 20
            const height = 4
            const result = createMatrix(width, height)

            expect(Array.isArray(result)).toBe(true)
            expect(Array.isArray(result[0])).toBe(true)
            expect(result.length).toBe(height)
            expect(result[0].length).toBe(width)
        })
    })

    describe('isWithinRange', () => {
        it('should return "true" if value is within range on numbers', () => {
            const start = 3
            const end = 8
            const result = isWithinRange(start, end, 4)
            expect(result).toBe(true)
        })

        it('should return "false" if value is NOT within range on numbers', () => {
            const start = 5
            const end = 8
            const result = isWithinRange(start, end, 4)
            expect(result).toBe(false)
        })
        
    })

    describe('isFirstOrLast', () => {
        const start = 5
        const end = 8
        it('should return "true" if value is first', () => {
            const result = isFirstOrLast(start, end, start)
            expect(result).toBe(true)
        })

        it('should return "true" if value is last', () => {
            const result = isFirstOrLast(start, end, end)
            expect(result).toBe(true)
        })

        it('should return "false" if value is neither first neither last', () => {
            const result = isFirstOrLast(start, end, 4)
            expect(result).toBe(false)
        })
        
    })

    describe('isLineCell', () => {
        it('should return "true" if value equals "x"', () => {
            const cell = 'x'
            const result = isLineCell(cell)
            expect(result).toBe(true)
        })

        it('should return "false" if value DOES NOT equal "x"', () => {
            const notX = 'o'
            const emptyCell = ' '
            expect(isLineCell(notX)).toBe(false)
            expect(isLineCell(emptyCell)).toBe(false)
        })
    })

    describe('isOnCanvas', () => {
        const width = 10
        const height = 5
        const x = 3
        const y = 5

        it('should return "true" if cell coordinates are within canvas', () => {
            const result = isOnCanvas(x, y, width, height)
            expect(result).toBe(true)
        })

        it('should return "false" if cell coordinates are NOT within canvas', () => {
            const tooBigY = 60 
            const negativeX = -3
            expect(isOnCanvas(x, tooBigY, width, height)).toBe(false)
            expect(isOnCanvas(negativeX, y, width, height)).toBe(false)
        })
    })

    describe('getAdjacentCells', () => {
        it('Given cell coordinates should return coordinates of 8 adjacent cells', () => {
            const selectedCell = { x: 1, y: 3 }
            const result = getAdjacentCells(selectedCell.x, selectedCell.y)
            expect(result).toHaveLength(8)
            result.forEach((cell) => {
                expect(cell).not.toEqual(selectedCell)
            })
        })
    })
})
