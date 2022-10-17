<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let message = ''

    let shouldAllowTyping = false

    let inputField: HTMLInputElement

    export function focus() {
        inputField.focus()
    }

    export function unfocus() {
        inputField.blur()
    }

    const onKeyPress = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            dispatch('unfocus')
            shouldAllowTyping = false
            return
        }

        if (!shouldAllowTyping) {
            shouldAllowTyping = true
            e.preventDefault()
            return
        }

        if (e.key === 'Enter') {
            send()
            shouldAllowTyping = false
        }

        if (e.key === '/') {
            dispatch('toggleCommandMode', true)
        }

        if (e.key === 'Backspace') {
            if (message.at(-1) === '/') dispatch('toggleCommandMode', false)
        }
    }

    const send = () => {
        dispatch('input', message)
        message = ''
    }
</script>

<input bind:value={message} bind:this={inputField} on:keydown={onKeyPress} />

<style>
</style>
