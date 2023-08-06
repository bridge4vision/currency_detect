import React, { useState } from "react";
import axios from "axios";

function ObjectLocalization() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("image", selectedImage);

    // Replace the API_URL with the URL of your Flask API endpoint
    const API_URL = "http://127.0.0.1:8080/localizeobject";

    axios
      .post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer",
      })
      .then((response) => {
        const imageBlob = new Blob([response.data], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(imageBlob);
        setProcessedImage(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching the image:", error);
      });
  };

  return (
    <div>
      <h1>Processed Image</h1>
      {processedImage && <img src={processedImage} alt="Processed Image" />}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleSubmit}>Process Image</button>
    </div>
  );
}

export default ObjectLocalization;
