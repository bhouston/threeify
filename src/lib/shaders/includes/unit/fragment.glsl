#pragma once
precision highp float;

varying vec2 v_uv;

#pragma include <math/bytePacking>

struct TestResults {
  int numPasses;
  int numFails;
  int selectorResult;
  int selectorId;
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

bool equalsRelativeTolerance( float rhs, float lhs, float tolerance ) {
  return (abs( rhs - lhs )/max(abs(rhs),abs(lhs))) < tolerance;
}

bool equalsRelativeTolerance( vec2 rhs, vec2 lhs, float tolerance ) {
  return
    equalsRelativeTolerance( rhs.x, lhs.x, tolerance ) &&
    equalsRelativeTolerance( rhs.y, lhs.y, tolerance );
}

bool equalsRelativeTolerance( vec3 rhs, vec3 lhs, float tolerance ) {
  return
    equalsRelativeTolerance( rhs.x, lhs.x, tolerance ) &&
    equalsRelativeTolerance( rhs.y, lhs.y, tolerance ) &&
    equalsRelativeTolerance( rhs.z, lhs.z, tolerance );
}

bool equalsRelativeTolerance( vec4 rhs, vec4 lhs, float tolerance ) {
  return
    equalsRelativeTolerance( rhs.x, lhs.x, tolerance ) &&
    equalsRelativeTolerance( rhs.y, lhs.y, tolerance ) &&
    equalsRelativeTolerance( rhs.z, lhs.z, tolerance ) &&
    equalsRelativeTolerance( rhs.w, lhs.w, tolerance );
}

void asset( inout TestResults results, in int id, in bool value ) {
  if( value ) {
    results.numPasses ++;
    if( id == results.selectorId ) {
      results.selectorResult = 1;
    }
  }
  else {
    results.numFails ++;
    if( id == results.selectorId ) {
      results.selectorResult = 0;
    }
  }
}

vec4 testResultsToFragColor( in TestResults results ) {
  return vec4(
    float( results.numPasses ) / 255.,
    float( results.numFails ) / 255.,
    float( results.selectorResult ) / 255.,
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

  TestResults results;
  results.selectorId = int( floor( v_uv.x * 1024. ) );
  results.selectorResult = 2;

  tests( results );

  gl_FragColor = testResultsToFragColor( results );

}
