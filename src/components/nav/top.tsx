import { BackIcon, SettingsIcon, LogoutIcon } from '../../assets/icons'
import { NavProps } from '../../utility/types'

export interface TopnavProps extends NavProps {}

export function Topnav(props: TopnavProps) {
    return (
        <nav className='top-nav'>
            <button onClick={(_) => props.switchMode(props.currentMode == 'settings' ? 'back' : 'settings')}>
                {props.currentMode == 'settings' ? <BackIcon /> : <SettingsIcon />}
            </button>
            <h3>{props.tabTitle}</h3>
            <button
                onClick={async (_) => {
                    try {
                        props.api.logout()
                        props.setIsLoggedIn(false)
                        props.switchMode('auth')
                    } catch (_err) {}
                }}>
                <LogoutIcon />
            </button>
        </nav>
    )
}
