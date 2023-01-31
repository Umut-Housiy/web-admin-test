import { FunctionComponent, useContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { Table } from "../Components/Table";
import { TabsTitle } from "../Components/TabsTitle";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { CheckIcon, ChevronRightIcon, CloseIcon } from "../Components/Icons";
import { formatter, fraction } from "../Services/Functions";
import { Button } from "../Components/Button";
import { Modal } from "../Components/Modal";
import ApiService from "../Services/ApiService";
import { AdminRefundOrderFilterType, ProductOrderDataType, RefundOrderListInnerModel } from "../Models";


export const OrderRefundRequestList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const waitingAdminActionTableEl = useRef<any>();

  const waitingSellerApproveTableEl = useRef<any>();

  const approveTableEl = useRef<any>();

  const rejectedTableEl = useRef<any>();

  const [waitingAdminActionCount, setWaitingAdminActionCount] = useState<number>(0);

  const [waitingSellerApproveCount, setWaitingSellerApproveCount] = useState<number>(0);

  const [approveRefundCount, setApproveRefundCount] = useState<number>(0);

  const [rejectedRefundCount, setRejectedRefundCount] = useState<number>(0);

  const tabsLink = [
    { id: 1, name: "Çözüm Bekleyen" + " (" + String(waitingAdminActionCount) + ")" },
    { id: 2, name: "Mağaza Onayı Bekleyen" + " (" + String(waitingSellerApproveCount) + ")" },
    { id: 3, name: "Onaylanan" + " (" + String(approveRefundCount) + ")" },
    { id: 4, name: "Reddedilen" + " (" + String(rejectedRefundCount) + ")" }
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);

  const [modalRefund, setModalRefund] = useState<RefundOrderListInnerModel>();

  const getWaitingAdminActionRefundListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getWaitingAdminActionRefundListForAdmin(page, take, searchText, order);

    if (_result.succeeded === true) {
      setWaitingAdminActionCount(_result.data.WaitingAdminActionCount);
      setWaitingSellerApproveCount(_result.data.WaitingSellerApproveCount);
      setApproveRefundCount(_result.data.ApprovedRefundCount);
      setRejectedRefundCount(_result.data.RejectedRefundCount);
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.WaitingAdminActionCount
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

  const getWaitingSellerApproveRefundListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getWaitingSellerApproveRefundListForAdmin(page, take, searchText, order);

    if (_result.succeeded === true) {

      setWaitingAdminActionCount(_result.data.WaitingAdminActionCount);
      setWaitingSellerApproveCount(_result.data.WaitingSellerApproveCount);
      setApproveRefundCount(_result.data.ApprovedRefundCount);
      setRejectedRefundCount(_result.data.RejectedRefundCount);

      return {
        Data: _result.data.Data,
        TotalCount: _result.data.WaitingSellerApproveCount
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

  const getSellerApproveRefundListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerApproveRefundListForAdmin(page, take, searchText, order);

    if (_result.succeeded === true) {

      setWaitingAdminActionCount(_result.data.WaitingAdminActionCount);
      setWaitingSellerApproveCount(_result.data.WaitingSellerApproveCount);
      setApproveRefundCount(_result.data.ApprovedRefundCount);
      setRejectedRefundCount(_result.data.RejectedRefundCount);

      return {
        Data: _result.data.Data,
        TotalCount: _result.data.ApprovedRefundCount
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

  const getSellerRejectedRefundListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerRejectedRefundListForAdmin(page, take, searchText, order);

    if (_result.succeeded === true) {

      setWaitingAdminActionCount(_result.data.WaitingAdminActionCount);
      setWaitingSellerApproveCount(_result.data.WaitingSellerApproveCount);
      setApproveRefundCount(_result.data.ApprovedRefundCount);
      setRejectedRefundCount(_result.data.RejectedRefundCount);

      return {
        Data: _result.data.Data,
        TotalCount: _result.data.RejectedRefundCount
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

  const approveRefundForAdmin = async (OrderProductId) => {
    setShowRefundModal(false);

    context.showModal({
      type: "Question",
      title: "İade Onayla",
      message: "İadeyi onaylanacak emin misiniz? Onay işlemi sonrası başka işlem yapamazsınız.",
      onClick: async () => {
        const _result = await ApiService.approveRefundForAdmin(OrderProductId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İade Onaylandı",
            onClose: () => {
              context.hideModal();
              if (waitingAdminActionTableEl.current) {
                waitingAdminActionTableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const rejectRefundForAdmin = async (OrderProductId) => {
    setShowRefundModal(false);

    context.showModal({
      type: "Question",
      title: "İade Reddet",
      message: "İadeyi reddedilecek emin misiniz? Red işlemi sonrası başka işlem yapamazsınız.",
      onClick: async () => {
        const _result = await ApiService.rejectRefundForAdmin(OrderProductId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İade Reddedildi",
            onClose: () => {
              context.hideModal();
              if (waitingAdminActionTableEl.current) {
                waitingAdminActionTableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); },
    })

  }

  const handleOpenRefundModal = (item) => {
    setModalRefund(JSON.parse(JSON.stringify(item)));
    setShowRefundModal(true);
  }

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleDateString() ?? "-";
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">İade Talepleri</h2>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {
          selectedTabsId === 1 ?
            <>
              <Table
                ref={waitingAdminActionTableEl}
                key={"waitingAdminActionTableEl"}
                emptyListText={"Talep Bulunamadı"}
                getDataFunction={getWaitingAdminActionRefundListForAdmin}
                header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-1 flex items-center">
                    <span className="p-sm-gray-400">
                      İade Talep Tarihi
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      Sipariş Bilgileri
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      Satıcı Bilgileri
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      Ürün Bilgileri
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      Alıcı Bilgileri
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      İade Edilecek Tutarı
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      İade Nedeni
                    </span>
                  </div>
                </div>}
                renderItem={(e, i) => {
                  return <div className=" lg:grid-cols-8 px-2 border-b border-t min-h-20 py-5 border-gray-200 hidden lg:grid gap-4" key={i}>
                    <div className="lg:col-span-1 flex items-center">
                      <span className="p-sm">
                        {handleJsTime(e.RefundCreatedDateJSTime)}
                      </span>
                    </div>
                    <div className="lg:col-span-1 flex items-center">
                      <div>
                        <div className="text-sm text-gray-900 font-medium">{"#" + e.UserOrderId}</div>
                        <div className="text-sm text-gray-700 mt-1">{handleJsTime(e.OrderCreatedDateJSTime)}</div>
                      </div>
                    </div>
                    <div className="lg:col-span-1 flex items-center">
                      <span className="text-sm text-blue-400 underline font-medium cursor-pointer" onClick={() => { history.push(`/satici-detay/${e.SellerId}`); }}>
                        {e.StoreName}
                      </span>
                    </div>
                    <div className="lg:col-span-1 flex items-center gap-3">
                      <img src={e.MainPhotoUrl ?? ""} alt={e.ProductName} className="w-12 h-12 object-contain" />
                      <span className="p-sm">
                        {e.ProductName}
                      </span>
                    </div>
                    <div className="lg:col-span-1 flex items-center gap-3">
                      <img src={e.BuyerPhoto ?? ""} alt={e.BuyerName} className="w-8 h-8 object-cover rounded-full" />
                      <div className="text-sm">
                        <div className="text-gray-900 font-medium">{e.BuyerName}</div>
                      </div>
                    </div>
                    <div className="lg:col-span-1 flex items-center">
                      <div className="text-sm text-black-400 font-medium">
                        {Number(e.TotalPrice ?? 0) % 1 === 0 ?
                          <>{fraction.format(Number(e.TotalPrice ?? 0))} TL </>
                          :
                          <>{formatter.format(Number(e.TotalPrice ?? 0))} TL</>
                        }
                      </div>
                    </div>
                    <div className="lg:col-span-2 items-center flex">
                      <div className="text-sm text-gray-700">{e.RefundReason}</div>
                      <Button className="w-1/2 min-w-1/2 ml-auto" buttonSm design="button-blue-400" text="İade Talebini İncele" onClick={() => { handleOpenRefundModal(e); }} />
                      <div className="flex items-center ml-2">
                        <ChevronRightIcon className="w-8 h-5 text-gray-700 hover:hover:text-blue-400 cursor-pointer transition-all border-l pl-1" />
                      </div>
                    </div>
                  </div>
                }}
              />
            </>
            :
            selectedTabsId === 2 ?
              <>
                <Table
                  ref={waitingSellerApproveTableEl}
                  key={"waitingSellerApproveTableEl"}
                  emptyListText={"Talep Bulunamadı"}
                  getDataFunction={getWaitingSellerApproveRefundListForAdmin}
                  header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-1 flex items-center">
                      <span className="p-sm-gray-400">
                        İade Talep Tarihi
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Sipariş Bilgileri
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Satıcı Bilgileri
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Ürün Bilgileri
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Alıcı Bilgileri
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        İade Edilecek Tutarı
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        İade Nedeni
                      </span>
                    </div>
                  </div>}
                  renderItem={(e, i) => {
                    return <div className=" lg:grid-cols-8 px-2 border-b border-t min-h-20 py-5 border-gray-200 hidden lg:grid gap-4" key={i}>
                      <div className="lg:col-span-1 flex items-center">
                        <span className="p-sm">
                          {handleJsTime(e.RefundCreatedDateJSTime)}
                        </span>
                      </div>
                      <div className="lg:col-span-1 flex items-center">
                        <div>
                          <div className="text-sm text-gray-900 font-medium">{"#" + e.UserOrderId}</div>
                          <div className="text-sm text-gray-700 mt-1">{handleJsTime(e.OrderCreatedDateJSTime)}</div>
                        </div>
                      </div>
                      <div className="lg:col-span-1 flex items-center">
                        <span className="text-sm text-blue-400 underline font-medium cursor-pointer" onClick={() => { history.push(`/satici-detay/${e.SellerId}`); }}>
                          {e.StoreName}
                        </span>
                      </div>
                      <div className="lg:col-span-1 flex items-center gap-3">
                        <img src={e.MainPhotoUrl ?? ""} alt={e.ProductName} className="w-12 h-12 object-contain" />
                        <span className="p-sm">
                          {e.ProductName}
                        </span>
                      </div>
                      <div className="lg:col-span-1 flex items-center gap-3">
                        <img src={e.BuyerPhoto ?? ""} alt={e.BuyerName} className="w-8 h-8 object-cover rounded-full" />
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium">{e.BuyerName}</div>
                        </div>
                      </div>
                      <div className="lg:col-span-1 flex items-center">
                        <div className="text-sm text-black-400 font-medium">
                          {Number(e.TotalPrice ?? 0) % 1 === 0 ?
                            <>{fraction.format(Number(e.TotalPrice ?? 0))} TL </>
                            :
                            <>{formatter.format(Number(e.TotalPrice ?? 0))} TL</>
                          }
                        </div>
                      </div>
                      <div className="lg:col-span-2 items-center flex">
                        <div className="text-sm text-gray-700">{e.RefundReason}</div>
                        <Button className="w-1/2 min-w-1/2 ml-auto" buttonSm design="button-blue-400" text="İade Talebini İncele" onClick={() => { handleOpenRefundModal(e); }} />
                        <div className="flex items-center ml-2">
                          <ChevronRightIcon className="w-8 h-5 text-gray-700 hover:hover:text-blue-400 cursor-pointer transition-all border-l pl-1" />
                        </div>
                      </div>
                    </div>
                  }}
                />
              </>
              :
              selectedTabsId === 3 ?
                <>
                  <Table
                    ref={approveTableEl}
                    key={"approveTableEl"}
                    emptyListText={"Talep Bulunamadı"}
                    getDataFunction={getSellerApproveRefundListForAdmin}
                    header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                      <div className="lg:col-span-1 flex items-center">
                        <span className="p-sm-gray-400">
                          İade Talep Tarihi
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Sipariş Bilgileri
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Satıcı Bilgileri
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Ürün Bilgileri
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Alıcı Bilgileri
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          İade Edilecek Tutarı
                        </span>
                      </div>
                      <div className="lg:col-span-2">
                        <span className="p-sm-gray-400">
                          İade Nedeni
                        </span>
                      </div>
                    </div>}
                    renderItem={(e, i) => {
                      return <div className=" lg:grid-cols-8 px-2 border-b border-t min-h-20 py-5 border-gray-200 hidden lg:grid gap-4" key={i}>
                        <div className="lg:col-span-1 flex items-center">
                          <span className="p-sm">
                            {handleJsTime(e.RefundCreatedDateJSTime)}
                          </span>
                        </div>
                        <div className="lg:col-span-1 flex items-center">
                          <div>
                            <div className="text-sm text-gray-900 font-medium">{"#" + e.UserOrderId}</div>
                            <div className="text-sm text-gray-700 mt-1">{handleJsTime(e.OrderCreatedDateJSTime)}</div>
                          </div>
                        </div>
                        <div className="lg:col-span-1 flex items-center">
                          <span className="text-sm text-blue-400 underline font-medium cursor-pointer" onClick={() => { history.push(`/satici-detay/${e.SellerId}`); }}>
                            {e.StoreName}
                          </span>
                        </div>
                        <div className="lg:col-span-1 flex items-center gap-3">
                          <img src={e.MainPhotoUrl ?? ""} alt={e.ProductName} className="w-12 h-12 object-contain" />
                          <span className="p-sm">
                            {e.ProductName}
                          </span>
                        </div>
                        <div className="lg:col-span-1 flex items-center gap-3">
                          <img src={e.BuyerPhoto ?? ""} alt={e.BuyerName} className="w-8 h-8 object-cover rounded-full" />
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">{e.BuyerName}</div>
                          </div>
                        </div>
                        <div className="lg:col-span-1 flex items-center">
                          <div className="text-sm text-black-400 font-medium">
                            {Number(e.TotalPrice ?? 0) % 1 === 0 ?
                              <>{fraction.format(Number(e.TotalPrice ?? 0))} TL </>
                              :
                              <>{formatter.format(Number(e.TotalPrice ?? 0))} TL</>
                            }
                          </div>
                        </div>
                        <div className="lg:col-span-2 items-center flex">
                          <div className="text-sm text-gray-700">{e.RefundReason}</div>
                          <Button className="w-1/2 min-w-1/2 ml-auto" buttonSm design="button-blue-400" text="İade Talebini İncele" onClick={() => { handleOpenRefundModal(e); }} />
                          <div className="flex items-center ml-2">
                            <ChevronRightIcon className="w-8 h-5 text-gray-700 hover:hover:text-blue-400 cursor-pointer transition-all border-l pl-1" />
                          </div>
                        </div>
                      </div>
                    }}
                  />
                </>
                :
                selectedTabsId === 4 ?
                  <>
                    <Table
                      ref={rejectedTableEl}
                      key={"rejectedTableEl"}
                      emptyListText={"Talep Bulunamadı"}
                      getDataFunction={getSellerRejectedRefundListForAdmin}
                      header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                        <div className="lg:col-span-1 flex items-center">
                          <span className="p-sm-gray-400">
                            İade Talep Tarihi
                          </span>
                        </div>
                        <div className="lg:col-span-1">
                          <span className="p-sm-gray-400">
                            Sipariş Bilgileri
                          </span>
                        </div>
                        <div className="lg:col-span-1">
                          <span className="p-sm-gray-400">
                            Satıcı Bilgileri
                          </span>
                        </div>
                        <div className="lg:col-span-1">
                          <span className="p-sm-gray-400">
                            Ürün Bilgileri
                          </span>
                        </div>
                        <div className="lg:col-span-1">
                          <span className="p-sm-gray-400">
                            Alıcı Bilgileri
                          </span>
                        </div>
                        <div className="lg:col-span-1">
                          <span className="p-sm-gray-400">
                            İade Edilecek Tutarı
                          </span>
                        </div>
                        <div className="lg:col-span-2">
                          <span className="p-sm-gray-400">
                            İade Nedeni
                          </span>
                        </div>
                      </div>}
                      renderItem={(e, i) => {
                        return <div className=" lg:grid-cols-8 px-2 border-b border-t min-h-20 py-5 border-gray-200 hidden lg:grid gap-4" key={i}>
                          <div className="lg:col-span-1 flex items-center">
                            <span className="p-sm">
                              {handleJsTime(e.RefundCreatedDateJSTime)}
                            </span>
                          </div>
                          <div className="lg:col-span-1 flex items-center">
                            <div>
                              <div className="text-sm text-gray-900 font-medium">{"#" + e.UserOrderId}</div>
                              <div className="text-sm text-gray-700 mt-1">{handleJsTime(e.OrderCreatedDateJSTime)}</div>
                            </div>
                          </div>
                          <div className="lg:col-span-1 flex items-center">
                            <span className="text-sm text-blue-400 underline font-medium cursor-pointer" onClick={() => { history.push(`/satici-detay/${e.SellerId}`); }}>
                              {e.StoreName}
                            </span>
                          </div>
                          <div className="lg:col-span-1 flex items-center gap-3">
                            <img src={e.MainPhotoUrl ?? ""} alt={e.ProductName} className="w-12 h-12 object-contain" />
                            <span className="p-sm">
                              {e.ProductName}
                            </span>
                          </div>
                          <div className="lg:col-span-1 flex items-center gap-3">
                            <img src={e.BuyerPhoto ?? ""} alt={e.BuyerName} className="w-8 h-8 object-cover rounded-full" />
                            <div className="text-sm">
                              <div className="text-gray-900 font-medium">{e.BuyerName}</div>
                            </div>
                          </div>
                          <div className="lg:col-span-1 flex items-center">
                            <div className="text-sm text-black-400 font-medium">
                              {Number(e.TotalPrice ?? 0) % 1 === 0 ?
                                <>{fraction.format(Number(e.TotalPrice ?? 0))} TL </>
                                :
                                <>{formatter.format(Number(e.TotalPrice ?? 0))} TL</>
                              }
                            </div>
                          </div>
                          <div className="lg:col-span-2 items-center flex">
                            <div className="text-sm text-gray-700">{e.RefundReason}</div>
                            <Button className="w-1/2 min-w-1/2 ml-auto" buttonSm design="button-blue-400" text="İade Talebini İncele" onClick={() => { handleOpenRefundModal(e); }} />
                            <div className="flex items-center ml-2">
                              <ChevronRightIcon className="w-8 h-5 text-gray-700 hover:hover:text-blue-400 cursor-pointer transition-all border-l pl-1" />
                            </div>
                          </div>
                        </div>
                      }}
                    />
                  </>
                  :
                  <></>
        }
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showRefundModal}
        onClose={() => { setShowRefundModal(false); }}
        title="Detaylı İade Bilgisi"
        body={
          <>
            <div className="pb-4 border-b border-gray-200">
              {
                modalRefund?.Status === ProductOrderDataType.REFUNDED ?
                  <>
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-400">
                      <CheckIcon className="icon-sm" />
                      <div>İade Onaylandı</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-1/3 flex items-center justify-between text-gray-700">
                        <div>İade Onay Tarihi</div><div>:</div>
                      </div>
                      <div className="text-gray-900 font-medium">{handleJsTime(modalRefund?.RefundUpdateDateJSTime)}</div>
                    </div>
                  </>
                  :
                  (modalRefund?.Status === ProductOrderDataType.REFUND_REJECTED) ?
                    <>
                      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-red-400">
                        <CloseIcon className="icon-sm" />
                        <div>İade Mağaza Tarafından Reddedildi</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="w-1/3 flex items-center justify-between text-gray-700">
                          <div>İade Red Tarihi</div><div>:</div>
                        </div>
                        <div className="text-gray-900 font-medium">{handleJsTime(modalRefund?.RefundUpdateDateJSTime)}</div>
                      </div>
                    </>
                    :
                    (modalRefund?.Status === ProductOrderDataType.DONE && modalRefund?.IsRefundRequestedBefore) ?
                      <>
                        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-red-400">
                          <CloseIcon className="icon-sm" />
                          <div>İade Housiy Tarafından Reddedildi</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="w-1/3 flex items-center justify-between text-gray-700">
                            <div>İade Red Tarihi</div><div>:</div>
                          </div>
                          <div className="text-gray-900 font-medium">{handleJsTime(modalRefund?.RefundUpdateDateJSTime)}</div>
                        </div>
                      </>
                      :
                      <></>
              }
              <div className="flex items-center gap-4 text-sm">
                <div className="w-1/3 flex items-center justify-between text-gray-700">
                  <div>İade Talep Tarihi</div><div>:</div>
                </div>
                <div className="text-gray-900 font-medium">{handleJsTime(modalRefund?.RefundCreatedDateJSTime)}</div>
              </div>
              <div className="flex items-center gap-4 text-sm mt-4">
                <div className="w-1/3 flex items-center justify-between text-gray-700">
                  <div>Sipariş Numarası</div><div>:</div>
                </div>
                <div className="text-gray-900 font-medium">{"#" + modalRefund?.UserOrderId}</div>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium ml-auto cursor-pointer" onClick={() => { history.push(`/siparis-detay/${String(modalRefund?.UserOrderId ?? 0)}`); }}>
                  <div>Sipariş Detayına Git</div>
                  <ChevronRightIcon className="icon-sm" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-4 items-center">
              <img src={modalRefund?.MainPhotoUrl ?? ""} alt={modalRefund?.ProductName} className="w-32 h-32 object-contain " />
              <div>
                <div className="text-sm text-gray-900 font-medium">{modalRefund?.ProductName}</div>
                <div className="flex items-center gap-4 text-sm mt-2">
                  <div className="w-1/3 flex items-center text-gray-700">
                    <div>Barkod No :</div>
                  </div>
                  <div className="text-gray-900 font-medium">{modalRefund?.BarcodeNo}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-1/3 flex items-center justify-between text-gray-700">
                  <div>İade Nedeni</div><div>:</div>
                </div>
                <div className="text-gray-900 font-medium">{modalRefund?.RefundReason}</div>
              </div>
              <div className="flex items-center gap-4 text-sm mt-4">
                <div className="w-1/3 flex items-center justify-between text-gray-700">
                  <div>Açıklama</div><div>:</div>
                </div>
                <div className="text-gray-900 font-medium">{modalRefund?.RefundDescription}</div>
              </div>
              <div className="flex items-start gap-4 text-sm mt-4">
                <div className="w-1/3 flex items-center justify-between text-gray-700">
                  <div>İade Görselleri</div><div>:</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {
                    modalRefund?.RefundProofFile &&
                    <>
                      {
                        modalRefund?.RefundProofFile.map((item) => (
                          <div className="col-span-1">
                            <img src={item ?? ""} alt={modalRefund?.ProductName} className="w-24 h-24 object-contain " />
                          </div>
                        ))
                      }
                    </>
                  }
                </div>
              </div>
              {
                (modalRefund?.Status === ProductOrderDataType.REFUND_REJECTED || (modalRefund?.Status === ProductOrderDataType.DONE && modalRefund?.IsRefundRequestedBefore)) &&
                <div className="flex items-center gap-4 text-sm mt-4">
                  <div className="w-1/3 flex items-center justify-between text-gray-700">
                    <div>İade Red Nedeni</div><div>:</div>
                  </div>
                  <div className="text-gray-900 font-medium">{modalRefund?.RefundSellerRejectDescription}</div>
                </div>
              }
            </div>
          </>
        }
        footer={
          <>
            {
              modalRefund?.Status === ProductOrderDataType.REFUND_REJECTED &&
              <div className="mt-12 flex gap-2 items-center">
                <Button className="w-1/2" design="button-blue-400" text="Onayla" onClick={() => { approveRefundForAdmin(modalRefund?.OrderProductId) }} />
                <Button className="w-1/2" design="button-gray-100" text="Reddet" onClick={() => { rejectRefundForAdmin(modalRefund?.OrderProductId); }} />
              </div>
            }
          </>
        }
      />
    </div>
  )
}
