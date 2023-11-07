import useApi from '../../src/hooks/useApi'

export type tokenAuthStates = 'pending' | 'authorized' | 'unauthorized'

export type TimeTable = {
    monday: Subject[]
    tuesday: Subject[]
    wendsday: Subject[]
    thursday: Subject[]
    friday: Subject[]
}

export type Subject = {
    name: string
    id: string
    room: string
    teacher: string
    hour: number
}

export type UserData = {
    id: number
    firstName: string
    lastName: string
    username: string
    email?: string
    classId: string
    bithDate: Date
    role: 'student' | 'teacher' | 'admin'
    profilePicUrl?: string
    languages: (Omit<Language, 'units'> & { progress: number })[]
    recentlyExcersised: { lang: Language; when: Date; from: Word; to: Word }[]
    recentlyViewed: { lang: Language; when: Date; what: Word }[]
    lastSessionStats: UserStats
    stats: Stats
    languageStats: LanguageStats[]
    badges: Badge[]
    passwordSet: boolean
}

export type WeekDay = 'MO' | 'DI' | 'MI' | 'DO' | 'FR' | 'SA' | 'SO'

export type UserStats = {
    languages: LanguageStats[]
    trainingDays: {
        id: WeekDay
        languages: LanguageStats[]
        totalWords: number
        approxTime: Date
    }[]
}

export type LanguageStats = Omit<Language, 'units'> & {
    averageScore: number
    mostCommonMistakes: { inputChar: string; correctedChar: string }[]
    worstWords: Word[]
    bestWords: Word[]
    totalWordsTrained: Word[]
    diagramData: LangStatsDiagramData
}
export type Stats = {
    average: {
        score: number
        timePerDay: string
        wordsPerSession: number
        sessionsPerMonth: number
    }
    bestChapter: {
        lang: Omit<Language, 'units'>
        title: string
        chapterId: string
        unitId: string
        averageScore: number
        mostCorrections: string[]
        revisionTimes: number
    }
    worstChapter: {
        lang: Omit<Language, 'units'>
        title: string
        chapterId: string
        unitId: string
        averageScore: number
        mostCorrections: string[]
        revisionTimes: number
    }
    weekChartData: {
        name: string
        Score: number
        Wörter: number
        amt: number
    }[]
}

export type LangStatsDiagramData = {
    data: {
        name: WeekDay
        words: Word[]
        score: number
    }[]
    start: Date
    end: Date
}

export type Badge = {
    id: string
    title: string
    iconUrl: string
    description: string
}

export type Language = {
    id: LanguageId
    title: LanduageTitle
    flag: LanguageFlag
    units: VocabUnit[]
}

export type LanguageId = 'EN' | 'SP' | 'FR' | 'LT'
export type LanduageTitle = 'English' | 'Francais' | 'Espanol' | 'Latin'
export type LanguageFlag = '🇪🇸' | '🇬🇧' | '🇫🇷'

export type VocabUnit = {
    lang: LanguageId
    chapters: VocabChapter[]
    id: string
    title: string
    nextUnitId?: string
    isSpecial: boolean
}

export type VocabChapter = {
    lang: LanguageId
    unitId: string
    words: Word[]
    title: string
    id: string
    nextChapterId?: string
}

export type Word = {
    chapterId: string
    unitId: string
    langId: LanguageId
    idx: number
    native: string[]
    foreign: string
}

export type ExerciseProgress = {
    score: number
    red: number[]
    green: number[]
    yellow: number[]
    A: string
    B: string
}[]

export type Class = {
    studentIds: number[]
    name: string
    id: string
    teacherIds: number[]
}

//FRONTEND types
export interface NavProps {
    api: { logout: () => Promise<void> }
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    currentMode: Modes
    switchMode: (to: Modes | 'back') => void
    tabTitle: string
}

export type Modes = 'auth' | 'me' | 'exercise' | 'stats' | 'view' | 'settings' | 'teacher'

export interface OutletProps {
    currentMode: Modes
    langData: Language[]
    setLangData: React.Dispatch<React.SetStateAction<Language[]>>
    isMobile: boolean
    api: ReturnType<typeof useApi>
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    switchMode: (to: Modes | 'back') => void
    userData: UserData | null
    currentLanguageconfig: { lang: Language; unit: VocabUnit; chapter: VocabChapter; shown: boolean } | null
    setCurrentLanguageConfig: React.Dispatch<React.SetStateAction<{ lang: Language; unit: VocabUnit; chapter: VocabChapter; shown: boolean } | null>>
    tabTitle: string
    setTabTitle: React.Dispatch<React.SetStateAction<string>>
    confirm: (msg: string, { confirmed, canceled }: { confirmed: () => void; canceled: () => void }) => void
    setCurrentPanicFunction: React.Dispatch<React.SetStateAction<(() => void | Promise<void>) | null>>
}

export interface ConfirmProps {
    msg: string
    onConfirm: () => void
    onCancel: () => void
}

export type HttpStatus = {
    code: number
    title: string
}

