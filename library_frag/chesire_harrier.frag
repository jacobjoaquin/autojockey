#ifdef GL_ES
precision mediump float;
#endif

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
const vec3 c0 = vec3(255.0, 148.0, 0.0) / 255.0;
const vec3 c1 = vec3(255.0, 0.0, 210.0) / 255.0;

// Commodore 64 Blues
// const vec3 c0 = vec3(80.0, 69.0, 155.0) / 256.0;
// const vec3 c1 = vec3(126.0, 145.0, 203.0) / 256.0;


// const vec3 c0 = vec3(242.0, 215.0, 186.0) / 255.0;
// const vec3 c1 = vec3(112.0, 2.0, 137.0) / 255.0;

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
  // return wrap;
  return step(0.5, wrap);
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
  vec2 t = st;

  float sine = sin(u_time * 0.027 * TAU);

  float txMod = sin(u_time * 0.028 * TAU);
  txMod = map(txMod, -1.0, 1.0, 0.1, 0.9);
  t.x -= txMod;
  // t.y -= 0.02;
  // t.x -= 1.0 / 6.0;
  t.x *= 1.0;
  float rAmount = 0.01;
  t = rotate2d(map(sine, -1.0, 1.0, -rAmount, rAmount) * TAU) * t;
  // t = rotate2d(-0.005 * TAU) * t;

  float horizon = 0.5;
  float div = 16.0;
  // div = map(sin(u_time * 0.125 * TAU), -1.0, 1.0, 1.0, 64.0);
  float thisY = t.y * step(0.5, 1.0 - t.y) + (1.0 - t.y) * step(0.5, t.y);

  float x = t.x / map(thisY, 0.0, horizon, 1.0, 1.0 / div);
  float y = pow(32.0, thisY);

  float mask = step(0.5, st.y);
  float sy = mask * (1.0 - t.y) + (1.0 - mask) * (t.y);
  float waveMod = sin(u_time * 0.012 * TAU);
  waveMod = map(waveMod, -1.0, 1.0, -0.2, 0.2);
  float phaseMod = sin(u_time * 0.032 * TAU);
  phaseMod = map(phaseMod, -1.0, 1.0, 1.0, 8.0);
  x += (sin((phaseMod * sy + 4.0 * phase) * TAU) * 0.5 + 0.5) * waveMod;

  x = fract(x + step(0.5, t.y) * 0.5);
  x = fract(x + sin(u_time * 0.311) * 2.0);
  y = fract(y + 4.0 * phase);
  x = step(0.5, x);
  y = step(0.5, y);

  // float v = int(x) + int(y) == 1 ? 1.0 : 0.0;
  float v = abs(x - y);

  // v *= step(1.0 - horizon, 1.0 - t.y);

  vec3 o = vec3(mix(c0, c1, v));
  vec3 top = mask * o;
  vec3 bottom = (1.0 - mask) * o;
  o = o * top * map(t.y, 0.5, 1.0, 0.0, 3.0) +
  o * bottom * map(t.y, 0.0, 0.5, 3.0, 0.0);

  float stripe = step(0.5, x);
  o *= stripe;

  // o *= mask + (1.0 - mask) * o;
  // o *= 1.0 - mask;

  gl_FragColor = vec4(o, 1.0);
}
