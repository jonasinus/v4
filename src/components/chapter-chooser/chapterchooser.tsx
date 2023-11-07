import { useState, useEffect } from 'react'
import { LanguageId, UserData, Language, VocabUnit, VocabChapter } from '../../utility/types'

export interface ChapterChooserProps {
    callback: ({ lang, unit, chapter }: { lang: Language; unit: VocabUnit; chapter: VocabChapter | 'unset' }) => any
    currentLangConfig: { lang: Language; unit: VocabUnit; chapter: VocabChapter; shown: boolean } | null
    setCurrentLangConfig: React.Dispatch<React.SetStateAction<{ lang: Language; unit: VocabUnit; chapter: VocabChapter; shown: boolean } | null>>
    userData: UserData | null
    api: { getLangData: (lang: LanguageId) => Promise<Language>; getLangsData: () => Promise<Omit<Language, 'units'>[]> }
}

export default function ChapterChooser(props: ChapterChooserProps) {
    const [languages, setLanguages] = useState<Omit<Language, 'units'>[]>([])
    const [userLangs, setUserLangs] = useState<Language[]>([])

    const [lang, setLang] = useState<Language | null>(props.currentLangConfig?.lang || userLangs[0])
    const [unit, setUnit] = useState<VocabUnit | null>(props.currentLangConfig?.unit || null)
    const [chapter, setChapter] = useState<VocabChapter | null | 'unset'>(props.currentLangConfig?.chapter || null)

    useEffect(() => {
        ;(async () => {
            let fff: Language[] = []
            if (props.userData) {
                for (let i = 0; i < props.userData.languages.length; i++) {
                    let nl = await props.api.getLangData(props.userData.languages[i].id)
                    fff.push(nl)
                }
            }
            setUserLangs(fff)
        })()
    }, [languages, props.userData, props.userData?.languages])

    useEffect(() => {
        setLang(userLangs[0])
    }, [userLangs])

    useEffect(() => {
        if (lang) setUnit(lang.units[0])
    }, [lang])

    useEffect(() => {
        if (lang && unit) setChapter(unit.chapters[0])
    }, [unit])

    useEffect(() => {
        ;(async () => {
            let lngs = await props.api.getLangsData()
            setLanguages(lngs)
        })()

        if (props.currentLangConfig != null) {
            setLang(props.currentLangConfig.lang)
            setUnit(props.currentLangConfig.unit)
            setChapter(props.currentLangConfig.chapter)
        }
    }, [])

    if (props.currentLangConfig && !props.currentLangConfig.shown) return <div className='chapter-chooser hidden'></div>

    return (
        <div className='chapter-chooser'>
            <div className='langs'>
                <h3>Sprachen:</h3>
                <div className='options'>
                    {languages
                        .filter((l) => userLangs.map((ul) => ul.id).includes(l.id))
                        .map((l) => (
                            <button
                                key={'language' + l.id}
                                onClick={(_) => setLang(userLangs.find((ul) => ul.id === l.id) || null)}
                                className={lang && lang.id === l.id ? 'selected' : ''}>
                                {l.flag} - {l.title}
                            </button>
                        ))}
                </div>
            </div>
            <div className='units'>
                <h3>Einheiten:</h3>
                <div className='options'>
                    {lang?.units.map((u) => (
                        <button key={'unit' + u.id} onClick={(_) => setUnit(u)} className={unit && unit.id === u.id ? 'selected' : ''}>
                            {u.title}
                        </button>
                    ))}
                </div>
            </div>
            <div className='chapter'>
                <h3>Kapitel:</h3>
                <div className='options'>
                    {unit?.chapters.map((c) => (
                        <button
                            key={'chapter' + c.id}
                            onClick={(_) => setChapter(c)}
                            className={chapter && chapter != 'unset' && chapter.id === c.id ? 'selected' : ''}>
                            {c.title}
                        </button>
                    ))}
                </div>
            </div>
            <div className='misc'></div>
            <div className='ctrls'>
                {props.currentLangConfig &&
                    props.currentLangConfig.lang != null &&
                    props.currentLangConfig.unit != null &&
                    props.currentLangConfig.chapter != null && (
                        <button onClick={(_) => props.setCurrentLangConfig({ ...props.currentLangConfig!, shown: false })}>Abbrechen</button>
                    )}
                <button
                    className='save-button'
                    onClick={(_) => {
                        if (lang && unit && chapter) props.callback({ lang: lang, unit: unit, chapter: chapter })
                    }}>
                    Speichern
                </button>
            </div>
        </div>
    )
}
