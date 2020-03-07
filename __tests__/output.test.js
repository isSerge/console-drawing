const { createWrite, createPositionAtRow, getUpperBorders, getLowerBorders, getRowWithBorders, createDrawCanvas } = require('../output')

describe('Output', () => {

    const stdoutStub = {
        write: jest.fn(),
    }
    
    const write = createWrite(stdoutStub)

    it('createWrite should return a function which calls stdout.write with string value as parameter', () => {
        const string = 'random string'
        write(string)
        expect(stdoutStub.write).toHaveBeenCalledWith(string)
    })

    it('createWrite should return a function which calls write with row value as parameter', () => {
        const positionAtRow = createPositionAtRow(write)
        const row = 12
        positionAtRow(row)
        expect(stdoutStub.write).toHaveBeenCalledWith(`\x1b[${row};0H`)
    })

    it('getUpperBorders should return upper borders string based on canvas width', () => {
        const width = 5
        const result = getUpperBorders(width)
        expect(result).toBe('┌─────┐')
    })

    it('getLowerBorders should return lower borders string based on canvas width', () => {
        const width = 5
        const result = getLowerBorders(width)
        expect(result).toBe('└─────┘')
    })

    it('getRowWithBorders should return string with row values and edge borders', () => {
        const row = [' ', 'x', ' ', ' ']
        const result = getRowWithBorders(row)
        expect(result).toBe('│ x  │')
    })

    it('createDrawCanvas should return a function which calls getUpperBorders, getLowerBorders and getRowWithBorders', () => {
        const canvas = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ]

        const dependencies = { 
            getUpperBorders: jest.fn(), 
            getLowerBorders: jest.fn(), 
            getRowWithBorders: jest.fn(), 
            positionAtRow: jest.fn(),
            write: jest.fn(),
        }
        
        const draw = createDrawCanvas(dependencies)
        
        draw(canvas)
        expect(dependencies.getUpperBorders).toHaveBeenCalledTimes(1)
        expect(dependencies.getLowerBorders).toHaveBeenCalledTimes(1)
        expect(dependencies.getRowWithBorders).toHaveBeenCalledTimes(canvas.length)
    })
})