#pragma once

// source: https://en.wikipedia.org/wiki/Normal_distribution

const float guassianConstant = 1.0 / sqrt(2.0 * PI);

float gaussianPdf(float x, float stdDev) {
  return guassianConstant * exp(-0.5 * pow2(x / stdDev)) / stdDev;
}
