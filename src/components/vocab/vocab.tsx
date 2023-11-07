import { useState, useEffect } from 'react'
import { ArrowBack, ArrowForward, Search, Sort } from '../../assets/icons'
import { OutletProps, VocabChapter } from '../../utility/types'

export interface VocabProps extends OutletProps {}
export function VocabPage(props: VocabProps) {
    const [_chapter, _setChapter] = useState<VocabChapter | null>(null)

    const [isLastChapter, setIsLastChapter] = useState<boolean>(false)
    const [isFirstChapter, setIsFirstChapter] = useState<boolean>(false)

    useEffect(() => {
        let isFirst = props.currentLanguageconfig!.chapter === props.currentLanguageconfig!.lang.units[0].chapters[0]
        let lastUnitIdx = props.currentLanguageconfig!.lang.units.length - 1
        let lastUnit = props.currentLanguageconfig!.lang.units[lastUnitIdx]
        let lastChapterIdx = lastUnit.chapters.length - 1
        let lastChapter = lastUnit.chapters[lastChapterIdx]
        let isLast = lastChapter === props.currentLanguageconfig!.chapter
        console.log({ isFirst, isLast, lastUnit, lastChapter, lastChapterIdx, lastUnitIdx })

        setIsFirstChapter(isFirst)
        setIsLastChapter(isLast)
    }, [props.currentLanguageconfig])

    function nextChapter() {
        let chapter = props.currentLanguageconfig!.chapter
        let unit = props.currentLanguageconfig!.unit
        let lang = props.currentLanguageconfig!.lang

        let chapterIdx = unit.chapters.indexOf(chapter)
        let unitIdx = lang.units.indexOf(unit)

        if (chapterIdx === unit.chapters.length - 1) {
            if (unitIdx === lang.units.length - 1) {
                alert('no more chapters in this language')
            } else {
                let nextUnit = lang.units[unitIdx + 1]
                props.setCurrentLanguageConfig({
                    ...props.currentLanguageconfig!,
                    unit: nextUnit,
                    chapter: nextUnit.chapters[0]
                })
            }
        } else {
            props.setCurrentLanguageConfig({ ...props.currentLanguageconfig!, chapter: unit.chapters[chapterIdx + 1] })
        }
    }

    function prevChapter() {
        let chapter = props.currentLanguageconfig!.chapter
        let unit = props.currentLanguageconfig!.unit
        let lang = props.currentLanguageconfig!.lang

        let chapterIdx = unit.chapters.indexOf(chapter)
        let unitIdx = lang.units.indexOf(unit)

        if (chapterIdx === 0) {
            if (unitIdx === 0) {
                alert('no previous chapter in this language')
            } else {
                let prevUnit = lang.units[unitIdx - 1]
                props.setCurrentLanguageConfig({
                    ...props.currentLanguageconfig!,
                    unit: prevUnit,
                    chapter: prevUnit.chapters[prevUnit.chapters.length - 1]
                })
            }
        } else {
            props.setCurrentLanguageConfig({ ...props.currentLanguageconfig!, chapter: unit.chapters[chapterIdx - 1] })
        }
    }

    const [popup, setPopup] = useState<null | 'search' | 'sort'>(null)
    const [order, setOrder] = useState<'normal' | 'a-z' | 'score' | 'training' | 'random'>('normal')
    const [searchQuery, setSearchQuery] = useState('')

    function search() {
        console.log('searching for: ', searchQuery)
    }

    useEffect(() => {
        console.log({ popup })
    }, [popup])

    return (
        <div className='vocab'>
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
                    <span>{props.currentLanguageconfig?.lang.flag}</span>
                    <span className='slash'> / </span>
                    <span>{props.currentLanguageconfig?.unit.title}</span>
                </button>
            </div>
            <div>
                <h2>{props.currentLanguageconfig?.chapter.title}</h2>
                <p>{props.currentLanguageconfig?.chapter.words.length} Wörter</p>
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
                <div className='search'>
                    <button onClick={(_) => (popup === 'search' ? setPopup(null) : setPopup('search'))}>
                        <Search fill='black' />
                    </button>
                    <div className='popup search' style={{ display: popup != 'search' ? 'none' : '' }}>
                        <input
                            type='text'
                            placeholder='Suchen'
                            onInput={(ev) => setSearchQuery(ev.currentTarget.value)}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') search()
                            }}
                        />
                        <button className='x' onClick={(_) => setPopup(null)}>
                            ×
                        </button>
                    </div>
                </div>
            </div>
            <ul>
                {props.currentLanguageconfig?.chapter.words
                    .sort((a, b) => {
                        if (order === 'normal') return a.idx - b.idx
                        //return props.currentLanguageconfig!.chapter.words.indexOf(a) - props.currentLanguageconfig!.chapter.words.indexOf(b)
                        else if (order === 'a-z') return a.foreign.localeCompare(b.foreign)
                        else if (order === 'random') {
                            return Math.random() - 0.5
                        } else return 0
                    })
                    .filter((e) => {
                        if (searchQuery.trim() === '') return e
                        else {
                            let includes = false
                            if (e.foreign.includes(searchQuery)) includes = true
                            for (let i = 0; i < e.native.length; i++) {
                                if (e.native[i].includes(searchQuery)) includes = true
                            }
                            if (includes) return e
                        }
                    })
                    .map((w) => (
                        <li>
                            <p className='foreign'>{w.foreign}</p>
                            <span> | </span>
                            <p className='native'>
                                {w.native.map((n, i, a) => (
                                    <span>
                                        {n}
                                        {i + 1 < a.length ? <span className='slash'> / </span> : ''}
                                    </span>
                                ))}
                            </p>
                        </li>
                    ))}
            </ul>
            <div className='ctrls'>
                <button onClick={(_) => prevChapter()} disabled={isFirstChapter}>
                    <ArrowBack />
                </button>
                <p>
                    Einheit {(props.currentLanguageconfig?.lang.units.indexOf(props.currentLanguageconfig.unit) || 0) + 1} <span className='slash'> / </span>{' '}
                    {props.currentLanguageconfig?.lang.units.length}
                </p>
                <p>
                    Kapitel {(props.currentLanguageconfig?.unit.chapters.indexOf(props.currentLanguageconfig.chapter) || 0) + 1}
                    <span className='slash'> / </span> {props.currentLanguageconfig?.unit.chapters.length}
                </p>
                <button onClick={(_) => nextChapter()} disabled={isLastChapter}>
                    <ArrowForward />
                </button>
            </div>
        </div>
    )
}
