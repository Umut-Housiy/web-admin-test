import { FunctionComponent, useState } from "react";
import { PlusIcon, CheckIcon, CloseIcon, AlertIcon } from "./Icons";
import { FileRejection, useDropzone } from 'react-dropzone';
import ApiService from "../Services/ApiService";

export interface InfoTypes {
  message: string,
  icon: "check" | "cross"
}

export interface UploadedFile {
  FileUrl: string,
  FileName: string
}

export interface DropzonePropModel {
  info?: InfoTypes[],
  uploadUrl: string,
  disabled?: boolean,
  maxFileSizeAsMB?: number,
  maxFileCount?: number,
  accept: ("image" | "pdf" | "all")[],
  addFiles: (e: UploadedFile[]) => void,
  fileUploaderCss?: boolean,
  sizeDescription?: string,
  warningDescription?: string
}

export const Dropzone: FunctionComponent<DropzonePropModel> = (props: DropzonePropModel) => {

  const [errors, setErrors] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [loadingRemaining, setLoadingRemaining] = useState<string>("");

  const getMimeTypes = () => {
    let result: string[] = [];

    if (props.accept.indexOf("all") > -1) {
      return [];
    }
    if (props.accept.indexOf("image") > -1) {
      result = ["image/jpeg", "image/png", "image/gif", "image/tiff", ...result];
    }
    if (props.accept.indexOf("pdf") > -1) {
      result = ["application/pdf", ...result];
    }
    return result;
  }

  const dropAccepted = async (files: File[]) => {

    setLoading(true);

    let tempData: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      setLoadingRemaining(`(${i + 1}/${files.length})`);
      var result = await ApiService.SendDropzoneFile(props.uploadUrl, file);

      if (result.succeeded) {
        tempData.push({
          FileName: result.data.FileName,
          FileUrl: result.data.FileUrl
        })

      }
      else {
        setErrors([...errors, `${file.name} dosyası yüklenemedi.(${result.message})`]);
      }
    }
    props.addFiles(tempData);
    setLoading(false);
    setLoadingRemaining(``);

  }

  const dropRejected = (files: FileRejection[]) => {
    setErrors([]);

    let temp: string[] = [];

    for (let i = 0; i < files?.length ?? 0; i++) {
      const x = files[i];

      if (x.errors[0].code === "too-many-files") {
        temp = [`En fazla ${props.maxFileCount} dosya yükleyebilirsiniz.`];
        break;
      }
      if (x.errors[0].code === "file-too-large") {
        temp = ([...temp, `${x.file.name} isimli dosyanın boyutu (${Number((x.file.size / (1024 * 1024)).toFixed(1))} MB), izin verilen sınırın üzerinde. (En fazla : ${props.maxFileSizeAsMB} MB)`]);
      } else if (x.errors[0].code === "file-invalid-type") {
        temp = ([...temp, `${x.file.name} isimli dosya izin verilen tipte değil.`]);
      }
    }
    setErrors(temp);

  }

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: dropAccepted,
    accept: getMimeTypes(),
    maxFiles: props.maxFileCount,
    disabled: props.disabled || ((props.maxFileCount ?? 1) <= 0) || loading,
    maxSize: (props.maxFileSizeAsMB ?? 0) * 1024 * 1024,
    onDropRejected: dropRejected,
  });

  return (
    <div className="mb-4">
      <div className={`row grid ${props.info ? "lg:grid-cols-2" : ""} ${props.fileUploaderCss ? "border border-gray-300" : "p-4 bg-gray-100"} gap-6 rounded-lg`}>
        <div className={`${props.fileUploaderCss ? "h-11 relative p-0.5" : "h-48 border-dashed border-4 "} lg:col-span-1 border-gray-200  focus-within:border-blue-200  transition-all duration-300`} onClick={() => { setErrors([]); }}>
          <div {...getRootProps()} className="flex items-center h-full focus:outline-none bg-white cursor-pointer">
            <input {...getInputProps()} className=" focus:outline-none" />
            <div className="flex flex-col  items-center w-3/4 mx-auto text-center px-4 ">
              {((props.maxFileCount ?? 1) <= 0) ? <div className="row gap-6 p-4 ">
                <p className="text-sm text-red-400">İzin verilen dosya sayısına ulaştınız</p>
              </div> : (loading ? <>
                Yükleniyor ...{loadingRemaining}
              </> : <>
                {props.fileUploaderCss ?
                  <div className="w-40 top-0 bg-gray-200 text-sm h-11 absolute right-0 flex items-center justify-center rounded-r text-gray-700 font-medium">
                    Dosya Yükle
                  </div>
                  : <>
                    <PlusIcon className="w-6 h-6 text-blue-400 mb-4" />
                    <p className="text-sm text-gray-700">Yüklemek istediğiniz dosyaları sürükleyerek buraya bırakabilir veya tıklayarak dosya seçebilirsiniz.</p>
                  </>}
              </>)}

            </div>
          </div>
          {
            props.fileUploaderCss &&
            <>
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
            </>
          }
        </div>
        {props.info ?
          <div className="lg:col-span-1 h-48">
            {props.info.map(x => {
              return (
                <p className="flex items-center text-sm text-gray-700 mb-2">
                  <span>
                    {
                      x.icon === "check" ? <CheckIcon className="text-gray-900 icon-sm mr-2" /> : <CloseIcon className="text-gray-900 icon-sm mr-2" />
                    }
                  </span>
                  <span>{x.message}</span>
                </p>
              );

            })}
          </div> : <></>}
      </div>
      {errors.length ? <div className="row gap-6 p-4 ">{
        errors.map(x => {
          return <p className="text-md text-red-400">• {x}</p>
        })
      }
      </div> : <></>}

      {/* */}
    </div >
  )
}
