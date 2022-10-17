<script lang="ts">
    import type { ICommandDefinition } from 'rpg/shared/commands/Commands'

    export let commands: ICommandDefinition[]
</script>

<ul>
    {#each commands as command}
        <li data-description={command.description}>/{command.name}</li>
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
</style>
