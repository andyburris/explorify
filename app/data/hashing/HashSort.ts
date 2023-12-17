export function hashSortedIndices(indices: number[], keys?: string[]): number {
    const initialSortOrder = Array(indices.length).map(_ => '0')
    indices.forEach((n, i) => initialSortOrder[n] = String.fromCharCode('a'.charCodeAt(0) + i))
    const hashed = alphabetToNumber(initialSortOrder.join(''))
    return hashed
}

export function unhashSortedIndices(hash: number, keys: string[]): { key: string, index: number }[] {
    const sortedAlphabet = Array(keys.length).map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i)).join('')
    const alphabet = numberToAlphabet(hash, sortedAlphabet)
    return keys.map((k, i) => { return { key: k, index: alphabet.charCodeAt(i) - 'a'.charCodeAt(0) } })
}

function alphabetToNumber(str: String): number {
    return str.split('').reduce((acc, char, index) => {
        const smallerChars = str.substring(index + 1).split('').filter(c => c < char ).length
        return acc + smallerChars * factorial(str.length - index - 1)
    }, 0)
}

function factorial(n: number): number {
    if(n <= 1) return 1
    return n * factorial(n - 1)
}

function downTo(endInclusive: number, startInclusive: number) {
    const size = endInclusive - startInclusive
    return Array.from(Array(size).keys()).map(i => endInclusive - i);
}

function numberToAlphabet(number: number, initialChars: String): String {
    const characters = initialChars.split('')
    const size = initialChars.length

    const result = downTo(size - 1, 1).reduce((acc, i) => {
        const fact = factorial(i)
        const index = acc.remaining / fact
        const char = characters[index]
        characters.splice(index)
        const remaining = acc.remaining % fact
        return { remaining: remaining, str: acc.str + char }
    }, { remaining: number, str: "" })

    return result.str + characters[0]
}