<script lang="ts">
    export let columns: string[] = []
</script>

<table>
    <thead>
        <tr>
            {#each columns as column}
                <th>{column}</th>
            {/each}
        </tr>
    </thead>

    <tbody>
        <slot />
    </tbody>
</table>

<style lang="scss">
    @import '../components/theme.scss';

    table {
        border: 1px solid;
        border-collapse: collapse;
        background-color: var(--theme-color-a);
    }

    th {
        background-color: var(--theme-color-b);
    }
</style>
