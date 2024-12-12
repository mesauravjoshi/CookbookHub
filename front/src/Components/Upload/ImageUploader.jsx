import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUploader.css'
const ImageUploader = ({ error, setError, setSelectedImage, selectedImage }) => {
  // const [error, setError] = useState(null);
  const [fIleSelected, setFIleSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 1) {
        setError('Only one image is allowed');
        return;
      }

      const file = acceptedFiles[0];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPG and PNG images are allowed');
        return;
      }

      if (file.size < 100 * 1024 || file.size > 2000 * 1024) {
        setError('Image size must be between 100KB and 2MB');
        return;
      }

      setSelectedImage(file);
      // console.log(file);

      setFIleSelected(true)
      setError(null);
    },
  });

  const handleRemoveImage = () => {
    setFIleSelected(false)
    setSelectedImage(null);
  };

  const hanleSubmit = (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    // setLoading(true);
    // setSuccess(false);

    const formData = new FormData();
    formData.append('image', selectedImage);
    console.log(selectedImage);
  };

  return (
    <>

      {/* <form action="" onSubmit={hanleSubmit}> */}


      <div {...getRootProps()} className="dragBox">
        <input {...getInputProps()} />
        {
          (isDragActive && fIleSelected) ?
            <div className='dragText' >
              <center>
                <p>Drop the image here ...</p>
              </center>
            </div>
            : (
              <div className='dragText' >
                <center>
                  <i className="bi bi-cloud-arrow-up-fill"></i>
                  <p>Drag and drop an image here, or click to select</p>
                </center>
              </div>
            )
        }
        {selectedImage && (
          <div className='uplaod_image'>
            <img src={URL.createObjectURL(selectedImage)} alt="Selected Image" />
          </div>
        )}
      </div>
      <center>

        {error && (
          <div style={{ color: 'red' }}>{error}</div>
        )}
        {fIleSelected
          && <div className='selected-file' >
            <p>{selectedImage.name}</p>
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleRemoveImage()} width="30" height="30" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg>
          </div>
        }
      </center>
      {/* <button type="submit">Submit</button> */}
      {/* {loading && <p>Loading...</p>}
      {success && <p>Image uploaded successfully!</p>} */}
      {/* </form> */}

    </>
  );
};

export default ImageUploader;