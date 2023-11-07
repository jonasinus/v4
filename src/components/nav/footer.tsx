import { OutletProps } from '../../../api/src/types'
import { BookIcon, StatsIcon, PersonIcon, RocketIcon } from '../../assets/icons'

export function FooterNav(props: OutletProps) {
    if (props.userData && props.isLoggedIn) {
        if (props.userData!.role === 'student')
            return (
                <nav className='nav-footer'>
                    <button className={props.currentMode == 'view' ? 'active' : 'passive'} onClick={(_) => props.switchMode('view')}>
                        <BookIcon />
                    </button>
                    <button className={props.currentMode == 'stats' ? 'active' : 'passive'} onClick={(_) => props.switchMode('stats')}>
                        <StatsIcon />
                    </button>
                    <button className={props.currentMode == 'me' ? 'active' : 'passive'} onClick={(_) => props.switchMode('me')}>
                        <PersonIcon />
                    </button>
                    <button className={props.currentMode == 'exercise' ? 'active' : 'passive'} onClick={(_) => props.switchMode('exercise')}>
                        <RocketIcon />
                    </button>
                </nav>
            )
        else return <></>
    } else return <></>
}
