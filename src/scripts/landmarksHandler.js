export const getMappedLandmarks = (sketch, mediaPipe, webcamFeed, indices) => {
  const mappedLandmarks = {};

  if (mediaPipe.landmarks.length > 0 && mediaPipe.landmarks[0]) {
    indices.forEach((index) => {
      if (mediaPipe.landmarks[0][index]) {
        const landmarkNameX = `LM${index}X`;
        const landmarkNameY = `LM${index}Y`;

        mappedLandmarks[landmarkNameX] = sketch.map(
          mediaPipe.landmarks[0][index].x,
          1,
          0,
          0,
          webcamFeed.scaledWidth
        );

        mappedLandmarks[landmarkNameY] = sketch.map(
          mediaPipe.landmarks[0][index].y,
          0,
          1,
          0,
          webcamFeed.scaledHeight
        );
      }
    });
  }

  return mappedLandmarks;
};
