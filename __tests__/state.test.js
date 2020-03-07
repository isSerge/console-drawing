const { createState } = require('../state')

describe('State', () => {
    const state = createState()
    it('createState factory function should return an object with "updateState" and "getState" methods', () => {
        expect(state).toHaveProperty('updateState')
        expect(state).toHaveProperty('getState')
        expect(typeof state.updateState).toBe('function')
        expect(typeof state.getState).toBe('function')
    })

    it('getState should return current state', () => {
        const result = state.getState()
        const expected = []
        expect(result).toEqual(expected)
    })

    it('updateState should update current state', () => {
        const expected = [
            ['',''], 
            ['',''],
            ['',''],
        ]
        state.updateState(expected)
        const result = state.getState()
        expect(result).toEqual(expected)
    })
})
