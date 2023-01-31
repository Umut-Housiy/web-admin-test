import React, { FunctionComponent, useEffect, useState } from "react"
import { Loading } from "./Loading"
import PdfIcon from '../Assets/pdfIcon.svg'
import { AlertIcon, CheckIcon } from "./Icons"


export interface FileUploaderInterface {
  isLoading?: boolean,
  oldPreview?: string,
  isPdf?: boolean,
  onFileSelected?: (selected: any) => void;
  isTriangle?: boolean,
  sizeDescription?: string,
  warningDescription?: string
}

export const FileUploader: FunctionComponent<FileUploaderInterface> = (props: FileUploaderInterface) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState<string | undefined>()

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return;
    }
    setSelectedFile(e.target.files[0]);
    props.onFileSelected?.(e.target.files[0]);
  }
  return (
    <form>
      <div className="relative">
        <div className="relative py-2.5 text-sm rounded-lg  border  border-gray-200  flex justify-center items-center">
          <div className="absolute w-full pl-4">
            <div className="flex items-center justify-between">
              <span className="block text-gray-700 font-normal">Bir dosya seçiniz</span>
              <div className="text-gray-700 px-12 py-3 bg-gray-100 rounded-r-lg">Dosya Seç</div>
            </div>
          </div>
          {
            props.isPdf ?
              <input type="file" className="h-full w-full opacity-0" name="" accept="application/pdf" onChange={onSelectFile} />
              :
              <input type="file" className="h-full w-full opacity-0" name="" accept="image/*" onChange={onSelectFile} />
          }

        </div>
        {props.sizeDescription &&
          <div className="absolute w-96 flex items-center gap-2 ml-8 transform left-full top-1/2 transform -translate-y-1/2">
            <CheckIcon className="icon-sm text-green-400" />
            <div className="text-sm text-gray-700">Hazırlanacak görsel boyutu:</div>
            <div className="text-sm text-black-400 font-medium">{props.sizeDescription}</div>
          </div>
        }
        {props.warningDescription &&
          <div className={`${props.sizeDescription ? "mt-8" : ""} absolute w-full flex items-center gap-2 ml-8 transform left-full top-1/2 transform -translate-y-1/2`}>
            <AlertIcon className="icon-sm text-red-400" />
            <div className="text-sm text-gray-700">{props.warningDescription}</div>
          </div>
        }
      </div>
      {
        (props.isLoading !== undefined && props.isLoading === true) ?
          <div className="h-20 w-20 mt-5">
            <Loading inputMd />
          </div>
          :
          (!selectedFile && props.oldPreview !== null && props.oldPreview !== undefined && !props.isPdf) ?
            <img src={props.oldPreview} className="w-20 h-20 mt-5 rounded-lg object-contain" />
            :
            (selectedFile && !props.isPdf) ?
              <img src={preview} className={`${props.isTriangle ? "w-44 h-20" : "w-20 h-20"} mt-5 rounded-lg object-contain`} />
              :
              (!selectedFile && props.isPdf && props.oldPreview !== null && props.oldPreview !== undefined) ?
                <a target="_blank" href={props.oldPreview} className="flex gap-4 pt-5">
                  <img src={PdfIcon} className="w-16 h-16 rounded-lg object-contain " />
                  <div className="text-tiny text-blue-400 font-medium my-auto">Belgeyi Görüntüle</div>
                </a>
                :
                (selectedFile && props.isPdf) ?
                  <a target="_blank" href={preview} className="flex gap-4 pt-5">
                    <img src={PdfIcon} className="w-16 h-16 rounded-lg object-contain " />
                    <div className="text-tiny text-blue-400 font-medium my-auto">Belgeyi Görüntüle</div>
                  </a>
                  :
                  <></>
      }
    </form>
  )
}
