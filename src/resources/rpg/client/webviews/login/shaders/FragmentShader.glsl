precision highp float;
varying vec2 v_tpos;
uniform vec2 u_size;
uniform sampler2D u_texture;
uniform mat3 u_kernel;
void main(void) {
    vec2 delta = 1.0/u_size;
    vec4 color = vec4(0,0,0,0);
    for (int i=0; i<=2; i++) {
        for (int j=0; j<=2; j++) {
            vec2 offset = v_tpos + vec2(i-1, j-1)*delta;
            color += u_kernel[i][j]*texture2D(u_texture, offset);
        }
    }
    gl_FragColor = color;
}