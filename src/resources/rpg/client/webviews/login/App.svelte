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

    let canvas

    onMount(() => {
        let img = new Image()

        let gl = canvas.getContext("experimental-webgl");

        img.onload = function() {
            // https://gist.github.com/jasonkit/c5b4fd62e8cbfe2780cc

            gl.viewport(0, 0, img.width, img.height);

            let vtx_shader = gl.createShader(gl.VERTEX_SHADER);
            let frag_shader = gl.createShader(gl.FRAGMENT_SHADER);

            gl.shaderSource(vtx_shader, VertexShader);
            gl.shaderSource(frag_shader, FragmentShader);
            gl.compileShader(vtx_shader);
            gl.compileShader(frag_shader);

            if (!gl.getShaderParameter(vtx_shader, gl.COMPILE_STATUS)){
                console.log(gl.getShaderInfoLog(vtx_shader));
            }
            if (!gl.getShaderParameter(frag_shader, gl.COMPILE_STATUS)){
                console.log(gl.getShaderInfoLog(frag_shader));
            }

            let program = gl.createProgram();
            gl.attachShader(program, vtx_shader);
            gl.attachShader(program, frag_shader);
            gl.linkProgram(program);
            gl.useProgram(program);

            let a_vpos = gl.getAttribLocation(program, "a_vpos");   // vertex coordinate
            let a_tpos = gl.getAttribLocation(program, "a_tpos");   // texture coordinate
            let u_size = gl.getUniformLocation(program, "u_size");  // size of the texture
            let u_texture = gl.getUniformLocation(program, "u_texture"); // texture id, use 0 for TEXTURE0
            let u_kernel = gl.getUniformLocation(program, "u_kernel");   // 3x3 kernel to apply

            gl.enableVertexAttribArray(a_vpos);
            gl.enableVertexAttribArray(a_tpos);
            gl.uniform2fv(u_size, new Float32Array([img.width, img.height]));
            gl.uniform1i(u_texture, 0);

            let gaussianMatrix = new Float32Array([
                0.0625, 0.125, 0.0625,
                0.125, 0.25, 0.125,
                0.0625, 0.125, 0.0625
            ]);

            gl.uniformMatrix3fv(u_kernel, false, gaussianMatrix);

            let vpos_buf = gl.createBuffer();
            let tpos_buf = gl.createBuffer();
            let idx_buf = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, vpos_buf);
            // order: Bottom-Left, Bottom-Right, Top-Right, Top-Left
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, 1,1, -1,1]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_vpos, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, tpos_buf);
            // corresponding texture coordinate
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1, 0,1]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_tpos, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx_buf)
            // We will draw the square as triangle strip
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                0, 1,
                3, 2
            ]), gl.STATIC_DRAW);

            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.activeTexture(gl.TEXTURE0);

            gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);
        };

        alt.on('GAME:SCREEN', (buffer) => {
            img.src = 'data:image/png;base64,' + buffer
        })
    })


</script>

<div class="container">
    <canvas bind:this={canvas} width={200} height={200}></canvas>

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