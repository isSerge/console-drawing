const createState = () => {
    let state = []

    return {
        updateState(newState) {
            state = newState
        },
        getState() {
            return state
        },
    }
}

module.exports = {
    createState,
}
