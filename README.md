# compare-image

Compares 2 images for similarity, returning a percentage of the difference (0-1)

# Installation

`npm install compare-image --save`

# API

There are 2 buit in comparission methods:

##comparePixels##
checks each pixel for any differences - best for visual comparison.

##compareByChannels##
checks each channel on each pixel - best for comparing the underlying data.


If we take 2 images, and the only difference is the RED channel on 1 pixel in the two images.

*comparePixels* looks at each pixel as a whole.  Any change is treated as a visual difference of that pixel. So a 100 x 100px image, which has 1 pixel different would be `0.1` percent different.

*compareData* would produce only a `0.025` percent difference for same image, as only 1 of the 4 channels on that pixel was different.  

# API Docs
see here.

#Usage

```` javascript
var compareImg = require('compare-image');

//can a relative path, an http url, a data url, or an in-memory Buffer.
var imgA='http://www.domain.com/path/to/image.png';
var imgB='http://www.domain.com/path/to/image.png';

compareImg.comparePixels(imgA, imgB, function(err, diff) {
    console.log("the images are", diff, " percent different");
});
````
