<script lang="ts">
    import FolderOutline from 'svelte-material-icons/FolderOutline.svelte'
    import FolderOpenOutline from 'svelte-material-icons/FolderOpenOutline.svelte'

    import Entity from './Entity.svelte'
    import type { IEntityGroupTree } from './App.svelte'

    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let data: IEntityGroupTree

    let expanded = false

    const toggle = () => {
        expanded = !expanded

        dispatch('groupInteraction', data._id)
    }
</script>

{#if expanded}
    <div class="current-group">
        <FolderOpenOutline color="white" />
        <button on:click|stopPropagation={toggle}>{data.name}</button>
    </div>
    <ul>
        {#if data.children}
            {#each data.children as child}
                <li><svelte:self data={child} on:groupInteraction on:editEntity /></li>
            {/each}
        {/if}
        {#if data.entities}
            {#each data.entities as entity}
                <li><Entity data={entity} on:editEntity /></li>
            {/each}
        {/if}
    </ul>
{:else}
    <div class="current-group">
        <FolderOutline color="white" />
        <button on:click|stopPropagation={toggle}>{data.name}</button>
    </div>
{/if}

<style lang="scss">
    .current-group {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        color: white;
    }

    button {
        padding: 0 0 0 0.5em;
        font-weight: bold;
        font-family: Roboto, sans-serif;
        cursor: pointer;
        border: none;
        margin: 0;
        background: none;
        color: white;
    }

    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.5em;
        list-style: none;
        border-left: 1px solid #eee;
    }

    li {
        padding: 0.2em 0;
    }
</style>
