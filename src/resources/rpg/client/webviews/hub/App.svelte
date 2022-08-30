<script lang="ts">
    import { onMount } from 'svelte'

    import LocationSelector from "./LocationSelector.svelte"

    import type {IAvailableLocation} from "../../Hub"
    import AuthPanel from "./AuthPanel.svelte"

    enum Stage {
        WAITING_FOR_AUTHORIZATION,
        CHOOSING_LOCATION
    }

    let stage: Stage = Stage.WAITING_FOR_AUTHORIZATION

    $: isLoginStage = stage === Stage.WAITING_FOR_AUTHORIZATION

    let availableLocations: IAvailableLocation[] = []

    alt.on('STAGE:LOCATION_SELECT', (locations: IAvailableLocation[]) => {
        availableLocations = locations

        stage = Stage.CHOOSING_LOCATION
    })

    const login = (event: CustomEvent) => {
        alt.emit('AUTH:LOGIN', event.detail.login, event.detail.password)
    }

    const register = (event: CustomEvent) => {
        alt.emit('AUTH:REGISTRATION', event.detail.login, event.detail.password)
    }

    const onLocationSelectorChange = (event: CustomEvent) => {
        alt.emit('LOCATION_SELECTOR:CHANGE', event.detail)
    }

    const spawn = (event: CustomEvent) => {
        alt.emit('LOCATION_SELECTOR:CONFIRM', event.detail)
    }

    onMount(() => {})
</script>

<style lang="scss">
  @import url('http://fonts.cdnfonts.com/css/roboto');
  @import url('http://fonts.cdnfonts.com/css/amiable-forsythia-free-2');

  @import '../components/theme.scss';

  :global(html) {
    margin: 0;
    padding: 0;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }

  .location-select {
    position: absolute;
    width: 100vw;
    bottom: 0;
  }
</style>

{ #if isLoginStage }
    <AuthPanel on:login={login} on:registration={register}></AuthPanel>
{ :else }
    <div class="location-select">
        <LocationSelector availableLocations={availableLocations} on:locationChange={onLocationSelectorChange} on:spawn={spawn}></LocationSelector>
    </div>
{ /if }
