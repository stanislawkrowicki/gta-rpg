<script lang="ts">
    import Message from "./Message.svelte";
    import Input from "./Input.svelte";

    interface Message {
        author: string,
        message: string
    }

    let messages: Message[] = []

    const handleMessage = (messageEvent) => {
        alt.emit('MESSAGE', messageEvent.detail)
    }

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
        <Input on:input={handleMessage}></Input>
    </div>
</div>