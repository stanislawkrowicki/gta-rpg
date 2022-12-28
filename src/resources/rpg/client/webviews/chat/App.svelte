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

    let container

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

    let isFocused = false

    const focus = () => {
        inputComponent.focus()

        isFocused = true
    }

    const unfocus = () => {
        inputComponent.unfocus()
        alt.emit('UNFOCUS')
        commands = []
        isInCommandMode = false

        isFocused = false
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

<svelte:window on:mousedown={(e) => {}} />

<div bind:this={container} class="container {isFocused ? 'active' : ''}">
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

<style>
    :global(body) {
        font-family: 'Amiable Forsythia Free', sans-serif;
    }
    .container {
        height: 150px;
        width: 350px;

        background: #00000000;

        transform-origin: 0 0;

        /*--scale: calc();*/
        /*transform: scale(var(--scale));*/

        transition: background 0.25s;

        border-radius: 5px;
    }
    .container.active {
        background: #00000077;
    }
    .messages {
        height: inherit;
        overflow-y: scroll;

        padding: 4px;
    }

    ::-webkit-scrollbar {
        width: 4px;
    }
    .messages::-webkit-scrollbar-track {
        background-color: transparent;
    }
    .messages::-webkit-scrollbar-thumb {
        background-color: #d6dee1;
        border-radius: 5px;
    }
</style>
