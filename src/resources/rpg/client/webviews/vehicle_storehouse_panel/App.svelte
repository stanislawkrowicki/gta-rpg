<script lang="ts">
    import Table from '../components/Table.svelte'

    interface IPlayerVehicle {
        id: number
        model: string
    }

    let tableColumns = ['id', 'model']
    let storehouseDescription = ''
    let playerVehicles: IPlayerVehicle[] = []

    alt.on('STOREHOUSE_DESCRIPTION', (description) => {
        storehouseDescription = description
    })

    alt.on('PLAYER_VEHICLES', (vehicles) => {
        playerVehicles = vehicles
    })

    const closePanel = () => {
        alt.emit('CLOSE')
    }

    const onVehicleSelect = (vehicle: IPlayerVehicle) => {
        alt.emit('TAKE_VEHICLE_OUT', vehicle.id)
    }
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
    />
</svelte:head>

<div class="container" id="main-container">
    <header>
        <p>{storehouseDescription}</p>

        <span class="close-button material-symbols-outlined" on:click={closePanel}> close </span>
    </header>

    <Table columns={tableColumns}>
        {#each playerVehicles as playerVehicle}
            <tr
                on:click={() => {
                    onVehicleSelect(playerVehicle)
                }}
            >
                <td>{playerVehicle.id}</td>
                <td>{playerVehicle.model}</td>
            </tr>
        {/each}
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

    td {
        padding: 15px;
    }

    tr {
        cursor: pointer;
    }
</style>
