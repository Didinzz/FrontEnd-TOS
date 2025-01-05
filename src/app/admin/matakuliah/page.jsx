'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import ContentTable from './ContentTable'
import TambahMatakuliah from '../../components/layout/admin/modal/TambahMatakuliah'
import { deleteMatakuliah, fetchMatakuliah } from '../../services/matakuliahService'
import { getUserRoleDosen } from '../../services/userService'
import EditMatakuliah from '../../components/layout/admin/modal/EditMatakuliah'
import Swal from 'sweetalert2'
import debounce from 'lodash.debounce'

const Page = () => {
  const modalControllerRef = useRef(null);
  const modalTambahControllerRef = useRef(null);
  const [listMatakuliah, setListMatakuliah] = useState([])
  const [listDosen, setListDosen] = useState([])
  const [selectMatakuliah, setSelectMatakuliah] = useState('')
  const [searchTerm, setSearchTerm] = useState('')


  const onEditHandle = (id) => {
    setSelectMatakuliah(id);
    if (modalControllerRef.current) {
      modalControllerRef.current.openModal(); // Buka modal
    }
  };

  const onAddHandleModal = () => {
    if (modalTambahControllerRef.current) {
      modalTambahControllerRef.current.openModal(); // Buka modal
    }
  };

  const getAllDosen = async () => {
    try {
      const response = await getUserRoleDosen();
      setListDosen(response.data)
    } catch (error) {
      throw new Error(`Error fetching dosen: ${error.message}`);
    }
  }

  const getListMatakuliah = async () => {
    try {
      const response = await fetchMatakuliah();
      setListMatakuliah(response.data);
    } catch (error) {
      throw new Error(`Error fetching matakuliah: ${error.message}`);
    }
  }

  const debounceSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  )

  useEffect(() => {
    return () => {
      debounceSetSearchTerm.cancel();
    };
  }, [debounceSetSearchTerm]);


  useEffect(() => {
    getListMatakuliah();
    getAllDosen();
  }, [])
  const handleDeleteMatakuliah = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: 'Data yang dihapus tidak bisa dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        showLoaderOnConfirm: true, // Aktifkan loading indikator
        allowOutsideClick: false, // Cegah modal tertutup jika klik di luar
        preConfirm: async () => {
          try {
            // Proses delete
            const response = await deleteMatakuliah(id);
            if (response.status === 'ok') {
              await getListMatakuliah(); // Refresh data setelah delete berhasil
              Swal.fire('Success', response.message, 'success');
            } else {
              throw new Error(response.message || 'Gagal menghapus data.');
            }
          } catch (error) {
            console.error('Error delete matakuliah:', error.message);
            Swal.fire('Error!', 'Terjadi kesalahan saat menghapus data.', 'error');
          }
        },
      });
    } catch (error) {
      Swal.fire('Error!', 'Terjadi kesalahan.', 'error');
    }
  };


  const filteredMatakuliah = listMatakuliah.filter((matakuliah) =>
    matakuliah.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    matakuliah.semester.toString().includes(searchTerm.toLowerCase()) ||
    matakuliah.dosens.some((dosen) => dosen.nama.toLowerCase().includes(searchTerm.toLowerCase()))
  )


  return (
    <main className="flex-1 p-4">
      <div className="space-y-4">
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Daftar Mata Kuliah</h2>
          <button className="btn btn-wide bg-green-500 hover:bg-green-600 mb-5 text-white" onClick={onAddHandleModal}>+ Tambah Mata Kuliah</button>
          <label className="input input-bordered flex items-center gap-2 mb-5 w-2/6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd" />
            </svg>
            <input type="text" className="grow w-2/6" placeholder="[matakuliah, semester, dosen]" onChange={(e) => debounceSetSearchTerm(e.target.value)} />
          </label>
          <div className="bg-white shadow rounded overflow-hidden">
            <table className="min-w-full bg-white w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-center">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Mata Kuliah</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Kode Matakuliah</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Semester</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Team Teaching</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatakuliah.length === 0 ? (
                  <tr className='w-full'>
                    <td colSpan={6} className='text-center font-semibold py-1'>Tidak ada Matakuliah</td>
                  </tr>
                ) : (
                  filteredMatakuliah.map((matakuliah, index) => (
                    <ContentTable key={index} matakuliah={matakuliah} count={index + 1} onEditHandle={onEditHandle} handleDeleteMatakuliah={handleDeleteMatakuliah} />
                  )))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <TambahMatakuliah
        listDosen={listDosen}
        getListMatakuliah={getListMatakuliah}
        onRef={(controller) => (modalTambahControllerRef.current = controller)}
      />
      <EditMatakuliah
        listDosen={listDosen}
        matakuliahId={selectMatakuliah}
        getListMatakuliah={getListMatakuliah}
        onRef={(controller) => (modalControllerRef.current = controller)} />

    </main>

  )
}

export default Page