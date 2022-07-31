<script lang="ts">
    import { onMount } from 'svelte'

    import FragmentShader from './shaders/FragmentShader.glsl'
    import VertexShader from './shaders/VertexShader.glsl'

    let login = ''
    let password = ''
    let message = ''

    function checkCredentials() {
        alt.emit('LOGIN:ATTEMPT', login, password)
    }

    alt.on('LOGIN:ERROR', (error) => {
        message = error
    })

    onMount(() => {})


</script>

<style lang="scss">
  @import url('http://fonts.cdnfonts.com/css/roboto');
  @import url('http://fonts.cdnfonts.com/css/amiable-forsythia-free-2');

  $THEME-COLOR-A: #737dfe;
  $THEME-COLOR-B: #ffcac9;

  :global(html) {
    background: url(https://i.ytimg.com/vi/Y16jJfIxcHc/maxresdefault.jpg);
    background-size: cover;
    margin: 0;
    padding: 0;
  }
  :global(body) {
    margin: 0;
    padding: 0;

  }
  * {
    color: white;
    font-family: Roboto;
  }
  button {
    border: 0;

  }
  .container {
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 2vh;
  }

  .header {
    color: white;
  }

  h1 {
    color: white;
    margin: 0px;
    font-size: 42px;
    font-family: 'Amiable Forsythia Free', sans-serif;
    background: white;

    background-position: 0px 60px;
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

    background:rgba(255, 255, 255, 0.95);
    color: #000;

    padding: 5px;

    outline: none;
    height: 6vh;

    border-radius: 0px;
    border-width: 3px;
    border-style: solid;

    border-top: 0;
    border-right: 0;
    border-left: 0;

    border-image: linear-gradient(40deg, $THEME-COLOR-A, $THEME-COLOR-B) 1;
    padding-left: 15px;

    &:focus, &:hover {
      background:rgba(255, 255, 255, 1);
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.45);
    }
  }
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

    transition: --login-btn-color-a 0.1s, --login-btn-color-b 0.1s;

    &:hover {
      --login-btn-color-a: #868eff;
      --login-btn-color-b: #ffd9d8;
    }

    &:active {
      --login-btn-color-a: #9aa1ff;
      --login-btn-color-b: #ffe6e6;
    }
  }


  #main-container {
    width: 100%;
    position: absolute;

    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);

    margin-top: 40vh;
    transform: translateY(-40%);
    padding: 30px 0 0 0;
  }

  .container > :last-child {
    margin-bottom: 5vh;
  }
</style>

<div class="container" id="main-container">
    <div class="header">
        <h1>LOGO</h1>
    </div>

    <div class="login">
        <input placeholder="Login" type="text" id="login" name="login" bind:value={login}>
    </div>

    <div class="password">
        <input placeholder="Hasło" type="text" id="password" name="password" bind:value={password}>
    </div>

    <p id="message">{message}</p>

    <button id="login-btn" bind:value={checkCredentials}>ZALOGUJ</button>
</div>