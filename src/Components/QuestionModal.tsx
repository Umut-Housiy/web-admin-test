import React, { FunctionComponent, ReactElement, useState } from "react"
import { Button } from "./Button"
import { CloseIcon, QuestionIcon, } from "./Icons"

interface ModalProps {
  title?: string,
  headerClassName?: string,
  bodyClassName?: string,
  footerClassName?: string,
  footer?: ReactElement,
  description?: string,
  modalType?: string,
  showModal?: boolean,
  processLoading?: boolean,
  onClose?: () => void;
  onClickForFunction?: () => void;
  onClick?: () => Promise<boolean>;
  cancelButtonTitle?: string,
  confirmButtonTitle?: string,
  doubleButton?: boolean,
  button1Text?: string,
  button2Text?: string,
  button1Func?: () => void,
  button2Func?: () => void

}
export const QuestionModal: FunctionComponent<ModalProps> = (props: ModalProps) => {

  const [processLoading, setProcessLoading] = useState<boolean>(false);

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
                <QuestionIcon className="w-21 h-21 text-yellow-600 mx-auto mb-8" />
                <p className="text-type-20-medium text-black-400 text-center">{props.title}</p>
                <p className="text-type-16-regular text-black-400 my-8 text-center">{props.description}</p>
              </div>
              <div className={`bg-white px-6 pt-4 `}>
                {props.doubleButton ?
                  <>
                    <Button block text={props.button1Text ?? "Tamam"} design="button-blue-400 font-semibold " onClick={props.button1Func} />
                    <Button block text={props.button2Text ?? "Vazgeç"} design="button text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-300 w-full mt-4 rounded-xl" onClick={props.button2Func} />
                  </>
                  :
                  <>
                    <Button isLoading={processLoading} text={props.confirmButtonTitle ?? "Onayla"} design="button-blue-400 w-full" block onClick={() => {
                      if (props.onClick) {
                        setProcessLoading(true);
                        props.onClick().then((e) => {
                          setProcessLoading(false);
                        })
                      }
                      else if (props.onClickForFunction) {
                        props.onClickForFunction()
                      }
                    }} />
                    <Button text={props.cancelButtonTitle ?? "Vazgeç"} design={`${processLoading ? "cursor-not-allowed" : ""} button text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-300 w-full mt-4 rounded-xl`} block onClick={props.onClose} />
                  </>
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
