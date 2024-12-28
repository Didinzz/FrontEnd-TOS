import { useRouter } from 'next/navigation'
import React from 'react'
import Swal from 'sweetalert2';
import { logout } from '../../utils/authHelper';

const LogoutButton = ({color, children}) => {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Apakah anda yakin ingin logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire('Success', 'Logout Berhasil', 'success');
        router.push('/login');
      }
    });
  }
  return (
    <button className={color} onClick={handleLogout}>{children}</button>
  )
}

export default LogoutButton