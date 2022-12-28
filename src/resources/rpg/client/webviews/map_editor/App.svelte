<script lang="ts" context="module">
    export interface IEntityGroupTree {
        _id: string
        name: string
        description?: string
        children?: IEntityGroupTree[]
        entities?: IEntity[]
    }
</script>

<script lang="ts">
    import FilePlusOutline from 'svelte-material-icons/FilePlusOutline.svelte'
    import FolderPlusOutline from 'svelte-material-icons/FolderPlusOutline.svelte'
    import DeleteOutline from 'svelte-material-icons/DeleteOutline.svelte'
    import Close from 'svelte-material-icons/Close.svelte'

    import type { IEntityGroup } from 'rpg/client/world/MapEditor'
    import type { IEntity } from 'rpg/client/world/MapEditor'
    import Group from './Group.svelte'

    import Vector3 from 'rpg/shared/utils/Vector3'
    import WorldEntityType from 'rpg/shared/world/WorldEntityType'

    let entities: IEntity[] = []
    let groups: IEntityGroup[] = []

    let groupsTrees: IEntityGroupTree[] = []

    $: groups, generateGroupTrees()

    const generateGroupTree = (group: IEntityGroup, slot: IEntityGroupTree[] = groupsTrees) => {
        const newSlotLen = slot.push({
            _id: group._id,
            name: group.name,
            description: group.description,
            entities: entities.filter((entity) => entity.groupId === group._id),
        })

        const children = groups.filter((otherGroup) => otherGroup.parent?._id === group._id)

        if (children.length > 0) {
            slot[newSlotLen - 1].children = []
            children.forEach((child) => {
                generateGroupTree(child, slot[newSlotLen - 1].children)
            })
        }
    }

    const generateGroupTrees = () => {
        groupsTrees = []

        const primaryGroups = groups.filter((group) => !!!group.parent)

        primaryGroups.forEach((group) => {
            generateGroupTree(group)
        })
    }

    let lastClickedGroup: IEntityGroup = null
    let currentlyEditedGroup: IEntityGroup = null
    let currentlyEditedEntity: IEntity = null

    const onGroupInteraction = (event: { detail: string }) => {
        lastClickedGroup = groups.find((group) => group._id === event.detail)
    }

    const onBackgroundInteraction = () => {
        lastClickedGroup = null
    }

    const createNewGroup = () => {
        currentlyEditedGroup = {
            _id: Math.floor(Math.random() * 0xffffff).toString(),
            name: '',
        }

        if (lastClickedGroup) currentlyEditedGroup.parent = lastClickedGroup
    }

    const onCreateNewGroup = () => {
        createNewGroup()
    }

    const disableGroupEditor = () => {
        currentlyEditedGroup = null
    }

    const submitGroup = () => {
        groups.push(currentlyEditedGroup)
        currentlyEditedGroup = null
        groups = groups
    }

    const editEntity = (entityId: string) => {
        const selectedEntity = entities.find((entity) => entity._id === entityId)
        if (!selectedEntity) return

        currentlyEditedEntity = selectedEntity
    }

    const onEditEntity = (event: { detail: string }) => editEntity(event.detail)

    const disableEntityEditor = () => {
        currentlyEditedEntity = null
    }
</script>

<main>
    <div class="actions">
        <button class="action" id="new-object">
            <FilePlusOutline color="white" size="1.5em" />
        </button>
        <button class="action" id="new-group" on:click={onCreateNewGroup}>
            <FolderPlusOutline color="white" size="1.5em" />
        </button>
        <button class="action" id="delete">
            <DeleteOutline color="white" size="1.5em" />
        </button>
    </div>
    {#if currentlyEditedGroup}
        <div class="group-editor">
            <button id="close-btn" on:click={disableGroupEditor}><Close size="1.5em" /></button>
            <form class="properties">
                <div class="property">
                    <label for="name"><u>Nazwa:</u></label>
                    <input type="text" id="name" bind:value={currentlyEditedGroup.name} />
                </div>
                <div class="property">
                    <label for="description">Opis:</label>
                    <input
                        type="text"
                        id="description"
                        bind:value={currentlyEditedGroup.description}
                    />
                </div>
                {#if currentlyEditedGroup.parent}
                    <div class="property">
                        <label for="parent">Rodzic:</label>
                        <input
                            type="text"
                            id="parent"
                            value={currentlyEditedGroup.parent.name}
                            disabled
                        />
                    </div>
                {/if}
                <input
                    type="submit"
                    value="Stwórz"
                    id="submit"
                    on:click|preventDefault={submitGroup}
                />
            </form>
        </div>
    {:else if currentlyEditedEntity}
        <div class="entity-editor">
            <button id="close-btn" on:click={disableEntityEditor}><Close size="1.5em" /></button>
            <div class="properties">
                <div class="property" />
            </div>
        </div>
    {:else}
        <div class="tree" on:click={onBackgroundInteraction} on:keypress>
            {#each groupsTrees as primaryGroup}
                <Group
                    data={primaryGroup}
                    on:groupInteraction={onGroupInteraction}
                    on:editEntity={onEditEntity}
                />
            {/each}
        </div>
    {/if}
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

    .entity-editor,
    .group-editor {
        position: relative;
        background-color: #444;
        width: 100%;
        height: 100%;
        padding: 1rem;
        box-sizing: border-box;

        #close-btn {
            position: absolute;
            top: 2%;
            right: 5%;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
        }

        .properties {
            margin-top: 7%;
            display: flex;
            flex-direction: column;

            #submit {
                position: relative;
                height: 4em;
                width: 8em;
                margin: 2em auto 0;
                background: none;
                color: white;
                border: 2px solid white;
                cursor: pointer;
            }
        }

        .property {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0.5em 3em 0.5em 3em;

            label {
                color: white;
                font-family: Roboto, sans-serif;
            }
        }
    }
</style>
