<script lang="ts">
    import type { IEditorObject } from 'rpg/client/world/MapEditor'

    interface IExistingObjectElement {
        object: IEditorObject
        isExpanded: boolean
    }

    let existingRootObjects: IExistingObjectElement[] = []

    alt.on('EXISTING_ROOT_OBJECTS', (objects) => {
        existingRootObjects = objects
    })
</script>

<main>
    <div class="sidebar" />
</main>
