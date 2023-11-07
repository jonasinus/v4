import { AreaChart, XAxis, YAxis, Tooltip, Area, ResponsiveContainer, Legend } from 'recharts'
import { OutletProps } from '../../../api/src/types'

export function StatsPage(_props: OutletProps) {
    return (
        <div className='statistics'>
            <div className='weekly-chart'>
                <h3>Deine letzte Woche:</h3>
                <ResponsiveContainer width='100%' height={300} minWidth={100}>
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
            <div className='average'>
                <h3>Insgesamt:</h3>
                <div className='data'>
                    <p>
                        Score: <b>{_props.userData!.stats.average.score}</b>
                    </p>
                    <p>
                        Zeit / Tag: <b>{_props.userData!.stats.average.timePerDay}</b>
                    </p>
                    <p>
                        Wörter / Session: <b>{_props.userData!.stats.average.wordsPerSession}</b>
                    </p>
                    <p>
                        Sessions / Monat: <b>{_props.userData!.stats.average.sessionsPerMonth}</b>
                    </p>
                </div>
            </div>
            <div className='worst'>
                <h3>Wiederholungsbedarf:</h3>
                <div className='data'>
                    <div className='en'>
                        <h4>
                            {_props.userData!.stats.worstChapter.lang.flag} {_props.userData!.stats.worstChapter.lang.title}:
                        </h4>
                        <p>{_props.userData!.stats.worstChapter.title}</p>
                        <div className='d'>
                            <p>Score: {_props.userData!.stats.worstChapter.averageScore}</p>
                            <p>Korrekturen: {_props.userData!.stats.worstChapter.mostCorrections.join(' | ')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='best'>
                <h3>Bestes Kapitel:</h3>
                <div className='data'>
                    <div className='en'>
                        <h4>
                            {_props.userData!.stats.bestChapter.lang.flag} {_props.userData!.stats.bestChapter.lang.title}:
                        </h4>
                        <p>{_props.userData!.stats.bestChapter.title}</p>
                        <div className='d'>
                            <p>Score: {_props.userData!.stats.bestChapter.averageScore}</p>
                            <p>Korrekturen: {_props.userData!.stats.bestChapter.mostCorrections.join(' | ')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
