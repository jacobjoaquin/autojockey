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
const vec3 c0 = vec3(1.0);
const vec3 c1 = vec3(0.0);

// Pornj
// const vec3 c1 = vec3(255.0, 148.0, 0.0) / 255.0;
// const vec3 c0 = vec3(255.0, 0.0, 210.0) / 255.0;

// Commodore 64 Blues
// const vec3 c1 = vec3(80.0, 69.0, 155.0) / 256.0;
// const vec3 c0 = vec3(126.0, 145.0, 203.0) / 256.0;

// From
// https://thebookofshaders.com/08/
mat2 rotate2d(float angle)
{
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
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
  float phase = u_time / 60.0 * 8.0;
  if (u_isProcessing)
  {
    phase = u_phase;
  }
  phase = fract(phase);
  vec2 st = gl_FragCoord.xy / u_resolution;

  // Grid
  vec2 t = st;
  t.x -= 0.5;
  float r = sin(1.0 * phase * TAU);

  t = rotate2d(r * 1.0 / 12.0 * TAU) * t;
  t.y = pow(8.0, t.y);
  t.x += map(st.x - 0.5, -0.5, 0.5, -t.y, t.y) * 0.25;
  t.y += fract(phase * 4.0);
  t = fract(t);

  vec2 grid = vec2(t.x, t.y);
  grid = step(0.5, grid);
  float g = grid.x + grid.y;
  g = mod(g, 2.0);

  // float horizon = 1.0 - step(1.0 /

  vec3 c2 = vec3(168, 110, 239) / 255.0;
  float mSrc= sin(12.0 * (1.0 * phase + t.x) * TAU) * 0.5 + 0.5;
  mSrc = step(0.5, mSrc);
  vec3 c3 = mix(c1, c2, mSrc);

  vec3 c4 = vec3(1.0, 0.0, 1.0);
  float mSrc2 = sin(6.0 * (1.0 * phase + t.y) * TAU) * 0.5 + 0.5;
  mSrc2 = step(0.5, mSrc2);
  // float gradient = 1.0 - st.y * 0.5;
  // vec3 c5 = mix(c0 * gradient, c4, mSrc2);
  // vec3 c5 = mix(c0, c4, mSrc2);
  vec3 c5 = mix(vec3(0.1), c4, mSrc2);


  vec3 o = vec3(mix(c5, c3, g));

  // o *= gradient;

  gl_FragColor = vec4(o, 1.0);
}
