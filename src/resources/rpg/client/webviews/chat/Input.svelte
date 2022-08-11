<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher()

    export let message = ""

    const onKeyPress = (e) => {
        if (e.key === 'Enter') send()
    }

    const send = () => {
        dispatch('input', message)
        message = ''
    }
</script>

<style>
    .author {
        
    }
    .author:after {
        content: ": ";
    }
    .message {

    }
</style>

<input bind:value={message} on:keypress={onKeyPress} autofocus/>