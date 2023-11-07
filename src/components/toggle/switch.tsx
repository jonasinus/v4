import { useState } from 'react'

export const ToggleSwitch = ({ isToggled, onToggle }: { isToggled: boolean; onToggle: React.ChangeEventHandler<HTMLInputElement> }) => {
    const [on, toggle] = useState(false)
    return (
        <label className={'switch ' + (on ? 'on' : 'off')}>
            <input
                type='checkbox'
                defaultChecked={isToggled}
                onChange={(ev) => {
                    onToggle(ev)
                    toggle(ev.currentTarget.checked)
                }}
            />
            <span></span>
        </label>
    )
}
