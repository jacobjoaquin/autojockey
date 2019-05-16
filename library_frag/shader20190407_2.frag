#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.283185307179586
#define PI 3.141592653589793

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  float u_phase = u_time * 0.1;
  vec3 c0 = vec3(1.0, 0.5, 0.0);
  vec3 c1 = vec3(0.9, 0.1, 0.3);
  float m = 1.0;
  vec2 nCoord = gl_FragCoord.xy / u_resolution.xy;
  float sinx = sin((m * nCoord.x + u_phase) * TAU);
  float cosx = cos(sinx * m * nCoord.x * TAU);
  float siny = sin((m * nCoord.y) * TAU);
  float cosy = cos(m * nCoord.y * TAU);

  float v = fract(sinx + cosx + siny + cosy + u_phase);
  float stripes = fract(nCoord.y * 32.0 + -8.0 * u_phase);
  stripes = step(stripes, 0.25);
  v = v - stripes;
  vec3 color = mix(c0, c1, v);
  gl_FragColor = vec4(color, 1.0);
}
