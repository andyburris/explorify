import { DEBUG } from "../utils/debug"

export function hashSortedIndices(indices: number[]): number {
    const initialSortOrder = Array(indices.length).map(_ => '0')
    indices.forEach((n, i) => initialSortOrder[i] = String.fromCharCode('a'.charCodeAt(0) + n))
    const hashed = alphabetToNumber(initialSortOrder.join(''))

    const unhashed = unhashSortedIndices(hashed, indices.map(_ => ""))
    if(DEBUG && !indices.every((v, i) => v == unhashed[i].index)) throw Error(`hash != unhash, indices = ${indices}, hash = ${hashed}, unhashed = ${unhashed.map(v => v.index)}`)
    return hashed
}

export function unhashSortedIndices(hash: number, keys: string[]): { key: string, index: number }[] {
    const sortedAlphabet = keys.map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i)).join('')
    const alphabet = numberToAlphabet(hash, sortedAlphabet)
    const mapped = keys.map((k, i) => { return { key: k, index: alphabet.charCodeAt(i) - 'a'.charCodeAt(0) } })
    return mapped
}

function alphabetToNumber(str: String): number {
    return str.split('').reduce((acc, char, index) => {
        const smallerChars = str.substring(index + 1).split('').filter(c => c < char ).length
        return acc + smallerChars * factorial(str.length - index - 1)
    }, 0)
}

export function factorial(n: number): number {
    if(n <= 1) return 1
    return n * factorial(n - 1)
}

function downTo(endInclusive: number, startInclusive: number) {
    if(startInclusive > endInclusive) return []
    const size = endInclusive - (startInclusive - 1)
    return Array.from(Array(size).keys()).map(i => endInclusive - i);
}

function numberToAlphabet(number: number, initialChars: String): String {
    const characters = initialChars.split('')
    const size = initialChars.length

    const result = downTo(size - 1, 1).reduce((acc, i) => {
        const fact = factorial(i)
        const index = Math.floor(acc.remaining / fact)
        const char = characters[index]
        // if(DEBUG) console.log(`i = ${i}, index = ${index}, char = ${char}, characters = ${characters}, remaining = ${acc.remaining}`)
        characters.splice(index, 1)
        const remaining = acc.remaining % fact
        return { remaining: remaining, str: acc.str + char }
    }, { remaining: number, str: "" })

    return result.str + characters[0]
}