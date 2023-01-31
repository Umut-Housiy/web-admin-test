import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import { Button } from "../../Components/Button";
import { DatePicker } from "../../Components/DatePicker";
import { DateView } from "../../Components/DateView";
import { ChevronRightIcon } from "../../Components/Icons"
import { Label } from "../../Components/Label";
import { Modal } from "../../Components/Modal";
import { Table } from "../../Components/Table";
import { useStateEffect } from "../../Components/UseStateEffect";
import { fraction, ProPaymentsWithoutRecipteInnerModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { formatter, returnPaymentType } from "../../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";

interface RouteParams {
  id: string,
}

export const ProReceiptPaymentRecordList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const params = useParams<RouteParams>();

  const history = useHistory();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];

  const [allItems, setAllItems] = useState<ProPaymentsWithoutRecipteInnerModel[]>([]);

  const [sumPrice, setSumPrice] = useState<number>(0);

  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  const [plannedDate, setPlannedDate] = useState<Date>(new Date());

  const [selectedPaymentIdList, setSelectedPaymentIdList] = useState<number[]>([]);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [minDate, setMinDate] = useState<Date>(new Date());

  useEffect(() => {
    setMinDateFunc();
  }, []);

  const getProPaymentActionsWithoutReceipt = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProPaymentActionsWithoutReceipt(Number(params.id), page, take, searchText, order);

    if (_result.succeeded === true) {
      setAllItems(_result.data.Data);
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

  const [selectedPaymentList, setSelectedPaymentList] = useState<{ PaymentId: number, PaymentType: number, TotalPrice: number }[]>([]);

  const addListOrRemoveFromList = (payment) => {
    if (selectedPaymentList.filter(i => i.PaymentId === payment.PaymentId).length > 0) {
      let currentArray = selectedPaymentList.filter(i => i.PaymentId !== payment.PaymentId);
      setSelectedPaymentList(currentArray)
    }
    else {
      let tempItem: { PaymentId: number, PaymentType: number, TotalPrice: number } = { PaymentId: payment.PaymentId, PaymentType: payment.PaymentType, TotalPrice: payment.TotalPrice }
      setSelectedPaymentList([...selectedPaymentList, tempItem]);
    }
  }

  const checkAllItems = () => {
    setSelectedPaymentList([]);
    if (selectedPaymentList.length === 0) {
      let tempArray: { PaymentId: number, PaymentType: number, TotalPrice: number }[] = [];

      for (let i = 0; i < allItems.length; i++) {
        tempArray.push(
          { PaymentId: allItems[i].PaymentId, PaymentType: allItems[i].PaymentType, TotalPrice: allItems[i].TotalPrice }
        )
      }
      setSelectedPaymentList([...tempArray])
    }
    else {
      setSelectedPaymentList([]);
    }
  }

  useStateEffect(() => {
    calculateSumPrice();
  }, [selectedPaymentList]);

  useStateEffect(() => {
    let tempSelectedIdList: number[] = [];
    selectedPaymentList.map((item) => {
      tempSelectedIdList.push(item.PaymentId)
    });
    setSelectedPaymentIdList(tempSelectedIdList);

  }, [selectedPaymentList])

  const calculateSumPrice = () => {
    let sumPrice: number = 0;
    selectedPaymentList.map((item) => (
      item.PaymentType > 100 ? sumPrice -= item.TotalPrice : sumPrice += item.TotalPrice
    ))
    setSumPrice(sumPrice);
  }

  const createProReceipt = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createProReceipt(Number(params.id), selectedPaymentIdList, plannedDate.getTime());

    setShowReceiptModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ekstre Oluşturuldu",
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
          if (tableEl.current) {
            tableEl.current?.reload();
          }
          history.push("/pro-ekstre-olustur")
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

  const setMinDateFunc = async () => {
    const now = new Date();

    const newDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    setMinDate(newDate);
    setPlannedDate(newDate);
  }


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to="/pro-ekstre-olustur" className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Ekstre Oluştur
          </div>
        </Link>
        <h2 className="mb-4">Profesyonel İşlem Detayı</h2>
        {selectedPaymentList.length > 0 &&
          <div className="py-3 mb-4 px-3 border rounded-lg bg-gray-100 flex items-center justify-between">
            <h5>Toplam Hakediş: <span className="ml-2 inline-block">
              {sumPrice % 1 === 0 ?
                <>{fraction.format(sumPrice)} TL </>
                :
                <>{formatter.format(sumPrice)} TL</>
              }
            </span> </h5>
            <div className="flex items-center gap-x-2">
              <Button buttonSm design="button-gray-100 w-32" text="Vazgeç" onClick={() => setSelectedPaymentList([])} />
              <Button buttonSm design="button-blue-400 w-32" text="Ekstre Oluştur" onClick={() => setShowReceiptModal(true)} />
            </div>
          </div>
        }
        <Table
          ref={tableEl}
          emptyListText={"İşlem Bulunamadı"}
          getDataFunction={getProPaymentActionsWithoutReceipt}
          header={<div className="lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                <input type="checkbox"
                  className="form-checkbox text-blue-400 border border-gray-400 cursor-pointer mr-2"
                  onChange={(e) => { }}
                  onClick={() => checkAllItems()}
                  checked={allItems.length === selectedPaymentList.length ? true : false}
                />
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
                Hizmet No
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Fatura No
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Fatura Tipi
              </span>
            </div>
            <div className="lg:col-span-1 ">
              <span className="p-sm-gray-400">
                Fatura Tarihi
              </span>
            </div>
            <div className="lg:col-span-1 ">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className={`${selectedPaymentList.find(i => i.PaymentId === e.PaymentId) ? "bg-blue-100" : ""} lg:grid-cols-8 px-2 border-b lg:h-20 mb-0.5 border-gray-200 grid gap-4 items-center py-3 lg:py-0`}>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlem Tipi:</span>
                <div className="flex items-center p-sm">
                  <input type="checkbox"
                    className="form-checkbox text-blue-400 border border-gray-400 cursor-pointer mr-2"
                    onChange={(e) => { }}
                    onClick={() => addListOrRemoveFromList(e)}
                    checked={selectedPaymentList.find(i => i.PaymentId === e.PaymentId) ? true : false}
                  />
                  {e.PaymentType > 100 ?
                    "Fatura"
                    :
                    returnPaymentType(e.PaymentType)
                  }
                </div>

              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlem Tarihi:</span>
                {e.CreatedDateJSTime > 0 ?
                  <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.CreatedDateJSTime} pattern="dd/MM/yyyy HH:mm" />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Hizmet No:</span>
                <Link className="text-sm text-gray-700 font-medium underline" to={{ pathname: `/hizmet-detay/${e.WorkId}`, state: { prevTitle: "Faturalandırılması Gereken Profesyonel İşlemleri", prevPath: window.location.pathname, tabId: 1 } }}>
                  #{e.WorkId}
                </Link>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2 underline">Fatura No:</span>
                <p className="p-sm">
                  {e.PaymentType > 100 ?
                    e.InvoiceNo
                    :
                    "-"
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Fatura Tipi:</span>
                <p className="p-sm">
                  {e.PaymentType > 100 ?
                    returnPaymentType(e.PaymentType)
                    :
                    "-"
                  }
                </p>

              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Fatura Tarihi:</span>
                {(e.PaymentType > 100 && e.InvoiceDateJSTime > 0) ?
                  <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.InvoiceDateJSTime} pattern="dd/MM/yyyy" />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                <p className={e.PaymentType > 100 ? "text-red-400 text-sm font-medium" : "text-black-400 text-sm font-medium"}>
                  {e.PaymentType > 100 ? "-" : "+"}
                  {e.TotalPrice % 1 === 0 ?
                    <>{fraction.format(e.TotalPrice)} TL </>
                    :
                    <>{formatter.format(e.TotalPrice)} TL</>
                  }
                </p>
              </div>

            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>

      <Modal
        modalType="fixedSm"
        showModal={showReceiptModal}
        onClose={() => { setShowReceiptModal(false); }}
        title="Yeni Ödeme Emri"
        body={
          <div>
            <Label isRequired withoutDots title="Planlanan Ödeme Tarihi" className="mt-4" />
            <DatePicker
              isFull
              value={plannedDate}
              minDate={minDate}
              setSelectedDate={(e) => { setPlannedDate(e) }}
            />
            <Label isRequired withoutDots title="Toplam Hakediş" className="mt-4" />
            <div className="form-input bg-gray-100">
              {sumPrice % 1 === 0 ?
                <>{fraction.format(sumPrice)} TL </>
                :
                <>{formatter.format(sumPrice)} TL</>
              }
            </div>
            {/* //TODO: Finans - Ekstre No Neye Göre Basılcak ? */}
          </div>
        }
        footer={
          <>
            <Button isLoading={processLoading} text="Ekstre Oluştur" design="button-blue-400 w-full mt-4" onClick={() => createProReceipt()} />
          </>
        }
      />

    </div >

  )
}
