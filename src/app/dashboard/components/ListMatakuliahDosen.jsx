'use client';

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import React, { useState, useEffect } from "react";
import Skeleton from "../../components/common/Skeleton";
import { useRouter } from "next/navigation";
import { fetchMatakuliahDosen } from "../../services/matakuliahService";
import Loading from "../../components/common/Loading";

const ListMatakuliahDosen = ({ isLoading, listMatakuliah }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false); // State untuk navigasi


  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handleDetailMatakuliah = async (id) => {
    setIsNavigating(true); // Aktifkan loading
    try {
      router.push(`/dashboard/modul/${id}`);
    } catch (error) {
      console.error(`Navigation error: ${error.message}`);
    } finally {
      setIsNavigating(false); // Matikan loading setelah navigasi
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8 w-full overflow-x-hidden">
      <h2 className="text-xl font-semibold text-black-700 mb-4">Courses</h2>
      {isLoading ? (
        <Loading />
      ) : listMatakuliah.length === 0 ? (
        <p className="text-center text-xl font-semibold">Tidak ada matakuliah</p>
      ) : (
        <>
          {isNavigating && ( // Tampilkan indikator loading saat navigasi
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Loading />
            </div>
          )}
          <Carousel
            responsive={responsive}
            infinite={true}
            draggable={true}
            swipeable={true}
          >
            {listMatakuliah.map((mk, index) => (
              <div
                className="w-72 h-52 bg-white border border-black rounded-lg flex-shrink-0 cursor-pointer"
                key={index}
                onClick={() => handleDetailMatakuliah(mk.id)}
              >
                <div className="bg-[#2c4b82] w-full h-fit rounded-tl-lg rounded-tr-lg font-semibold text-black-000 p-4">
                  <div className="text-lg text-white capitalize"> {/* Tambahkan efek scale di sini */}
                    {mk.nama}
                  </div>
                  <div className="text-sm font-light text-white"> {/* Tambahkan efek scale di sini */}
                    Semester {mk.semester}
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </>
      )}
    </section>
  );
};

export default ListMatakuliahDosen;
