<script lang="ts">
    import type { IEntity, IMarkerEntity } from 'rpg/client/world/MapEditor'
    import { MarkerType } from 'rpg/shared/world/markers/Markers'

    import Vector3Input from './Vector3Input.svelte'

    export let data: IEntity

    let wrapper = data.wrapped as IMarkerEntity
</script>

<div class="property">
    <label for="marker-type">Typ:</label>
    <select name="marker-type" id="marker-type" bind:value={wrapper.markerType}>
        {#each Object.keys(MarkerType).filter((key) => isNaN(Number(key))) as markerType}
            <option value={markerType}>{markerType}</option>
        {/each}
    </select>
</div>
<div class="property">
    <Vector3Input label="Pozycja:" bind:value={wrapper.position} />
</div>
<div class="property">
    <label for="scale">Skala:</label>
    <input type="number" name="scale" id="scale" bind:value={wrapper.scale} />
</div>

<style lang="scss">
    @import './propertyEditor.scss';
</style>
