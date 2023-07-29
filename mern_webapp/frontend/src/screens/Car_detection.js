import React, { useState, useEffect, Fragment, useRef } from "react";
import * as tf from "@tensorflow/tfjs";

import { Backdrop, Chip, CircularProgress, Grid, Stack } from "@mui/material";
const data_label_dict = [
  "articulated_truck",
  "background",
  "bicycle",
  "bus",
  "car",
  "motorcycle",
  "non-motorized_vehicle",
  "pedestrian",
  "pickup_truck",
  "single_unit_truck",
  "work_van",
];
function Car_detection() {
  const [model, setModel] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictedClass, setPredictedClass] = useState(null);
  const imageRef = useRef(null);
  useEffect(() => {
    const loadModel = async () => {
      const model_url = "model.json";

      const model = await tf.loadLayersModel(model_url);

      setModel(model);
    };

    loadModel();
  }, []);

  const readImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.readAsDataURL(file);
    });
  };

  const createHTMLImageElement = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => resolve(img);

      img.src = imageSrc;
    });
  };
  const findMaxIndex = (array) => {
    let maxIndex = 0;
    for (let i = 1; i < array.length; i++) {
      if (array[i] > array[maxIndex]) {
        maxIndex = i;
      }
    }
    return maxIndex;
  };

  const handleImageChange = async (event) => {
    const imageFile = event.target.files[0];
    const imageSrc = await readImageFile(imageFile);
    const image = await createHTMLImageElement(imageSrc);
    // if (imageFile) {
    const reader = new FileReader();

    reader.readAsDataURL(imageFile);
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setImageSrc(reader.result);
    };

    // }
    if (!imageFile) {
      setPredictedClass(null);
    }

    if (imageFile) {
      setLoading(true);

      // const imageSrc = await readImageFile(files[0]);
      // const image = await createHTMLImageElement(imageSrc);

      // tf.tidy for automatic memory cleanup
      const imagepixel = tf.browser.fromPixels(image);
      const resizedImage = tf.image.resizeBilinear(imagepixel, [256, 256]);
      const expandedImage = resizedImage.expandDims();
      const preprocessedImage = expandedImage.toFloat().div(tf.scalar(255));
      const prediction = model.predict(preprocessedImage);
      // // const predictions = prediction.dataSync();
      console.log(prediction);
      const predicted_index = prediction[1].as1D().argMax().dataSync()[0];
      setPredictedClass(data_label_dict[predicted_index]);
      // return prediction;
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <Grid
        container
        className="App"
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginTop="12%"
      >
        <Grid item>
          <h1 style={{ textAlign: "center", marginBottom: "1.5em" }}>
            Veichle Image Classifier
          </h1>
          <h2>Image Upload</h2>
          <input type="file" onChange={handleImageChange} ref={imageRef} />
          {selectedImage && (
            <div>
              <h3>Selected Image Preview:</h3>
              <img
                src={imageSrc}
                alt="Selected"
                style={{ maxWidth: "300px" }}
              />
            </div>
          )}
          <Stack
            style={{ marginTop: "2em", width: "12rem" }}
            direction="row"
            spacing={1}
          >
            <Chip
              label={
                predictedClass === null
                  ? "Prediction:"
                  : `Prediction: ${predictedClass}`
              }
              style={{ justifyContent: "left" }}
              variant="outlined"
            />
          </Stack>
        </Grid>
      </Grid>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Fragment>
  );
}

export default Car_detection;
