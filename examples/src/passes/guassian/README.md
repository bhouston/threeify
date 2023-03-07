From here:

https://www.shadertoy.com/view/WtKfD3



Can you inline the defines and also replace the single letter variable names with descriptive variable names in this snippet so that it is understandable by normal people rather than just compilers?


int           N = 13; // 7                              // target sampling rate
float         w = .1,                                   // filter width
              z;                                        // LOD MIPmap level to use for integration 
#define init               \
              z = ceil(max(0.,log2(w*R.y/float(N))));   // N/w = res/2^z
#define R     iResolution.xy

// forced to doing this silly thing because of silly not-really-includes Common
#define include                                                             \
                                                                            \
vec4 convol1D(vec2 U, vec2 D) {                                             \
    vec4  O = vec4(0);                                                      \
    float r = float(N-1)/2., g, t=0., x;                                    \
    for( int k=0; k<N; k++ ) {                                              \
        x = float(k)/r-1.;                                                  \
        t += g = exp(-2.*x*x );                                             \
        O += g * textureLod(iChannel0, (U+w*x*D) *R.y/R, z );               \
    }                                                                       \
    return O/t;                                                             \
}

// === first pass of separable convolution

include    // include functions

void mainImage( out vec4 O, vec2 u )
{
    init 
    vec2 U = u / R.y;  
    
  //O = convol2D(U); return;
    O = convol1D(U,vec2(1,0));
}


Sure! Here's the code with inlined defines and more descriptive variable names:

glsl
Copy code
int N = 13; // Target sampling rate
float filter_width = 0.1; // Filter width
float lod_level; // LOD MIPmap level to use for integration

// Calculate LOD level based on filter width and target sampling rate
lod_level = ceil(max(0.0, log2(filter_width * iResolution.y / float(N))));

// Function to perform 1D convolution
vec4 convolve1D(vec2 position, vec2 direction) {
    vec4 output = vec4(0.0);
    float kernel_radius = float(N - 1) / 2.0;
    float total_weight = 0.0;
    for (int i = 0; i < N; i++) {
        float offset = float(i) / kernel_radius - 1.0;
        float weight = exp(-2.0 * offset * offset);
        total_weight += weight;
        output += weight * textureLod(iChannel0, (position + filter_width * offset * direction) * iResolution.y / iResolution.xy, lod_level);
    }
    return output / total_weight;
}

void mainImage(out vec4 output_color, vec2 uv) {
    vec2 normalized_uv = uv / iResolution.y;
    output_color = convolve1D(normalized_uv, vec2(1.0, 0.0));
}
The code defines a target sampling rate N and a filter width filter_width. The LOD level to use for integration is then calculated based on the filter width and the target sampling rate.

The convolve1D function performs a 1D convolution using the specified position and direction. The function loops over a kernel of size N and calculates the weight and texture sample for each kernel element, then sums the weighted texture samples and divides by the total weight to get the final output color.

Finally, the mainImage function takes in the output color and uv coordinate, normalizes the uv coordinate, and calls convolve1D with the normalized uv coordinate and a horizontal direction to perform the convolution.



Ben Houston
This second shader uses the defined already specified.  Can you also inline the defines and make the variable names descriptive?

// Fast Gaussian blur using MIPmap LOD + separability : 60fps whatever the filter size.
// Common: set N for quality:  ( cost = 2*N )
//  13 (default) = almost identical to full convolution.
//   7 is still pretty cool.
// See https://www.shadertoy.com/view/wtVfWK for experimentation


// === second pass of separable convolution

include    // include functions

void mainImage( out vec4 O, vec2 u )
{
// O = texelFetch(iChannel0, ivec2(u), 0); return;

    init 
    vec2 U = u / R.y;  
    O = convol1D(U,vec2(0,1));
    
    U = .5+ ( u - .5*R ) / R.y;  
}
Sure! Here's the code with inlined defines and more descriptive variable names:

glsl
Copy code
// Fast Gaussian blur using MIPmap LOD + separability : 60fps whatever the filter size.
// Common: set N for quality:  ( cost = 2*N )
//  13 (default) = almost identical to full convolution.
//   7 is still pretty cool.
// See https://www.shadertoy.com/view/wtVfWK for experimentation


// === Second pass of separable convolution

include    // include functions

void mainImage(out vec4 output_color, vec2 uv) {
    // Calculate LOD level based on filter width and target sampling rate
    int N = 13; // Target sampling rate
    float filter_width = 0.1; // Filter width
    float lod_level = ceil(max(0.0, log2(filter_width * iResolution.y / float(N))));

    // Convolve in the vertical direction
    vec2 normalized_uv = uv / iResolution.y;
    output_color = convolve1D(normalized_uv, vec2(0.0, 1.0));

    // Convert back to non-normalized UV coordinate for next pass
    normalized_uv = 0.5 + (uv - 0.5 * iResolution.xy) / iResolution.y;
}
The code calculates the LOD level to use for integration based on the filter width and target sampling rate. It then convolves the input texture in the vertical direction using the convolve1D function and a vertical direction vector of (0.0, 1.0).

Finally, the code converts the UV coordinate back to non-normalized coordinates by subtracting 0.5 * iResolution.xy from uv and dividing by iResolution.y, and stores the result in normalized_uv for use in the next pass.