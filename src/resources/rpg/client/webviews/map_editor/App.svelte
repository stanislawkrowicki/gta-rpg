<script lang="ts">
    import FilePlusOutline from 'svelte-material-icons/FilePlusOutline.svelte'
    import FolderPlusOutline from 'svelte-material-icons/FolderPlusOutline.svelte'
    import DeleteOutline from 'svelte-material-icons/DeleteOutline.svelte'

    import type { IEntityGroup } from 'rpg/client/world/MapEditor'
    import Group from './Group.svelte'

    import Vector3 from 'rpg/shared/utils/Vector3'
    import WorldEntityType from 'rpg/shared/world/WorldEntityType'

    let primaryGroups: IEntityGroup[] = [
        {
            _id: 'testh',
            name: 'testGroup',
            entities: [
                {
                    _id: 'testentity',
                    name: 'test',
                    type: WorldEntityType.OBJECT,
                    wrapped: {
                        hash: 15,
                        position: new Vector3(0, 0, 0),
                        rotation: new Vector3(0, 0, 0),
                    },
                },
            ],
            children: [
                {
                    _id: 'testi',
                    name: 'testGroup2',
                    entities: [
                        {
                            _id: 'testentity2',
                            name: 'test',
                            type: WorldEntityType.OBJECT,
                            wrapped: {
                                hash: 15,
                                position: new Vector3(0, 0, 0),
                                rotation: new Vector3(0, 0, 0),
                            },
                        },
                    ],
                    children: [],
                },
            ],
        },
    ]
</script>

<main>
    <div class="actions">
        <button class="action" id="new-object">
            <FilePlusOutline color="white" size="1.5em" />
        </button>
        <button class="action" id="new-group">
            <FolderPlusOutline color="white" size="1.5em" />
        </button>
        <button class="action" id="delete">
            <DeleteOutline color="white" size="1.5em" />
        </button>
    </div>
    <div class="tree">
        {#each primaryGroups as primaryGroup}
            <Group data={primaryGroup} />
        {/each}
    </div>
</main>

<style lang="scss">
    main {
        position: absolute;
        height: 80vh;
        width: 25vw;
        background-color: #333;
        right: 2vw;
        top: 10vh;
    }

    .actions {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        background-color: #333;

        .action {
            padding: 10px;
            background: none;
            border: none;
        }

        .action:hover {
            background-color: #555;
            cursor: pointer;
            color: white;
        }
    }

    .tree {
        background-color: #444;
        width: 100%;
        height: 100%;
        padding: 1rem;
        box-sizing: border-box;
    }
</style>
