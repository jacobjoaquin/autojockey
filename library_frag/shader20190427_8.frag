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
const vec3 c0 = vec3(0.0);
const vec3 c1 = vec3(1.0);

// Pornj
const vec3 c2 = vec3(255.0, 148.0, 0.0) / 255.0;
const vec3 c3 = vec3(255.0, 0.0, 210.0) / 255.0;

// Commodore 64 Blues
const vec3 c4 = vec3(80.0, 69.0, 155.0) / 256.0;
const vec3 c5 = vec3(126.0, 145.0, 203.0) / 256.0;


const vec3 c6 = vec3(242.0, 215.0, 186.0) / 255.0;
const vec3 c7 = vec3(112.0, 2.0, 137.0) / 255.0;



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


  // Grid translation
  vec2 t = st;
  t.x -= 0.5;
  // t.y -= 0.5;
  t.y = pow(32.0, t.y);
  t.x *= 2.0;
  t.y *= 1.0;
  t.x /= (1.0 - st.y) * 1.0;
  t.x += 0.5;
  vec2 tFloor = floor(t);  // Create indices
  t = fract(t);


  // Concentric circles
  float v = concentricCircles(vec2(0.5), t, 0.1);
  float alt = mod(tFloor.x + tFloor.y, 2.0);
  v += 1.0 * phase + tFloor.y / 24.0;
  v -= abs(tFloor.x * 0.05);
  v *= 2.0;
  v = fract(v);
  v = sin((v + alt * 0.5) * TAU) * 0.5 + 0.5;
  v = step(0.5, v);

  // Makes checkerboard
  // float v = mod(tFloor.x + tFloor.y, 2.0);

  vec3 o = vec3(mix(c0, c3, v));
  gl_FragColor = vec4(o, 1.0);
}
