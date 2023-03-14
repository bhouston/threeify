#pragma once

// Do not use unless you are trying to debug things, these are slow and 99% of the time unnecessary

float safePow( const float a, const float b ) {
  return pow(max( a, 0. ), b);
}

float safePow2( const float a ) {
  return pow2(max( a, 0. ));
}

float safeLog( const float x ) {
  return log(max( x, 1e-6 ));
}

float safeLog2( const float x ) {
  return log2(max( x, 1e-6 ));
}

float safeSqrt( const float x ) {
  return sqrt(max( x, 0.0 ));
}

float safeDivide( const float a, const float b ) {
  return a / max( b, 1e-6 );
}
