<script lang="ts">
    import { createEventDispatcher } from "svelte"

    const dispatch = createEventDispatcher()

    export let message = ""

    let inputField

    export function focus() {
        inputField.focus()
    }

    export function unfocus() {
        inputField.blur()
    }

    const onKeyPress = (e) => {
        if (e.key === 'Enter') send()
    }

    const send = () => {
        dispatch('input', message)
        message = ''
    }
</script>

<style>
</style>

<input bind:value={message} bind:this={inputField} on:keypress={onKeyPress}/>