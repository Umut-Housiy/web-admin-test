import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Table } from "../Components/Table";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { AlertIcon, ChevronRightIcon } from "../Components/Icons";
import { TabsTitle } from "../Components/TabsTitle";
import { useHistory } from "react-router-dom";
import { formatter, fraction } from "../Services/Functions";
import { Modal } from "../Components/Modal";
import { Label } from "../Components/Label";
import { Button } from "../Components/Button";
import ApiService from "../Services/ApiService";
import { WorkListInnerModel, WorkRejectReasonTypes } from "../Models";
import { Dropdown } from "../Components/Dropdown";
import { TextArea } from "../Components/TextArea";

export const ProWorkCancelRequestList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const waitingTableEl = useRef<any>();

  const rejectedTableEl = useRef<any>();

  const tabsLink = [
    { id: 1, name: "Onay Bekleyen Talepler" },
    { id: 2, name: "Reddedilen Talepler" },
  ];

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [selectedWork, setSelectedWork] = useState<WorkListInnerModel>();

  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState<boolean>(false);

  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [rejectTitleList, setRejectTitleList] = useState<{ key: string, value: string }[]>([]);

  const [selectedRejectTitle, setSelectedRejectTitle] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [rejectReason, setRejectReason] = useState<string>("");

  const [showRejectedRequestModal, setShowRejectedRequestModal] = useState<boolean>(false);

  useEffect(() => {
    setCurrentOpenedFilterButton("");
  }, [showRejectModal]);

  const getWorkWaitingCancelRequestList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getWorkWaitingCancelRequestList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const getWorkRejectedCancelRequestList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getWorkRejectedCancelRequestList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleDateString() ?? "-";
  }

  const handleOpenAcceptRejectModal = (item) => {
    setSelectedWork(item);
    setShowAcceptRejectModal(true);
  }

  const handleOpenRejectedRequestModal = (item) => {
    setSelectedWork(item);
    setShowRejectedRequestModal(true);
  }

  const approveCancelRequest = async () => {
    setProcessLoading(true);

    const _result = await ApiService.approveCancelRequest(selectedWork?.WorkId ?? 0);

    setShowAcceptRejectModal(false);
    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Talep Onaylandı.",
        onClose: () => { context.hideModal(); history.push("/iptal-edilen-isler"); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const getRejectReasonList = async () => {
    setProcessLoading(true);

    const _result = await ApiService.getRejectReasonList(WorkRejectReasonTypes.CANCEL_REQUEST_REJECT, 1, 9999, "", 1);

    setShowAcceptRejectModal(false);
    setProcessLoading(false);

    if (_result.succeeded === true) {
      setRejectReason("");

      let _tempList: { key: string, value: string }[] = [];
      _result.data.Data.map((item) => {
        _tempList.push({ key: item.Id.toString(), value: item.Text });
      });
      setRejectTitleList(JSON.parse(JSON.stringify(_tempList)));
      setShowRejectModal(true);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setShowAcceptRejectModal(true); }
      });
    }
  }

  const rejectCancelRequest = async () => {
    setProcessLoading(true);

    const _result = await ApiService.rejectCancelRequest(selectedWork?.WorkId ?? 0, Number(selectedRejectTitle.key), rejectReason);

    setProcessLoading(false);
    setShowRejectModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Talep reddedildi.",
        onClose: () => { context.hideModal(); history.push("/is-iptal-talepleri"); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">İptal Talepleri</h2>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
        {
          selectedTabsId === 1 ?
            <Table
              ref={waitingTableEl}
              key={"waitingTableEl"}
              emptyListText={"Talep Bulunamadı"}
              getDataFunction={getWorkWaitingCancelRequestList}
              header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-1 flex items-center">
                  <span className="p-sm-gray-400">
                    Müşteri Bilgisi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Profesyonel Bilgisi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    İş Tanımı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Hizmet İptal Tarihi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    İptal Eden Taraf
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Kesinti Bedeli
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    İptal Nedeni
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Durum
                  </span>
                </div>
              </div>}
              renderItem={(e, i) => {
                return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                  <div className="lg:col-span-1 gap-2 flex items-center">
                    <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 rounded-full object-cover" />
                    <p className="p-sm">
                      {e.UserName}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="text-sm underline text-blue-400 font-medium cursor-pointer" onClick={() => { history.push(`/pro-profesyonel-detay/${e.ProId}`); }}>
                      {e.ProStoreName}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {e.WorkName}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {handleJsTime(e.RejectDate)}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {e.RequestCancelFromPro && "Profesyonel"}
                      {e.RequestCancelFromUser && "Müşteri"}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {(e.RequestCancelFromUser && e.CancelPenaltyFeeForUser && e.CancelPenaltyFeeForUser > 0) ?
                        <>
                          {
                            e.CancelPenaltyFeeForUser % 1 === 0 ?
                              <>{fraction.format(e.CancelPenaltyFeeForUser)} TL </>
                              :
                              <>{formatter.format(e.CancelPenaltyFeeForUser)} TL</>
                          }
                        </>
                        :
                        <></>
                      }
                      {(e.RequestCancelFromPro && e.CancelPenaltyFeeForPro && e.CancelPenaltyFeeForPro > 0) ?
                        <>
                          {
                            e.CancelPenaltyFeeForPro % 1 === 0 ?
                              <>{fraction.format(e.CancelPenaltyFeeForPro)} TL </>
                              :
                              <>{formatter.format(e.CancelPenaltyFeeForPro)} TL</>
                          }
                        </>
                        :
                        <></>
                      }
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {e.RejectTitle}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex items-center  justify-between">
                    <p className="font-medium text-sm">
                      <div className="w-36 text-center py-1 rounded-full bg-red-100 text-yellow-600">Onay Bekliyor</div>
                    </p>
                    <div>
                      <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 text-gray-700 cursor-pointer transition-all" onClick={() => { handleOpenAcceptRejectModal(e); }} />
                    </div>
                  </div>
                </div>
              }}
            />
            :
            <Table
              ref={rejectedTableEl}
              key={"rejectedTableEl"}
              emptyListText={"Talep Bulunamadı"}
              getDataFunction={getWorkRejectedCancelRequestList}
              header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-1 flex items-center">
                  <span className="p-sm-gray-400">
                    Müşteri Bilgisi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Profesyonel Bilgisi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    İş Tanımı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Hizmet İptal Tarihi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    İptal Eden Taraf
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Kesinti Bedeli
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    İptal Nedeni
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Durum
                  </span>
                </div>
              </div>}
              renderItem={(e: WorkListInnerModel, i) => {
                return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                  <div className="lg:col-span-1 gap-2 flex items-center">
                    <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 rounded-full object-cover" />
                    <p className="p-sm">
                      {e.UserName}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="text-sm underline text-blue-400 font-medium cursor-pointer" onClick={() => { history.push(`/pro-profesyonel-detay/${e.ProId}`); }}>
                      {e.ProStoreName}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {e.WorkName}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {handleJsTime(e.RejectDate)}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      <p className="p-sm">
                        {e.IsProSendedCancelRequest && "Profesyonel"}
                        {!e.IsProSendedCancelRequest && "Müşteri"}
                      </p>
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {(!e.IsProSendedCancelRequest && e.CancelPenaltyFeeForUser && e.CancelPenaltyFeeForUser > 0) ?
                        <>
                          {
                            e.CancelPenaltyFeeForUser % 1 === 0 ?
                              <>{fraction.format(e.CancelPenaltyFeeForUser)} TL </>
                              :
                              <>{formatter.format(e.CancelPenaltyFeeForUser)} TL</>
                          }
                        </>
                        :
                        <></>
                      }
                      {(e.IsProSendedCancelRequest && e.CancelPenaltyFeeForPro && e.CancelPenaltyFeeForPro > 0) ?
                        <>
                          {
                            e.CancelPenaltyFeeForPro % 1 === 0 ?
                              <>{fraction.format(e.CancelPenaltyFeeForPro)} TL </>
                              :
                              <>{formatter.format(e.CancelPenaltyFeeForPro)} TL</>
                          }
                        </>
                        :
                        <></>
                      }
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {e.RejectTitle}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex items-center  justify-between">
                    <p className="font-medium text-sm">
                      <div className="w-36 text-center py-1 rounded-full bg-gray-100 text-black-400">Reddedildi</div>
                    </p>
                    <div>
                      <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 text-gray-700 cursor-pointer transition-all" onClick={() => { handleOpenRejectedRequestModal(e); }} />
                    </div>
                  </div>
                </div>
              }}
            />
        }
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showAcceptRejectModal}
        onClose={() => { setShowAcceptRejectModal(false); }}
        title="Hizmet İptal Detayı"
        body={
          <>
            <Label withoutDots title="Hizmet İptali" />
            <div className="text-sm text-gray-900 mb-4">{selectedWork?.RequestCancelFromPro ? "Profesyonel tarafından iptal edildi." : selectedWork?.RequestCancelFromUser ? "Kullanıcı tarafından iptal edildi." : ""}</div>
            <Label withoutDots title="Hizmet İptal Tarihi" />
            <div className="text-sm text-gray-900  mb-4">{handleJsTime(selectedWork?.RejectDate)}</div>
            <Label withoutDots title="Hizmet İptal Nedeni" />
            <div className="text-sm text-gray-900 mb-4">{selectedWork?.RejectTitle}</div>
            <Label withoutDots title="Açıklama" />
            <div className="text-sm text-gray-900 mb-4">{selectedWork?.RejectReason}</div>
          </>
        }
        footer={
          <div className="flex gap-4 ">
            <Button isLoading={processLoading} block design="button-gray-100" text="Talebi Reddet" onClick={() => { getRejectReasonList(); }} />
            <Button isLoading={processLoading} block design="button-blue-400" text="Talebi Onayla" onClick={() => { approveCancelRequest(); }} />
          </div>

        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showRejectModal}
        onClose={() => { setShowRejectModal(false); }}
        title="Talep Reddet"
        body={
          <>
            <Label withoutDots title="Red Nedeni" />
            <Dropdown
              isDropDownOpen={currentOpenedFilterButton === "titleSelect"}
              onClick={() => { setCurrentOpenedFilterButton("titleSelect"); }}
              className="w-full text-black-700 text-sm border-gray-300 mb-4 "
              classNameDropdown="h-36 overflow-y-auto custom-scrollbar"
              label={selectedRejectTitle.value}
              items={rejectTitleList}
              onItemSelected={item => { setSelectedRejectTitle(item); }} />
            <Label withoutDots title="Red Açıklaması" />
            <TextArea
              setText={setRejectReason}
              text={rejectReason}
              placeholder="Açıklama giriniz..."
              maxCount={2000}
            />
          </>
        }
        footer={
          <Button isLoading={processLoading} block design="button-blue-400" text="Onayla" onClick={() => { rejectCancelRequest(); }} />
        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showRejectedRequestModal}
        onClose={() => { setShowRejectedRequestModal(false); }}
        title="Hizmet İptal Detayı"
        body={
          <>
            <div className="flex text-sm text-red-400 font-medium gap-2 items-center mb-4">
              <AlertIcon className="icon-sm" />
              <div>Bu hizmet iptali admin tarafından reddedildi.</div>
            </div>
            <Label withoutDots title="Red Tarihi" />
            <div className="text-sm text-gray-900 mb-4">{handleJsTime(selectedWork?.CancellationDateJS)}</div>
            <Label withoutDots title="Red Nedeni" />
            <div className="text-sm text-gray-900 mb-4">{selectedWork?.CancellationTitle}</div>
            <Label withoutDots title="Açıklama" />
            <div className="text-sm text-gray-900 mb-4 pb-4 border-b border-gray-200">{selectedWork?.CancellationReason}</div>
            <Label withoutDots title="Hizmet İptali" />
            <div className="text-sm text-gray-900 mb-4">{selectedWork?.IsProSendedCancelRequest ? "Profesyonel tarafından iptal edildi." : !selectedWork?.IsProSendedCancelRequest ? "Profesyonel tarafından iptal edildi." : ""}</div>
            <Label withoutDots title="Hizmet İptal Tarihi" />
            <div className="text-sm text-gray-900 mb-4">{handleJsTime(selectedWork?.RejectDate)}</div>
            <Label withoutDots title="Hizmet İptal Nedeni" />
            <div className="text-sm text-gray-900 mb-4">{selectedWork?.RejectTitle}</div>
            <Label withoutDots title="Açıklama" />
            <div className="text-sm text-gray-900 mb-4">{selectedWork?.RejectReason}</div>
          </>
        }
      />
    </div>
  )
}
