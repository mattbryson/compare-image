var getPixels = require("get-pixels")



/**
 * Compare 2 images for equality based on each pixel. This compares images for visual differences.
 * If ANY part of a pixel (R/G/B/A) is different, the the pixel as whole is flagged as different.
 * @param imgA The path to the base file. It can be a relative path, an http url or a data url.
 * @param imgB The path to the comparison file. It can be a relative path, an http url or a data url.
 * @param function The callback once done, passed an error if there was one, and the difference as a 0-1 percetnage of the 2 images.
 */
exports.comparePixels=function(imgA, imgB, done) {
  return exports.compare(imgA, imgB, compareByPixels, done);
};

/**
 * Compare 2 images for equality based on the underlying channels  / Data for each pixel. This is NOT a visualy comparison.
 * This will check R,G,B,A individually, and report a percentage change of each pixel. So a red pixel (R:255 G:0 B:0 A:0) would only by 25% different to a Green pixel  (R:0 G:255 B:0 A:0)
 * @param imgA The path to the base file. It can be a relative path, an http url or a data url.
 * @param imgB The path to the comparison file. It can be a relative path, an http url or a data url.
 * @param function The callback once done, passed an error if there was one, and the difference as a 0-1 percentage of the 2 images.
 */
exports.compareData=function(imgA, imgB, done) {
  return exports.compare(imgA, imgB, compareByData, done);
};

/**
 * Compare 2 image for equality
 * @param imgA The path to the base file. It can be a relative path, an http url or a data url.
 * @param imgB The path to the comparison file. It can be a relative path, an http url or a data url.
 * @param function The comparator function to run.  This will receive 2 args, each a ndarray of pixels in raster order having shape equal to [width, height, channels]
 * @param function The callback once done, passed an error if there was one, and the difference as a percetnage of the 2 images.
 */
exports.compare=function(imgA, imgB, comparator, done) {
  getPixelData(imgA, imgB, function(err, bitmapA, bitmapB) {
    var diff;
    if(!err) {
      diff = comparator(bitmapA, bitmapB);
    }
    done(err, diff);
  });
}



function getPixelData(imgA, imgB, done) {
  getPixels(imgA, function(err, bmA) {
    if(err) { return done(err); }
    getPixels(imgB, function(err, bmB) {
      done(err, bmA, bmB);
    })
  })
}

function compareByPixels(pxA, pxB) {
  var diff=0;
  var width = pxA.shape[0];
  var height = pxA.shape[1];
  var channels = pxA.shape[2];
  for(var x=0; x<width; x++ ) {
    for(var y=0; y<height; y++ ) {
      //If ANY of the channels are different, then this pixel has changed
      var pxDiff = 0;
      for(var c=0; c<channels; c++) {
         pxDiff = pxA.get(x,y,c) != pxB.get(x,y,c);
         if(pxDiff) {
           c=channels;
         }
      }
      diff+=pxDiff;
    }
  }

  return diff / ((width * height));
}

function compareByData(pxA, pxB) {
  var diff=0;
  var width = pxA.shape[0];
  var height = pxA.shape[1];
  var channels = pxA.shape[2];
  for(var x=0; x<width; x++ ) {
    for(var y=0; y<height; y++ ) {
      for(var c=0; c<channels; c++) {
        if(pxB.get(x,y,c) === undefined) {
          diff  += 1;// 100% different if this doesnt exist in img 2
        } else {
          diff += Math.abs((pxA.get(x,y,c) - pxB.get(x,y,c))/255);
       }
      }
    }
  }

  return diff / ((width * height)*channels);
}
