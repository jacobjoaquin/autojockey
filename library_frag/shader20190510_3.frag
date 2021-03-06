// #ifdef GL_ES
// precision mediump float;
// #endif

#define TAU 6.283185307179586
#define PI 3.141592653589793

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform int u_frame;
uniform float u_phase;
uniform bool u_isProcessing;

// Colors
// B&W
// const vec3 c0 = vec3(1.0);
// const vec3 c1 = vec3(0.0);

// Pornj
const vec3 c1 = vec3(255.0, 96.0, 0.0) / 255.0;
const vec3 c0 = vec3(255.0, 0.0, 210.0) / 255.0;

// Commodore 64 Blues
// const vec3 c1 = vec3(80.0, 69.0, 155.0) / 256.0;
// const vec3 c0 = vec3(126.0, 145.0, 203.0) / 256.0;

// From
// https://thebookofshaders.com/08/
mat2 rotate2d(float angle)
{
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

// source: https://thebookofshaders.com/10/
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float map(float v, float x0, float x1, float y0, float y1)
{
  if (x0 == x1)
  {
    return y0;
  }
  return (((v - x0) * (y1 - y0)) / (x1 - x0)) + y0;
}

void main()
{
  float phase = u_time / 60.0 * 30.0;
  if (u_isProcessing)
  {
    phase = u_phase;
  }
  phase = fract(phase);
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec2 st2 = st;
  vec2 sto = st;
  // st = rotate2d((sin(u_time * 0.2) * 4.0) * (st.y - 0.5) * 2.0) * st;
  st = rotate2d((sin(u_time * 0.2) * 2.0) * (st.y - 0.5) * 2.0) * st;
  st = rotate2d(32.0 / 256.0 * TAU) * st;
  // st.x += 0.25;
  st = rotate2d(st.y * -1.0) * st;

  // st.x += 0.4;
  // st.y += -0.1;

  // Grid
  vec2 t = st;
  t.x -= 0.5;
  float r = sin(1.0 * phase * TAU);
  t = rotate2d(1.0 / 16.0 * TAU) * t;
  t.y = pow(4.0, t.y);
  t.x += map(st.x - 0.5, -0.5, 0.5, -t.y, t.y) * 0.95;
  t.y += fract(phase * 1.0);
  t = fract(t);

  vec2 grid = vec2(t.x, t.y);
  grid = step(0.5, grid) * 1.01;
  float g = grid.x;
  g += grid.y;
  g = mod(g, 2.0);

  vec3 black = vec3(0.0);
  float nStripesFreq0 = 1.0;
  float nStripesFreq1 = 5.0;
  vec3 c2 = vec3(1.0, 0.5, 0);
  float mSrc= sin(nStripesFreq0 * (16.0 * phase + t.x) * TAU) * 0.5 + 0.5;
  vec3 c3 = mix(c1, c1, mSrc);
  vec3 c4 = vec3(0.28, 0.0, 0.28);
  float mSrc2 = sin(nStripesFreq1 * (-1.0 * phase + t.y) * TAU) * 0.5 + 0.5;
  mSrc2 = step(0.5, mSrc2);
  float gradient = 1.0 - st.y * 1.0;
  vec3 c5 = mix(c1 * gradient, c0, mSrc2);
  vec3 o = vec3(mix(c2, c1, g));

  vec3 cMixOut = vec3(g);

  vec3 white = vec3(1.0);
  white *= clamp(1.0 - distance(sto, vec2(1.5, 0.5)) * 0.5, 0.0, 1.0);
  float rSine = sin(0.1 * u_time * TAU);
  rSine = map(rSine, -1.0, 1.0, 32.0, 128.0);
  float r2 = fract(random(ceil((fract(t + 2.0 * phase)) * rSine) * u_time * 0.1) + 1.0 * phase);
  r2 *= 2.0;

  cMixOut = white * r2 * (1.0 - g) * st.x;
  float sine = sin(-32.0 * st2.y + u_time * TAU);
  sine = map(sine, -1.0, 1.0, 0.0, 1.0);
  vec3 c6 = mix(c3, c5, sine);
  cMixOut += gradient * c6 * g;


  gl_FragColor = vec4(cMixOut, 1.0);
}
