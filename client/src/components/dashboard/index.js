import React from "react";
import "./styles.css";
import { useServerUser } from "../../contextStore/serverUserContext";

export default function Dashboard() {
  const serverUser = useServerUser();

  const uploadFile = (id) => {
    document.getElementById(`fileUpload${id}`).click();
  };

    return (
        <div className="dashboard">
            <div className="navbar">
                <div className="title">Medical H5</div>
                <a href="#" className="logout">Logout</a>
            </div>

            <h1 className="heading">Medical H5</h1>

            <div className="container">
                <div className="box">
                    <h3>Upload Medical Record</h3>
                    <button className="btn" onClick={() => uploadFile(1)}>Upload</button>
                    <input type="file" id="fileUpload1" name="fileUpload1" accept="image/*" style={{display: "none"}}/>
                </div>
                <div className="box">
                    <h3>Upload Prescription</h3>
                    <button className="btn" onClick={() => uploadFile(2)}>Upload</button>
                    <input type="file" id="fileUpload2" name="fileUpload2" accept="image/*" style={{display: "none"}}/>
                </div>
                <div className="box">
                    <h3>Upload Lab Report</h3>
                    <button className="btn" onClick={() => uploadFile(3)}>Upload</button>
                    <input type="file" id="fileUpload3" name="fileUpload3" accept="image/*" style={{display: "none"}}/>
                </div>
            </div>
        </div>
    );
}