import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom"
import { ChevronRightIcon } from "../../Components/Icons"
import { Loading } from "../../Components/Loading"
import { TabsTitle } from "../../Components/TabsTitle"
import { useStateEffect } from "../../Components/UseStateEffect"
import { ProRequestNewModel, WorkDetailModel, WorkStatus } from "../../Models"
import ApiService from "../../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext"
import { ProWorkCancelInfo } from "./ProWorkCancelInfo"
import { ProWorkCompleteInfo } from "./ProWorkCompleteInfo"
import { ProWorkDocuments } from "./ProWorkDocuments"
import { ProWorkInfo } from "./ProWorkInfo"
import { ProWorkMessages } from "./ProWorkMessages"
import { ProWorkOffer } from "./ProWorkOffer"
import { ProWorkPayments } from "./ProWorkPayments"
import { ProWorkRequest } from "./ProWorkRequest"

interface RouteParams {
  id: string
}

interface LocationParams {
  prevTitle: string,
  prevPath: string,
  tabId: number,
  queryPage: number,
}

export const ProWorkDetailMain: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const location = useLocation<LocationParams>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(true);

  const [tabsLink, setTabsLink] = useState<{ id: number, name: string }[]>([
    { id: 1, name: "Hizmet Bilgileri" },
    { id: 2, name: "Teklif Bilgileri" },
    { id: 3, name: "Talep Bilgileri" },
    { id: 4, name: "Mesajlar" },
    { id: 5, name: "Belgeler" },
    { id: 6, name: "Ödeme Dökümü" },
    { id: 7, name: "İş Teslim Bilgileri" },
    { id: 8, name: "İptal/Red Bilgileri" },
  ]);

  const [selectedTabsId, setSelectedTabsId] = useState<number>(location.state?.tabId ?? 1);

  const [workDetail, setWorkDetail] = useState<WorkDetailModel>();

  const [requestDetail, setRequestDetail] = useState<ProRequestNewModel>();

  const [offerCreateDate, setOfferCreateDate] = useState<number>(0);

  useEffect(() => {
    getWorkDetail();
  }, []);

  useStateEffect(() => {
    getRequestDetailNewDetail();
    if (workDetail?.Status !== WorkStatus.WAITING_OFFER && (workDetail?.ProOfferId ?? 0) > 0) {
      getOfferDetail();
    }
  }, [workDetail]);

  const getWorkDetail = async () => {

    const _result = await ApiService.getWorkDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      let tempList: { id: number, name: string }[] = tabsLink;
      if (_result.data.Status === WorkStatus.WORK_CANCELED_BY_PRO || _result.data.Status === WorkStatus.WORK_CANCELED_BY_USER) {
        tempList = tempList.filter(x => x.id !== 7);
      }
      if (_result.data.Status === WorkStatus.WAITING_OFFER || _result.data.Status === WorkStatus.REQUEST_CANCELED || _result.data.Status === WorkStatus.REQUEST_REJECTED) {
        tempList = tempList.filter(x => x.id !== 2 && x.id !== 6 && x.id !== 5);
      }
      if (_result.data.Status === WorkStatus.WAITING_OFFER_RESULT) {
        tempList = tempList.filter(x => x.id !== 8);
      }
      if (_result.data.Status === WorkStatus.OFFER_REJECTED) {
        tempList = tempList.filter(x => x.id !== 5 && x.id !== 6 && x.id !== 7);
      }
      if (_result.data.Status !== WorkStatus.WORK_COMPLETED) {
        tempList = tempList.filter(x => x.id !== 7);
      }
      if (_result.data.Status === WorkStatus.WAITING_OFFER) {
        tempList = tempList.filter(x => x.id !== 8);
      }
      if (_result.data.Status === WorkStatus.WATING_WORK_START || _result.data.Status === WorkStatus.WORK_COMPLETED || _result.data.Status === WorkStatus.WAITING_TO_WORK_COMPLETE || _result.data.Status === WorkStatus.WAITING_WORK_COMPLETE_APPROVAL) {
        tempList = tempList.filter(x => x.id !== 8);
      }
      setTabsLink(JSON.parse(JSON.stringify(tempList)));
      setWorkDetail(_result.data);
    }
    else {

      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoading(false); history.push(location.state?.prevPath ?? "/teslim-edilen-isler"); }
      });
    }
  }

  const getRequestDetailNewDetail = async () => {

    const _result = await ApiService.getRequestDetailNewDetail(workDetail?.RequestId ?? 0);

    if (_result.succeeded === true) {
      setRequestDetail(_result.data);
      setLoading(false);
    }
    else {
      setLoading(false);
    }
  }

  const getOfferDetail = async () => {

    const _result = await ApiService.getOfferDetail(workDetail?.ProOfferId ?? 0);

    if (_result.succeeded === true) {
      setOfferCreateDate(_result.data.CreatedDate);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/pro-talepler') }
      });
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={location.state?.prevPath !== undefined ? (location.state?.queryPage !== 1 ? (location.state?.prevPath + "?sayfa=" + location.state?.queryPage) : location.state?.prevPath) : ("/teslim-edilen-isler")} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            {location.state?.prevTitle ?? "Alınan Hizmetler"}
          </div>

        </Link>
        {
          loading ?
            <Loading width="w-full" height="h-12" />
            :
            <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        }
        {
          selectedTabsId === 1 ?
            <>
              {
                loading ?
                  <Loading width="w-full" height="h-screen" />
                  :
                  <ProWorkInfo item={workDetail} />
              }
            </>
            :
            selectedTabsId === 2 ?
              <>
                {
                  loading ?
                    <Loading width="w-full" height="h-screen" />
                    :
                    <ProWorkOffer item={workDetail} offerCreatedDate={offerCreateDate} />
                }
              </>
              :
              selectedTabsId === 3 ?
                <>
                  {
                    loading ?
                      <Loading width="w-full" height="h-screen" />
                      :
                      <ProWorkRequest item={requestDetail} />
                  }
                </>
                :
                selectedTabsId === 4 ?
                  <>
                    <ProWorkMessages workDetail={workDetail} />
                  </>
                  :
                  selectedTabsId === 5 ?
                    <>
                      {
                        loading ?
                          <Loading width="w-full" height="h-screen" />
                          :
                          <ProWorkDocuments item={workDetail} />
                      }
                    </>
                    :
                    selectedTabsId === 6 ?
                      <>
                        {
                          loading ?
                            <Loading width="w-full" height="h-screen" />
                            :
                            <ProWorkPayments item={workDetail} />
                        }
                      </>
                      :
                      selectedTabsId === 7 ?
                        <>
                          {
                            loading ?
                              <Loading width="w-full" height="h-screen" />
                              :
                              <ProWorkCompleteInfo item={workDetail} />
                          }

                        </>
                        :
                        selectedTabsId === 8 ?
                          <>
                            {
                              loading ?
                                <Loading width="w-full" height="h-screen" />
                                :
                                <ProWorkCancelInfo item={workDetail} />
                            }
                          </>
                          :
                          <></>
        }
      </div>
    </div>
  )
}
