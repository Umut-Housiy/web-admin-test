import React, { FunctionComponent, ReactElement } from "react"
import { Button } from "./Button"

import { CloseIcon, SuccessIcon, } from "./Icons"

interface ModalProps {
  title?: string,
  headerClassName?: string,
  bodyClassName?: string,
  footerClassName?: string,
  footer?: ReactElement,
  successMessage?: string,
  modalType?: string,
  showModal?: boolean,
  onClose?: () => void;
  doubleButton?: boolean,
  button1Text?: string,
  button2Text?: string,
  button1Func?: () => void,
  button2Func?: () => void
}
export const SuccessModal: FunctionComponent<ModalProps> = (props: ModalProps) => {
  return (
    <>
      {props.showModal === true &&
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-70 outline-none focus:outline-none">

          <>
            <div className={`${props.modalType === "fixedSm" ? "lg:min-w-412 lg:max-w-412 min-w-9/10 max-w-9/10" : props.modalType === "fixedMd" ? "lg:min-w-1030 lg:max-w-1030 min-w-9/10 max-w-9/10" : ""} lg:min-h-572 lg:max-h-572 max-h-75vh relative w-auto my-6 mx-auto z-80 bg-white rounded-3xl py-6 flex flex-col`}>
              <div className=" ml-auto mr-6 h-10 w-10 rounded-lg bg-white shadow-customShadowLightBlue flex items-center justify-center cursor-pointer" onClick={props.onClose} >
                <CloseIcon className="icon-sm text-gray-400" />
              </div>
              <div className={`bg-white overflow-auto custom-scrollbar px-6 mr-1 mt-6  flex-1 flex flex-col items-center justify-center lg:min-h-0 h-full `}>
                <SuccessIcon className="w-21 h-21 text-blue-400 mx-auto mb-8" />
                <p className="text-type-20-medium text-black-400 text-center">{props.title}</p>
                <p className="text-type-16-regular text-black-400 my-8 text-center">{props.successMessage}</p>
              </div>
              <div className={`bg-white px-6 pt-4 `}>
                {props.doubleButton ?
                  <>
                    <Button block text={props.button1Text ?? "Tamam"} design="button-blue-400 font-semibold " onClick={props.button1Func} />
                    <Button block text={props.button2Text ?? "Vazgeç"} design="button text-blue-400 w-full mt-4 font-semibold hover:bg-blue-100 transition-all duration-300" onClick={props.button2Func} />
                  </>
                  :
                  <Button block text="Tamam" design="button-blue-400" onClick={props.onClose} />
                }
              </div>
            </div>
            <div className="bg-black-400 opacity-40 inset-0 fixed z-40" onClick={props.onClose}></div>
          </>
        </div>
      }
    </>

  )
}
