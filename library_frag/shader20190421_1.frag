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
// const vec3 c1 = vec3(80.0, 69.0, 155.0) / 256.0;
// const vec3 c0 = vec3(126.0, 145.0, 203.0) / 256.0;


// const vec3 c1 = vec3(16.0) / 256.0;
// const vec3 c0 = vec3(255, 184, 0) / 256.0;

// From
// https://thebookofshaders.com/08/
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
  float phase = u_time / 60.0 * 8.0;
  if (u_isProcessing)
  {
    phase = u_phase;
  }
  phase = fract(phase);
  vec2 st = gl_FragCoord.xy / u_resolution;

  // Grid
  vec2 t = st;
  t -= 0.5;
  t *= 1.0;
  float xWaves = fract(t.y + sin((phase + t.x) * TAU) * 0.5 + 0.5);
  float yWaves = t.x + 3.0 * cos((-phase + t.y) * TAU) * 0.5 + 0.5;

  yWaves = fract(yWaves);
  // xWaves = step(0.5, xWaves);
  // yWaves = step(0.5, yWaves);
  // float g = xWaves + yWaves;
  // float g = xWaves;
  float g = sin((4.0 * phase + t.x + st.y ) * TAU) * 0.5 + 0.5;
  g += yWaves;
  g = mod(g, 2.0);


  // float concentricCircles(in vec2 p0, in vec2 p1, in float scale)
  vec2 t2 = st;
  t2.x -= 0.5;
  t2.x = t2.x + t2.y;
  t2.y = pow(2.0, sin(fract(t2.y + phase) * TAU) * 0.5 + 0.5);
  float cc = concentricCircles(vec2(0.5, 0.5 ), fract(t2 * 2.0), 2.0);
  cc = fract(cc);
  // g = mod(g + cc, 2.0);
  // cc = step(cc, 0.5);
  g = mod(fract(cc + phase), 2.0);
  float g2 = g;
  g = step(0.5, g) + g2;

  vec3 c = mix(c0, c1, g);
  vec3 o = c;

  // o *= gradient;

  gl_FragColor = vec4(o, 1.0);
}
