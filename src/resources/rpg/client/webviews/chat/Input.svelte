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
        message = ''
    }

    export function setMessage(messageToSet: string) {
        message = messageToSet
    }

    const onKeyPress = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            dispatch('unfocus')
            shouldAllowTyping = false
            return
        } else if (!shouldAllowTyping) {
            shouldAllowTyping = true
            e.preventDefault()
            return
        } else if (e.key === 'Enter') {
            send()
            shouldAllowTyping = false
            return
        } else if (e.key === '/') {
            dispatch('toggleCommandMode', true)
            return
        } else if (e.key === 'Backspace') {
            if (message.at(-1) === '/') dispatch('toggleCommandMode', false)
            else dispatch('keyPress', message.slice(0, -1))
            return
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return
        else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
            return
        } else dispatch('keyPress', message + e.key)
    }

    const send = () => {
        dispatch('input', message)
        message = ''
    }
</script>

<input bind:value={message} bind:this={inputField} on:keydown={onKeyPress} />

<style>
    input {
        width: -webkit-fill-available;
        padding: 4px;

        outline: none;
        background: transparent;
        border: none;

        transition: background 0.15s;

        border-radius: 4px;
    }

    input:focus {
        background: #ffffffbb;
    }
</style>
