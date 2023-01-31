import { FunctionComponent, ReactElement } from "react"

import { CloseIcon } from "./Icons"

interface ModalProps {
  title?: string,
  headerClassName?: string,
  bodyClassName?: string,
  footerClassName?: string,
  body?: ReactElement,
  footer?: ReactElement,
  modalType?: string,
  showModal?: boolean,
  onClose?: () => void;
  insideScroll?: boolean
}

export const Modal: FunctionComponent<ModalProps> = (props: ModalProps) => {
  return (
    <>
      {props.showModal === true &&
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-70 outline-none focus:outline-none">
          <>
            <div className={`${props.modalType === "fixedSm" ? "lg:min-w-412 lg:max-w-412 min-w-9/10 max-w-9/10" : props.modalType === "fixedMd" ? "lg:min-w-1030 lg:max-w-1030 min-w-9/10 max-w-9/10" : ""} lg:min-h-572 lg:max-h-572 max-h-75vh relative w-auto my-6 mx-auto z-80 bg-white rounded-3xl py-6 flex flex-col `}>
              <div className={` flex items-center justify-between px-6`}>
                <h4 className="text-type-20-medium line-clamp-1 mr-4 text-black-400">{props.title}</h4>
                <div className="h-10 w-10 rounded-lg bg-white shadow-customShadowLightBlue flex items-center justify-center cursor-pointer" onClick={props.onClose} >
                  <CloseIcon className="icon-sm text-gray-400" />
                </div>
              </div>
              <div className={`bg-white ${props.insideScroll ? "overflow-auto lg:overflow-visible custom-scrollbar " : "overflow-auto custom-scrollbar"} px-6 mr-1 mt-6  flex-1 lg:min-h-0 flex flex-col`}>
                <>{props.body}</>
              </div>
              <div className={`bg-white px-6 pt-4 `}>
                {props.footer}
              </div>
            </div>
            <div className="bg-black-400 opacity-40 inset-0 fixed z-40" onClick={props.onClose}></div>
          </>
        </div>
      }
    </>
  );
};
