<script lang="ts">
    import type { ICommandDefinition } from 'rpg/shared/commands/Commands'
    import { createEventDispatcher } from 'svelte'

    export let commands: ICommandDefinition[]

    const dispatch = createEventDispatcher()

    let allowNavigation = false
    let selectedCommandIndex = 0

    $: commands, (selectedCommandIndex = 0), (allowNavigation = false)

    const incrementCommandIndex = () => {
        if (selectedCommandIndex === commands.length - 1) selectedCommandIndex = 0
        else selectedCommandIndex++

        dispatch('commandIndexChange', selectedCommandIndex)
    }

    const decrementCommandIndex = () => {
        if (selectedCommandIndex == 0) selectedCommandIndex = commands.length - 1
        else selectedCommandIndex--

        dispatch('commandIndexChange', selectedCommandIndex)
    }

    const setCommandIndex = (num: number) => {
        selectedCommandIndex = num
        dispatch('commandIndexChange', num)
    }
</script>

<svelte:window
    on:keydown={(e) => {
        if (e.key === 'ArrowUp')
            if (!allowNavigation) {
                allowNavigation = true
                setCommandIndex(0)
            } else decrementCommandIndex()
        else if (e.key === 'ArrowDown')
            if (!allowNavigation) {
                allowNavigation = true
                setCommandIndex(0)
            } else incrementCommandIndex()
    }}
/>

<ul>
    {#each commands as command, i}
        {#if allowNavigation && i === selectedCommandIndex}
            <li data-description={command.description} class="highlighted">/{command.name}</li>
        {:else}
            <li data-description={command.description}>/{command.name}</li>
        {/if}
    {/each}
</ul>

<style lang="scss">
    ul {
        list-style-type: none;
        margin: 0 0 0 0.5em;
        padding: 0;
        color: white;
        position: absolute;
        left: 0;
    }

    li:after {
        content: attr(data-description);
        visibility: hidden;
        opacity: 0;
        width: 140px;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        padding: 5px 0;
        transition: opacity 0.25s ease-in-out;

        position: absolute;
        z-index: 1;
        left: 110%;
    }

    li:hover:after {
        opacity: 1;
        visibility: visible;
    }

    .highlighted {
        background-color: rgba(50, 50, 50, 0.5);
    }

    .highlighted:before {
        content: '> ';
    }

    .highlighted:after {
        opacity: 1;
        visibility: visible;
    }
</style>
