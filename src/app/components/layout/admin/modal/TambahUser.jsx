'use client'

import React, { useRef, useState } from 'react'
import { FaEnvelope, FaKey, FaUser } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { createUser } from '../../../../services/userService'


const TambahUser = ({ fetchAllUser }) => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancle = () => {
    modalRef.current.close();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validasi form harus di isi
    if (!nama || !email || !password || !role) {
      modalRef.current.close()
      Swal.fire('Error', 'Semua field harus diisi', 'error');
      return;
    }
    try {
      await createUser(nama, email, password, role);

      setNama('');
      setEmail('');
      setPassword('');
      setRole('');

      modalRef.current.close();

      Swal.fire('Success', 'Pengguna berhasil ditambah', 'success');
      await fetchAllUser();

    } catch (error) {
      console.log(error);
    }


  }

  return (
    <dialog id="tambahUser" className="modal" ref={modalRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-3">Tambah Pengguna Baru</h3>
        <form method="dialog" onSubmit={handleSubmit}>
          <div className="space-y-6">

            <div className='mb-5'>
              <label className="input input-bordered flex items-center gap-2">
                <FaUser className='h-4 w-4 opacity-70' />
                <input type="text" className="grow" placeholder="Username" value={nama} onChange={(e) => setNama(e.target.value)} />
              </label>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <FaEnvelope className='h-4 w-4 opacity-70' />
              <input type="eml,. ail" className="grow" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <div className='mb-5'>
              <label className="input input-bordered flex items-center gap-2">
                <FaKey className='h-4 w-4 opacity-70' />
                <input type="password" className="grow" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
            </div>
            <div className="mb5">
              <select className="select select-bordered w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}>
                <option value="" disabled>Pilih role...</option>
                <option value='dosen'>Dosen</option>
                <option value='mahasiswa'>Mahasiswa</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <button type='button' className="btn btn-ghost bg-gray-300 hover:bg-gray-400  w-1/2" onClick={handleCancle}>
              Batal
            </button>
            <button type='submit' className="btn bg-blue-500 hover:bg-blue-600 text-white w-1/2" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Simpan'}
            </button>
          </div>
          <button type='button' className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCancle}>✕</button>
        </form>
      </div>
    </dialog>
  )
}

export default TambahUser