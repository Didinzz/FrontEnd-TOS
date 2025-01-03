'use client'
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Swal from 'sweetalert2';
import { addMatakuliah } from '../../../../services/matakuliahService';


const anmimatedComponents = makeAnimated();


const TambahMatakuliah = ({ listDosen, getListMatakuliah, onRef }) => {
  const modalRef = useRef(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [nama, setNama] = useState('');
  const [kode, setKode] = useState('');
  const [semester, setSemester] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleCancle = () => {
    modalRef.current.close();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validasi form harus di isi
    if (!nama || !kode || !semester || selectedOptions.length === 0) {
      modalRef.current.close()
      Swal.fire('Error', 'Semua field harus diisi', 'error');
      return;
    }

    const dosenIds = selectedOptions.map((dosen) => dosen.value);

    // data untuk post
    const payload = {
      nama,
      kode,
      semester,
      dosenIds
    }

    setIsLoading(true);

    try {
      const response = await addMatakuliah(payload);
      
      modalRef.current.close(); // Tutup modal
      Swal.fire('Success', response.message, 'success');
      setNama('');
      setKode('');
      setSemester('');
      setSelectedOptions([]);
      await getListMatakuliah();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }


  const options =
    listDosen.length > 0
      ? listDosen.map((dosen) => ({
        value: dosen.id,
        label: dosen.nama,
      }))
      : [
        { value: 'no-data', label: 'Tidak ada data dosen', isDisabled: true },
      ]; // Opsi default jika kosong

  useEffect(() => {
    // Meneruskan fungsi untuk mengontrol modal ke komponen induk
    if (onRef) {
      onRef({
        openModal: () => modalRef.current.showModal(),
        closeModal: () => modalRef.current.close(),
      });
    }
  }, [onRef]);
  return (
    <dialog className="modal" id='addMatakuliahModal' ref={modalRef}>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md mx-4 sm:mx-0 modal-box">
        <h1 className="text-2xl font-semibold mb-6 text-center">Penambahan Mata Kuliah</h1>
        <form method='dialog' onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="dosen">
              Dosen
            </label>
            <Select
              id="dosen"
              name="dosen"
              components={anmimatedComponents}
              options={options}
              isMulti
              value={selectedOptions}
              onChange={(selected) => setSelectedOptions(selected)}
              className="w-full"
              classNamePrefix="react-select"
              placeholder="Pilih Dosen..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="mata-kuliah">Mata Kuliah</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" id="mata-kuliah" name="mata-kuliah" value={nama} onChange={(e) => setNama(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="kode-mata-kuliah">Kode Mata Kuliah</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" id="kode-mata-kuliah" name="kode-mata-kuliah" value={kode} onChange={(e) => setKode(e.target.value)} />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="semester">Semester</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" id="semester" name="semester" value={semester} onChange={(e) => setSemester(e.target.value)} />
          </div>
          <div className='flex justify-between w-full gap-2 min-w-0'> {/* Tambahkan min-w-0 */}
            <button type='button' className='btn flex-1 bg-gray-300 hover:bg-gray-400 text-black rounded-md' onClick={handleCancle}>Batal</button>
            <button type='submit' className="btn flex-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={isLoading}>{isLoading ? 'menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default TambahMatakuliah