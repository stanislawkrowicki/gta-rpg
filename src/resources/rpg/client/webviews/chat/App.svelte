<script lang="ts">
    import Message from "./Message.svelte"
    import Input from "./Input.svelte"

    interface IMessage {
        author: string,
        message: string
    }

    let messages: IMessage[] = []
    let inputComponent

    const handleMessage = (messageEvent) => {
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
        messages = [...messages, { author: obj.author, message: obj.message }]
    })

    document.onmousedown = (e) => {
        e.preventDefault()
    }
</script>

<div id="container">
    <div class="messages">
        { #each messages as message }
            <Message author={message.author} message={message.message}/>
        { /each }
    </div>

    <div class="message-input">
        <Input bind:this={inputComponent} on:input={handleMessage}></Input>
    </div>
</div>