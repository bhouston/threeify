The plan is to do a blur with a fixed size guassian filter.
- I have already matched the airy disk.
- One can just control the stddev of the guassian, but I would prefer to keep it small.
Do it on the HDR data.
Then blend it back into the original HDR data because we can ignore the peak of the airy disk.
* Weight the original data as ( 1.0 - integral of guassian )
* Add the blurred data.


The above is implemented.

If I wanted the absolute fastest shader implementation, should have a single FP16 buffer where I do the H integration and then
within the final combine shader I also do the V integration.  One could specify an alpha and then use the hardware to do the blend operation.
- this would enable the same shader to be used for V and H integration.