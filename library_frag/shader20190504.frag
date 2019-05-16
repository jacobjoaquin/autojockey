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
  float phase = u_time / 60.0 * 16.0;
  if (u_isProcessing)
  {
    phase = u_phase;
  }
  phase = fract(phase);
  vec2 st = gl_FragCoord.xy / u_resolution;
  // st -= 0.25;
  // st = rotate2d(phase * TAU) * st;
  // st = rotate2d(0.125 * TAU) * st;

  // Grid translation
  float nRows = 9.0;
  float nColumns = nRows;
  vec2 t = st;
  t -= 0.5;
  t *= nRows;
  // t.x *= nRows * 2.0;

  // t.y -= 1.0;
  float stepY = step(0.5, st.y);
  float y = (1.0 - stepY) * st.y + stepY * (1.0 - st.y);
  t.y = y;
  t.x = t.x / map(y, 0.0, 1.0, 1.0, 1.0 / nColumns);
  t.y = pow(nColumns * 16.0, t.y);
  vec2 tPre = t;
  vec2 tIndex = floor(t);     // Create indices
  t = fract(t);

  // Concentric circles
  vec2 offset = vec2(0.5);

  float sine = sin(phase * TAU);
  float m = sine * 0.5 + 0.5;
  float ccScale0 = distance(st, offset) * 2.0;
  float ccScale1 = distance(st, offset) * 9.0;

  // ccScale0 = fract(ccScale0);
  // ccScale1 = fract(ccScale1);
  // ccScale0 = step(0.5, ccScale0);
  // ccScale1 = step(0.5, ccScale1);
  // ccScale0 += phase;
  // ccScale1 += phase;

  float v0 = concentricCircles(offset, st, 1.0);
  float v1 = concentricCircles(offset, t, 1.0);

  // float v0 = concentricCircles(offset, st, 4.0);
  // float v1 = concentricCircles(offset, t, 3.0);
  v0 = pow(2.0, v0);
  // v1 = pow(32.0, v1);
  v0 = fract(v0);
  v1 = fract(v1);
  float v = v0 + v1;
  v += -phase + ccScale0;

  float negate = mod(tIndex.x + tIndex.y, 2.0);
  // v += negate * 0.5;
  v = fract(v);
  v = mod(v, 2.0);
  // v = step(0.5, v);

  float r = random(floor(tPre * 2.0));
  // r = r * 0.5;
  // r = step(0.5, r);
  // v *= 0.8;
  // v += r * 0.1;
  v = fract(v);

  float crusherAmount = 4.0;
  v = floor(v * crusherAmount) / (crusherAmount - 1.0);

  vec3 o = vec3(mix(c9, c3, v));
  gl_FragColor = vec4(o, 1.0);
}
