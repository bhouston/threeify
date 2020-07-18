#pragma once
precision highp float;

#pragma include <math/bytePacking>

struct TestResults {
  int numSuccesses;
  int numFailures;
  int idOfFirstFailure;
};

// IDEA: Varying which unit test to run based on a varying from the vertex shader.
//  This one can have multiple identified failures per run.

bool equalsTolerance( float rhs, float lhs, float tolerance ) {
  return abs( rhs - lhs ) < tolerance;
}

bool equalsTolerance( vec2 rhs, vec2 lhs, float tolerance ) {
  return
    equalsTolerance( rhs.x, lhs.x, tolerance ) &&
    equalsTolerance( rhs.y, lhs.y, tolerance );
}

bool equalsTolerance( vec3 rhs, vec3 lhs, float tolerance ) {
  return
    equalsTolerance( rhs.x, lhs.x, tolerance ) &&
    equalsTolerance( rhs.y, lhs.y, tolerance ) &&
    equalsTolerance( rhs.z, lhs.z, tolerance );
}

bool equalsTolerance( vec4 rhs, vec4 lhs, float tolerance ) {
  return
    equalsTolerance( rhs.x, lhs.x, tolerance ) &&
    equalsTolerance( rhs.y, lhs.y, tolerance ) &&
    equalsTolerance( rhs.z, lhs.z, tolerance ) &&
    equalsTolerance( rhs.w, lhs.w, tolerance );
}

void asset( inout TestResults results, in int id, in bool value ) {
  if( value ) {
    results.numSuccesses ++;
  }
  else {
    results.numFailures ++;
    if( results.idOfFirstFailure == 0 ) {
      results.idOfFirstFailure = id;
    }
  }
}

vec4 testResultsToFragColor( in TestResults results ) {
  return vec4(
    float( results.numSuccesses ) / 255.,
    float( results.numFailures ) / 255.,
    float( results.idOfFirstFailure ) / 255.,
    1. );
}

// TODO: Is this actually useful?
#define assetNotNaN(results,id,value) asset( results, id, !isnan(value));
#define assetEqual(results,id,lhs,rhs) asset( results, id, (lhs)==(rhs));
#define assetNotEqual(results,id,lhs,rhs) asset( results, id, (lhs)!=(rhs));
#define assetGreater(results,id,lhs,rhs) asset( results, id, (lhs)>(rhs));
#define assetGreaterOrEqual(results,id,lhs,rhs) asset( results, id, (lhs)=>(rhs));
#define assetLess(results,id,lhs,rhs) asset( results, id, (lhs)<(rhs));
#define assetLessOrEqual(results,id,lhs,rhs) asset( results, id, (lhs)<=(rhs));

void tests( inout TestResults results );

void main() {

  TestResults result;

  tests( result );

  gl_FragColor = testResultsToFragColor( result );

}
