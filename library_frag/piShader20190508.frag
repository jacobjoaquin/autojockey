// #ifdef GL_ES
// precision mediump float;
// #endif
//

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
const vec3 c0 = vec3(0.0);
const vec3 c1 = vec3(1.0);

// Pornj
const vec3 c2 = vec3(255.0, 148.0, 0.0) / 255.0;
const vec3 c3 = vec3(255.0, 0.0, 210.0) / 255.0;

// Commodore 64 Blues
const vec3 c4 = vec3(80.0, 69.0, 155.0) / 256.0;
const vec3 c5 = vec3(126.0, 145.0, 203.0) / 256.0;


const vec3 c6 = vec3(255, 217, 188) / 255.0;
const vec3 c7 = vec3(112.0, 2.0, 137.0) / 255.0;

const vec3 c8 = vec3(255.0, 184.0, 0.0) / 255.0;
const vec3 c9 = vec3(26.0, 17.0, 16.0) / 255.0;

const vec3 c10 = vec3(255.0, 60.0, 0.0) / 255.0;

// source: https://thebookofshaders.com/05/
float plot(vec2 st, float pct)
{
  return smoothstep(pct - 0.02, pct, st.y) - smoothstep(pct, pct + 0.02, st.y);
}

// source: https://thebookofshaders.com/08/
mat2 rotate2d(float angle)
{
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}
// source: https://thebookofshaders.com/10/
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float concentricCircles(in vec2 p0, in vec2 p1, in float scale)
{
  float d = distance(p0, p1);
  float wrap = fract(d * scale);
  return wrap;
  // return step(0.5, wrap);
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
  float phase = u_time / 60.0 * 2.0;
  if (u_isProcessing)
  {
    phase = u_phase;
  }
  phase = fract(phase);
  vec2 st = gl_FragCoord.xy / u_resolution;
  st = rotate2d(0.5 * TAU) * st;
  // st.y += 1.0;

  // Grid translation
  float sine2 = sin(0.025 * u_time * TAU);
  float nRows = map(sine2, -1.0, 1.0, 1.0, 12.0);
  float nColumns = nRows;
  vec2 t = st;
  // t -= 0.5;
  // t.x = pow(12.0, st.x);
  t.x *= nRows;
  t.y *= nColumns;

  vec2 tPre = t;
  vec2 tIndex = floor(t);     // Create indices
  t.y += tIndex.x * phase;
  // t = rotate2d(0.01 * random(t) * TAU) * t;
  float sine = sin(st.x + (2.0 * phase) * TAU);
  t = fract(t);
  // t = rotate2d(sine * 0.25 * random(t) * TAU) * t;
  t = rotate2d(st.y + st.x + u_time * 0.1 * TAU + random(t) * 0.05) * t;

  // Concentric circles
  float v = t.x + t.y;
  float negate = mod(tIndex.x + tIndex.y, 2.0);
  // v += negate * phase * 1.0;
  // v += negate * 0.125;
  // v = fract(v);
  v = mod(v, 2.0);

  float crusherAmount = 1.0;
  // v = floor(v * crusherAmount) / (crusherAmount - 1.0);

  v += random(st + u_time * 0.5);
  vec3 cMix0 = mix(c0, c7, st.x);
  vec3 cMix1 = mix(c10, c3, st.y);
  // vec3 o = vec3(mix(cMix0, cMix1, v));
  vec3 o = vec3(mix(c1, c2, v));
  // vec3 o = vec3(v);
  gl_FragColor = vec4(o, 1.0);
}
