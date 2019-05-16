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
  // st -= 0.5;
  // st = rotate2d(phase * TAU) * st;

  // Grid translation
  float nRows = 9.0;
  float nColumns = nRows;
  vec2 t = st;
  // t -= 0.5;
  t *= nRows;
  // t.x *= nRows * 2.0;

  // t.y -= 1.0;
  float stepY = step(0.5, st.y);
  // float y = (1.0 - stepY) * st.y + stepY * (1.0 - st.y);
  // t.y = y;
  // t.x = t.x / map(y, 0.0, 1.0, 1.0, 1.0 / nColumns);
  // t.y = pow(nColumns * 1.0, t.y);
  vec2 tIndex = floor(t);     // Create indices
  t = fract(t);

  // Concentric circles
  vec2 offset = vec2(0.5);
  // vec2 tIndexMod = tIndexMod +

  // float ccScale0 = 3.0 - distance(floor(st * nRows) / (nRows - 1.0), offset) * 36.0;
  float sine = sin(phase * TAU);
  float m = sine * 0.5 + 0.5;
  float ccScale0 = distance(st, offset) * map(m, 0.0, 1.0, 64.0, 128.0);
  float ccScale1 = distance(st, offset) * 1.0;

  float ccScale = ccScale0 + ccScale1;
  ccScale = fract(ccScale);
  ccScale = mod(ccScale, 2.0);


  float v = concentricCircles(offset, t, ccScale);
  v += phase;
  v += tIndex.x / nRows;
  v += tIndex.y / nColumns;

  // float cc2 = concentricCircles(offset, st, 1.0);

  float negate = mod(tIndex.x + tIndex.y, 2.0);
  // v += negate * 0.5;
  // v += stepY * 0.5;
  // v += cc2;
  // v += (st.y + st.x);
  v = fract(v);
  v = mod(v, 2.0);
  v = step(0.5, v);

  vec2 t2 = t * st;
  // t2 = frac(t2);
  // v =

  vec3 o = vec3(mix(c10, c9, v));
  gl_FragColor = vec4(o, 1.0);
}
