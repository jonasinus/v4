import { useEffect, useState } from 'react'
import backgroundSvg from '../../assets/gradient background.svg'
import { Modes } from '../../utility/types'
import useApi from '../../hooks/useApi'
import { UserData } from '../../../api/src/types'

export interface AuthPageProps {
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
    userData: UserData | null
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    api: ReturnType<typeof useApi>
    currentMode: Modes
}

export default function AuthPagePage(_props: AuthPageProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const [mode, setMode] = useState<'login' | 'reset' | 'setnew'>('login')

    useEffect(() => {
        setTimeout(() => {
            setErrorMessage('')
        }, 5000)
    }, [errorMessage])

    useEffect(() => {
        if (!_props.isLoggedIn) {
            setMode('login')
        }
    }, [_props.isLoggedIn])

    return (
        <div className={'page auth' + (_props.isLoggedIn ? ' collapsed' : '') + (' ' + mode)}>
            <div className='background-img-wrapper'>
                <img src={backgroundSvg} alt='background svg' className='background-gradient' />
            </div>
            <div className='logo'>{/*<img src={logo} alt='LOGO' />*/}</div>
            <form
                className='login form'
                onReset={(_ev) => {
                    _ev.preventDefault()
                    setUsername('')
                    setPassword('')
                }}>
                <div className='welcome-msg'>
                    {mode == 'login' && (
                        <>
                            <h1>Hello</h1>
                            <p>logge dich ein um fortzufahren</p>
                        </>
                    )}{' '}
                    {mode == 'reset' && (
                        <>
                            <h1>
                                Passwort <br /> vergessen?
                            </h1>
                            <p>Kein Problem! Einfach zurücksetzen</p>
                        </>
                    )}
                    {mode == 'setnew' && (
                        <>
                            <h1>Passwort ändern</h1>
                            <p>Neu hier oder Passwort zurückgesetzt?</p>
                        </>
                    )}
                </div>
                {errorMessage !== '' && <div className={'error shown'}>{errorMessage}</div>}
                {mode !== 'setnew' && (
                    <div className={'email-input input'}>
                        <svg width='31' height='31' viewBox='0 0 31 31' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M15.7487 4.10436C9.54935 4.10436 4.51972 9.13783 4.51972 15.3419C4.51972 21.5459 9.54935 26.5794 15.7487 26.5794C16.7838 26.5794 17.6202 27.4163 17.6202 28.4523C17.6202 29.4883 16.7838 30.3252 15.7487 30.3252C7.47901 30.3252 0.776733 23.6178 0.776733 15.3419C0.776733 7.06591 7.47901 0.358521 15.7487 0.358521C24.0183 0.358521 30.7206 7.06591 30.7206 15.3419V17.2148C30.7206 20.3168 28.2058 22.8335 25.1061 22.8335C23.3925 22.8335 21.8544 22.061 20.8251 20.8494C19.4916 22.0785 17.7079 22.8335 15.7487 22.8335C11.6138 22.8335 8.2627 19.4799 8.2627 15.3419C8.2627 11.2039 11.6138 7.8502 15.7487 7.8502C17.3804 7.8502 18.8893 8.3711 20.1174 9.26074C20.4508 8.96809 20.8836 8.78666 21.3631 8.78666C22.3983 8.78666 23.2346 9.62362 23.2346 10.6596V15.3419V17.2148C23.2346 18.2507 24.0709 19.0877 25.1061 19.0877C26.1413 19.0877 26.9776 18.2507 26.9776 17.2148V15.3419C26.9776 9.13783 21.948 4.10436 15.7487 4.10436ZM19.4916 15.3419C19.4916 13.2758 17.8132 11.596 15.7487 11.596C13.6842 11.596 12.0057 13.2758 12.0057 15.3419C12.0057 17.4079 13.6842 19.0877 15.7487 19.0877C17.8132 19.0877 19.4916 17.4079 19.4916 15.3419Z' />
                        </svg>
                        <label className={username.trim() === '' ? 'v' : 'h'}>max.mustermann</label>
                        <input type='text' onInput={(_ev) => setUsername(_ev.currentTarget.value)} />
                    </div>
                )}
                {mode === 'login' && (
                    <>
                        <div className={'password-input input'}>
                            <svg width='28' height='33' viewBox='0 0 28 33' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M21.4092 6.531L21.4092 6.53098L21.4073 6.52483C20.3907 3.2846 17.4402 0.910217 13.8735 0.910217C9.53129 0.910217 6.01254 4.43268 6.01254 8.77689V12.1477H5.4518C2.66066 12.1477 0.398071 14.4112 0.398071 17.205V26.5696C0.398071 29.3635 2.66066 31.6269 5.4518 31.6269H22.2952C25.0876 31.6269 27.3489 29.3634 27.3489 26.5696V17.205C27.3489 14.4112 25.0876 12.1477 22.2952 12.1477H8.63403V8.77689C8.63403 5.87829 10.9308 3.53314 13.8735 3.53314C16.2468 3.53314 18.2503 5.1109 18.8946 7.27997L18.8946 7.2801C19.0991 7.96785 19.8332 8.37159 20.5263 8.15846C21.222 7.95222 21.6134 7.22325 21.4092 6.531ZM10.2234 21.8873C10.2234 22.6092 10.8121 23.1988 11.5341 23.1988H16.2129C16.9349 23.1988 17.5236 22.6092 17.5236 21.8873C17.5236 21.1654 16.9349 20.5759 16.2129 20.5759H11.5341C10.8121 20.5759 10.2234 21.1654 10.2234 21.8873ZM3.01956 17.205C3.01956 15.8608 4.10881 14.7706 5.4518 14.7706H22.2952C23.6377 14.7706 24.7275 15.8609 24.7275 17.205V26.5696C24.7275 27.9138 23.6377 29.004 22.2952 29.004H5.4518C4.10881 29.004 3.01956 27.9138 3.01956 26.5696V17.205Z'
                                    strokeWidth='0.75'
                                />
                            </svg>
                            <label className={password.trim() === '' ? 'v' : 'h'}>password</label>
                            <input type='password' onInput={(_ev) => setPassword(_ev.currentTarget.value)} />
                            <p className='forgot' tabIndex={0} onClick={(_ev) => setMode('reset')}>
                                passwort wergessen?
                            </p>
                        </div>
                        <div className='einloggen'>
                            <input
                                type='button'
                                value='Anmelden'
                                onClick={async (_ev) => {
                                    _ev.preventDefault()
                                    try {
                                        await _props.api.login(username, password)
                                        let ud = await _props.api.getUserData()
                                        console.log({ ud })
                                        if (!ud.passwordSet) {
                                            setConfirmedPassword('')
                                            setPassword('')
                                            setUsername('')
                                            setPassword('')
                                            setMode('setnew')
                                            _props.setUserData(ud)
                                        } else _props.setIsLoggedIn(true)
                                    } catch (_error) {
                                        setErrorMessage(('Error logging in: ' + _error) as string)
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
                {mode === 'reset' && (
                    <>
                        <div className='einloggen'>
                            <input
                                type='button'
                                value='Zurück'
                                onClick={(_ev) => {
                                    _ev.preventDefault()
                                    setMode('login')
                                }}
                            />
                            <input
                                type='button'
                                value='Zurücksetzen'
                                onClick={async (_ev) => {
                                    _ev.preventDefault()
                                    try {
                                        setErrorMessage('Info: ' + ((await _props.api.resetPassword(username)) as unknown as { msg: string }).msg)
                                    } catch (_error) {
                                        setErrorMessage(_error as string)
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
                {mode === 'setnew' && (
                    <>
                        <div className={'password-input input'}>
                            <svg width='28' height='33' viewBox='0 0 28 33' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M21.4092 6.531L21.4092 6.53098L21.4073 6.52483C20.3907 3.2846 17.4402 0.910217 13.8735 0.910217C9.53129 0.910217 6.01254 4.43268 6.01254 8.77689V12.1477H5.4518C2.66066 12.1477 0.398071 14.4112 0.398071 17.205V26.5696C0.398071 29.3635 2.66066 31.6269 5.4518 31.6269H22.2952C25.0876 31.6269 27.3489 29.3634 27.3489 26.5696V17.205C27.3489 14.4112 25.0876 12.1477 22.2952 12.1477H8.63403V8.77689C8.63403 5.87829 10.9308 3.53314 13.8735 3.53314C16.2468 3.53314 18.2503 5.1109 18.8946 7.27997L18.8946 7.2801C19.0991 7.96785 19.8332 8.37159 20.5263 8.15846C21.222 7.95222 21.6134 7.22325 21.4092 6.531ZM10.2234 21.8873C10.2234 22.6092 10.8121 23.1988 11.5341 23.1988H16.2129C16.9349 23.1988 17.5236 22.6092 17.5236 21.8873C17.5236 21.1654 16.9349 20.5759 16.2129 20.5759H11.5341C10.8121 20.5759 10.2234 21.1654 10.2234 21.8873ZM3.01956 17.205C3.01956 15.8608 4.10881 14.7706 5.4518 14.7706H22.2952C23.6377 14.7706 24.7275 15.8609 24.7275 17.205V26.5696C24.7275 27.9138 23.6377 29.004 22.2952 29.004H5.4518C4.10881 29.004 3.01956 27.9138 3.01956 26.5696V17.205Z'
                                    strokeWidth='0.75'
                                />
                            </svg>
                            <label className={password.trim() === '' ? 'v' : 'h'}>password</label>
                            <input
                                type='password'
                                onInput={(_ev) => setPassword(_ev.currentTarget.value)}
                                className={password.length > 8 ? 'alright' : password.length === 0 ? 'empty' : 'bad'}
                            />
                        </div>
                        <div className={'password-input input'}>
                            <svg width='28' height='33' viewBox='0 0 28 33' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M21.4092 6.531L21.4092 6.53098L21.4073 6.52483C20.3907 3.2846 17.4402 0.910217 13.8735 0.910217C9.53129 0.910217 6.01254 4.43268 6.01254 8.77689V12.1477H5.4518C2.66066 12.1477 0.398071 14.4112 0.398071 17.205V26.5696C0.398071 29.3635 2.66066 31.6269 5.4518 31.6269H22.2952C25.0876 31.6269 27.3489 29.3634 27.3489 26.5696V17.205C27.3489 14.4112 25.0876 12.1477 22.2952 12.1477H8.63403V8.77689C8.63403 5.87829 10.9308 3.53314 13.8735 3.53314C16.2468 3.53314 18.2503 5.1109 18.8946 7.27997L18.8946 7.2801C19.0991 7.96785 19.8332 8.37159 20.5263 8.15846C21.222 7.95222 21.6134 7.22325 21.4092 6.531ZM10.2234 21.8873C10.2234 22.6092 10.8121 23.1988 11.5341 23.1988H16.2129C16.9349 23.1988 17.5236 22.6092 17.5236 21.8873C17.5236 21.1654 16.9349 20.5759 16.2129 20.5759H11.5341C10.8121 20.5759 10.2234 21.1654 10.2234 21.8873ZM3.01956 17.205C3.01956 15.8608 4.10881 14.7706 5.4518 14.7706H22.2952C23.6377 14.7706 24.7275 15.8609 24.7275 17.205V26.5696C24.7275 27.9138 23.6377 29.004 22.2952 29.004H5.4518C4.10881 29.004 3.01956 27.9138 3.01956 26.5696V17.205Z'
                                    strokeWidth='0.75'
                                />
                            </svg>
                            <label className={confirmedPassword.trim() === '' ? 'v' : 'h'}>confirmPassword</label>
                            <input
                                type='password'
                                onInput={(_ev) => setConfirmedPassword(_ev.currentTarget.value)}
                                className={
                                    confirmedPassword.length > 8 && confirmedPassword == password ? 'alright' : confirmedPassword.length === 0 ? 'empty' : 'bad'
                                }
                            />
                        </div>
                        <div className='einloggen'>
                            <input
                                type='button'
                                value='Bestätigen'
                                onClick={async (_ev) => {
                                    _ev.preventDefault()
                                    if (password != confirmedPassword) {
                                        setErrorMessage('Passwörter müssen übereinstimmen!')
                                        return
                                    }
                                    if (password.trim() === '') {
                                        setErrorMessage('neues passwort muss einen Wert haben')
                                        return
                                    }
                                    try {
                                        await _props.api.setNewPassword(password)
                                        _props.setIsLoggedIn(true)
                                    } catch (_error) {
                                        setErrorMessage(('Error saving password: ' + _error) as string)
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}
