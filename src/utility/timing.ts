export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    let interval = Math.floor(seconds / 31536000)

    if (interval >= 1) {
        return 'vor' + (interval === 1 ? ' Jahr' : interval + ' Jahren')
    }

    interval = Math.floor(seconds / 2592000)

    if (interval >= 1) {
        return 'vor' + (interval === 1 ? ' Monat' : interval + ' Monaten')
    }

    interval = Math.floor(seconds / 86400)

    if (interval >= 1) {
        return 'vor' + (interval === 1 ? ' Tag' : interval + ' Tagen')
    }

    interval = Math.floor(seconds / 3600)

    if (interval >= 1) {
        return 'vor' + (interval === 1 ? ' Stunde' : interval + ' Stunden')
    }

    interval = Math.floor(seconds / 60)

    if (interval >= 1) {
        return 'vor' + (interval === 1 ? 'einer Minute' : interval + ' Minuten')
    }

    return 'vor' + (seconds === 1 ? 'einer Sekunde' : seconds + ' Sekunden')
}
