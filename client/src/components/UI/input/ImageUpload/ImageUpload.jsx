import React, { useRef } from "react";
import profileImg from "../../../../assets/img/profile-default.png";
import classes from './ImageUpload.module.css'

const ImageUpload = props => {
    const fileInput = useRef(null);

    const handleChange = e => {
        let file = e.target.files[0];
        if (file){
            let reader = new FileReader();
            reader.addEventListener("loadend", () => {
                props.handleChange({ file, imagePreviewUrl: reader.result});
            });
            reader.readAsDataURL(file);    
        }
    }
    const triggerInputFile = () => { fileInput.current.click() }
    const clearInputFile = () => { 
        fileInput.current.value = ""; 
        props.handleChange({ file: '', imagePreviewUrl: ''});
    }
    return (
        <div>
            <div className={classes.wrapperPreviewImg}>
                <img 
                    className={["border border-2 rounded-3", classes.previewImg].join(' ')}
                    src={ props.value.imagePreviewUrl || profileImg }
                />
                {props.value.imagePreviewUrl && 
                (
                    <button 
                        className={classes.previewImgCloseBtn} 
                        onClick={clearInputFile} 
                        type="button"
                    />
                )}

            </div>
            <div>
                <input 
                    ref={fileInput} 
                    type="file" 
                    accept="image/*" 
                    className="hide" 
                    onChange={handleChange} 
                    style={{width: "150px"}}
                />
                <button 
                    className={["btn btn-outline-primary", classes.uploadImgBtn].join(" ")} 
                    onClick={triggerInputFile} 
                    type="button"
                >
                    Загрузить фото
                </button>
            </div>
        </div>
    );
}

export default ImageUpload;