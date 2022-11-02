<script lang="ts">
    import type { IBindDefinition } from 'rpg/client/settings/ClientSettings'

    export let availableBinds: IBindDefinition[] = []
</script>

<div class="container">
    {#each availableBinds as bind}
        <div class="bind">
            <label for={bind.name}>{bind.description}</label>
            <input
                type="text"
                name={bind.name}
                value={String.fromCharCode(bind.keyCode)}
                readonly
            />
        </div>
    {/each}
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
</style>
