#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.283185307179586
#define PI 3.141592653589793

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_input;

const vec3 c0 = vec3(1.0, 0.1, 0.4);
const vec3 c1 = vec3(0.1);

float checker(vec2 st, float nTiles, float xOffset, float yOffset) {
  float n = nTiles * 0.5;
  float x = step(0.5, fract(n * fract(st.x + xOffset)));
  float y = step(0.5, fract(n * fract(st.y + yOffset)));
  return mod(x + y, 2.0);
}

void main()
{
  float u_phase = u_time / 10.0;
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 center = vec2(0.5, 0.5);
  float offset = sin(u_phase * TAU) * 0.25;
  float scale = 12.0;

  float d = distance(st, vec2(0.5 + offset, 0.5));
  d = fract(d * scale);
  d = step(0.5, d);
  float d2 = distance(st, vec2(0.5 - offset, 0.5));
  d2 = fract(d2 * scale);
  d2 = step(0.5, d2);
  float d3 = distance(st, vec2(0.5, 0.5 - offset));
  d3 = fract(d3 * scale);
  d3 = step(0.5, d3);
  float d4 = distance(st, vec2(0.5, 0.5 + offset));
  d4 = fract(d4 * scale);
  d4 = step(0.5, d4);


  float dLayer = mod(d  + d3, 2.0);

  // float layer1 = sin(6.0 * st.y * TAU);

  float py = gl_FragCoord.y;
  py = mod(py, 2.0);
  // py = py * 0.5 + 0.5;
  float dc = distance(st, vec2(0.5, 0.5));
  dc = 1.0 - dc;
  dc = clamp(dc, 0.0, 1.0);


  vec3 c = mix(c0, c1, vec3(mod(dLayer, 2.0)));
  c *= dc * py;
  // c *= py;
  gl_FragColor = vec4(c, 1.0);
}
