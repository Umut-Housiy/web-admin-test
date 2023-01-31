import React, { FunctionComponent, useState } from "react";
import { CoverPhotoIcon, MakeCoverPhotoIcon, ThreeDotIcon, TrashIcon } from "../Components/Icons";
import { Dropzone } from "../Components/Dropzone";
import { SERVICES } from "../Services/Constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export interface ProductDropzonePropModel {
  images: { name: string, url: string, isMain: boolean }[],
  setImages: (e: { name: string, url: string, isMain: boolean }[]) => void,
  setCoverPhoto: (e: string) => void
}

export const ProductDropzone: FunctionComponent<ProductDropzonePropModel> = (props: ProductDropzonePropModel) => {

  const multipleItems6Half = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplaySpeed: 4000,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  }

  const [selectedPhoto, setSelectedPhoto] = useState<number>(0)

  const [showCoverPhotoBox, setShowCoverPhotoBox] = useState<boolean>(false)

  const [selectedRemovePhoto, setSelectedRemovePhoto] = useState<number>()

  const remove = (file, selectedRemovePhotoIndex) => {
    const newFiles = [...props.images];
    newFiles.splice(selectedRemovePhotoIndex, 1);
    if (props.images[selectedRemovePhotoIndex]?.isMain && newFiles.length > 0) {
      newFiles[0].isMain = true;
    }
    props.setImages(newFiles)
  };

  const makeDefaultPhoto = (url: string) => {
    let tempData = props.images;
    for (let i = 0; i < tempData.length; i++) {
      tempData[i].isMain = tempData[i].url === url;
    }
    props.setImages(tempData);

    props.setCoverPhoto(url);
    setShowCoverPhotoBox(false);
  }

  const addFiles = (e) => {

    let tempData: { name: string, url: string, isMain: boolean }[] = [];
    for (let i = 0; i < e.length; i++) {
      const element = e[i];
      tempData.push({ isMain: ((props.images?.length ?? 0) === 0 && i === 0), name: element.FileName, url: element.FileUrl })
    }
    props.setImages([...props.images, ...tempData]);
  }

  return (
    <>
      <div className="lg:col-span-3 ">
        <Dropzone
          accept={["image"]}
          uploadUrl={SERVICES.API_ADMIN_PRODUCT_URL + "/upload-dropzone-image"}
          addFiles={addFiles}
          maxFileSizeAsMB={5}
          maxFileCount={5 - (props.images?.length ?? 0)}
          info={[
            { message: "Yalnızca JPEG, GIF, PNG veya TIFF uzantılı dosyalar yükleyebilirisiniz.", icon: "check" },
            { message: "Yüksek çözünürlüğe sahip görseller yükleyiniz.", icon: "check" },
            { message: "Reklam veya tanıtım içerek görseller yüklenemez.", icon: "cross" },
            { message: "Yükleyeceğiniz belge boyutu 5MB’dan büyük olmamalıdır.", icon: "cross" }
          ]}
        />
        {props.images?.length && props.images?.length <= 4 ?
          <div className="grid lg:grid-cols-9 gap-4">
            {props.images.map((item, j) => (
              <div className="lg:col-span-2">
                <div className="relative">
                  <img src={item.url} alt={item.name} className="w-full object-contain" />
                  <ThreeDotIcon className="w-7 h-7 bg-white shadow-lg absolute right-2 top-2 rounded-sm text-gray-700 cursor-pointer"
                    onClick={() => { setSelectedPhoto(j); { setShowCoverPhotoBox(!showCoverPhotoBox) } }} />
                  {item.isMain ?
                    <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                  }
                  {showCoverPhotoBox && selectedPhoto === j &&
                    <div className="absolute right-2 top-10 bg-white rounded-sm shadow-md p-2 cursor-pointer">
                      {item.isMain ? <></> : <p className="text-sm" onClick={() => { makeDefaultPhoto(item.url) }}>
                        <MakeCoverPhotoIcon className="icon-md text-gray-700 mr-1 inline-block" />
                        Kapak fotoğrafı yap
                      </p>
                      }
                      <p className="text-sm mt-3" onClick={() => { setSelectedRemovePhoto(j); remove(item, j) }} >
                        <TrashIcon className="icon-md text-gray-700 mr-1 inline-block" />
                        Resmi Sil
                      </p>
                    </div>
                  }
                </div>
              </div>
            ))}
          </div> :
          props.images?.length && props.images?.length > 4 ?
            <Slider {...multipleItems6Half}>
              {props.images.map((item, j) => (
                <div className="relative pr-3">
                  <img src={item.url} alt={item.name} className="w-full   object-contain" />
                  <ThreeDotIcon className="w-7 h-7 bg-white shadow-lg absolute right-6 top-2 rounded-sm text-gray-700 cursor-pointer"
                    onClick={() => { setSelectedPhoto(j); { setShowCoverPhotoBox(!showCoverPhotoBox) } }} />
                  {item.isMain ?
                    <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                  }
                  {showCoverPhotoBox && selectedPhoto === j &&
                    <div className="absolute right-2 top-10 bg-white rounded-sm shadow-md p-2 cursor-pointer">
                      {item.isMain ? <></> : <p className="text-sm" onClick={() => { makeDefaultPhoto(item.url) }}>
                        <MakeCoverPhotoIcon className="icon-md text-gray-700 mr-1 inline-block" />
                        Kapak fotoğrafı yap
                      </p>
                      }
                      <p className="text-sm mt-3" onClick={() => { setSelectedRemovePhoto(j); remove(item, j) }} >
                        <TrashIcon className="icon-md text-gray-700 mr-1 inline-block" />
                        Resmi Sil
                      </p>
                    </div>
                  }
                </div>
              ))}
            </Slider>
            :
            <></>
        }
      </div>
    </>
  )
}
