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
    let filteredCommands: ICommandDefinition[] = []
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
            unfocus()
            return
        }

        alt.emit('MESSAGE', messageEvent.detail)
        unfocus()
    }

    const toggleCommandMode = (toggleEvent: { detail: boolean }) => {
        isInCommandMode = toggleEvent.detail
    }

    const onInputChange = (changeEvent: { detail: string }) => {
        // changeEvent is current text in input
        if (!isInCommandMode) return

        const currentCommand = changeEvent.detail.replace('/', '').split(' ')[0]

        const exactCommand = commands.find((command) => command.name === currentCommand)
        if (exactCommand) {
            filteredCommands = [exactCommand]
            return
        }

        if (currentCommand === '') {
            filteredCommands = commands
            return
        }

        filteredCommands = commands.filter((command) => command.name.startsWith(currentCommand))
    }

    const fillCommand = (commandEvent: { detail: number }) => {
        inputComponent.setMessage('/' + filteredCommands[commandEvent.detail].name)
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
        filteredCommands = permittedCommands
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
            on:keyPress={onInputChange}
            on:unfocus={unfocus}
        />
    </div>

    {#if isInCommandMode}
        <div class="commands-dropdown">
            <CommandPalette commands={filteredCommands} on:commandIndexChange={fillCommand} />
        </div>
    {/if}
</div>
