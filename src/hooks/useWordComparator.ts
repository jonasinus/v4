export default function useComparator() {
    const levenshteinCompare = (word: string, userInput: string): number => {
        const len1 = word.length
        const len2 = userInput.length

        const matrix: number[][] = []

        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i]
        }

        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j
        }

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                let cost = word[i - 1] === userInput[j - 1] ? 0 : 1

                // Give smaller penalty for accent-related edits
                if (word[i - 1].toLowerCase() === userInput[j - 1].toLowerCase()) {
                    cost = Math.min(cost, matrix[i - 1][j - 1] + 0.5)
                }

                // Consider adjacent letter swaps as a single edit
                if (i > 1 && j > 1 && word[i - 1] === userInput[j - 2] && word[i - 2] === userInput[j - 1]) {
                    cost = Math.min(cost, matrix[i - 2][j - 2] + cost)
                }

                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
            }
        }

        const distance = matrix[len1][len2]
        const maxLength = Math.max(len1, len2)
        const similarity = Math.max(((word.length - distance) / maxLength) * 100, 0)

        return similarity
    }

    function scoreify(A: string, B: string) {
        let red = []
        let yellow = []
        let green = []

        const accents = /[\u0300-\u036f]/g

        function removeAccents(str: string) {
            return str.normalize('NFD').replace(accents, '')
        }

        for (let i = 0; i < Math.min(A.length, B.length); i++) {
            if (A[i] !== B[i]) {
                if (removeAccents(A[i]) === removeAccents(B[i])) {
                    yellow.push(i)
                } else {
                    red.push(i)
                }
            } else {
                green.push(i)
            }
        }

        if (A.length > B.length) {
            for (let i = B.length; i < A.length; i++) {
                red.push(i)
            }
        }

        if (B.length > A.length) {
            for (let i = A.length; i < B.length; i++) {
                red.push(i)
            }
        }

        console.info('scoreify compare: ', { red, yellow, green, A, B })

        return {
            red: red,
            yellow: yellow,
            green: green
        }
    }

    return {
        levenshteinCompare,
        accentCompare: scoreify
    }
}
