import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom"
import { Button } from "../../Components/Button";
import { DateView } from "../../Components/DateView";
import { ChevronRightIcon, DownloadIcon, FileTextIcon } from "../../Components/Icons"
import { Label } from "../../Components/Label";
import { Modal } from "../../Components/Modal";
import { Table } from "../../Components/Table";
import { fraction, ReceiptPaymentRowInnerModel, WaitingInvoiceSellerPaymentsInnerModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { NumberView } from "../../Components/NumberView";
import { formatter, returnPaymentType } from "../../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";

interface RouteParams {
  id: string,
}

interface LocationModel {
  status?: number
  uncompleted?: boolean
}

export const ReceiptDetailForSeller: FunctionComponent = () => {
  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];

  const tableDetail = useRef<any>();

  const tableElForCompletedPayment = useRef<any>();

  const tableElForUnCompletedPayment = useRef<any>();

  const location = useLocation<LocationModel>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const [receiptDate, setReceiptDate] = useState<number>(0);

  const [sellerId, setSellerId] = useState<number>(0);

  const [sellerStoreName, setSellerStoreName] = useState<string>("");

  const [plannedDate, setPlannedDate] = useState<number>(0);

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const [sellerAccountInfo, setSellerAccountInfo] = useState<string>("");

  const [status, setStatus] = useState<number>(location.state?.status ?? 1);

  const [payedDateJSTime, setPayedDateJSTime] = useState<number>(0);

  const [selectedType, setSelectedType] = useState<number>(0);

  const [compeletedTrasactionIds, setCompeletedTrasactionIds] = useState<string[]>([]);

  const [unCompeletedTrasactionIds, setUnCompeletedTrasactionIds] = useState<string[]>([]);

  const history = useHistory();

  const tableEl = useRef<any>();

  useEffect(() => {
    getReceiptDetail();
  }, []);

  const getReceiptDetail = async () => {

    setLoading(true);

    const _result = await ApiService.getReceiptDetail(Number(params.id))
    if (_result.succeeded === true) {
      setReceiptDate(_result.data.ReceiptDateJSTime);
      setSellerId(_result.data.SellerId);
      setSellerStoreName(_result.data.SellerStoreName);
      setPlannedDate(_result.data.PlannedDateJSTime);
      setTotalPrice(_result.data.TotalPrice);
      setSellerAccountInfo(_result.data.SellerAccountInfo);
      setPayedDateJSTime(_result.data.PayedDateJSTime);
      setLoading(false);
      setCompeletedTrasactionIds(_result.data.CompletedTransactionIds ?? []);
      setUnCompeletedTrasactionIds(_result.data.UncompleteTransactionIds ?? []);

    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setLoading(false);
          history.push("/satici-odeme-emirleri")
        }
      });
    }
  }

  const handleShowModal = (item: number) => {
    setSelectedType(item);
    setShowDetailModal(true);
  }

  const getPaymentActionItems = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getReceiptPaymentTypeAction(Number(params.id), selectedType, page, take, searchText, order);

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
    // return {
    //   Data: [],
    //   TotalCount: 0
    // }
  }

  const getReceiptPaymentAction = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getReceiptPaymentAction(Number(params.id), page, take, searchText, order);

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
    // return {
    //   Data: [],
    //   TotalCount: 0
    // }
  }

  const saveSellerReceipt = async () => {
    setProcessLoading(true);

    const _result = await ApiService.saveReceiptPayment(Number(params.id));

    setShowPaymentModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ödeme tamamlandı",
        message: `${(_result.message !== "" || _result.message !== null) ? _result.message : ""}`,
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
          history.push("/satici-odeme-emirleri")
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

  const showCancelModal = () => {
    context.showModal({
      type: "Question",
      title: "İşlemi İptal Et",
      message: `${Number(params.id)} ekstre numaralı işlemi iptal etmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.cancelReceipt(Number(params.id));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İşlem İptal Edildi",
            onClose: () => {
              context.hideModal();
              history.push("/satici-odeme-emirleri")
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

  const getDescription = (e: WaitingInvoiceSellerPaymentsInnerModel) => {
    if (e.AdvertisementIds) {
      return `${e.AdvertisementIds} numaralı reklamlar için fatura`
    }

    if (e.UserOrderId) {
      return `#${e.UserOrderId} numaralı sipariş için ${returnPaymentType(e.PaymentType)}`
    }

    return `-`

  }

  const getCompletedTransactionIds = async (order: number, searchText: string, page: number, take: number) => {
    return {
      Data: compeletedTrasactionIds.slice((page - 1) * take, page * take),
      TotalCount: compeletedTrasactionIds.length
    }
  }

  const getUnCompletedTransactionIds = async (order: number, searchText: string, page: number, take: number) => {
    return {
      Data: unCompeletedTrasactionIds.slice((page - 1) * take, page * take),
      TotalCount: unCompeletedTrasactionIds.length
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to="/satici-odeme-emirleri" className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Ödeme Emirleri
          </div>
        </Link>
        <div className="flex items-center justify-between pb-5 border-b">
          <h2 >Ekstre Detayı</h2>
          {status === 1 &&
            <div className="flex items-center gap-x-2">
              <Button isLoading={processLoading} buttonSm text="Ödeme Yap" design="button-blue-400 w-32" onClick={() => setShowPaymentModal(true)} />
              <Button buttonSm text="İşlemi İptal Et" design="button-gray-100 w-32" onClick={() => showCancelModal()} />
            </div>
          }

        </div>
        <div className="flex">
          <div className="w-1/2 mt-4">
            <h4 className="mb-4">Ekstre Bilgileri</h4>
            <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title={status === 2 ? "Ödeme No" : "Ekstre No"} desc={params.id} />
            <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Oluşturulma Tarihi" desc={
              <DateView className="text-sm text-gray-700 mb-1" dateNumber={receiptDate} pattern="dd/MM/yyyy" />
            } />
            <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Satıcı ID" desc={sellerId} />
            <Label loading={loading} descClassName="text-blue-400 text-sm underline font-medium" titleWidth="w-1/5" descWidth="w-4/5" title="Satıcı Adı" desc={
              <Link to={`/satici-detay/${sellerId}`} >{sellerStoreName}</Link>
            } />
            <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Planlanan Ödeme Tarihi" desc={
              <DateView className="text-sm text-gray-700 mb-1" dateNumber={plannedDate} pattern="dd/MM/yyyy" />
            } />
            <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Toplam Tutar" desc={totalPrice % 1 === 0 ?
              <>{fraction.format(totalPrice)} TL </>
              :
              <>{formatter.format(totalPrice)} TL</>
            }
            />
          </div>
          {status === 2 &&
            <div className="w-1/2 mt-4">
              <h4 className="mb-4">Ödeme Bilgileri</h4>
              <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Satıcı Hesabı" desc={sellerAccountInfo} />
              <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Ödeme Tarihi" desc={
                <DateView className="text-sm text-gray-700 mb-1" dateNumber={payedDateJSTime} pattern="dd/MM/yyyy" />
              } />
            </div>
          }
        </div>
        {location.state?.uncompleted !== true && <>
          <h4 className="pt-4 border-t mb-4">İşlem Bilgileri</h4>
          <Table
            ref={tableEl}
            emptyListText={"İşlem Bulunamadı"}
            getDataFunction={getReceiptPaymentAction}
            header={<div className="lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  İşlem Tipi
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  İşlem Tarihi
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Fatura No
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
            renderItem={(e: ReceiptPaymentRowInnerModel, i) => {
              return <div key={"list" + i} className="lg:grid-cols-5 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                <div className="lg:col-span-1 flex lg:block items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">İşlem Tipi:</span>
                  <p className="p-sm">
                    {returnPaymentType(e.PaymentType)}
                  </p>
                </div>
                <div className="lg:col-span-1 flex lg:block items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">İşlem Tarihi:</span>
                  {e.CreatedDateJSTime > 0 ?
                    <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.CreatedDateJSTime} pattern="dd/MM/yyyy" />
                    :
                    "-"
                  }
                </div>
                <div className="lg:col-span-1 flex lg:block items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Fatura No:</span>
                  <p className="p-sm">
                    {e.InvoiceNo}
                  </p>
                </div>
                <div className="lg:col-span-1 flex lg:block items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                  {e.PaymentType < 100 ?
                    <p className="p-sm">
                      +<NumberView price={e.TotalPrice} suffix="TL" />
                    </p>
                    :
                    <p className="p-sm text-red-400">
                      -<NumberView price={e.TotalPrice} suffix="TL" />
                    </p>
                  }

                </div>
                <div className="lg:col-span-1 flex lg:block items-center">
                  <div className="lg:grid-cols-2 grid">
                    <div className=" lg:col-span-1 text-sm font-medium text-blue-400 flex items-center hover:underline cursor-pointer" onClick={() => handleShowModal(e.PaymentType)}>
                      <FileTextIcon className="icon-sm mr-1" />
                      Detay Görüntüle
                    </div>
                    {e.InvoicePath ? <a className=" lg:col-span-1 text-sm font-medium text-gray-700 flex items-center hover:underline" href={e.InvoicePath} download={e.InvoicePath}>
                      <DownloadIcon className="icon-sm mr-2" />
                      Faturayı İndir
                    </a> : <>-</>}
                  </div>
                </div>

              </div>
            }}
            sortOptions={sortOptions}
          />
          {compeletedTrasactionIds.length > 0 && <>
            <h4 className="pt-4 border-t mb-4">Tamamlanan Ödeme Bilgileri</h4>
            <Table
              ref={tableElForCompletedPayment}
              emptyListText={"Ödeme Bulunamadı"}
              getDataFunction={getCompletedTransactionIds}
              header={<div className="lg:grid-cols-2 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Transcation ID
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Durum
                  </span>
                </div>
              </div>}
              renderItem={(e, i) => {
                return <div key={"list" + i} className="lg:grid-cols-2 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Transcation ID</span>
                    <p className="p-sm">
                      {e}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
                    <p className="text-sm text-green-400 font-medium">Tamamlandı</p>
                  </div>
                </div>
              }}
              sortOptions={sortOptions}
            />
          </>
          }
        </>}
        {unCompeletedTrasactionIds.length > 0 && <>
          <h4 className="pt-4 border-t mb-4">Tamamlanamayan Ödeme Bilgileri</h4>
          <Table
            ref={tableElForUnCompletedPayment}
            emptyListText={"Ödeme Bulunamadı"}
            getDataFunction={getUnCompletedTransactionIds}
            header={<div className="lg:grid-cols-2 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Transcation ID
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Durum
                </span>
              </div>
            </div>}
            renderItem={(e, i) => {
              return <div key={"list" + i} className="lg:grid-cols-2 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                <div className="lg:col-span-1 flex lg:block items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Transcation ID</span>
                  <p className="p-sm">
                    {e}
                  </p>
                </div>
                <div className="lg:col-span-1 flex lg:block items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
                  <p className="text-sm text-red-400 font-medium">Gönderilemedi</p>
                </div>
              </div>
            }}
            sortOptions={sortOptions}
          />
        </>
        }

      </div>

      <Modal
        modalType="fixedSm"
        showModal={showPaymentModal}
        onClose={() => { setShowPaymentModal(false); }}
        title="Ödeme Yap"
        body={
          <div>
            <Label className="mt-4" isRequired title="Aktarım Yapılacak Hesap Seçimi (Satıcı Hesabı)" withoutDots />
            <input className="form-input" type="text" value={sellerAccountInfo} disabled />
            <Label className="mt-4" isRequired title="Toplam Tutar" withoutDots />
            <div className="form-input bg-gray-100">
              {totalPrice % 1 === 0 ?
                <>{fraction.format(totalPrice)} TL </>
                :
                <>{formatter.format(totalPrice)} TL</>
              }
            </div>
          </div>
        }
        footer={
          <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Ödeme Yap" onClick={() => { saveSellerReceipt() }} />
        }
      />

      <Modal
        modalType="fixedMd"
        showModal={showDetailModal}
        onClose={() => { setShowDetailModal(false); }}
        title={status === 1 ? "Ekstre Detayı" : "Ödeme Detayı"}
        body=
        {
          <div className="">
            <Table
              ref={tableDetail}
              key={"tableDetail"}
              emptyListText={"Kayıt Bulunamadı"}
              getDataFunction={getPaymentActionItems}
              noRefreshButton
              noSearchBar
              noSortOptions
              header={
                <div className="lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-3">
                    <span className="text-sm text-gray-700 font-medium">
                      İşlem Tipi
                    </span>
                  </div>
                  <div className="lg:col-span-3">
                    <span className="text-sm text-gray-700 font-medium">
                      Açıklama
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="text-sm text-gray-700 font-medium">
                      Toplam Tutar
                    </span>
                  </div>
                </div>

              }
              renderItem={(e, i) => {
                return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                  <div className="lg:col-span-3 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">İşlem Tipi:</span>
                    <p className="p-sm">
                      {returnPaymentType(e.PaymentType)}
                    </p>
                  </div>
                  <div className="lg:col-span-3 flex lg:block items-center flex items-center">
                    <p className="p-sm">
                      {getDescription(e)}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <p className="p-sm">
                      <NumberView price={e.TotalPrice} suffix="TL" />
                    </p>
                  </div>
                </div>
              }}
            />
          </div>
        }
      />
    </div>

  )
}
