precision mediump float;

uniform mat4 worldView;

varying vec4 vPosition;
varying vec3 vNormal;

uniform sampler2D textureSampler;
uniform sampler2D refSampler;

void main(void) {

    vec3 e = normalize( vec3( worldView * vPosition ) );
    vec3 n = normalize( worldView * vec4(vNormal, 0.0) ).xyz;

    vec3 r = reflect( e, n );
    float m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );
    vec2 vN = r.xy / m + .5;

    vec3 topColor =     vec3(0.7, 1.0, 0.95);
    vec3 bottomColor =  vec3(0.85, 1.0, 0.6);
    vec3 base = texture2D( refSampler, vN).rgb;

    float offset = 2.0;
    float h = normalize(vPosition + offset).y;

	gl_FragColor = vec4( mix(bottomColor, topColor, max(pow(max(h, 0.0), 0.6), 0.0)), 1.0 );
}
