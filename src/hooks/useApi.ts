import { useCallback } from 'react'
import { UserData, ExerciseProgress, LanguageId, Language, UserStats } from '../../api/src/types'

let INSTANCE: null | ApiFunctions = null

type ApiFunctions = {
    apiUrl: string
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    verifyToken: () => Promise<void>
    resetPassword: (username: string) => Promise<void>
    setNewPassword: (password: string) => Promise<any>
    getUserData: () => Promise<UserData>
    getUserStats: () => Promise<any>
    getStudents: () => Promise<any>
    saveExerciseProgress: (progress: ExerciseProgress) => Promise<any>
    getLangData: (langId: LanguageId) => Promise<Language>
    getLangsData: () => Promise<Language[]>
    getStats: () => Promise<UserStats>
}

export default function useApi(): ApiFunctions {
    if (!INSTANCE) {
        INSTANCE = useApiFactory()
    }
    return INSTANCE
}

function useApiFactory(): ApiFunctions {
    const apiUrl = 'http://localhost:3000'

    const makeRequest = useCallback(async (url: string | URL, method = 'GET', requestBody = {}): Promise<{ msg: string; error?: string; data: any }> => {
        const headers = {
            'Content-Type': 'application/json'
        }

        if (method !== 'GET') {
            headers['Content-Type'] = 'application/json'
        }

        try {
            const response = await fetch(`${apiUrl}/${url}`, {
                method,
                mode: 'cors',
                credentials: 'include',
                headers,
                body: method !== 'GET' ? JSON.stringify(requestBody) : null
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            let json = await response.json()
            return { msg: '', data: json }
        } catch (error) {
            //console.error('Error:', error)
            throw new Error('Error making API request')
        }
    }, [])

    const login: (username: string, password: string) => Promise<void> = useCallback(
        (username: string, password: string) => {
            return new Promise(async (res, rej) => {
                try {
                    const requestBody = { username, password }
                    let data = (await makeRequest('auth/login', 'POST', requestBody)).data
                    return res(data)
                } catch {
                    rej()
                }
            })
        },
        [makeRequest]
    )

    const resetPassword: (username: string) => Promise<void> = useCallback(
        (username: string) => {
            return new Promise(async (res, rej) => {
                try {
                    const requestBody = { username }
                    let data = (await makeRequest('auth/reset-password', 'POST', requestBody)).data
                    return res(data)
                } catch {
                    rej()
                }
            })
        },
        [makeRequest]
    )

    const setNewPassword: (password: string) => Promise<any> = useCallback(
        (password: string) => {
            return new Promise(async (res, rej) => {
                try {
                    const reqBody = { password }
                    let data = (await makeRequest('auth/set-password', 'POST', reqBody)).data
                    return res(data)
                } catch (err) {
                    rej(err)
                }
            })
        },
        [makeRequest]
    )

    const logout: () => Promise<void> = useCallback(() => {
        return new Promise(async (res, rej) => {
            try {
                await makeRequest('auth/logout', 'POST')
                res()
            } catch {
                rej()
            }
        })
    }, [makeRequest])

    const verifyToken: () => Promise<void> = useCallback(async () => {
        return new Promise(async (res, rej) => {
            try {
                await makeRequest('auth/verifyToken')
                res()
            } catch {
                rej('invalid token')
            }
        })
    }, [makeRequest])

    const getUserData: () => Promise<UserData> = useCallback(async () => {
        return new Promise(async (res, rej) => {
            try {
                let response = await makeRequest('userdata', 'GET')
                return res(response.data)
            } catch {
                rej()
            }
        })
    }, [makeRequest])

    const getUserStats = useCallback(async () => {
        return (await makeRequest('getUserStats')).data
    }, [makeRequest])

    const getStudents = useCallback(async () => {
        return (await makeRequest('getStudents')).data
    }, [makeRequest])

    const saveExerciseProgress = useCallback(
        async (progress: ExerciseProgress) => {
            return (await makeRequest('user/exercise/save', 'POST', { ...progress })).data
        },
        [makeRequest]
    )

    const getLangData: (lang: LanguageId) => Promise<Language> = useCallback(
        async (lang: LanguageId) => {
            return (await makeRequest(`data/lang/${lang}`, 'GET')).data
        },
        [makeRequest]
    )

    const getLangsData: () => Promise<Language[]> = useCallback(async () => {
        return (await makeRequest('data/langs', 'GET')).data
    }, [makeRequest])

    const getStats: () => Promise<UserStats> = useCallback(async () => {
        return (await makeRequest('stats', 'GET')).data
    }, [makeRequest])

    return {
        apiUrl,
        login,
        logout,
        verifyToken,
        resetPassword,
        setNewPassword,
        getUserData,
        getUserStats,
        getStudents,
        saveExerciseProgress,
        getLangsData,
        getLangData,
        getStats
    }
}
