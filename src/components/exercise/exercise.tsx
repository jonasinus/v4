import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { Sort } from '../../assets/icons'
import useComparator from '../../hooks/useWordComparator'
import useApi from '../../hooks/useApi'
import { Language, OutletProps, VocabChapter, VocabUnit, Word } from '../../../api/src/types'

export function Exercise(props: OutletProps) {
    const [popup, setPopup] = useState<null | 'search' | 'sort'>(null)
    const [order, setOrder] = useState<'normal' | 'a-z' | 'score' | 'training' | 'random'>('normal')

    const comparator = useComparator()

    const [miniStats, _setMiniStats] = useState<{ wordCount: number; correctInputCount: number; averageScore: number; skippedWords: number }>({
        averageScore: 100,
        correctInputCount: 0,
        skippedWords: 0,
        wordCount: 0
    })

    useEffect(() => {
        console.log({ popup })
    }, [popup])

    useEffect(() => {
        console.log(miniStats)
    }, [miniStats])

    return (
        <div className='exercise'>
            <div className='locator'>
                <button
                    onClick={(_) => {
                        let obj =
                            {
                                lang: props.currentLanguageconfig!.lang,
                                unit: props.currentLanguageconfig!.unit,
                                chapter: props.currentLanguageconfig!.chapter,
                                shown: true
                            } || null
                        console.log({ obj })
                        props.setCurrentLanguageConfig({ ...props.currentLanguageconfig!, shown: true })
                    }}>
                    <span className='flag'>{props.currentLanguageconfig?.lang.flag}</span>
                    <span className='slash'> / </span>
                    <span>{props.currentLanguageconfig?.unit.title}</span>
                </button>
            </div>
            <div className='options'>
                <div className='order'>
                    <button onClick={(_) => (popup === 'sort' ? setPopup(null) : setPopup('sort'))}>
                        <Sort fill='black' />
                    </button>
                    <div className='popup order' style={{ display: popup != 'sort' ? 'none' : '' }}>
                        <div className='btns'>
                            <button className={order === 'normal' ? 'active' : 'inactive'} onClick={(_) => setOrder('normal')}>
                                normal
                            </button>
                            <button className={order === 'a-z' ? 'active' : 'inactive'} onClick={(_) => setOrder('a-z')}>
                                a-z
                            </button>
                            <button className={order === 'random' ? 'active' : 'inactive'} onClick={(_) => setOrder('random')}>
                                random
                            </button>
                            {/* <button className={order === 'training' ? 'active' : 'inactive'} onClick={(_) => setOrder('training')}>
                                x-male-trainiert
                            </button> */}
                            {/* <button className={order === 'score' ? 'active' : 'inactive'} onClick={(_) => setOrder('score')}>
                                score
                            </button> */}
                        </div>
                        <button className='x' onClick={(_) => setPopup(null)}>
                            ×
                        </button>
                    </div>
                </div>
            </div>
            <div className='questions'>
                {props.currentLanguageconfig && (
                    <Question
                        words={props.currentLanguageconfig?.chapter.words}
                        compare={comparator}
                        {...props}
                        setPanicfunction={props.setCurrentPanicFunction}
                        api={props.api}
                        setMiniStats={_setMiniStats}
                        ministats={miniStats}
                    />
                )}
            </div>
            <div className='ministats'>
                <p>
                    Gelernte Wörter: <b>{miniStats.wordCount}</b>{' '}
                    <span>({props.userData!.languageStats.find((l) => l.id === props.currentLanguageconfig!.lang.id)!.totalWordsTrained.length})</span>
                </p>
                <p>
                    Übersprungene Wörter: <b>{miniStats.skippedWords}</b>
                </p>
                <p>
                    Richtige Eingaben: <b>{miniStats.correctInputCount}</b>
                </p>
                <p>
                    Durchschnittlicher Score: <b>{miniStats.averageScore}</b>{' '}
                    <span>({props.userData!.languageStats.find((l) => l.id === props.currentLanguageconfig!.lang.id)!.averageScore})</span>
                </p>
            </div>
        </div>
    )
}

