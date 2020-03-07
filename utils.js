const stringsToIntegers = xs => xs.map(x => parseInt(x, 10))
const convertInputsToIndexes = xs => xs.map(x => x - 1)
const stringify = object => JSON.stringify(object)

module.exports = {
    stringsToIntegers,
    stringify,
    convertInputsToIndexes,
}
