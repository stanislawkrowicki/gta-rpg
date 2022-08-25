<script lang="ts">
    import {createEventDispatcher} from "svelte"

    export let message = ''

    const dispatch = createEventDispatcher()

    let login = ''
    let password = ''
    let passwordConfirm = ''

    const emitRegisterEvent = () => {
        dispatch('register', {
            login: login,
            password: password,
            passwordConfirm: passwordConfirm,
        })
    }
</script>

<style lang="scss">
  @import '../components/theme.scss';

  @property --register-btn-color-a {
    syntax: '<color>';
    initial-value: $THEME-COLOR-A;
    inherits: false;
  }

  @property --register-btn-color-b {
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

  #register-btn {
    padding: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    margin-top: 5vh;
    background: linear-gradient(40deg,
            var(--register-btn-color-a),
            var(--register-btn-color-b)
    );

    min-width: 20vw;
    border-radius: 30px;

    transition: --register-btn-color-a 0.1s, --register-btn-color-b 0.1s;

    &:hover {
      --register-btn-color-a: #868eff;
      --register-btn-color-b: #ffd9d8;
    }

    &:active {
      --register-btn-color-a: #9aa1ff;
      --register-btn-color-b: #ffe6e6;
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
    <div class="password-confirm">
        <input placeholder="Powtórz hasło" type="password" id="password-confirm" name="password-confirm" bind:value={passwordConfirm}>
    </div>

    <p id="message">{message}</p>

    <button id="register-btn" on:click={emitRegisterEvent}>ZAREJESTRUJ</button>

</div>