import React, { useState,useRef } from 'react';
import axios from 'axios';
import '@coreui/coreui/dist/css/coreui.min.css';
import { CIcon } from '@coreui/icons-react'; 
import { cilCloudUpload, cilTrash } from '@coreui/icons';
import { CToast, CToastBody, CToaster, CToastHeader,CButton } from '@coreui/react';

const Post = () => {
    const [image, setImage] = useState(null); 
    const [isUploaded, setIsUploaded] = useState(false);

    const [toast, addToast] = useState(0)
    const toaster = useRef()
    const exampleToast = (
      <CToast>
        <CToastHeader closeButton>
          <svg
            className="rounded me-2"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            <rect width="100%" height="100%" fill="#007aff"></rect>
          </svg>
          <div className='title text-big font-bold'>
              Post
          </div>

        </CToastHeader>
        <CToastBody>image posted successfully.</CToastBody>
      </CToast>
    )


    const handleFileChange = (event) => {
        setImage(event.target.files[0]); 
        setIsUploaded(false); 
    };

    const removeImage = () => {
        setImage(null);
        setIsUploaded(false);
    };

    const uploadImage = async () => {
        if (!image) {
            alert('Please select an image first.');
            return;
        }
        
        const formData = new FormData();
        formData.append('image', image);
        formData.append('username', "hello");
        formData.append('email', 'abc@gmail.com');
        formData.append('caption', "my post");

        try {
            await axios.post('http://localhost:3090/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setIsUploaded(true);

            // Clear the image after 3 seconds
            setTimeout(() => {
                setImage(null);
                setIsUploaded(false);
            }, 3000);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert("Image not uploaded")
        }
    };

    return (
        // <div className='border-dark align-center display-flex flex-column'>
        //     {!image ? (
        //         <div className='flex-row'>
        //             <input type="file" onChange={handleFileChange} accept="image/*" />
        //         </div>
        //     ) : (
        //         <>
        //             <div className='flex-row' style={{ alignItems: 'center' }}>
        //                 <img src={URL.createObjectURL(image)} alt="Selected Image" style={{ width: '300px', height: 'auto', marginRight: '10px' }} />
        //             </div>
        //             <div className='flex-row'>
        //                 {!isUploaded && (
        //                     <>
        //                         <button onClick={uploadImage} style={{ marginRight: '10px' }}>
        //                             <CIcon icon={cilCloudUpload} /> Upload Image
        //                         </button>
        //                         <button onClick={removeImage}>
        //                             <CIcon icon={cilTrash} /> Remove
        //                         </button>
        //                     </>
        //                 )}
        //             </div>
        //             <div>
        //                 <CToaster ref={toasterRef} className="p-3" placement="top-end">
        //                     {toastVisible && (
        //                         <CToast>
        //                             <CToastHeader closeButton>
        //                                 Notification
        //                             </CToastHeader>
        //                             <CToastBody>
        //                                 {message}
        //                             </CToastBody>
        //                         </CToast>
        //                     )}
        //                 </CToaster>
        //             </div>
        //         </>
        //     )}
        // </div>
        <div>
          <CButton color="primary" onClick={() => addToast(exampleToast)}>Send a toast</CButton>
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        </div>
    );
}

export default Post;
