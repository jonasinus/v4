import { useEffect } from 'react'
import { timeAgo } from '../../utility/timing'
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Legend, Area } from 'recharts'
import { Language, LanguageId, OutletProps, Word } from '../../../api/src/types'

export function Me(_props: OutletProps) {
    useEffect(() => {
        if (_props.userData === null) {
            _props.setIsLoggedIn(false)
        }
    }, [_props.userData])

    function openLangMenu(langId: LanguageId) {
        _props.switchMode('view')
        let lang = _props.langData.find((l) => l.id == langId)!
        let unit = lang.units[0]
        let chapter = unit.chapters[0]
        _props.setCurrentLanguageConfig({ lang, unit, chapter, shown: false })
    }

    function resumeExercise(lang: Language, to: Word) {
        let unit = lang.units.find((u) => u.id === to.unitId)!
        _props.setCurrentLanguageConfig({ lang: lang, unit, chapter: unit.chapters.find((c) => c.id === to.chapterId)!, shown: false })
        setTimeout(() => _props.switchMode('exercise'), 250)
    }

    function resumeView(lang: Language, from: Word) {
        let unit = lang.units.find((u) => u.id === from.unitId)!
        _props.setCurrentLanguageConfig({ lang: lang, unit, chapter: unit.chapters.find((c) => c.id === from.chapterId)!, shown: false })
        setTimeout(() => _props.switchMode('exercise'), 250)
    }

    return (
        <div className='me'>
            <div className='section'>
                <h2>Hallo {_props.userData!.firstName.charAt(0).toUpperCase() + _props.userData!.firstName.slice(1)}</h2>
                <p>{_props.userData!.classId}</p>
            </div>

            <div className='section languages'>
                <h3>Deine Sprachen:</h3>
                <ul className='list'>
                    {_props.userData?.languages.map((lang) => (
                        <button
                            key={lang.id}
                            className='list-item'
                            onClick={(_) => {
                                openLangMenu(lang.id)
                            }}>
                            <span className='flag'>{lang.flag}</span>
                            {lang.title}
                        </button>
                    ))}
                </ul>
            </div>

            <div className='quick-stats'>
                <h3>Deine Letzte Woche:</h3>
                <br />
                <ResponsiveContainer width='100%' height={150} minWidth={100}>
                    <AreaChart
                        width={500}
                        height={300}
                        data={_props.userData!.stats.weekChartData}
                        margin={{
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0
                        }}>
                        <XAxis dataKey='name' />
                        <YAxis yAxisId='left' />
                        <YAxis yAxisId='right' orientation='right' max={50} />
                        <Tooltip />
                        <Legend />
                        <Area yAxisId='left' type='monotone' dataKey='Wörter' stroke='#8b0a42ff' fill='#8b0a42ff' activeDot={{ r: 5 }} opacity={0.75} />
                        <Area yAxisId='right' type='monotone' dataKey='Score' stroke='#0a6d8bf0' fill='#0a6d8b80' activeDot={{ r: 5 }} opacity={0.75} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className='section'>
                <h3>Einfach weitermachen:</h3>
                <ul className='list'>
                    {_props.userData?.recentlyExcersised.map((re) => (
                        <li key={Math.random()}>
                            <button
                                onClick={(_) => {
                                    resumeExercise(re.lang, re.to)
                                }}>
                                <p>
                                    <span className='flag'>{re.lang.flag}</span> {re.lang.title}: <i>{re.from.foreign}</i> → <i>{re.to.foreign}</i>
                                </p>
                                <p className='date'>{timeAgo(new Date(re.when))}</p>
                            </button>
                        </li>
                    ))}
                </ul>
                <h3>Oder wiederholen</h3>
                <ul className='list'>
                    {_props.userData?.recentlyExcersised.map((re) => (
                        <li key={Math.random()}>
                            <button
                                onClick={(_) => {
                                    resumeView(re.lang, re.from)
                                }}>
                                <p>
                                    <span className='flag'>{re.lang.flag}</span>
                                    {re.lang.title}: <i>{re.from.foreign}</i> → <i>{re.to.foreign}</i>
                                </p>
                                <p className='date'>{timeAgo(new Date(re.when))}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='section'>
                <h3>Erfolge: </h3>
                <div className='badges'>
                    {_props.userData?.badges.map((ba) => (
                        <div className='badge' key={ba.id}>
                            <img src={ba.iconUrl} alt='' />
                            <h4>{ba.title}</h4>
                            <p>{ba.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='section progress'>
                <h3>Fortschritt:</h3>
                {_props.userData?.languages.map((lng) => (
                    <div>
                        <p>
                            <span className='flag'>{lng.flag}</span>
                            {lng.title}:
                        </p>
                        <p className='date'>{lng.progress}%</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
