import React, { FunctionComponent, useEffect, useState } from "react"
import { PlusIcon, UploadImage } from "./Icons"
import { Loading } from "./Loading"
import { useStateEffect } from "./UseStateEffect";

export interface FileUploaderInterface {
  isLoading?: boolean,
  disabled?: boolean,
  oldPreview?: string,
  oldPreviewUpdate?: (e: string) => void,
  className?: string,
  onFileSelected?: (selected: any) => void;
}

export const ImgUploader: FunctionComponent<FileUploaderInterface> = (props: FileUploaderInterface) => {

  const [selectedFile, setSelectedFile] = useState();

  const [preview, setPreview] = useState<string | undefined>();

  useEffect(() => {
    setSelectedFile(undefined);
  }, [props.isLoading]);

  useStateEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    if (props.oldPreviewUpdate) {
      props.oldPreviewUpdate(objectUrl);
    }
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile]);

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
      <div className={`${props.className ? props.className : ""} ${props.isLoading === true ? "pointer-events-none" : ""} relative w-32 h-32 rounded-full`}>
        <div className={`${(selectedFile || props.oldPreview) ? "inset-0" : "left-1/2 -translate-x-1/2 transform "} absolute `}>
          {
            (props.isLoading !== undefined && props.isLoading === true) ?
              <div className="pointer-events-none">
                <Loading circle CircleClassName="w-32 h-32" />
              </div>
              :
              (!selectedFile && (props.oldPreview !== null && props.oldPreview !== "")) ?
                <img src={props.oldPreview} className="w-32 h-32 rounded-full mx-auto object-cover" />
                :

                selectedFile ?
                  <img src={preview || ""} className="w-32 h-32 rounded-full mx-auto object-cover" />
                  :
                  (selectedFile === undefined && (props.oldPreview === "" || props.oldPreview === null)) &&
                  <UploadImage className="w-32 h-32 rounded-full mx-auto" />
          }
          {
            !props.disabled &&
            <PlusIcon className="bg-gray-900 p-1 rounded-full text-white w-6 h-6 absolute right-6 bottom-0" />
          }
        </div>
        <input type="file" disabled={props.disabled} className="h-full w-full opacity-0 cursor-pointer" name="" accept="image/*" onChange={onSelectFile} />
      </div>
    </form>
  )
}
