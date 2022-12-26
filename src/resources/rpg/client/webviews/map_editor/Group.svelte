<script lang="ts">
    import FolderOutline from 'svelte-material-icons/FolderOutline.svelte'
    import FolderOpenOutline from 'svelte-material-icons/FolderOpenOutline.svelte'

    import Entity from './Entity.svelte'
    import type { IEntityGroup } from 'rpg/client/world/MapEditor'

    export let data: IEntityGroup

    let expanded = false

    const toggle = () => {
        expanded = !expanded
    }
</script>

{#if expanded}
    <div class="current-group">
        <FolderOpenOutline color="white" />
        <button on:click={toggle}>{data.name}</button>
    </div>
    <ul>
        {#each data.children as child}
            <li><svelte:self data={child} /></li>
        {/each}
        {#each data.entities as entity}
            <li><Entity data={entity} /></li>
        {/each}
    </ul>
{:else}
    <div class="current-group">
        <FolderOutline color="white" />
        <button on:click={toggle}>{data.name}</button>
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
