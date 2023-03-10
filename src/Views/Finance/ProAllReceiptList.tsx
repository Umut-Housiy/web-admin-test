import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { Button } from "../../Components/Button";
import { DateView } from "../../Components/DateView";
import { ChevronRightIcon } from "../../Components/Icons";
import { Label } from "../../Components/Label";
import { Modal } from "../../Components/Modal";
import { Table } from "../../Components/Table";
import ApiService from "../../Services/ApiService";
import { currentDateStampForCompare, formatter, fraction } from "../../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";


export const ProAllReceiptList: FunctionComponent = () => {
  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];

  const _now = currentDateStampForCompare();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const [selectedReceiptId, setSelectedReceiptId] = useState<number>(0);

  const [selectedSellerAccountInfo, setSelectedSellerAccountInfo] = useState<string>("");

  const [selectedTotalPrice, setSelectedTotalPrice] = useState<number>(0);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const getProReceipts = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProReceipts(page, take, searchText, order);

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


  const handleShowPaymentModal = (item) => {
    setSelectedReceiptId(item.ReceiptId);
    setSelectedSellerAccountInfo(item.SellerAccountInfo);
    setSelectedTotalPrice(item.TotalPrice);
    setShowPaymentModal(true);
  }

  const clearInput = () => {
    setSelectedReceiptId(0);
    setSelectedSellerAccountInfo("");
    setSelectedTotalPrice(0);
  }

  const saveSellerReceipt = async () => {
    setProcessLoading(true);

    const _result = await ApiService.saveReceiptPayment(selectedReceiptId);

    setShowPaymentModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "??deme tamamland??",
        message: `${(_result.message !== "" || _result.message !== null) ? _result.message : ""}`,
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
          if (tableEl.current) {
            tableEl.current?.reload();
          }
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
        }
      });
    }
  }

  const showCancelModal = (item) => {
    context.showModal({
      type: "Question",
      title: "????lemi ??ptal Et",
      message: `${item.ReceiptId} ekstre numaral?? i??lemi iptal etmek istedi??inize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.cancelReceipt(item.ReceiptId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "????lem ??ptal Edildi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          ??deme Emirleri
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"Emir Bulunamad??"}
          getDataFunction={getProReceipts}
          header={<div className="lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Ekstre No
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Profesyonel ID
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Profesyonel Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Planlanan ??deme Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
            <div className="lg:col-span-2 text-center">
              <span className="p-sm-gray-400">
                ????lemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ekstre No:</span>
                <p className="p-sm">
                  {e.ReceiptId}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel ID:</span>
                <p className="p-sm">
                  {e.ProId}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Bilgisi:</span>
                <Link to={`/pro-profesyonel-detay/${e.ProId}`} className="underline text-blue-400 font-medium text-sm">{e.ProStoreName}</Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Planlanan ??deme Tarihi:</span>
                {e.PlannedDateJSTime > 0 ?
                  <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.PlannedDateJSTime} pattern="dd/MM/yyyy" />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                <p className="p-sm">
                  {e.TotalPrice % 1 === 0 ?
                    <>{fraction.format(e.TotalPrice)} TL </>
                    :
                    <>{formatter.format(e.TotalPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2 text-center">????lemler:</span>
                <div className="flex items-center divide-x text-sm gap-x-3 justify-center">
                  <span className={`${e.PlannedDateJSTime <= _now ? "text-blue-400 cursor-pointer" : "text-gray-700 pointer-events-none"} font-medium `} onClick={() => handleShowPaymentModal(e)}>
                    ??deme Yap
                  </span>
                  <div className="text-gray-700 font-medium pl-2 cursor-pointer hover:text-red-400 transition-all duration-300" onClick={() => showCancelModal(e)}>
                    ????lemi ??ptal Et
                  </div>
                  <Link to={{ pathname: `${"/pro-ekstre-detay/" + e.ReceiptId}`, state: { status: 1 } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400  cursor-pointer transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showPaymentModal}
        onClose={() => { setShowPaymentModal(false); clearInput(); }}
        title="??deme Yap"
        body={
          <div>
            <Label className="mt-4" isRequired title="Aktar??m Yap??lacak Hesap Se??imi (Profesyonel Hesab??)" withoutDots />
            <input className="form-input" type="text" value={selectedSellerAccountInfo} disabled />
            <Label className="mt-4" isRequired title="Toplam Tutar" withoutDots />
            <div className="form-input bg-gray-100">
              {selectedTotalPrice % 1 === 0 ?
                <>{fraction.format(selectedTotalPrice)} TL </>
                :
                <>{formatter.format(selectedTotalPrice)} TL</>
              }
            </div>
          </div>
        }
        footer={
          <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="??deme Yap" onClick={() => { saveSellerReceipt() }} />
        }
      />
    </div>
  )
}