export const AllHttpStatuses: HttpStatus[] = [
    { code: 100, title: 'Continue' },
    { code: 101, title: 'Switching Protocols' },
    { code: 102, title: 'Processing' },
    { code: 103, title: 'Early Hints' },
    { code: 200, title: 'OK' },
    { code: 201, title: 'Created' },
    { code: 202, title: 'Accepted' },
    { code: 203, title: 'Non-Authoritative Information' },
    { code: 204, title: 'No Content' },
    { code: 205, title: 'Reset Content' },
    { code: 206, title: 'Partial Content' },
    { code: 207, title: 'Multi-Status' },
    { code: 208, title: 'Already Reported' },
    { code: 226, title: 'IM Used' },
    { code: 300, title: 'Multiple Choices' },
    { code: 301, title: 'Moved Permanently' },
    { code: 302, title: 'Found' },
    { code: 303, title: 'See Other' },
    { code: 304, title: 'Not Modified' },
    { code: 305, title: 'Use Proxy' },
    { code: 307, title: 'Temporary Redirect' },
    { code: 308, title: 'Permanent Redirect' },
    { code: 400, title: 'Bad Request' },
    { code: 401, title: 'Unauthorized' },
    { code: 402, title: 'Payment Required' },
    { code: 403, title: 'Forbidden' },
    { code: 404, title: 'Not Found' },
    { code: 405, title: 'Method Not Allowed' },
    { code: 406, title: 'Not Acceptable' },
    { code: 407, title: 'Proxy Authentication Required' },
    { code: 408, title: 'Request Timeout' },
    { code: 409, title: 'Conflict' },
    { code: 410, title: 'Gone' },
    { code: 411, title: 'Length Required' },
    { code: 412, title: 'Precondition Failed' },
    { code: 413, title: 'Payload Too Large' },
    { code: 414, title: 'URI Too Long' },
    { code: 415, title: 'Unsupported Media Type' },
    { code: 416, title: 'Range Not Satisfiable' },
    { code: 417, title: 'Expectation Failed' },
    { code: 418, title: "I'm a teapot" },
    { code: 421, title: 'Misdirected Request' },
    { code: 422, title: 'Unprocessable Entity' },
    { code: 423, title: 'Locked' },
    { code: 424, title: 'Failed Dependency' },
    { code: 425, title: 'Too Early' },
    { code: 426, title: 'Upgrade Required' },
    { code: 428, title: 'Precondition Required' },
    { code: 429, title: 'Too Many Requests' },
    { code: 431, title: 'Request Header Fields Too Large' },
    { code: 451, title: 'Unavailable For Legal Reasons' },
    { code: 500, title: 'Internal Server Error' },
    { code: 501, title: 'Not Implemented' },
    { code: 502, title: 'Bad Gateway' },
    { code: 503, title: 'Service Unavailable' },
    { code: 504, title: 'Gateway Timeout' },
    { code: 505, title: 'HTTP Version Not Supported' },
    { code: 506, title: 'Variant Also Negotiates' },
    { code: 507, title: 'Insufficient Storage' },
    { code: 508, title: 'Loop Detected' },
    { code: 510, title: 'Not Extended' },
    { code: 511, title: 'Network Authentication Required' }
]

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE' | 'CONNECT' | 'HEAD'

export type ApiEndpoint = {
    title: string
    description: string

    fullpath: string
    pathFromParent: string | null

    methods: HttpMethod[]
    statusCodes: number[]

    requestBodyItems: { required: boolean; key: string; value: any }[]
    requestQueryParameters: { required: boolean; key: string; value: string }[]
    requiredCookies: { name: string; valueDescription: string }[]

    childEndPoints?: ApiEndpoint[]
}

export const ApiStructure: ApiEndpoint = {
    fullpath: '/',
    pathFromParent: null,

    methods: [],
    statusCodes: [],

    requestBodyItems: [],
    requestQueryParameters: [],
    requiredCookies: [],

    title: 'scema endpoint',
    description: 'returns this object as specification',

    childEndPoints: [
        {
            fullpath: '/auth',
            pathFromParent: '/auth',

            methods: ['GET'],
            statusCodes: [200],

            requestBodyItems: [],
            requestQueryParameters: [],
            requiredCookies: [],

            title: 'auth router',
            description: 'router for auth functions',

            childEndPoints: [
                {
                    fullpath: '/auth/login',
                    pathFromParent: '/login',

                    methods: ['POST'],
                    statusCodes: [200, 400, 401],

                    requestBodyItems: [
                        { key: 'username', required: true, value: 'username of the user' },
                        { key: 'password', required: true, value: 'password of the user' }
                    ],
                    requestQueryParameters: [],
                    requiredCookies: [],

                    title: 'login',
                    description: 'endpoint for username-password-authentication'
                },
                {
                    fullpath: '/auth/logout',
                    pathFromParent: '/logout',

                    methods: ['POST', 'GET'],
                    statusCodes: [200, 400, 401],

                    requestBodyItems: [],
                    requestQueryParameters: [],
                    requiredCookies: [{ name: 'token', valueDescription: 'jsonwebtoken issued when loggin in' }],

                    title: 'logout',
                    description: 'endpoint for ending authenticated session'
                },
                {
                    fullpath: '/auth/verifyToken',
                    pathFromParent: '/verifyToken',

                    methods: ['POST'],
                    statusCodes: [200, 400, 401],

                    requestBodyItems: [],
                    requestQueryParameters: [],
                    requiredCookies: [{ name: 'token', valueDescription: 'jsonwebtoken issued when loggin in' }],

                    title: 'verifyToken',
                    description: 'endpoint for token autheticity validation'
                }
            ]
        },
        {
            fullpath: '/data',
            pathFromParent: '/data',

            methods: [],
            statusCodes: [],

            requestBodyItems: [],
            requestQueryParameters: [],
            requiredCookies: [],

            title: 'data router',
            description: 'router for data functions',

            childEndPoints: [
                {
                    fullpath: '/data/getLang/:languageId',
                    pathFromParent: '/getLang/:languageId',

                    methods: ['GET'],
                    statusCodes: [200, 401, 400],

                    requestBodyItems: [],
                    requestQueryParameters: [],
                    requiredCookies: [{ name: 'token', valueDescription: 'jsonwebtoken issued when loggin in' }],

                    title: 'language data provider',
                    description: 'endpoint for language data retrieval'
                }
            ]
        }
    ]
}
