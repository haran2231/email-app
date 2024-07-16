import React, { useState } from 'react';
import Mammoth from 'mammoth';
import FileReader from 'react-file-reader';

const WordFileUploader = () => {
  const [fileContent, setFileContent] = useState('');

  const handleFilesforword = async (files) => {
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

  return (
    <div>
      <h2>Upload Word File for msg content</h2>
      <FileReader handleFilesforword={handleFilesforword} fileTypes={['.docx']}>
        <button className="p-2 my-4 border border-black border-solid">Select Word File</button>
      </FileReader>
      <textarea
        value={fileContent}
        className="w-[80%] h-60 px-3"
        onChange={(e) => setFileContent(e.target.value)}
        rows="20"
        cols="80"
      />
    </div>
  );
};

export default WordFileUploader;
