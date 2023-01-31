import React, { FunctionComponent } from "react";
import { MessageDataModel, WorkMessageType } from "../Models";
import { CheckIcon, ClipboardPlusIcon, DownloadIcon, EyeIcon, FileTextIcon, PlayVectorIcon, ProhibitIcon, SearchIcon, TrashIcon, ZoomImageIcon } from "./Icons";
import { SRLWrapper } from "simple-react-lightbox";

interface MessageItemProps {
  item: MessageDataModel,
}

export const MessageItem: FunctionComponent<MessageItemProps> = (props: MessageItemProps) => {

  const handleJsTime = (JsTime) => {
    try {
      let adjustedTime = new Date(JsTime + (new Date(JsTime).getTimezoneOffset() * 60000));
      let timeString = adjustedTime.toLocaleTimeString() ?? "";
      return timeString.split(':')[0] + ":" + timeString.split(':')[1];
    }
    catch {
      return ""
    }
  }

  const handleJsDate = (JsTime) => {
    try {
      let adjustedTime = new Date(JsTime + (new Date(JsTime).getTimezoneOffset() * 60000));
      return adjustedTime.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  const handleReturnFilePath = (itemPath: string) => {
    try {
      var fileType = itemPath.split('.')[itemPath.split('.').length - 1].toLocaleLowerCase();
      if (fileType === "png" || fileType === "jpeg" || fileType === "jfif" || fileType === "pjpeg") {
        return itemPath;
      }
      else {
        return "https://housiystrg.blob.core.windows.net/sellermedia/avatar.png"
      }
    }
    catch {
      return "https://housiystrg.blob.core.windows.net/sellermedia/avatar.png";
    }
  }

  const srlWrapperOptions = {
    settings: {
      disableKeyboardControls: true,
      disableWheelControls: true
    },
    buttons: {
      showNextButton: false,
      showPrevButton: false,
      showThumbnailsButton: false,
      showAutoplayButton: false,
    },
    thumbnails: {
      showThumbnails: false
    }
  }


  return (
    <>
      {
        !props.item.IsDeleted &&
        <>
          {
            props.item.MessageType === WorkMessageType.TEXT_MESSAGE ?
              <div className={`mt-4 flex items-center gap-2 ${!props.item.IsPro ? "justify-start" : "justify-end"}`}>
                {
                  props.item.IsPro &&
                  <div className="text-type-10-regular text-gray-700">{handleJsTime(props.item.CreatedDateJSTime)}</div>
                }
                <div className={`lg:max-w-3/4 max-w-full text-type-10-regular p-3 rounded-lg text-gray-700  ${!props.item.IsPro ? "bg-gray-200" : "bg-blue-100"}`}>{JSON.parse(props.item.MessageData).Message}</div>
                {
                  !props.item.IsPro &&
                  <div className="text-type-10-regular text-gray-700">{handleJsTime(props.item.CreatedDateJSTime)}</div>
                }
              </div>
              :
              props.item.MessageType === WorkMessageType.FILE_MESSAGE ?
                <>
                  {
                    JSON.parse(props.item.MessageData).map((fileItem) => (
                      <div className={`mt-4 flex items-center gap-2 ${!props.item.IsPro ? "justify-start" : "justify-end"}`}>
                        <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                          <img src={handleReturnFilePath(fileItem.FilePath)} className="w-8 h-8 object-contain" />
                          <div className="truncate">
                            <div className="text-text-type-12-medium text-black-900">{fileItem.FilePath}</div>
                            <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>
                          </div>
                          <SRLWrapper options={srlWrapperOptions}>
                            <div className="bg-gray-100 p-2 rounded-lg ml-auto relative cursor-pointer" >
                              <img src={handleReturnFilePath(fileItem.FilePath)} className="absolute h-full w-full top-0 left-0 object-contain opacity-0" />
                              <ZoomImageIcon className="text-gray-700 cursor-pointer icon-sm" />
                            </div>
                          </SRLWrapper>
                        </div>
                      </div>
                    ))
                  }
                </>
                :
                props.item.MessageType === WorkMessageType.REQUEST_CREATED_MESSAGE ?
                  <div className={`mt-2 flex items-center  ${"justify-start"}`}>
                    <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileTextIcon className="icon-md text-blue-400" />
                      </div>
                      <div>
                        <div className="text-type-12-medium text-gray-900">Yeni talep oluşturuldu</div>
                        <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>

                      </div>
                    </div>
                  </div>
                  :
                  props.item.MessageType === WorkMessageType.REQUEST_CANCELED_MESSAGE ?
                    <div className={`mt-2 flex items-center  ${"justify-start"}`}>
                      <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                        <div className="select-none p-2 bg-red-100 rounded-lg">
                          <ProhibitIcon className="icon-md text-red-400" />
                        </div>
                        <div>
                          <div className="text-type-12-medium text-gray-900">Talep iptal edildi</div>
                          <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>

                        </div>
                      </div>
                    </div>
                    :
                    props.item.MessageType === WorkMessageType.REQUEST_REJECTED_MESSAGE ?
                      <div className={`mt-2 flex items-center  ${"justify-end"}`}>
                        <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                          <div className="p-2 bg-red-100 rounded-lg">
                            <ProhibitIcon className="icon-md text-red-400" />
                          </div>
                          <div>
                            <div className="text-type-12-medium text-gray-900">Talep reddedildi</div>
                            <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>
                          </div>
                        </div>
                      </div>
                      :
                      props.item.MessageType === WorkMessageType.OFFER_SENDED_MESSAGE ?
                        <div className={`mt-2 flex items-center  ${"justify-end"}`}>
                          <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <ClipboardPlusIcon className="icon-md text-blue-400" />
                            </div>
                            <div>
                              <div className="text-type-12-medium text-gray-900">Yeni teklif oluşturuldu</div>
                              <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>
                            </div>
                          </div>
                        </div>
                        :
                        props.item.MessageType === WorkMessageType.OFFER_REJECTED_MESSAGE ?
                          <div className={`mt-2 flex items-center  ${"justify-start"}`}>
                            <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                              <div className="p-2 bg-red-100 rounded-lg">
                                <ProhibitIcon className="icon-md text-red-400" />
                              </div>
                              <div>
                                <div className="text-type-12-medium text-gray-900">Teklif reddedildi</div>
                                <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>
                              </div>
                            </div>
                          </div>
                          :
                          props.item.MessageType === WorkMessageType.OFFER_ACCEPTED_MESSAGE ?
                            <div className={`mt-2 flex items-center  ${"justify-start"}`}>
                              <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <CheckIcon className="icon-md text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-type-12-medium text-gray-900">Teklif onaylandı</div>
                                  <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>
                                </div>
                              </div>
                            </div>
                            :
                            props.item.MessageType === WorkMessageType.WORK_STARTED_MESSAGE ?
                              <div className={`mt-2 flex items-center  ${"justify-end"}`}>
                                <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <PlayVectorIcon className="icon-md text-blue-400" />
                                  </div>
                                  <div>
                                    <div className="text-type-12-medium text-gray-900">İşe başlandı</div>
                                    <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>

                                  </div>
                                </div>
                              </div>
                              :
                              props.item.MessageType === WorkMessageType.WORK_COMPLETED_MESSAGE ?
                                <div className={`mt-2 flex items-center  ${"justify-end"}`}>
                                  <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                      <CheckIcon className="icon-md text-blue-400" />
                                    </div>
                                    <div>
                                      <div className="text-type-12-medium text-gray-900">İş tamamlandı</div>
                                      <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>

                                    </div>
                                  </div>
                                </div>
                                :
                                props.item.MessageType === WorkMessageType.WORK_APPROVED_MESSAGE ?
                                  <div className={`mt-2 flex items-center  ${"justify-start"}`}>
                                    <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                                      <div className="p-2 bg-blue-100 rounded-lg">
                                        <CheckIcon className="icon-md text-blue-400" />
                                      </div>
                                      <div>
                                        <div className="text-type-12-medium text-gray-900">İş onaylandı</div>
                                        <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>

                                      </div>
                                    </div>
                                  </div>
                                  :
                                  props.item.MessageType === WorkMessageType.WORK_CANCELED_BY_PRO_MESSAGE ?
                                    <div className={`mt-2 flex items-center  ${"justify-end"}`}>
                                      <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                                        <div className="p-2 bg-red-100 rounded-lg">
                                          <ProhibitIcon className="icon-md text-red-400" />
                                        </div>
                                        <div>

                                          <div className="text-type-12-medium text-gray-900">İş iptal edildi</div>
                                          <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>

                                        </div>
                                      </div>
                                    </div>
                                    :
                                    props.item.MessageType === WorkMessageType.WORK_CANCELED_BY_USER_MESSAGE ?
                                      <div className={`mt-2 flex items-center  ${"justify-start"}`}>
                                        <div className={`lg:w-2/5 w-full flex gap-2 items-center border border-gray-200 rounded-lg p-4`}>
                                          <div className="p-2 bg-red-100 rounded-lg">
                                            <ProhibitIcon className="icon-md text-red-400" />
                                          </div>
                                          <div>
                                            <div className="text-type-12-medium text-gray-900">İş iptal edildi</div>
                                            <div className="text-type-10-regular text-gray-700 mt-1">{handleJsDate(props.item.CreatedDateJSTime)}</div>
                                          </div>
                                        </div>
                                      </div>
                                      :
                                      <></>
          }

        </>
      }
    </>

  )
}
