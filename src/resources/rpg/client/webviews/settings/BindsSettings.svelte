<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    import KeyboardUtils from 'rpg/shared/utils/KeyboardUtils'
    import type { IBindDefinition } from 'rpg/client/settings/ClientSettings'

    import type { IBindChange } from 'rpg/client/settings/ClientSettings'

    import { settingsPanel as trans } from 'lang'

    export let availableBinds: IBindDefinition[] = []

    const dispatch = createEventDispatcher()

    let showBindPrompt = false
    let showAlreadyDefinedMessage = false
    let currentlyBinding: string = null

    const bindChangePrompt = (bindName: string) => {
        if (showBindPrompt) return

        dispatch('disableAllBinds')

        showBindPrompt = true
        currentlyBinding = bindName
        document.addEventListener('keydown', onChangePromptKeypress)
    }

    const onChangePromptKeypress = (event: KeyboardEvent) => {
        showAlreadyDefinedMessage = false

        if (event.key === 'Escape') {
            closeBindPrompt()
            return
        }

        if (['Alt', 'Shift', 'Control'].includes(event.key)) {
            return
        }

        let sanitizedKey = event.key

        // make caps lock not matter as it does not in altV
        if (event.key.length === 1) sanitizedKey = event.key.toUpperCase()

        const keyCode = KeyboardUtils.getKeyCodeFromChar(sanitizedKey)

        if (typeof keyCode === 'undefined') {
            return
        }

        let modifier: 'Control' | 'Alt' | 'Shift' = null

        if (event.ctrlKey) modifier = 'Control'
        else if (event.shiftKey) modifier = 'Shift'
        else if (event.altKey) modifier = 'Alt'

        const modifierKeyCode = modifierToKeyCode(modifier)

        for (const alreadyDefinedBind of availableBinds) {
            if (alreadyDefinedBind.name === currentlyBinding) continue
            if (
                alreadyDefinedBind.keyCode === keyCode &&
                alreadyDefinedBind.modifierCode === modifierKeyCode
            ) {
                showAlreadyDefinedMessage = true
                return
            }
        }

        onChangeFinish({
            keyCode: keyCode,
            modifierCode: modifierToKeyCode(modifier),
            bindName: currentlyBinding,
        })
    }

    const modifierToKeyCode = (modifier: 'Control' | 'Alt' | 'Shift') => {
        if (modifier === 'Shift') return 16
        else if (modifier === 'Control') return 17
        else if (modifier === 'Alt') return 18
        else return null
    }

    const onChangeFinish = (changedBind: IBindChange) => {
        dispatch('bindChange', changedBind)
        closeBindPrompt()
    }

    const closeBindPrompt = () => {
        dispatch('enableBinds')
        document.removeEventListener('keydown', onChangePromptKeypress)
        showBindPrompt = false
        currentlyBinding = null
    }
</script>

<div class="container">
    {#each availableBinds as bind}
        <div class="bind">
            <label for={bind.name}>{bind.description}</label>
            <input
                type="text"
                name={bind.name}
                value={bind.modifierCode
                    ? `${KeyboardUtils.getTranslatedCharFromKeyCode(
                          bind.modifierCode
                      )} + ${KeyboardUtils.getTranslatedCharFromKeyCode(bind.keyCode)}`
                    : KeyboardUtils.getTranslatedCharFromKeyCode(bind.keyCode)}
                readonly
                on:click={() => bindChangePrompt(bind.name)}
            />
        </div>
    {/each}

    {#if showBindPrompt}
        <div class="prompt">
            <span id="text">{trans.setBind}</span>

            {#if showAlreadyDefinedMessage}
                <span id="already-defined-message">{trans.keyAlreadyDefined}</span>
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    @import '../components/theme.scss';

    .container {
        padding: 1em;
    }

    .bind {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.5em;
        margin: 2em;
        font-family: Arial, sans-serif;
        font-weight: bold;
        color: white;
        border-bottom: solid 3px $THEME-COLOR-B;

        input {
            box-shadow: none;
            background-color: #555;
            border: 0px;
            border-bottom: solid 3px $THEME-COLOR-A;
            height: 3em;
            color: white;
            text-align: center;
            font-family: Roboto, Arial, Helvetica, sans-serif;
            font-weight: 600;
        }
    }

    .prompt {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50em;
        height: 30em;
        border: solid 5px $THEME-COLOR-A;
        font-family: Roboto, Arial, Helvetica, sans-serif;
        font-weight: 600;
        background-color: #444;

        #text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 3em;
        }

        #already-defined-message {
            position: absolute;
            top: 80%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 1em;
        }
    }
</style>
