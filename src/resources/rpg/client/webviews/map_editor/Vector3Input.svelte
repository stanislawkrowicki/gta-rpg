<script lang="ts">
    import Vector3 from 'rpg/shared/utils/Vector3'

    export let label = ''
    export let value = new Vector3(0, 0, 0)
</script>

<div class="container">
    <p>{label}</p>
    <div class="inputs">
        <input type="number" bind:value={value.x} />
        <input type="number" bind:value={value.y} />
        <input type="number" bind:value={value.z} />
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        p {
            font-family: Roboto, sans-serif;
            color: white;
        }
    }

    .inputs {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        gap: 10px;

        input {
            width: 3em;
            height: 3em;
        }
    }
</style>
