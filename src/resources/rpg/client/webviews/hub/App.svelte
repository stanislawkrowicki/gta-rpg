<script lang="ts">
    import { onMount } from 'svelte'

    import LoginPanel from './LoginPanel.svelte'
    import RegistrationPanel from './RegistrationPanel.svelte'

    import Carousel from 'svelte-carousel'

    import ChevronRight from 'svelte-material-icons/ChevronRight.svelte'
    import ChevronLeft from 'svelte-material-icons/ChevronLeft.svelte'

    let carousel

    let loginMessage = ''
    let registrationMessage = ''

    const moveToLogin = () => {
        // @ts-ignore
        carousel.goTo(0)
    }

    const moveToRegistration = () => {
        // @ts-ignore
        carousel.goTo(1)
    }

    const onLoginEvent = (event) => {
        alt.emit('AUTH:LOGIN', event.detail.login, event.detail.password)
    }

    const onRegisterEvent = (event) => {
        if (event.detail.password !== event.detail.passwordConfirm) {
            registrationMessage = 'Podane hasła nie są identyczne.'
            return
        }

        alt.emit('AUTH:REGISTRATION', event.detail.login, event.detail.password)
    }

    alt.on('LOGIN:ERROR', (error) => {
        loginMessage = error
    })

    alt.on('REGISTER:ERROR', (error) => {
        registrationMessage = error
    })

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

  #main-container, .container {
    width: 100%;

    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);

    margin-top: 40vh;
    transform: translateY(-40%);
    padding: 30px 0 0 0;

    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 2vh;
  }

  .move-to-registration {
    position: absolute;
    right: 2.5vw;
    top: 22.5vh;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    span {
      color: white;
      font-size: 42px;
      height: 4rem;
      font-family: Roboto, sans-serif;
      margin-right: 20px;
    }
  }

  .move-to-login {
    position: absolute;
    left: 2.5vw;
    top: 22.5vh;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    span {
      color: white;
      font-size: 42px;
      height: 4rem;
      font-family: Roboto, sans-serif;
      margin-right: 20px;
    }
  }
</style>

<Carousel bind:this={carousel} arrows={false} dots={false} swiping={false}>
    <div class="container login-panel">
        <LoginPanel message={loginMessage} on:login={onLoginEvent}></LoginPanel>

        <div class="move-to-registration" on:click={moveToRegistration}>
            <span>Rejestracja</span>
            <ChevronRight color="white" size="4rem"></ChevronRight>
        </div>
    </div>

    <div class="container registration-panel">
        <RegistrationPanel message={registrationMessage} on:register={onRegisterEvent}></RegistrationPanel>

        <div class="move-to-login" on:click={moveToLogin}>
            <ChevronLeft color="white" size="4rem"></ChevronLeft>
            <span>Logowanie</span>
        </div>
    </div>
</Carousel>
