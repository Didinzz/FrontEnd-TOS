'use client'

import React, { useEffect, useState } from 'react'
import { getCount } from '../services/countServices'
import { FaUsers, FaUserGraduate, FaChalkboardTeacher, FaBook } from 'react-icons/fa';

const Page = () => {
  const [count, setCount] = useState('');

  const fetchCount = async () => {
    try {
      const response = await getCount();
      setCount(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCount();
  }, [])

  return (
    <div className='flex flex-col py-10 ml-10'>
      <h1 className='text-2xl font-bold mb-10 text-gray-800'>Dashboard Admin</h1>
      <div className="flex flex-wrap gap-6 justify-start items-start">
        {[
          { title: 'Total Pengguna', count: count.pengguna, icon: <FaUsers className='text-3xl' /> },
          { title: 'Total Mahasiswa', count: count.mahasiswa, icon: <FaUserGraduate className='text-3xl' /> },
          { title: 'Total Dosen', count: count.dosen, icon: <FaChalkboardTeacher className='text-3xl' /> },
          { title: 'Total Matakuliah', count: count.matakuliah, icon: <FaBook className='text-3xl' /> },
        ].map((item, index) => (
          <div key={index} className="w-[30%] h-[8em] bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl border border-blue-300">
            <div className='flex flex-col p-5 text-white'>
              <div className='flex items-center mb-2'>
                {item.icon}
                <h2 className='font-bold text-xl ml-2'>{item.title}</h2>
              </div>
              <p className='text-xl font-bold drop-shadow'>{item.count} Orang</p> {/* Menambahkan efek bayangan pada teks */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page