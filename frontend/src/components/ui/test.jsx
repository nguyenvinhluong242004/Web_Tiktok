import { useState } from "react";

const UploadImage = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Vui lòng chọn ảnh trước khi upload!");
            return;
        }

        const formData = new FormData();
        formData.append("file", image);

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5281/api/upload/upload-image", {
                method: "POST",
                body: formData,
            });

            const responseText = await response.text(); // Kiểm tra dữ liệu backend trả về
            console.log("Response từ backend:", responseText);

            const data = JSON.parse(responseText); // Chuyển thành JSON
            if (response.ok) {
                setUploadedUrl(data.ImageUrl);
            } else {
                alert("Upload thất bại: " + data.message);
            }
        } catch (error) {
            alert("Lỗi khi upload ảnh: " + error.message);
        }

        setLoading(false);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Upload ảnh lên Cloudinary</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="Preview" style={{ width: "200px", marginTop: "10px" }} />}
            <br />
            <button onClick={handleUpload} disabled={loading} style={{ marginTop: "10px" }}>
                {loading ? "Đang tải..." : "Upload ảnh"}
            </button>
            {uploadedUrl && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Ảnh đã upload:</h3>
                    <img src={uploadedUrl} alt="Uploaded" style={{ width: "200px" }} />
                    <p>URL: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a></p>
                </div>
            )}
        </div>
    );
};

export default UploadImage;
