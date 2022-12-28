<script lang="ts">
    import WorldEntityType from 'rpg/shared/world/WorldEntityType'

    import MapMarkerRadiusOutline from 'svelte-material-icons/MapMarkerRadiusOutline.svelte'
    import CarOutline from 'svelte-material-icons/CarOutline.svelte'
    import AccountOutline from 'svelte-material-icons/AccountOutline.svelte'
    import CubeOutline from 'svelte-material-icons/CubeOutline.svelte'
    import PencilOutline from 'svelte-material-icons/PencilOutline.svelte'

    import type { IEntity } from 'rpg/client/world/MapEditor'

    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let data: IEntity

    const emitEditEntity = () => {
        dispatch('editEntity', data._id)
    }
</script>

<main>
    {#if data.type === WorldEntityType.OBJECT}
        <CubeOutline />
    {:else if data.type === WorldEntityType.MARKER}
        <MapMarkerRadiusOutline />
    {:else if data.type === WorldEntityType.VEHICLE}
        <CarOutline />
    {:else if data.type === WorldEntityType.NPC}
        <AccountOutline />
    {/if}
    <span>{data.name}</span>
    <button on:click={emitEditEntity}><PencilOutline /></button>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        color: white;

        span {
            padding: 0 0 0 0.5em;
            background: 0 0.1em no-repeat;
            background-size: 1em 1em;
            font-family: Roboto, sans-serif;
        }

        button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: 0.2rem;
        }
    }
</style>
