import React from 'react'
import { FaUserCircle, FaFilePdf, FaEllipsisV, FaDownload, FaEye, FaTrash } from 'react-icons/fa'
import { deleteModul } from '../../services/modulServices'
import Swal from 'sweetalert2'

const modulList = ({ modul, handleReadModul, handleDonwloadModul, role, fetchMatakuliahById }) => {

    const formattedDate = new Date(modul.createdAt).toLocaleDateString('id-ID', {
        weekday: 'long',  // Nama hari
        month: 'long',    // Nama bulan
        day: 'numeric',   // Tanggal
      }) + ' ' + new Date(modul.createdAt).toLocaleTimeString('id-ID', {
        hour: '2-digit',   // Jam (dua digit)
        minute: '2-digit', // Menit (dua digit)
      });

    const handleDeleteModul = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Yakin ingin menghapus?',
                text: 'Data yang dihapus tidak bisa dikembalikan!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, hapus!',
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    try {
                        const response = await deleteModul(id);
                        if (response.status !== 'ok') {
                            throw new Error(response.message || 'Penghapusan gagal');
                        }
                        await fetchMatakuliahById();
                        return response;
                    } catch (error) {
                        Swal.showValidationMessage(`Error: ${error.message}`);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            });
    
            if (result.isConfirmed) {
                Swal.fire('Success', 'Modul berhasil dihapus!', 'success');
            }
        } catch (error) {
            Swal.fire('Error!', 'Terjadi kesalahan saat menghapus data.', 'error');
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow-md p-3 mb-4 border border-black">
            <div className="flex items-center mb-2">
                <FaUserCircle className="text-lg text-gray-600" size={30} />
                <div className="ml-2 w-full">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">Dosen</p>
                            <p className="text-sm font-semibold text-gray-500">{formattedDate}</p>
                        </div>
                        <div className='dropdown dropdown-end'>
                            <div tabIndex={0} role='button' className='btn btn-ghost hover:bg-transparent'>
                                <FaEllipsisV className="text-lg text-gray-600" size={15} />
                            </div>
                            <div tabIndex={0} className="card compact dropdown-content shadow bg-base-100 rounded-box z-[1] w-56">
                                <div tabIndex={0} className="card-body">
                                    <div className='btn btn-ghost btn-sm text-left' onClick={() => handleReadModul(modul.id)}>
                                        <p className='text-left flex gap-1'><FaEye /> Baca Modul</p>
                                    </div>
                                    {/* <hr className='text-black border border-gray-500' />
                                    <div className='btn btn-ghost btn-sm text-left' onClick={() => handleDonwloadModul(modul.id)}>
                                        <p className='text-left flex gap-1'><FaDownload />Download Modul</p>
                                    </div> */}
                                    {role === 'dosen' && (
                                        <>
                                            <hr className='text-black border border-gray-500' />
                                            <div className='btn btn-ghost btn-sm text-left' onClick={() => handleDeleteModul(modul.id)}>
                                                <p className='text-left flex gap-1'><FaTrash /> Hapus Modul</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2 className="text-sm font-medium mb-2 text-gray-800">Pertemuan {modul.pertemuanKe}</h2>
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                <div className="ml-2 flex items-center gap-2">
                    <FaFilePdf className="text-lg text-gray-600" size={20} />
                    <div className='flex flex-col justify-center gap-0'>
                        <p className="font-semibold text-gray-700 text-sm">{modul.title}</p>
                        <a href={modul.fileUrl}>modul</a>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default modulList
