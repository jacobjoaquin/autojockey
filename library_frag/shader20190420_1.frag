#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.283185307179586
#define PI 3.141592653589793

uniform float u_phase;
uniform float u_frame;
uniform float u_nFrames;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_input;

// Colors
// const vec3 c1 = vec3(1.0, 0.45, 0.0);
// // const vec3 c1 = vec3(0.8, 0.1, 0.3);
// const vec3 c0 = vec3(0.0, 0.5, 0.0);

const vec3 c1 = vec3(1.0, 0.5, 0.0);
const vec3 c0 = vec3(0.8, 0.1, 0.3);
// const vec3 c0 = vec3(1.0, 0.3, 0.7);


float concentricCircles(in vec2 p0, in vec2 p1, in float scale)
{
  float d = distance(p0, p1);
  float wrap = fract(d * scale);
  return wrap;
  // return step(0.5, wrap);
}

// From
// https://thebookofshaders.com/08/
mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
  sin(_angle),cos(_angle));
}

void main()
{
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  // Concentric circles
  vec2 center = vec2(0.5, 0.5);
  float scale = (sin(u_phase * TAU) * 0.5 + 0.5) * 8.0 + 1.0;
  float offset = cos(u_phase * TAU) * 0.5;
  float v = 0.0;  // Accumulator
  const float nAngles = 2.0;
  for (float i = 0.0; i < nAngles; ++i) {
    float phase = i / nAngles * TAU;
    vec2 r = vec2(cos(phase), sin(phase));
    vec2 t = vec2(0.5);
    vec2 st0 = st - t;
    float rAmount = sin(u_phase * TAU) * 0.5 + 0.5;
    st0 = rotate2d(2.0 * rAmount * TAU) * st0;
    v += concentricCircles(st0, r * offset, scale);
  }

  // Highlight overlay
  // float nRows = (sin(u_phase * TAU) * 0.5 + 0.5) * 12.0 + 2.0;
  // float nCols = (cos(u_phase * TAU) * 0.5 + 0.5) * 12.0 + 2.0;
  float nRows = sin(u_phase * TAU) * 18.0;
  float nCols = cos(u_phase * TAU) * 12.0;
  float m = cos(nRows * (st.y + 5.0 * u_phase) * TAU) * 0.5 + 0.5;
  float m2 = sin(nCols * (st.x + 7.0 * u_phase) * TAU) * 0.5 + 0.5;
  m *= m2;
  m = m * 0.2 + 0.8;
  m *= 1.25;

  // Final mix
  float colorMixer = mod(v, 2.0);
  vec3 c = vec3(mix(c0, c1, colorMixer) * m);
  gl_FragColor = vec4(c, 1.0);
}
