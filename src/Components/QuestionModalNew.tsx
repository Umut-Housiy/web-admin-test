import React, { FunctionComponent, ReactElement, useState } from "react"
import { Button } from "./Button"
import { HelpCircleIcon, CloseIcon, } from "./Icons"
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
  onClick?: () => void;
  onNewClick?: () => Promise<boolean>;
}
export const QuestionModalNew: FunctionComponent<ModalProps> = (props: ModalProps) => {
  const [processLoading, setProcessLoading] = useState<boolean>(false);

  return (
    <>
      {props.showModal === true &&
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-70 outline-none focus:outline-none  "
        >
          <>
            <div className={`${props.modalType === "sm" ? "min-w-1/4 max-w-2/5" : props.modalType === "md" ? "min-w-2/5 max-w-2/5" : props.modalType === "lg" ? "min-w-1/2 max-w-1/2" : props.modalType === "xl" && " min-w-3/4 max-w-3/4"} relative w-auto my-6 mx-auto z-70 rounded-lg bg-white`}>
              <div className="bg-gray-100 border-b border-gray-200 p-5 px-6 flex items-center justify-between rounded-t-lg">
                <h4>{props.title}</h4>
                <CloseIcon className="icon-md text-gray-900 absolute right-6 top-6 cursor-pointer" onClick={props.onClose} />
              </div>
              <div className="p-6 bg-white rounded-b-lg">
                <div className="text-center">
                  <HelpCircleIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p>{props.description}</p>
                </div>
                <div className="mt-6">
                  <div className="grid lg:grid-cols-2 gap-2">
                    <div className="lg:col-span-1">
                      <Button text="Vazgeç" color="text-gray-900" design={`${processLoading ? "cursor-not-allowed" : ""} button-gray-100`} block onClick={props.onClose} />
                    </div>
                    <div className="lg:col-span-1">
                      <Button isLoading={processLoading} text="Onayla" design="button-blue-400" block onClick={() => {
                        if (props.onNewClick) {
                          setProcessLoading(true);
                          props.onNewClick().then((e) => {
                            setProcessLoading(false);
                          })
                        }
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-black-400 opacity-40 inset-0 fixed z-40" onClick={props.onClose}></div>
          </>
        </div>
      }
    </>
  )
}
