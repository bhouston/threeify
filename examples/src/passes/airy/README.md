The plan is to do a blur with a fixed size guassian filter.
- I have already matched the airy disk.
- One can just control the stddev of the guassian, but I would prefer to keep it small.
Do it on the HDR data.
Then blend it back into the original HDR data because we can ignore the peak of the airy disk.
* Weight the original data as ( 1.0 - integral of guassian )
* Add the blurred data.
