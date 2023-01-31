import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link } from "react-router-dom";
import { DatePicker } from "../../Components/DatePicker";
import { DateView } from "../../Components/DateView";
import { Label } from "../../Components/Label";
import { Modal } from "../../Components/Modal";
import { Table } from "../../Components/Table"
import { fraction } from "../../Models";
import ApiService from "../../Services/ApiService";
import { formatter } from "../../Services/Functions";
import { Dropzone } from "../../Components/Dropzone";
import { SERVICES } from "../../Services/Constants";
import { DownloadIcon } from "../../Components/Icons";
import { Button } from "../../Components/Button";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";

export const ProAdvertisementPayments: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];
  const [invoiceNo, setInvoiceNo] = useState<string>("");

  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());

  const [selectedPaymentId, setSelectedPaymentId] = useState<number>(0);

  const [invoiceUrl, setInvoiceUrl] = useState<string>("");

  const getProWaitingAdvertisementPayments = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProWaitingAdvertisementPayments(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      return {
        Data: [],
        TotalCount: 0
      }
    }


  }

  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState<boolean>(false);

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [processLoading, setProcessLoading] = useState<boolean>(false);


  const clearInput = () => {
    setSelectedPaymentId(0);
    setInvoiceDate(new Date());
    setInvoiceNo("");
    setInvoiceUrl("");
  }
  const addFile = (e) => {
    setInvoiceUrl(e[0].FileUrl);

  }

  const handleShowInvoiceModal = (e) => {
    setSelectedPaymentId(e.PaymentId);
    setShowAddInvoiceModal(true);
  }

  const updateInvoicePaymentAction = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateInvoicePaymentAction(selectedPaymentId, invoiceUrl, invoiceNo, invoiceDate.getTime());

    setShowAddInvoiceModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Fatura başarıyla yüklendi",
        onClose: () => {
          context.hideModal();
          if (tableEl.current) {
            tableEl.current?.reload();
          }
          setProcessLoading(false);
          clearInput();
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


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Profesyonel Reklam Ödemeleri
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"Ödeme Bulunamadı"}
          getDataFunction={getProWaitingAdvertisementPayments}
          header={<div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Reklam ID
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Profesyonel Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Reklam Türü
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Reklam Süresi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ödeme Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam ID:</span>
                <p className="p-sm">
                  {e.AdvertiseId}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Bilgisi:</span>
                <Link to={`/pro-profesyonel-detay/${e.ProId}`} className="underline text-blue-400 font-medium text-sm">{e.ProStoreName}</Link>
              </div>

              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Türü:</span>
                {/* //#TODO: Finans - Reklam Türleri? */}
                <p className="p-sm">
                  {e.AdvertiseType}
                </p>
              </div>

              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Süresi:</span>
                <p className="p-sm">
                  {e.AdvertiseDay} gün
                </p>
              </div>

              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ödeme Tarihi:</span>
                <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.PayedDateJSTime} pattern="dd/MM/yyyy" />
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
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler:</span>
                {/* //#TODO: Finans - Bu link ne yapacak? Servis Yok 06/10/21 */}
                <p className="text-sm text-blue-400 font-medium underline" onClick={() => handleShowInvoiceModal(e)}>
                  İşlemi Faturalandır
                </p>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showAddInvoiceModal}
        onClose={() => { setShowAddInvoiceModal(false); clearInput(); }}
        title="Fatura Yükleme"
        body={
          <div>
            <p className="text-sm text-gray-900">Lütfen devam etmek için işlem faturasını yükleyiniz.</p>
            <Label className="mt-4" isRequired title="Fatura Numarası" withoutDots />
            <input className="form-input" type="text" value={invoiceNo} onChange={(e) => { setInvoiceNo(e.target.value) }} />
            <Label className="mt-4" isRequired title="Fatura Tarihi" withoutDots />
            <DatePicker
              isFull
              value={invoiceDate}
              setSelectedDate={(e) => { setInvoiceDate(e); }}
            />
            <Label className="mt-4" isRequired title="Fatura Yükle" withoutDots />
            <Dropzone
              fileUploaderCss
              accept={["pdf"]}
              addFiles={addFile}
              maxFileSizeAsMB={5}
              uploadUrl={SERVICES.API_ADMIN_FINANCE_URL + "/upload-payment-action-media"}
              maxFileCount={1}
            ></Dropzone>
            {
              (invoiceUrl !== "" && invoiceUrl !== undefined && invoiceUrl !== null) &&
              <a target="_blank" href={invoiceUrl} className="flex hover:underline text-sm text-blue-400 items-center text-sm font-medium">
                <DownloadIcon className="icon-sm mr-2" />
                <div className=" my-auto">Belgeyi Görüntüle</div>
              </a>
            }
          </div>
        }
        footer={
          <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Yükle ve Onayla" onClick={() => { updateInvoicePaymentAction() }} />
        }
      />
    </div>
  )
}
