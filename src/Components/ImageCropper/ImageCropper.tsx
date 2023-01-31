import React, { FunctionComponent, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage'
import { Button } from '../Button'
import { useStateEffect } from '../UseStateEffect'
import { Modal } from '../Modal'
import { AlertIcon, CheckIcon, PlusIcon, UploadIcon, UploadImage } from '../Icons'
import { Image } from "../Image";
import { Loading } from '../Loading'
import ppSample from '../../Assets/pp_sample_1.png'
import ppSample2 from '../../Assets/pp_sample_2.png'

export interface FileUploaderInterface {
  isLoading?: boolean,
  disabled?: boolean,
  oldPreview?: string,
  oldPreviewUpdate?: (e: string) => void,
  className?: string,
  onFileSelected?: (selected: any) => void;
}

export const ImageCropper: FunctionComponent<FileUploaderInterface> = (props: FileUploaderInterface) => {

  const [crop, setCrop] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  const [zoom, setZoom] = useState<number>(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [croppedImage, setCroppedImage] = useState<string>("");

  const [preview, setPreview] = useState<string | undefined>();

  const [showModal, setShowModal] = useState<boolean>(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, []);

  function urltoFile(url, filename, mimeType) {
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
      setCroppedImage(croppedImage);
      if (props.oldPreviewUpdate) {
        props.oldPreviewUpdate(croppedImage);
      }
      urltoFile(croppedImage, 'croppedImage.png', "image/png")
        .then(function (file) {
          if (props.onFileSelected) {
            props.onFileSelected(file);
          }
        })
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels]);

  const [selectedFile, setSelectedFile] = useState();

  useStateEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    // if (props.oldPreviewUpdate) {
    //   props.oldPreviewUpdate(objectUrl);
    // }
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile]);


  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return;
    }
    setSelectedFile(e.target.files[0]);
    // props.onFileSelected?.(e.target.files[0])
  }

  return (
    <>
      <form>
        <div className={`${props.className ? props.className : ""} ${props.isLoading === true ? "pointer-events-none" : ""} relative w-32 h-32 rounded-full cursor-pointer`} onClick={() => { if (!props.disabled) { setShowModal(true); } }}>
          <div className={`${(selectedFile || props.oldPreview) ? "inset-0" : "left-1/2 -translate-x-1/2 transform "} absolute `}>
            {
              (props.isLoading !== undefined && props.isLoading === true) ?
                <div className="pointer-events-none">
                  <Loading circle CircleClassName="w-32 h-32" />
                </div>
                :
                (!selectedFile && (props.oldPreview !== null && props.oldPreview !== "" && (!preview || preview === ""))) ?
                  <img src={props.oldPreview} className="w-32 h-32 rounded-full mx-auto object-cover" />
                  :
                  (selectedFile && (props.oldPreview !== null && props.oldPreview !== "" && (preview && preview !== "")) && !croppedImage) ?
                    <img src={preview} className="w-32 h-32 rounded-full mx-auto object-cover" />
                    :
                    (selectedFile && croppedImage) ?
                      <img src={croppedImage || ""} className="w-32 h-32 rounded-full mx-auto object-cover" />
                      :
                      (selectedFile === undefined && (props.oldPreview === "" || props.oldPreview === null)) &&
                      <UploadImage className="w-32 h-32 rounded-full mx-auto" />
            }
            {
              !props.disabled &&
              <PlusIcon className="bg-gray-900 p-1.5 border-2 border-white rounded-full text-white w-8 h-8 absolute right-4 -bottom-1" />
            }
          </div>
        </div>
      </form>

      <Modal
        modalType="fixedMd"
        showModal={showModal}
        onClose={() => { setShowModal(false); }}
        title="Profil Fotoğrafı Yükleyin"
        body=
        {
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="lg:col-span-1 col-span-2 lg:block hidden">
                <div className="flex items-center gap-2">
                  <AlertIcon className="text-red-400 icon-sm" />
                  <div className="text-sm text-gray-900 font-medium">Nasıl görsel yüklemeliyim?</div>
                </div>
                <div className="grid grid-cols-2 mt-4">
                  <div className="lg:col-span-2 col-span-2 flex items-center gap-2 justify-center my-2">
                    <Image src={ppSample} className="w-16 h-16 rounded-full object-cover" />
                    <Image src={ppSample2} className="w-16 h-16 rounded-full object-cover" />
                  </div>
                  <div className="lg:col-span-2 col-span-2 mt-2">
                    <div className="text-sm text-gray-700">Yükleyeceğiniz görseller belirtilen örneklerdeki gibi olmalıdır. Profil görselinizin yuvarlak alanın içerisine tam olarak yerleştiğinden emin olun. Logonuzu kullanıyorsanız, lütfen logonuzda herhangi bir kayma olmadığından emin olun</div>
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <CheckIcon className="text-green-400 icon-sm" />
                  <div className="text-sm text-gray-900 font-medium">Yalnızca JPEG, GIF, PNG veya TIFF uzantılı görseller yükleyebilirsiniz.</div>
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <CheckIcon className="text-green-400 icon-sm" />
                  <div className="text-sm text-gray-900 font-medium">Minimum 800x800 px boyutunda ve 72 dpi çözünürlükte görseller seçiniz.</div>
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <CheckIcon className="text-red-400 icon-sm" />
                  <div className="text-sm text-gray-900 font-medium">Yükleyeceğiniz belge boyutu 5MB’dan büyük olmamalıdır.</div>
                </div>
              </div>
              <div className="lg:col-span-1 col-span-2">
                {

                  !selectedFile ?
                    <>
                      <div className="flex items-center justify-center relative h-full w-full border-dashed border-4 border-light-blue-500">
                        <input type="file" className="h-full w-full opacity-0  cursor-pointer absolute top-0 left-0" name="" accept="image/*" onChange={onSelectFile} />
                        <div className="text-center px-6">
                          <PlusIcon className="text-blue-400 icon-md mx-auto" />
                          <div className="text-gray-700 mt-4 text-sm">Yüklemek istediğiniz dosyaları tıklayarak seçebilirisiniz</div>
                        </div>
                      </div>
                    </>
                    :
                    <>
                      <div className="relative h-80 w-full">
                        <div className="crop-container h-full w-full">
                          <Cropper
                            image={preview}
                            crop={crop}
                            zoom={zoom}
                            aspect={3 / 3}
                            cropShape="round"
                            showGrid={true}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            maxZoom={3}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2  cursor-pointer justify-center relative">
                          <UploadIcon className="text-gray-900 icon-sm" />
                          <div className="text-gray-900 text-sm font-medium">Yeni Fotoğraf Seç</div>
                          <input type="file" className="h-full w-full opacity-0  cursor-pointer absolute top-0 left-0" name="" accept="image/*" onChange={onSelectFile} />
                        </div>
                        <div className="border border-gray-200 rounded-full flex items-center justify-center gap-1 ">
                          <div className="bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-700 transform duration-300 p-2 cursor-pointer" onClick={() => { if (zoom > 1) { setZoom(zoom - 0.5); } }}>
                            <div className="w-3 h-3 text-white flex items-center justify-center select-none">-</div>
                          </div>
                          <div className="w-8 text-sm text-center select-none">
                            {"x" + zoom}
                          </div>
                          <div className="bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-700 transform duration-300 p-2 cursor-pointer" onClick={() => { if (zoom < 3) { setZoom(zoom + 0.5); } }}>
                            <div className="w-3 h-3 text-white flex items-center justify-center select-none">+</div>
                          </div>
                        </div>
                      </div>
                    </>
                }
              </div>
            </div>

          </>
        }
        footer={
          <>
            {
              selectedFile &&
              <div className="flex items-center gap-2 mt-4">
                <Button design="button-gray-100 w-full" text="Vazgeç" onClick={() => { setCroppedImage(props.oldPreview ?? ""); setShowModal(false); setSelectedFile(undefined) }} />
                <Button design="button-blue-400 w-full" text="Onayla" onClick={() => { showCroppedImage(); setShowModal(false); }} />
              </div>
            }
          </>
        }
      />
    </>

  )
}
