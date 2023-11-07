import { OutletProps } from '../../../api/src/types'
import backgroundSvg from '../../assets/gradient background.svg'
import { ArrowBack, ArrowForward } from '../../assets/icons'
import { useState } from 'react'

export const settings: { label: string; type: 'boolean' | 'number' | 'string' | 'email' }[] = [
    { label: 'angemeldet bleiben', type: 'boolean' },
    { label: 'Vokabeln lokal speichern', type: 'boolean' }
]

export function Settings(
    _props: OutletProps & {
        innerTab?: 'main' | 'Account-Daten' | 'Passwort Ändern' | 'Erscheinungsbild' | '3rd-Parties' | 'Daten-Auswertung' | 'Sichtbarkeit'
    }
) {
    const [innerTab, setInnerTab] = useState<
        'main' | 'Account-Daten' | 'Passwort Ändern' | 'Erscheinungsbild' | '3rd-Parties' | 'Daten-Auswertung' | 'Sichtbarkeit'
    >(_props.innerTab ?? 'main')

    return (
        <div className='settings'>
            <div className='background-img-wrapper'>
                <img src={backgroundSvg} alt='background svg' className='background-gradient' />
            </div>
            <div className='selection'>
                {innerTab === 'main' && (
                    <>
                        <div className='account'>
                            <img src={_props.userData?.profilePicUrl} />
                            <div>
                                <h3>
                                    {_props.userData?.firstName} {_props.userData?.lastName}
                                </h3>
                                <p>{_props.userData?.classId}</p>
                            </div>
                        </div>
                        <div className='account-settings'>
                            <h3>Account-Verwaltung</h3>
                            <label className=''>
                                <p>Account Daten</p>
                                <button onClick={(_) => setInnerTab('Account-Daten')}>
                                    <ArrowForward fill='gray' />
                                </button>
                            </label>
                            <label>
                                <p>Passwort Ändern</p>
                                <button onClick={(_) => setInnerTab('Passwort Ändern')}>
                                    <ArrowForward fill='gray' />
                                </button>
                            </label>
                            <label className='disabled'>
                                <p>Erscheinungsbild</p>
                                <button onClick={(_) => null /*setInnerTab('Erscheinungsbild')*/}>
                                    <ArrowForward fill='gray' />
                                </button>
                            </label>
                        </div>
                        <div className='privacy'>
                            <h3>Privatsphäre</h3>
                            <label className='disabled'>
                                <p>Sichtbarkeit</p>
                                <button onClick={(_) => null /*setInnerTab('Sichtbarkeit')*/}>
                                    <ArrowForward fill='gray' />
                                </button>
                            </label>
                            <label>
                                <p>Daten-Auswertung</p>
                                <button onClick={(_) => setInnerTab('Daten-Auswertung')}>
                                    <ArrowForward fill='gray' />
                                </button>
                            </label>
                            <label>
                                <p>3rd Parties</p>
                                <button onClick={(_) => setInnerTab('3rd-Parties')}>
                                    <ArrowForward fill='gray' />
                                </button>
                            </label>
                            <label className='highlight-red'>
                                <p>Daten löschen</p>
                                <button
                                    onClick={(_) =>
                                        _props.confirm('Wenn du fohrfährst werden alle deine Daten unwiederruflich gelöscht. Bist du dir sicher?', {
                                            confirmed: () => {
                                                console.log('TODO: delete all user-data')
                                            },
                                            canceled: () => {
                                                console.log('deletion canceled')
                                            }
                                        })
                                    }>
                                    DATEN LÖSCHEN
                                </button>
                            </label>
                        </div>
                        <div className='misc'>
                            <h3>Mehr...</h3>
                            <label>
                                <p>DBG-Website</p>
                                <button onClick={(_) => window.open('https://gym-oberasbach.de', '_blank')}>
                                    <ArrowForward fill='gray' />
                                </button>
                            </label>
                            <label>
                                <p>Projekt-Repo (GitHub)</p>
                                <button onClick={(_) => window.open('https://github.com', '_blank')}>
                                    <ArrowForward fill='gray' />
                                </button>
                            </label>
                        </div>
                    </>
                )}
                {innerTab !== 'main' && (
                    <>
                        <div className='sub-setting-nav'>
                            <button onClick={(_) => setInnerTab('main')}>
                                <ArrowBack />
                            </button>
                            <h3>{innerTab}</h3>
                        </div>
                        {innerTab === 'Erscheinungsbild' && <h3>noch nix hier</h3>}
                        {innerTab === '3rd-Parties' && (
                            <div className='3rd-parties'>
                                <h3>Drittabbieter</h3>
                                <p>Diese Website nutzt Fonts und Icons von fonts.google.com</p>
                                <p>Der Rest des Services, inklusive Datenauswertug passiert intern, also keine weite Firma erhält deine Daten</p>
                            </div>
                        )}
                        {innerTab === 'Account-Daten' && (
                            <div className='sub-setting-am'>
                                <h3>Aktuelle Daten:</h3>
                                <div className='general'>
                                    <p>
                                        Vorname: <span className='acc-data'>{_props.userData?.firstName}</span>
                                    </p>
                                    <p>
                                        Nachname: <span className='acc-data'>{_props.userData?.lastName}</span>
                                    </p>
                                    <p>
                                        Username: <span className='acc-data'>{_props.userData?.username}</span>
                                    </p>
                                    <p>
                                        Email: <span className='acc-data'>{_props.userData?.email}</span>
                                    </p>
                                    <p>
                                        Languages:
                                        {_props.userData?.languages.map((l) => (
                                            <span>
                                                <span className='acc-data'>l.flag</span>
                                            </span>
                                        ))}
                                    </p>
                                    <p>
                                        Geburtstag: <span className='acc-data'>{new Date(_props.userData?.bithDate || '').toString()}</span>
                                    </p>
                                    <p>
                                        Id: <span className='acc-data'>{_props.userData?.id}</span>
                                    </p>
                                    <p>
                                        KlassenId: <span className='acc-data'>{_props.userData?.classId}</span>
                                    </p>
                                </div>
                            </div>
                        )}
                        {innerTab === 'Daten-Auswertung' && (
                            <div>
                                <h3>Verarbeitung deiner Daten:</h3>
                                <p>
                                    Es werden keine, nicht in <i>Settings &gt; Account Daten</i> und Lerndaten erhoben
                                </p>
                                <p>/*insert EULA-File, Privacy-File, Cookie-File*/</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
