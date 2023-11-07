import { OutletProps } from '../utility/types'
import ChapterChooser from './chapter-chooser/chapterchooser'
import { Me } from './dashboard/me'
import { Exercise } from './exercise/exercise'
import { Settings } from './settings/settings'
import { StatsPage } from './stats/stats'
import TeacherPage from './teacher/teacher'
import { VocabPage } from './vocab/vocab'

export function MainComponent(props: OutletProps) {
    return (
        <main>
            {['exercise', 'view'].includes(props.currentMode) && (
                <ChapterChooser
                    {...props}
                    currentLangConfig={props.currentLanguageconfig}
                    setCurrentLangConfig={props.setCurrentLanguageConfig}
                    callback={({ lang, unit, chapter }) => {
                        if (chapter === 'unset') {
                        } else props.setCurrentLanguageConfig({ lang, unit, chapter, shown: false })
                        return
                    }}
                />
            )}
            {props.currentMode === 'view' &&
                props.currentLanguageconfig?.lang != null &&
                props.currentLanguageconfig?.unit != null &&
                props.currentLanguageconfig?.chapter != null &&
                !props.currentLanguageconfig.shown && <VocabPage {...props} currentLanguageconfig={props.currentLanguageconfig} />}
            {props.currentMode === 'exercise' &&
                props.currentLanguageconfig?.lang != null &&
                props.currentLanguageconfig?.unit != null &&
                props.currentLanguageconfig?.chapter != null &&
                !props.currentLanguageconfig.shown && <Exercise {...props} currentLanguageconfig={props.currentLanguageconfig} />}
            {props.currentMode === 'settings' && <Settings {...props} />}
            {props.currentMode === 'stats' && <StatsPage {...props} />}
            {props.currentMode === 'me' && <Me {...props} />}
            {props.currentMode === 'teacher' && props.userData?.role === 'teacher' && <TeacherPage {...props} />}
            {props.currentMode === 'teacher' && props.userData?.role !== 'teacher' && <>error, you are not allowed to see this content!</>}
        </main>
    )
}
