import express, { NextFunction, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ApiEndpoint, ApiStructure, Language, LanguageId, LanguageStats, UserData, VocabChapter, VocabUnit } from './types'

const app = express()
const consts = {
    PORT: 3000,
    SECRET: 'secret'
}

async function run() {
    const langStat: LanguageStats = {
        id: 'EN',
        flag: '🇬🇧',
        title: 'English',
        averageScore: 78.5,
        worstWords: [],
        bestWords: [],
        totalWordsTrained: [],
        diagramData: {
            data: [],
            end: new Date(),
            start: new Date()
        },
        mostCommonMistakes: [
            { inputChar: 'e', correctedChar: 'é' },
            { inputChar: 'à', correctedChar: 'á' },
            { inputChar: 'c', correctedChar: 'h' }
        ]
    }

    const sampleUser: UserData = {
        firstName: 'jonas',
        lastName: 'haardoerfer',
        email: 'jonas.haardoerfer@outlook.de',
        username: 'jonas.haardoerfer',
        bithDate: new Date(),
        classId: 'Q12_jkh34d',
        id: 46894,
        role: 'student',
        profilePicUrl: '../../assets/uch.png',
        passwordSet: false,
        languages: [
            {
                id: 'EN',
                title: 'English',
                flag: '🇬🇧',
                progress: 56
            },
            {
                id: 'FR',
                title: 'Francais',
                flag: '🇫🇷',
                progress: 11
            }
        ],
        recentlyExcersised: [
            {
                lang: await databaseGetLang('EN'),
                from: { chapterId: '0', foreign: 'look', native: ['schauen', 'sehen', 'begutachten'], idx: 0, unitId: 'asdddaas', langId: 'EN' },
                to: { chapterId: '0', foreign: 'horse', native: ['Pferd'], idx: 37, unitId: 'asdas', langId: 'EN' },
                when: new Date()
            },
            {
                lang: await databaseGetLang('FR'),
                from: { chapterId: '0', foreign: 'être', native: ['sein', 'oder nicht sein'], idx: 0, unitId: 'asdasadss', langId: 'FR' },
                to: { chapterId: '0', foreign: 'cheval', native: ['Pferd'], idx: 4, unitId: 'asdasas', langId: 'FR' },
                when: new Date()
            }
        ],
        recentlyViewed: [
            {
                lang: await databaseGetLang('EN'),
                when: new Date(),
                what: { chapterId: '0', native: ['aa'], foreign: 'aa', idx: 0, langId: 'EN', unitId: '0' }
            }
        ],
        badges: [
            {
                title: 'Starter',
                iconUrl: '../../assets/uch.png',
                id: '78df3a',
                description: 'logged in at least once'
            },
            {
                title: 'Admin',
                iconUrl: '../../assets/uch.png',
                id: '78df3b',
                description: 'you became admin!'
            }
        ],
        lastSessionStats: {
            languages: [],
            trainingDays: []
        },
        languageStats: [langStat],
        stats: {
            average: {
                score: 76.3,
                sessionsPerMonth: 5,
                timePerDay: '14min',
                wordsPerSession: 14
            },
            bestChapter: {
                lang: {
                    flag: '🇬🇧',
                    title: 'English',
                    id: 'EN'
                },
                averageScore: 98.5,
                chapterId: 'hdfs',
                mostCorrections: ['c -> h'],
                revisionTimes: 17,
                title: 'title of the chapter',
                unitId: 'hfdjfd'
            },
            worstChapter: {
                lang: {
                    flag: '🇬🇧',
                    title: 'English',
                    id: 'EN'
                },
                averageScore: 34.2,
                chapterId: 'opssaa',
                mostCorrections: ['c -> h', 'a -> b', 'b -> c'],
                revisionTimes: 17,
                title: 'title of the chapter',
                unitId: 'iqwioew'
            },
            weekChartData: [
                {
                    name: 'Mo',
                    Score: 78,
                    Wörter: 38,
                    amt: 2400
                },
                {
                    name: 'Di',
                    Score: 100,
                    Wörter: 2,
                    amt: 2210
                },
                {
                    name: 'Mi',
                    Score: 62,
                    Wörter: 14,
                    amt: 2290
                },
                {
                    name: 'Do',
                    Score: 87,
                    Wörter: 14,
                    amt: 2000
                },
                {
                    name: 'Fr',
                    Score: 95,
                    Wörter: 8,
                    amt: 2181
                },
                {
                    name: 'Sa',
                    Score: 0,
                    Wörter: 0,
                    amt: 2500
                },
                {
                    name: 'So',
                    Score: 70,
                    Wörter: 22,
                    amt: 2100
                }
            ]
        }
    }

    app.use(express.json())
    app.use(cookieParser())
    app.use((req, res, next) => {
        let origin = req.headers.origin

        res.setHeader('Access-Control-Allow-Origin', origin || '*')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
        res.setHeader('Access-Control-Allow-Headers', 'content-type')

        next()
    })
    /** --- endpoints --- */
    app.get('/', (_req, res) => {
        return res.status(200).json(ApiStructure)
    })

    app.post('/auth/login', async (req, res) => {
        try {
            const { username, password } = req.body
            console.info('user tried to log in: ', { data: req.body })
            let userData = await databaseLogin(username, password)
            userData.passwordSet = false
            console.info('user credentials valid')
            let token = createToken(userData.username, userData.role)
            res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
            return res.status(200).json({ msg: 'login successful', userData: userData })
        } catch (ignore) {
            console.info('user credentials invalid')
            console.log(ignore)
            res.status(400).json({ error: 'credentials not provided or invalid' })
        }
    })

    app.post('/auth/reset-password', async (req, res) => {
        res.status(200).json({ msg: 'password reset, staff will issue you the new password shortly' })
    })

    app.post('/auth/logout', authorize, (req, res) => {
        res.clearCookie('token')
        res.status(200).json({ msg: 'logout successful' })
    })

    app.post('/auth/set-password', authorize, async (req, res) => {
        sampleUser.passwordSet = true
        res.status(200).json({ msg: 'password changed successfully' })
    })

    app.all('/auth/verifyToken', authorize, (req, res) => {
        console.log('verified token')
        res.status(200).json({ msg: 'token valid', data: req.cookies.token })
    })

    app.get('/userdata', authorize, async (req, res) => {
        res.status(200).json({ ...(await databaseGetUserData()) })
    })

    app.get('/data/langs', async (req, res) => {
        return res.status(200).json([...(await databaseGetLangs())])
    })

    app.get('/data/lang/:lang', authorize, async (req, res) => {
        const { lang } = req.params
        let langId = lang as LanguageId
        let data = await databaseGetLang(langId)
        return res.status(200).json(data)
    })

    app.get('/data/getUnit/:lang/:unit', authorize, async (req, res) => {
        const { lang, unit } = req.params
        let langId = lang as LanguageId
        let data = await databaseGetUnit(langId, unit)
        return res.status(200).json(data)
    })

    app.get('/data/getChapter/:lang/:unit/:chapter', authorize, async (req, res) => {
        const { lang, unit, chapter } = req.params
        let langId = lang as LanguageId
        let data = await databaseGetChapter(langId, unit, chapter)
        return res.status(200).json(data)
    })

    app.listen(consts.PORT, () => console.log(`listening on port ${consts.PORT}`))

    /** --- helper functions --- */
    function createToken(username: string, role: 'student' | 'teacher' | 'admin'): string {
        return jwt.sign({ username, role }, consts.SECRET, {})
    }

    function verityToken(token: string) {
        return jwt.verify(token, consts.SECRET)
    }

    interface Request extends Express.Request {
        cookies: { [key: string]: any }
        tokenData?: JwtPayload | string
    }

    function authorize(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token as string
            console.log({ token, tokens: req })
            const tokenData = verityToken(token)
            req.tokenData = tokenData
            next()
        } catch (ignore) {
            res.status(401).json({ error: 'token either provided or invalid' })
        }
    }

    async function databaseLogin(username: string, password: string): Promise<UserData> {
        return new Promise(async (res, rej) => {
            if (username == 'jonas.haardoerfer' && password == '123') {
                return res(await databaseGetUserData())
            }
            return rej('invalid credentials')
        })
    }

    async function databaseGetUserData(): Promise<UserData> {
        return new Promise((res, rej) => {
            return res(sampleUser)
        })
    }

    async function databaseGetLangs(): Promise<Language[]> {
        return [await databaseGetLang('EN'), await databaseGetLang('FR')]
    }

    function chapter(lang: LanguageId, unitId: string, chapterId: string): VocabChapter {
        return {
            lang: lang,
            unitId: unitId,
            id: chapterId,
            title: 'Some Chapter - ' + chapterId,
            nextChapterId: chapterId.substring(0, chapterId.length - 2) + (chapterId.endsWith('a') ? 'b' : chapterId.endsWith('b') ? 'c' : 'a'),
            words: [
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 0,
                    foreign: 'cat',
                    native: ['Katze'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 1,
                    foreign: 'dog',
                    native: ['Hund'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 2,
                    foreign: 'car',
                    native: ['Auto', 'Automobilo'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 3,
                    foreign: 'train',
                    native: ['Zug', 'Schienefahrzeugs'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 4,
                    foreign: 'plane',
                    native: ['Flugzeug', 'Fliegaa'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 5,
                    foreign: 'fish',
                    native: ['Fisch', 'Fischiii'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 6,
                    foreign: 'apple',
                    native: ['iDings'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 7,
                    foreign: 'cat',
                    native: ['Katze'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 8,
                    foreign: 'dog',
                    native: ['Hund'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 9,
                    foreign: 'car',
                    native: ['Auto', 'Automobilo'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 10,
                    foreign: 'train',
                    native: ['Zug', 'Schienefahrzeugs'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 11,
                    foreign: 'plane',
                    native: ['Flugzeug', 'Fliegaa'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 12,
                    foreign: 'fish',
                    native: ['Fisch', 'Fischiii'],
                    langId: lang
                },
                {
                    unitId: unitId,
                    chapterId: chapterId,
                    idx: 13,
                    foreign: 'apple',
                    native: ['iDings'],
                    langId: lang
                }
            ]
        }
    }

    function unit(lang: LanguageId, unitId: string, isSpecial: boolean = false) {
        return {
            id: unitId,
            lang: lang,
            title: unitId + (isSpecial ? '' : '-title'),
            isSpecial: isSpecial,
            nextUnitId: unitId.substring(0, unitId.length - 2) + (unitId.endsWith('a') ? 'b' : unitId.endsWith('b') ? 'c' : 'a'),
            chapters: isSpecial
                ? [{ ...chapter(lang, unitId, 'schlechteste') }, { ...chapter(lang, unitId, 'alle') }]
                : [{ ...chapter(lang, unitId, 'kdjsfga') }, { ...chapter(lang, unitId, 'kdjsfgb') }, { ...chapter(lang, unitId, 'kdjsgfc') }]
        }
    }

    async function databaseGetChapter(lang: LanguageId, unitId: string, chapterId: string): Promise<VocabChapter> {
        return new Promise((res, rej) => {
            res(chapter('EN', 'asdf', 'ghjk'))
        })
    }

    async function databaseGetUnit(lang: LanguageId, unitId: string) {
        return new Promise((res, rej) => {
            return res(unit(lang, unitId, false))
        })
    }

    async function databaseGetLang(lang: LanguageId): Promise<Language> {
        return new Promise((res, rej) => {
            if (lang === 'EN') {
                let lng: Language = {
                    id: 'EN',
                    title: 'English',
                    flag: '🇬🇧',
                    units: [
                        { ...unit('EN', '23bnma', false) },
                        { ...unit('EN', '23bnmb', false) },
                        { ...unit('EN', '23bnmc', false) },
                        { ...unit('EN', 'wiederholung', true) }
                    ]
                }
                res(lng)
            } else {
                let lng: Language = {
                    id: 'FR',
                    title: 'Francais',
                    flag: '🇫🇷',
                    units: [
                        { ...unit('FR', '78465a', false) },
                        { ...unit('FR', '78465b', false) },
                        { ...unit('FR', '78465c', false) },
                        { ...unit('EN', 'wiederholung', true) }
                    ]
                }
                res(lng)
            }
        })
    }
}
run()
