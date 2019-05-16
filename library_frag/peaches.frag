#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.283185307179586
#define PI 3.141592653589793

uniform float u_time;
uniform vec2 u_resolution;

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

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 st2 = st;
  float phase = fract(u_time * 0.25);

  st -= 0.5;
  st = rotate2d(sin(u_time * 0.0123 * TAU) * TAU) * st;

  vec3 c0 = vec3(1.0, 0.5, 0.0);
  vec3 c1 = vec3(0.9, 0.1, 0.3);

  float m = sin(u_time * 0.05 * TAU);
  m = map(m, -1.0, 1.0, 0.5, 2.0);
  m *= m;

  float sinx = sin((m * st.x + phase) * TAU);
  float cosx = cos(m * st.x * TAU);
  float siny = sin(m * st.y * TAU);
  float cosy = cos(m * st.y * TAU);

  float v = fract(sinx + cosx + siny + cosy + phase);

  float bandWidth = sin(u_time * 0.042 * TAU);
  bandWidth = map(bandWidth, -1.0, 1.0, 0.05, 0.75);
  float band = step(bandWidth, fract(v + bandWidth));

  vec3 color = mix(c0, c1, fract(v + st2.y + phase));
  color *= band;

  gl_FragColor = vec4(color, 1.0);
}
