<script lang="ts">
    let login = '';
    let password = '';
    let message = '';

    function checkCredentials() {
        alt.emit('LOGIN:ATTEMPT', login, password)
    }

    alt.on('LOGIN:ERROR', (error) => {
        message = error
    })

</script>

<div class="container">
    <div class="header">
        <h1>Zaloguj się</h1>
    </div>

    <div class="login">
        <label for="login">Login:</label>
        <input type="text" id="login" name="login" bind:value={login}>
    </div>

    <div class="password">
        <label for="password">Hasło:</label>
        <input type="text" id="password" name="password" bind:value={password}>
    </div>

    <button id="login-btn" on:click={checkCredentials}>Zaloguj</button>

    <p id="message">{message}</p>
</div>

<style lang="scss">
    .container {
        background-color: hsla(354, 0%, 17%, 1);
        position: absolute;
        left: 50%;
        top: 50%;
        width: 60vw;
        height: 60vh;
        margin-left: -30vw;
        margin-top: -30vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 5vh;
    }

    .header {
        color: white;
    }

    h1 {
        color: white;
        size: 10vh;
        text-align: center;
    }

    label {
        color: white;
        size: 3vh;
    }

    input {
        width: 10vw;
        height: 6vh;
    }

    #login-btn {
        width: 12vw;
        height: 6vh;
    }

</style>