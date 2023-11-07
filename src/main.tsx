import './css/index.css'
import './css/nav.css'
import './css/chapterchooser.css'
import './css/auth.css'
import './css/vocab.css'
import './css/settings.css'
import './css/stats.css'
import './css/exercise.css'
import './css/me.css'

import ReactDOM from 'react-dom/client'
import { useEffect, useState } from 'react'
import AuthPagePage from './components/auth/auth.page'
import useApi from './hooks/useApi'
import { Language, Modes, UserData, VocabChapter, VocabUnit } from '../api/src/types'

import { Outlet } from './components/outlet/outlet'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

const consts: {
    redirectAfterLogin: Modes
} = {
    redirectAfterLogin: 'me'
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [currentMode, setCurrentMode] = useState<Modes>('auth')
    const [modeHistory, setModeHistory] = useState<Modes[]>([currentMode])
    const [isMobile, _setMobile] = useState<boolean>(window.innerWidth <= 768)
    const [tabTitle, setTabTitle] = useState<string>('')

    const [currentPanicFunction, setCurrentPanicFunction] = useState<(() => void | Promise<void>) | null>(null)

    const [currentLangConfig, setCurrentLangConfig] = useState<{ lang: Language; unit: VocabUnit; chapter: VocabChapter; shown: boolean } | null>(null)

    const [langsData, setLangsData] = useState<Language[]>([])

    const api = useApi()

    function switchMode(to: Modes | 'back', noPanic?: any) {
        if (typeof currentPanicFunction == 'function' && noPanic == undefined) {
            currentPanicFunction()
        }
        if (to != 'back') {
            setCurrentMode(to), setModeHistory([...modeHistory, to])
        } else {
            return switchMode(modeHistory[modeHistory.length - 2])
        }
        switch (to) {
            case 'auth':
                setTabTitle('Authentification')
                break
            case 'me':
                setTabTitle('Dashboard')
                break
            case 'exercise':
                setTabTitle('Lernen')
                break
            case 'stats':
                setTabTitle('Statistiken')
                break
            case 'view':
                setTabTitle('Vokabular')
                break
            case 'settings':
                setTabTitle('Einstellungen')
                break
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            if (userData!.role === 'teacher') switchMode('teacher')
            else switchMode(consts.redirectAfterLogin, true)
            api.getUserData().then((data) => setUserData(data))
        } else setCurrentMode('auth')
    }, [isLoggedIn])

    function confirm(msg: string, { confirmed, canceled }: { confirmed: () => void; canceled: () => void }) {
        if (window.confirm(msg)) confirmed()
        else canceled()
    }

    useEffect(() => {
        api.verifyToken().then(() => setIsLoggedIn(true))
        api.getLangsData().then((langsData) => setLangsData(langsData))

        function panicExit() {
            console.warn('panic-save, tab got blurred/closed!')
            if (typeof currentPanicFunction == 'function') currentPanicFunction()
        }

        document.addEventListener('blur', panicExit)
        return () => {
            document.removeEventListener('blur', panicExit)
        }
    }, [])

    useEffect(() => {
        console.log({ langsData })
    }, [langsData])

    return (
        <>
            <AuthPagePage
                api={api}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                setUserData={setUserData}
                userData={userData}
                currentMode={currentMode}
            />

            <Outlet
                userData={userData}
                currentMode={currentMode}
                isMobile={isMobile}
                api={api}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                switchMode={switchMode}
                currentLanguageconfig={currentLangConfig}
                setCurrentLanguageConfig={setCurrentLangConfig}
                tabTitle={tabTitle}
                setTabTitle={setTabTitle}
                confirm={confirm}
                langData={langsData}
                setLangData={setLangsData}
                setCurrentPanicFunction={setCurrentPanicFunction}
            />
        </>
    )
}
