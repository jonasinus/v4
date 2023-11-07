import { Dispatch, SetStateAction, useState, useCallback } from 'react'

export default function useHistoryState<Type>(initialValue: Type | (() => Type)): [Type, Dispatch<SetStateAction<Type>>, Type[]] {
    const [state, setState] = useState<Type>(initialValue)
    const [prevStates, setPrevStates] = useState<Type[]>([])

    const setHistoryState = useCallback(
        (value: SetStateAction<Type>) => {
            setPrevStates((prevStates) => [...prevStates, state]) // Save the previous state before updating
            setState(value)
        },
        [state]
    )

    return [state, setHistoryState, prevStates]
}
