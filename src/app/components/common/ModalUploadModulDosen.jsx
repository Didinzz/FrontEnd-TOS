'use client'

import React, { useEffect, useRef, useState } from 'react';
import { FaRegPlusSquare, FaUpload } from "react-icons/fa";
import { uploadModul } from '../../services/modulServices';
import Swal from 'sweetalert2';

const ModalUploadModulDosen = ({ idMatakuliah, fetchMatakuliahById }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [pertemuan, setPertemuan] = useState('');
  const [file, setFile] = useState(null);
  const modulRef = useRef(null);
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !pertemuan || !file) {
      modulRef.current.close();
      Swal.fire('Error', 'Semua field harus diisi', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('pertemuanKe', pertemuan);
    formData.append('matakuliahId', idMatakuliah);
    formData.append('file', file);

    setIsLoading(true);
    try {
      const response = await uploadModul(formData);
      Swal.fire('Success', response.message, 'success');
      setTitle('');
      setPertemuan('');
      setFile(null);
      modulRef.current.close();
      fetchMatakuliahById();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
      modulRef.current.close();
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancle = () => {
    modulRef.current.close();
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      Swal.fire('Error', 'File harus berformat PDF', 'error');
    }
  }

  useEffect(() => {
    const dropArea = dropAreaRef.current;

    const handleDragOver = (e) => {
      e.preventDefault();
      dropArea.classList.add('bg-gray-100');
    };

    const handleDragLeave = () => {
      dropArea.classList.remove('bg-gray-100');
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dropArea.classList.remove('bg-gray-100');
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type === 'application/pdf') {
        setFile(files[0]);
      } else {
        Swal.fire('Error', 'File harus berformat PDF', 'error');
      }
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <>
      <div className='mb-4'>
        <button
          className="btn bg-gradient-to-r from-blue-800 to-blue-900  text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          onClick={() => document.getElementById('uploadModul').showModal()}
        >
          <FaUpload size={20} className="mr-2" />
          Upload Modul
        </button>
      </div>

      <dialog id="uploadModul" className="modal" ref={modulRef}>
        <div className="modal-box bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Silahkan Upload Modul Disini</h3>
          <form method="dialog" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Judul
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Judul Modul"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Pertemuan
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Masukkan Pertemuan"
                  value={pertemuan}
                  onChange={(e) => setPertemuan(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-4" ref={dropAreaRef} onClick={() => fileInputRef.current.click()}>
              <div id="drop-area" className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center cursor-pointer">
                <p className="text-gray-600">{file ? file.name : 'Drop file disini atau klik untuk memilih'}</p>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className='flex justify-between gap-2'>
              <button type='button' className='btn w-52 bg-gray-300 hover:bg-gray-400 text-black rounded-md' onClick={handleCancle}>Batal</button>
              <button type='submit' className="btn w-52 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={isLoading}>
                {isLoading ? 'menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default ModalUploadModulDosen;