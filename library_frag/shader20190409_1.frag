#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.283185307179586
#define PI 3.141592653589793

uniform float u_time;
uniform vec2 u_resolution;


float biToUni(float v) {
  return (v + 1.0) * 0.5;
}

// Power curve
// http://www.iquilezles.org/www/articles/functions/functions.htm
float pcurve(float x, float a, float b) {
  float k = pow(a + b, a + b) / (pow(a , a) * pow(b , b));
  return k * pow(x, a) * pow(1.0 - x, b);
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
  float u_phase = u_time * 0.333;
  float sine = sin(u_time * 0.25);
  float nTiles = map(sine, -1.0, 1.0, 2.0, 12.0);

  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st -= 0.5;

  // Create tile mask
  vec2 mst = fract(st * nTiles);
  float curve = biToUni(sin(u_phase * TAU)) * 2.0 + 0.25;
  float vx = pcurve(mst.x, curve, curve);
  float vy = pcurve(mst.y, curve, curve);
  float mask = min(vx, vy);
  mask = step(0.5, mask);

  // Stripes
  float rowst = biToUni(sin((st.x - st.y + u_phase) * TAU * 4.0));
  rowst = step(0.5, rowst);
  float colst = biToUni(cos((st.y + st.x + u_phase) * TAU * 8.0));
  colst = step(0.5, colst);
  float foo = mask * rowst + (1.0 - mask) * colst;

  vec3 color = vec3(foo);
  gl_FragColor = vec4(color, 1.0);
}
