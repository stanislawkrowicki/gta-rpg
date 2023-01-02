<script lang="ts">
    import type { IEntity, IVehicleEntity } from 'rpg/client/world/MapEditor'

    import Vector3Input from './Vector3Input.svelte'

    export let data: IEntity

    let wrapper = data.wrapped as IVehicleEntity
</script>

<div class="property">
    <label for="hash">Hash:</label>
    <input type="text" id="hash" bind:value={wrapper.hash} />
</div>
<div class="property">
    <Vector3Input label="Pozycja:" bind:value={wrapper.position} />
</div>

<style lang="scss">
    @import './propertyEditor.scss';
</style>
