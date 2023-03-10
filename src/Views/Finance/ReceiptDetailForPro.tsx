import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom"
import { Button } from "../../Components/Button";
import { DateView } from "../../Components/DateView";
import { ChevronRightIcon, DownloadIcon, FileTextIcon } from "../../Components/Icons"
import { Label } from "../../Components/Label";
import { Modal } from "../../Components/Modal";
import { NumberView } from "../../Components/NumberView";
import { Table } from "../../Components/Table";
import { fraction, WaitingInvoiceSellerPaymentsInnerModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { formatter, returnPaymentType } from "../../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";

interface RouteParams {
  id: string,
}

interface LocationModel {
  status?: number
}

export const ReceiptDetailForPro: FunctionComponent = () => {
  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];

  const tableDetail = useRef<any>();

  const location = useLocation<LocationModel>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const [receiptDate, setReceiptDate] = useState<number>(0);

  const [proId, setProId] = useState<number>(0);

  const [proStoreName, setProStoreName] = useState<string>("");

  const [plannedDate, setPlannedDate] = useState<number>(0);

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const [proAccountInfo, setProAccountInfo] = useState<string>("");

  const [status, setStatus] = useState<number>(location.state?.status ?? 1);

  const [payedDateJSTime, setPayedDateJSTime] = useState<number>(0);

  const [selectedType, setSelectedType] = useState<number>(0);


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
      setProId(_result.data.ProId);
      setProStoreName(_result.data.SellerStoreName);
      setPlannedDate(_result.data.PlannedDateJSTime);
      setTotalPrice(_result.data.TotalPrice);
      setProAccountInfo(_result.data.ProAccountInfo);
      setPayedDateJSTime(_result.data.PayedDateJSTime);
      setLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setLoading(false);
          history.push("/pro-odeme-emirleri")
        }
      });
    }
  }


  const handleShowModal = (item: number) => {
    setSelectedType(item);
    setShowDetailModal(true);
  }


  const getPaymentActionItems = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProReceiptPaymentTypeAction(Number(params.id), selectedType, page, take, searchText, order);

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

  }

  const saveSellerReceipt = async () => {
    setProcessLoading(true);

    const _result = await ApiService.saveReceiptPayment(Number(params.id));

    setShowPaymentModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "??deme tamamland??",
        message: `${(_result.message !== "" || _result.message !== null) ? _result.message : ""}`,
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
          history.push("/pro-odeme-emirleri")
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
      title: "????lemi ??ptal Et",
      message: `${Number(params.id)} ekstre numaral?? i??lemi iptal etmek istedi??inize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.cancelReceipt(Number(params.id));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "????lem ??ptal Edildi",
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
      return `${e.AdvertisementIds} numaral?? reklamlar i??in fatura`
    }

    if (e.UserOrderId) {
      return `#${e.UserOrderId} numaral?? sipari?? i??in ${returnPaymentType(e.PaymentType)}`
    }

    return `-`

  }


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to="/satici-odeme-emirleri" className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            ??deme Emirleri
          </div>
        </Link>
        <div className="flex items-center justify-between pb-5 border-b">
          <h2 >Ekstre Detay??</h2>
          {status === 1 &&
            <div className="flex items-center gap-x-2">
              <Button isLoading={processLoading} buttonSm text="??deme Yap" design="button-blue-400 w-32" onClick={() => setShowPaymentModal(true)} />
              <Button buttonSm text="????lemi ??ptal Et" design="button-gray-100 w-32" onClick={() => showCancelModal()} />
            </div>
          }

        </div>
        <div className="flex">
          <div className="w-1/2 mt-4">
            <h4 className="mb-4">Ekstre Bilgileri</h4>
            <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title={status === 2 ? "??deme No" : "Ekstre No"} desc={params.id} />
            <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Olu??turulma Tarihi" desc={
              <DateView className="text-sm text-gray-700 mb-1" dateNumber={receiptDate} pattern="dd/MM/yyyy" />
            } />
            <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Profesyonel ID" desc={proId} />
            <Label loading={loading} descClassName="text-blue-400 text-sm underline font-medium" titleWidth="w-1/5" descWidth="w-4/5" title="Profesyonel Ad??" desc={
              <Link to={`/pro-profesyonel-detay/${proId}`} >{proStoreName}</Link>
            } />
            <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Planlanan ??deme Tarihi" desc={
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
              <h4 className="mb-4">??deme Bilgileri</h4>
              <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="Sat??c?? Hesab??" desc={proAccountInfo} />
              <Label loading={loading} titleWidth="w-1/5" descWidth="w-4/5" title="??deme Tarihi" desc={
                <DateView className="text-sm text-gray-700 mb-1" dateNumber={payedDateJSTime} pattern="dd/MM/yyyy" />
              } />
            </div>
          }
        </div>

        <h4 className="pt-4 border-t mb-4">????lem Bilgileri</h4>
        <Table
          ref={tableEl}
          emptyListText={"????lem Bulunamad??"}
          getDataFunction={getReceiptPaymentAction}
          header={<div className="lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                ????lem Tipi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                ????lem Tarihi
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
                ????lemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-5 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">????lem Tipi:</span>
                <p className="p-sm">
                  {returnPaymentType(e.PaymentType)}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">????lem Tarihi:</span>
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
                    Detay G??r??nt??le
                  </div>
                  {e.InvoicePath ? <a className=" lg:col-span-1 text-sm font-medium text-gray-700 flex items-center hover:underline" href={e.InvoicePath} download={e.InvoicePath}>
                    <DownloadIcon className="icon-sm mr-2" />
                    Faturay?? ??ndir
                  </a> : <>-</>}
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
        onClose={() => { setShowPaymentModal(false); }}
        title="??deme Yap"
        body={
          <div>
            <Label className="mt-4" isRequired title="Aktar??m Yap??lacak Hesap Se??imi (Profesyonel Hesab??)" withoutDots />
            <input className="form-input" type="text" value={proAccountInfo} disabled />
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
          <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="??deme Yap" onClick={() => { saveSellerReceipt() }} />
        }
      />


      <Modal
        modalType="fixedMd"
        showModal={showDetailModal}
        onClose={() => { setShowDetailModal(false); }}
        title={status === 1 ? "Ekstre Detay??" : "??deme Detay??"}
        body=
        {
          <div className="">
            <Table
              ref={tableDetail}
              key={"tableDetail"}
              emptyListText={"Kay??t Bulunamad??"}
              getDataFunction={getPaymentActionItems}
              noRefreshButton
              noSearchBar
              noSortOptions
              header={
                <div className="lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-3">
                    <span className="text-sm text-gray-700 font-medium">
                      ????lem Tipi
                    </span>
                  </div>
                  <div className="lg:col-span-3">
                    <span className="text-sm text-gray-700 font-medium">
                      A????klama
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
                    <span className="p-sm-gray-700 lg:hidden mr-2">????lem Tipi:</span>
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
