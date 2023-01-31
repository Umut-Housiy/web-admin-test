import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Button } from "../../Components/Button";
import { EmptyList } from "../../Components/EmptyList";
import { ChevronRightIcon } from "../../Components/Icons";
import { Loading } from "../../Components/Loading";
import { MessageItem } from "../../Components/MessageItem";
import { MessageDataModel, WorkDetailModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Image } from "../../Components/Image";


interface ProWorkMessagesProps {
  workDetail?: WorkDetailModel
}

export const ProWorkMessages: FunctionComponent<ProWorkMessagesProps> = (props: ProWorkMessagesProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const scrollEl = useRef<any>();

  const scrollInnerEl = useRef<any>();

  const [messageList, setMessageList] = useState<MessageDataModel[]>([]);

  const [isContinue, setIsContinue] = useState<boolean>(false);

  const [oldestMessageDate, setOldestMessageDate] = useState<number>();

  useEffect(() => {
    getMessagesForAdmin();
    if (scrollEl.current && scrollInnerEl.current) {
      scrollEl.current.scrollTop = scrollInnerEl.current.clientHeight;
    }
  }, [props.workDetail]);

  const getMessagesForAdmin = async () => {

    const _result = await ApiService.getMessagesForAdmin(props.workDetail?.WorkId ?? 0, oldestMessageDate);

    if (_result.succeeded === true) {

      let tempList: MessageDataModel[] = [];
      _result.data.Data.forEach((item) => {
        tempList.push(item);
      });
      messageList.forEach((item) => {
        tempList.push(item);
      });
      setMessageList(JSON.parse(JSON.stringify(tempList)));
      setIsContinue(_result.data.IsContinue);
      setOldestMessageDate(_result.data.OldestMessageDate);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoading(false); setProcessLoading(false); }
      });
    }
  }


  return (
    <>
      <div ref={scrollEl} className="min-h-60vh max-h-60vh overflow-y-auto custom-scrollbar border border-gray-200 rounded-md mb-4 px-2 mt-4">
        <div ref={scrollInnerEl} className="flex flex-col justify-end">
          {
            isContinue &&
            <Button isLoading={processLoading} onClick={() => { setProcessLoading(true); getMessagesForAdmin(); }} buttonSm design={"bg-blue-100 text-blue-400 w-40 mx-auto my-4 "} hasIcon icon={<ChevronRightIcon className="icon-sm text-blue-400 transform -rotate-90 mr-2" />} text={"Daha Fazla Yükle"}></Button>
          }
          {
            loading ?
              <>
                <div className="flex flex-col items-start">
                  <div className="w-3/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                  <div className="w-6/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                  <div className="w-5/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-3/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                  <div className="w-6/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                  <div className="w-5/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="w-3/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                  <div className="w-6/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                  <div className="w-5/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-3/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                  <div className="w-6/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                  <div className="w-5/12">
                    <Loading width="w-full" height="h-8" />
                  </div>
                </div>
              </>
              :
              <>
                {
                  messageList.length <= 0 ?
                    <>
                      <EmptyList text={"Mesaj Bulunamadı"} />
                    </>
                    :
                    messageList.map((item, index) => (
                      <>
                        {
                          ((!item.IsPro && (index - 1) >= 0 && messageList[(index - 1)].IsPro) || (!item.IsPro && (index + 1) <= messageList.length - 1 && messageList[(index + 1)].IsPro) || (!item.IsPro && index === 0)) &&
                          <div className="flex items-center gap-2 justify-start mt-2">
                            <Image className="w-8 h-8 rounded-full object-cover" src={props.workDetail?.UserPhoto ?? ""} alt={props.workDetail?.UserName} />
                            <div className="text-xs text-gray-900 font-medium">{props.workDetail?.UserName}</div>
                          </div>
                        }
                        <MessageItem item={item} />
                        {
                          ((item.IsPro && (index + 1) <= messageList.length - 1 && !messageList[(index + 1)].IsPro) || (item.IsPro && (index - 1) >= 0 && !messageList[(index - 1)].IsPro) || (item.IsPro && index === messageList.length - 1)) &&
                          <div className="flex items-center gap-2 justify-end mt-2">
                            <Image className="w-8 h-8 rounded-full object-cover" src={props.workDetail?.ProPhoto ?? ""} alt={props.workDetail?.ProStoreName} />
                            <div className="text-xs text-gray-900 font-medium">{props.workDetail?.ProStoreName}</div>
                          </div>
                        }
                      </>
                    ))
                }
              </>
          }
        </div>
      </div>
    </>
  )
}
