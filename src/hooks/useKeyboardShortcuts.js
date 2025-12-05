import { useEffect } from 'react'

function useKeyboardShortcuts(shortcuts) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check if user is typing in an input
            const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
                document.activeElement.tagName
            )

            shortcuts.forEach(({ key, ctrl, shift, alt, callback }) => {
                const ctrlMatch = ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
                const shiftMatch = shift ? event.shiftKey : !event.shiftKey
                const altMatch = alt ? event.altKey : !event.altKey
                const keyMatch = event.key.toLowerCase() === key.toLowerCase()

                if (keyMatch && ctrlMatch && shiftMatch && altMatch && !isTyping) {
                    event.preventDefault()
                    callback()
                }
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [shortcuts])
}

export default useKeyboardShortcuts

