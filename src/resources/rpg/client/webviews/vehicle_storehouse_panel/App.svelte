<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
</svelte:head>

<script lang="ts">
    import Table from "../components/Table.svelte";

    let tableColumns = ['id', 'model']
    let playerVehicles = []


    alt.on('PLAYER_VEHICLES', (vehicles) => {
        playerVehicles = vehicles
    })

    const closePanel = () => {
        alt.emit('CLOSE')
    }

    const onVehicleSelect = (vehicle) => {
        alt.emit('TAKE_VEHICLE_OUT', vehicle.id)
    }
</script>

<div class="container" id="main-container">
    <header>
        <p>Przechowalnia pojazdów</p>

        <span class="close-button material-symbols-outlined" on:click={closePanel}>
            close
        </span>
    </header>

    <Table columns={ tableColumns }>
        { #each playerVehicles as playerVehicle }
            <tr on:click={onVehicleSelect(playerVehicle)}>
                <td>{ playerVehicle.id }</td>
                <td>{ playerVehicle.model }</td>
            </tr>
        { /each }
    </Table>
</div>

<style lang="scss">
    #main-container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    header {
        * {
            display: inline-block;
        }
    }

    .close-button {
        cursor: pointer;
    }

    th, td {
      padding: 15px;
    }

    tr {
      cursor: pointer;
    }
</style>