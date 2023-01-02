<script lang="ts">
    import type { IEntity, INPCEntity } from 'rpg/client/world/MapEditor'

    import Vector3Input from './Vector3Input.svelte'

    export let data: IEntity

    let wrapper = data.wrapped as INPCEntity
</script>

<div class="property">
    <label for="model">Model:</label>
    <input type="text" id="model" bind:value={wrapper.model} />
</div>
<div class="property">
    <Vector3Input label="Pozycja:" bind:value={wrapper.position} />
</div>

<style lang="scss">
    @import './propertyEditor.scss';
</style>
