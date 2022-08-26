<script lang="ts">
    import {createEventDispatcher} from "svelte"

    import Carousel from 'svelte-carousel'

    import ChevronRight from 'svelte-material-icons/ChevronRight.svelte'
    import ChevronLeft from 'svelte-material-icons/ChevronLeft.svelte'

    let dispatch = createEventDispatcher()

    let carousel
    let currentLocation = 0

    export let availableLocations: {
        name: string,
        sx: number,
        sy: number,
        sz: number,
        cx: number,
        cy: number,
        cz: number
    }[] = []

    const goPrev = () => {
        // @ts-ignore
        carousel.goToPrev()
    }

    const goNext = () => {
        // @ts-ignore
        carousel.goToNext()
    }

    const onLocationChange = (event) => {
        currentLocation = event.detail
        dispatch('locationChange', currentLocation)
    }

    const spawn = () => {
        dispatch('spawn', currentLocation)
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'a') goPrev()
        if (event.key === 'ArrowRight' || event.key === 'd') goNext()

        if(event.key === 'Enter') spawn()
    })
</script>

<style lang="scss">
  .selector {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(40deg, var(--theme-color-a), var(--theme-color-b));
  }

  .carousel {
    width: 25%;
  }

  .location {
    text-align: center;

    span {
      color: white;
      font-family: Roboto, sans-serif;
      font-size: 42px;
    }
  }

  .chevron-wrapper {
    cursor: pointer;
    transition: 0.5s;

    &:hover {
      background-color: hsla(0, 0%, 60%, 50%);
      box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);
    }
  }
</style>

{ #if availableLocations.length > 0 }
    <div class="selector">
        <div class="chevron-wrapper" on:click={goPrev}>
            <ChevronLeft class="chevron chevron-left" color="white" size="4rem"></ChevronLeft>
        </div>

        <div class="carousel" on:click={spawn}>
            <Carousel bind:this={carousel} on:pageChange={onLocationChange} arrows={false} swiping={false}>
                { #each availableLocations as location }
                    <div class="location">
                        <span>{ location.name }</span>
                    </div>
                { /each }
            </Carousel>
        </div>

        <div class="chevron-wrapper" on:click={goNext}>
            <ChevronRight class="chevron chevron-right" color="white" size="4rem"></ChevronRight>
        </div>
    </div>
{ /if }
