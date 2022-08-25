<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher()

    export let message = ''

    let login = ''
    let password = ''

    const emitLoginEvent = () => {
        dispatch('login', {
            login: login,
            password: password
        })
    }
</script>

<style lang="scss">
  @import '../components/theme.scss';

  @property --login-btn-color-a {
    syntax: '<color>';
    initial-value: $THEME-COLOR-A;
    inherits: false;
  }

  @property --login-btn-color-b {
    syntax: '<color>';
    initial-value: $THEME-COLOR-B;
    inherits: false;
  }

  * {
    color: white;
    font-family: Roboto, sans-serif;
  }

  button {
    border: 0;
  }

  header {
    color: white;
    text-align: center;
  }

  h1 {
    color: white;
    margin: 0;
    font-size: 42px;
    font-family: 'Amiable Forsythia Free', sans-serif;
    background: white 0 60px;
    padding: 10px;

    font-weight: 600;

    letter-spacing: 5px;

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  label {
    color: white;
    size: 3vh;
  }

  input {
    min-width: 20vw;
    min-height: 30px;

    max-height: 5vh;

    margin-top: 2.5vh;

    background:rgba(255, 255, 255, 0.95);
    color: #000;

    outline: none;
    height: 6vh;

    border-radius: 0;
    border-width: 3px;
    border-style: solid;

    border-top: 0;
    border-right: 0;
    border-left: 0;

    border-image: linear-gradient(40deg, var(--theme-color-a), var(--theme-color-b)) 1;
    padding: 5px 5px 5px 15px;

    &:focus, &:hover {
      background:rgba(255, 255, 255, 1);
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.45);
    }
  }

  #login-btn {
    padding: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    margin-top: 5vh;
    background: linear-gradient(40deg,
            var(--login-btn-color-a),
            var(--login-btn-color-b)
    );

    min-width: 20vw;
    border-radius: 30px;


    &:hover {
      --theme-color-a: #868eff;
      --theme-color-b: #ffd9d8;
    }

    &:active {
      --login-btn-color-a: #9aa1ff;
      --login-btn-color-b: #ffe6e6;
    }
  }

  .container > :last-child {
    margin-bottom: 5vh;
  }
</style>

<div class="container">
    <header>
        <h1>LOGO</h1>
    </header>

    <div class="login">
        <input placeholder="Login" type="text" id="login" name="login" bind:value={login}>
    </div>

    <div class="password">
        <input placeholder="Hasło" type="password" id="password" name="password" bind:value={password}>
    </div>

    <p id="message">{message}</p>

    <button id="login-btn" on:click={emitLoginEvent}>ZALOGUJ</button>
</div>