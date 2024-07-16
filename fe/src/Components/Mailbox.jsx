import React, { useState, useRef } from "react";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
// import WordFileUploader from "./WordFileUploader";
import Mammoth from 'mammoth';
// import FileReader from 'react-file-reader';


const Mailbox = () => {
    // const [msg1, setMsg] = useState("");
    const [sending, setSending] = useState(false);
    const [data, setData] = useState([]);
    const [fileError, setFileError] = useState("");
    const [fileContent, setFileContent] = useState('');
    const [emailcount, setemailcount] = useState(false)
    const fileInputRef = useRef(null);
    const navigation = useNavigate(); // Initialize useNavigate hook

    // const handleMsg = (e) => {
    //     setMsg(e.target.value);
    // }

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const workbook = XLSX.read(event.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const emailList = XLSX.utils.sheet_to_json(sheet, { header: 'A' });

                const totalEmails = emailList.map(item => item.A).filter(email => validateEmail(email));
                setData(totalEmails);
                setemailcount(true)
                setFileError("");
            } catch (error) {
                setFileError("Error reading the file. Please ensure it is a valid Excel file.");
            }
        }

        reader.onerror = () => {
            setFileError("Error reading the file. Please try again.");
        }

        reader.readAsBinaryString(file);
    }


    const handleFilesforword = async (e) => {

        const files = e.target.files;

        if (!files || files.length === 0) {

            console.error("No file selected.");

            return;

        }



        const file = files[0];

        const arrayBuffer = await file.arrayBuffer();



        Mammoth.extractRawText({ arrayBuffer })

            .then((result) => {

                setFileContent(result.value);

            })

            .catch((error) => {
                console.error('Error reading Word file:', error);

            });

    };

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.)+[^<>()\[\]\\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }

    const send = async () => {
        if (fileContent === "") {
            alert("Kindly enter a message");
            return;
        }

        if (data.length === 0) {
            alert("No valid email addresses found.");
            return;
        }

        setSending(true);
        try {
            const response = await axios.post("https://bulk-email-oh0b.onrender.com/sendemail", { msg: fileContent, email: data, });
            console.log(response.data);
            if (response.data) {
                alert("Email sent successfully");
                setFileContent("");
            } else {
                alert("Failed to send");
            }
        } catch (error) {
            alert("Failed to send. Please try again later.");
        } finally {
            setSending(false);
            setemailcount(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = '';  // Resets the file input to empty
              }
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        navigation('/'); // Redirect to the login page after logout
    };

    return (
        <div className="bg-black">
            <div className="py-5 text-3xl font-bold text-center text-white bg-black">
                <h1>Bulk Email Send Application</h1>
            </div>

            <div className="py-5 text-2xl font-medium text-center text-white bg-blue-700">
                <h1>You can send multiple emails using this application</h1>
            </div>

            <div className="py-5 text-xl font-medium text-center text-white bg-blue-500">
                <h1>Drag and Drop</h1>
            </div>

            <div className="flex flex-col items-center gap-5 py-5 text-xl font-medium text-center text-black bg-blue-200">
                <h2>Upload Word File or you can type</h2>
                {/* <FileReader handleFiles={handleFilesforword} fileTypes={['.docx']}> */}
                {/* <button className="p-2 my-4 border border-black border-solid">Select Word File</button> */}
                <input className="p-2 border border-black border-solid" ref={fileInputRef} onChange={handleFilesforword} type="file" />
                {/* </FileReader> */}
                <textarea
                    value={fileContent}
                    className="w-[80%] h-60 px-3"
                    onChange={(e) => setFileContent(e.target.value)}
                    rows="20"
                    cols="80"
                />
                {/* <textarea onChange={handleMsg} value={msg} className="w-[80%] h-60 px-3"></textarea> */}
                <input className="p-2 border border-black border-solid" ref={fileInputRef} onChange={handleFile} type="file" />
                {fileError && <p className="text-red-500">{fileError}</p>}
                <p>Total Emails:{emailcount ? data.length:"0" } </p>
                <button onClick={send} className="px-10 py-3 text-xl font-normal text-white bg-black" type="button" disabled={sending}>
                    {sending ? "Sending..." : "Send"}
                </button>
                <button onClick={handleLogout} className="px-10 py-3 text-xl font-normal text-white bg-red-500" type="button">
                    Logout
                </button>
            </div>

            <div className="py-5 text-xs font-medium text-center text-white bg-black">
                <h1>Copyrights @abc</h1>
            </div>
        </div>
    )
}

export default Mailbox;
