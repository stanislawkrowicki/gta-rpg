<script lang="ts">
    import Table from "../components/Table.svelte";

    let tableColumns = ['id', 'model']
    let playerVehicles = []


    alt.on('PLAYER_VEHICLES', (vehicles) => {
        playerVehicles = vehicles
    })


</script>

<div class="container" id="main-container">
    <Table columns={tableColumns}>
        { #each playerVehicles as playerVehicle }
            <tr>
                <td>playerVehicle.id</td>
                <td>playerVehicle.model</td>
            </tr>
        { /each }
    </Table>
</div>