interface QuestionsProps {
    words: Word[]
    compare: ReturnType<typeof useComparator>
    currentLanguageconfig: { lang: Language; unit: VocabUnit; chapter: VocabChapter; shown: boolean } | null
    setCurrentLanguageConfig: React.Dispatch<React.SetStateAction<{ lang: Language; unit: VocabUnit; chapter: VocabChapter; shown: boolean } | null>>
    setPanicfunction: React.Dispatch<React.SetStateAction<(() => void | Promise<void>) | null>>
    api: ReturnType<typeof useApi>
    setMiniStats: Dispatch<SetStateAction<{ wordCount: number; correctInputCount: number; averageScore: number; skippedWords: number }>>
    ministats: { wordCount: number; correctInputCount: number; averageScore: number; skippedWords: number }
}
function Question(props: QuestionsProps) {
    const [input, setInput] = useState('')
    const [state, setState] = useState<'input' | 'check'>('input')

    const [word, setWord] = useState<Word>(props.words![0])

    const [checkResults, setCheckResults] = useState<{ score: number; red: number[]; yellow: number[]; green: number[]; A: string; B: string }>({
        score: 0,
        red: [],
        green: [],
        yellow: [],
        A: '',
        B: ''
    })

    function calculateNewAverage(currentAverage: number, numberOfElements: number, newScore: number): number {
        const sum = currentAverage * numberOfElements

        const updatedSum = sum + newScore

        const updatedNumberOfElements = numberOfElements + 1

        const newAverage = updatedSum / updatedNumberOfElements

        return newAverage
    }

    const [stats, setStats] = useState<(typeof checkResults)[]>([])

    const inputRef = useRef<HTMLInputElement | null>(null)

    function check() {
        setState('check')
        const score = props.compare.levenshteinCompare(word.foreign.toLocaleLowerCase(), input.toLocaleLowerCase())
        const acmpr = props.compare.accentCompare(word.foreign.toLowerCase(), input.toLocaleLowerCase())
        setCheckResults({ score, ...acmpr, A: word.foreign, B: input })
        setStats([...stats, { score, ...acmpr, A: word.foreign, B: input }])
    }

    function next() {
        if (word.idx + 1 >= props.words.length) {
            alert('end of chapter reached!')
            props.setCurrentLanguageConfig({ ...props.currentLanguageconfig!, shown: true })
            return
        }
        props.setMiniStats({
            ...props.ministats,
            averageScore: calculateNewAverage(props.ministats.averageScore, props.ministats.wordCount - props.ministats.skippedWords, checkResults.score),
            wordCount: props.ministats.wordCount + 1,
            correctInputCount: props.ministats.correctInputCount + (checkResults.score === 100 ? 1 : 0)
        })
        setState('input')
        setInput('')
        setCheckResults({ score: 0, red: [], green: [], yellow: [], A: '', B: '' })
        setWord(props.words[word.idx + 1])
    }

    function skip() {
        setState('input')
        setInput('')
        setCheckResults({ score: 0, red: [], green: [], yellow: [], A: '', B: '' })
        setWord(props.words[word.idx + 1])
        props.setMiniStats({ ...props.ministats, skippedWords: props.ministats.skippedWords + 1 })
    }

    async function exit() {
        console.warn('panic exit, saving exercise data (' + (stats.length == 0 ? 'no data needs to be saved' : stats) + ')')
        if (stats.length !== 0) props.api.saveExerciseProgress(stats)
    }

    useEffect(() => {
        props.setPanicfunction(exit)
    }, [])

    useEffect(() => {
        console.log('stats updated! :', { stats })
    }, [stats])

    useEffect(() => {
        inputRef.current?.focus()
    }, [inputRef, state])

    return (
        <div className='question'>
            <div className='display'>
                <h3>
                    Gesucht ist das <u>{/*props.currentLanguageconfig?.lang.title*/ 'Englisch'}e</u> Wort für:{' '}
                </h3>
                <h2>{word.native.join(' oder ')}</h2>
            </div>
            <div className={'input' + (state !== 'input' ? ' h' : ' v')} hidden={state !== 'input'}>
                <input type='text' value={input} onInput={(ev) => setInput(ev.currentTarget.value)} className='ababbaababhfdkjghlkjdf' ref={inputRef} />
            </div>
            <div className={'correct' + (state !== 'check' ? ' h' : ' v')} hidden={state !== 'check'}>
                <div className='ababbaababhfdkjghlkjdf'>
                    {input.split('').map((c, i) => (
                        <span className={checkResults?.green.includes(i) ? 'green' : checkResults?.yellow.includes(i) ? 'yellow' : 'red'}>{c}</span>
                    ))}
                </div>
                <div className='scores'>
                    <p>
                        Genauigkeit: <b>{checkResults?.score}%</b>
                    </p>
                </div>
            </div>
            <div className='ctrls'>
                <button onClick={skip}>Überspringen</button>
                <button onClick={state === 'input' ? check : next}>{state === 'input' ? 'Prüfen' : 'Weiter'}</button>
            </div>
            <div className='idx'>
                <p>{word.idx + 1}</p>
                <span className='slash'> / </span>
                <p>{props.words.length}</p>
            </div>
        </div>
    )
}
