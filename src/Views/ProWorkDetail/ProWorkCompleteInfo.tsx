import { FunctionComponent, useState } from "react"
import { AlertIcon, ChevronRightIcon, StarIcon } from "../../Components/Icons"
import { Modal } from "../../Components/Modal";
import { Image } from "../../Components/Image";
import { RateStars } from "../../Components/RateStars";
import { WorkDetailModel } from "../../Models";
import { SRLWrapper } from "simple-react-lightbox";


interface ProWorkCompleteInfoProp {
  item?: WorkDetailModel
}

export const ProWorkCompleteInfo: FunctionComponent<ProWorkCompleteInfoProp> = (props: ProWorkCompleteInfoProp) => {

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  const [showEvaluationModal, setShowEvaluationModal] = useState<boolean>(false);

  const handleGetProjectDay = (startDate, endDate) => {
    let diffInMilliSeconds = Math.abs(endDate - startDate) / 1000;

    const days = Math.floor(diffInMilliSeconds / 86400);
    return days + 1;
  }

  return (
    <div className="pt-4">
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İş Başlangıç Tarihi</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{handleJsDate(props.item?.WorkStartDateJS ?? 0)}</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İş Teslim Tarihi</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{handleJsDate(props.item?.WorkCompleteDate ?? 0)}</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>Proje Süresi</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{handleGetProjectDay((props.item?.WorkStartDateJS ?? 0), (props.item?.WorkCompleteDate ?? 0))} gün</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İş Teslim Açıklaması</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{props.item?.WorkCompleteDescription ?? "-"}</div>
      </div>
      {
        props.item?.IsEvaluated &&
        <div className="flex items-center text-sm gap-2 mb-4">
          <div className="text-gray-700 flex justify-between w-1/6"><span>Müşteri Değerlendirmesi</span><span>:</span></div>
          <div className="flex text-yellow-600 gap-1">
            <StarIcon className="icon-sm" />
            <div className="font-medium">{props.item?.EvaluateAverageRate ?? 0}</div>
          </div>
          <div className="flex gap-1 text-blue-400 font-medium ml-4 cursor-pointer" onClick={() => { setShowEvaluationModal(true); }}>
            <div>Değerlendirmeyi Gör</div>
            <ChevronRightIcon className="icon-sm" />
          </div>
        </div>
      }
      {
        props.item?.Documents &&
        <div className="flex items-center text-sm gap-2 mb-4">
          <div className="text-gray-700 flex justify-between min-w-1/6 w-1/6"><span>İş Teslim Görselleri</span><span>:</span></div>
          <SRLWrapper>
            <div className="grid grid-cols-5 flex gap-4">
              {
                props.item?.Documents.map((item) => (
                  <div className="col-span-1">
                    <Image src={item.Url} alt={item.Name} className="cursor-pointer object-contain" />
                  </div>
                ))
              }
            </div>
          </SRLWrapper>
        </div>
      }
      {
        (handleGetProjectDay((props.item?.PlannedWorkCompleteDate ?? 0), (props.item?.PlannedWorkCompleteDate ?? 0)) < handleGetProjectDay((props.item?.WorkStartDateJS ?? 0), (props.item?.WorkCompleteDate ?? 0))) &&
        <div className="flex items-center text-sm gap-2 mb-4 text-red-400 font-medium">
          <AlertIcon className="icon-sm" />
          <div>Bu hizmet tamamlanması gecikmesi sonucunda profesyonele {" " + props.item?.CompletePenaltyFeeDesc + " "} uygulanmıştır.</div>
        </div>
      }
      <Modal
        modalType="fixedSm"
        showModal={showEvaluationModal}
        onClose={() => { setShowEvaluationModal(false); }}
        title="Müşteri Değerlendirmesi"
        body={
          <>
            <div className="flex items-center gap-2">
              <Image src={props.item?.UserPhoto ?? ""} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <div className="text-tiny font-medium">{props.item?.UserName ?? "-"}</div>
                <div className="text-sm">{handleJsDate(props.item?.EvaluateDateJSTime)}</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 items-center justify-center">
              <RateStars className="h-6 text-yellow-600" rateValue={props.item?.EvaluateAverageRate ?? 0} onProfessional={true} />
              <div className="text-yellow-600 text-base font-medium mt-1">{props.item?.EvaluateAverageRate}</div>
              <div className="text-gray-400 text-sm mt-1">{"/ 5"}</div>
            </div>
            <div className="mt-6 bg-gray-100 text-tiny text-gray-900 p-4 rounded-lg">
              {props.item?.EvaluateDescription}
            </div>
          </>
        }
      />
    </div>
  )
}
