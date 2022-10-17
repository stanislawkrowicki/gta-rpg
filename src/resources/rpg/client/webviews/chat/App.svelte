<script lang="ts">
    import Message from './Message.svelte'
    import Input from './Input.svelte'

    import type { ICommandDefinition } from 'rpg/shared/commands/Commands'
    import CommandPalette from './CommandPalette.svelte'

    interface IMessage {
        author: string
        message: string
    }

    const MAX_MESSAGES = 15

    let messages: IMessage[] = []
    let commands: ICommandDefinition[] = []
    let inputComponent: Input

    let isInCommandMode = false

    const handleMessage = (messageEvent: { detail: string }) => {
        if (messageEvent.detail === '') {
            unfocus()
            return
        }

        if (isInCommandMode && messageEvent.detail[0] === '/') {
            const commandInvocation = messageEvent.detail.split(' ')
            const commandName = commandInvocation[0].replace('/', '')
            const commandArgs = commandInvocation.slice(1)

            alt.emit('COMMAND', commandName, commandArgs)
            isInCommandMode = false
            return
        }

        alt.emit('MESSAGE', messageEvent.detail)
        unfocus()
    }

    const toggleCommandMode = (toggleEvent: { detail: boolean }) => {
        isInCommandMode = toggleEvent.detail
    }

    const focus = () => {
        inputComponent.focus()
    }

    const unfocus = () => {
        inputComponent.unfocus()
        alt.emit('UNFOCUS')
        commands = []
        isInCommandMode = false
    }

    alt.on('FOCUS', () => {
        focus()
    })

    alt.on('CLIENT_MESSAGE', (obj) => {
        messages = [...messages, { author: obj.author, message: obj.message }].slice(-MAX_MESSAGES)
    })

    alt.on('PERMITTED_COMMANDS', (permittedCommands: ICommandDefinition[]) => {
        commands = permittedCommands
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
        <Input
            bind:this={inputComponent}
            on:input={handleMessage}
            on:toggleCommandMode={toggleCommandMode}
            on:unfocus={unfocus}
        />
    </div>

    {#if isInCommandMode}
        <div class="commands-dropdown">
            <CommandPalette {commands} />
        </div>
    {/if}
</div>
