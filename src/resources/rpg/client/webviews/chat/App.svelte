<script lang="ts">
    import Message from './Message.svelte'
    import Input from './Input.svelte'

    interface IMessage {
        author: string
        message: string
    }

    const MAX_MESSAGES = 15

    let messages: IMessage[] = []
    let inputComponent: Input

    const handleMessage = (messageEvent: { detail: string }) => {
        if (messageEvent.detail === '') {
            unfocus()
            return
        }

        alt.emit('MESSAGE', messageEvent.detail)
        unfocus()
    }

    const focus = () => {
        inputComponent.focus()
    }

    const unfocus = () => {
        inputComponent.unfocus()
        alt.emit('UNFOCUS')
    }

    alt.on('FOCUS', () => {
        focus()
    })

    alt.on('CLIENT_MESSAGE', (obj) => {
        messages = [...messages, { author: obj.author, message: obj.message }].slice(-MAX_MESSAGES)
    })
</script>

<svelte:window
    on:mousedown={(e) => {
        e.preventDefault()
    }}
/>

<div id="container">
    <div class="messages">
        {#each messages as message}
            <Message author={message.author} message={message.message} />
        {/each}
    </div>

    <div class="message-input">
        <Input bind:this={inputComponent} on:input={handleMessage} on:unfocus={unfocus} />
    </div>
</div>
