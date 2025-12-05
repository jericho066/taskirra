import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
    const [ storedValue, setStoredValue] = useState(() => {
        //* to get initial value from localStorage
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            return initialValue
        }
    })

    //* to update localStorage whenever storedValue changes
    useEffect(() => {
        try{
            window.localStorage.setItem(key, JSON.stringify(storedValue))
        } catch {
            console.error('Error writing to localStorage:', error)
        }
    }, [key, storedValue])

    return [ storedValue, setStoredValue]
}

export default useLocalStorage
