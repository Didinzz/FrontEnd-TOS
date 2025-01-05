'use client'

import React, { useCallback, useEffect, useState } from 'react'
import ContentTable from './ContentTable'
import { FaSearch } from 'react-icons/fa'
import { deleteUser, getAllUser } from '../../services/userService'
import TambahUser from '../../components/layout/admin/modal/TambahUser'
import EditUser from '../../components/layout/admin/modal/EditUser'
import Swal from 'sweetalert2'
import debounce from 'lodash.debounce'

const Page = () => {
  const [listUser, setListUser] = useState([])
  const [userId, setUserId] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const fetchAllUser = async () => {
    try {
      const response = await getAllUser();
      setListUser(response.data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const handleDelteUser = async (id) => {
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
            const response = await deleteUser(id);
            if (response.status === 'ok') {
              fetchAllUser(); // Refresh data setelah delete berhasil
              Swal.fire('Success', response.message, 'success');
            } else {
              throw new Error(response.message || 'Gagal menghapus data.');
            }
          } catch (error) {
            console.error('Error delete user:', error.message);
            Swal.fire('Error!', 'Terjadi kesalahan saat menghapus data.', 'error');
          }
        },
      });

      if (result.isConfirmed) {
        console.log('Data berhasil dihapus.');
      }
    } catch (error) {
      console.error('Error delete user:', error.message);
      Swal.fire('Error!', 'Terjadi kesalahan.', 'error');
    }
  };


  const onEditHandle = (id) => {
    setUserId(id);
    document.getElementById('editUser').showModal();
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
    fetchAllUser();
  }, []);

  const filteredUser = listUser.filter((user) =>
    user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <main className="flex-1 p-4">
      <div className="space-y-4">
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Daftar Pengguna</h2>
          {/* <button className="btn btn-ghost bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4" onClick={() => document.getElementById('tambahUser').showModal()}>+ Tambah pengguna</button> */}
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
            <input type="text" className="grow w-2/6" placeholder="[nama, email, role]" onChange={(e) => debounceSetSearchTerm(e.target.value)} />
          </label>
          <div className="bg-white shadow rounded overflow-hidden">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-center">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Role</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUser.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='text-center font-semibold py-1'>Tidak ada pengguna</td>
                  </tr>
                ) : (
                  filteredUser.map((user, index) => (
                    <ContentTable key={index} user={user} count={index + 1} onEditHandle={onEditHandle} handleDelteUser={handleDelteUser} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <TambahUser fetchAllUser={fetchAllUser} />
      <EditUser userId={userId} fetchAllUser={fetchAllUser} />
    </main>
  )
}

export default Page