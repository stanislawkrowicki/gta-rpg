<script lang="ts">
    export let columns: string[] = []
</script>

<table>
    <thead>
        <tr>
            { #each columns as column }
                <th>{ column }</th>
            { /each }
        </tr>
    </thead>

    <tbody>
        <slot></slot>
    </tbody>
</table>

<style lang="scss">
    $THEME-COLOR-A: #737dfe;
    $THEME-COLOR-B: #ffcac9;

    table {
        border: 1px solid;
        border-collapse: collapse;
        background-color: $THEME-COLOR-A;
    }

    th {
        background-color: $THEME-COLOR-B;
    }
</style>