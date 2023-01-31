import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { Button } from "../../Components/Button";
import { DatePicker } from "../../Components/DatePicker";
import { DateView } from "../../Components/DateView";
import { CloseIcon, DownloadIcon, FilterIcon, PlusIcon } from "../../Components/Icons";
import { Label } from "../../Components/Label";
import { Modal } from "../../Components/Modal";
import { Table } from "../../Components/Table"
import { WaitingInvoiceSellerPaymentsInnerModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { returnPaymentType } from "../../Services/Functions";
import { Dropzone } from "../../Components/Dropzone";
import { SERVICES } from "../../Services/Constants";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { NumberView } from "../../Components/NumberView";
import { SearchBar } from "../../Components/SearchBar";
import { Dropdown } from "../../Components/Dropdown";

export const SellerWaitingInvoicePaymentActionList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];


  const filterOptions = [ // HEPSİ = 0, REKLAM = 1, WAITINGRECEIPt = 2, RECEIPWAITINGBILL = 3
    { key: "0", value: "Tümü" },
    { key: "2", value: "Ekstreye Eklenecekler" },
    { key: "3", value: "Fatura Bekleyenler" }
  ];

  const [selectedFilterOption, setSelectedFilterOption] = useState<{ key: string, value: string }>({ key: "0", value: "Tümü" })

  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);

  const [invoiceUrl, setInvoiceUrl] = useState<string>("");

  const [searchText, setSearchText] = useState<string>("");

  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState<boolean>(false);

  const [invoiceNo, setInvoiceNo] = useState<string>("");

  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());

  const [selectedPaymentId, setSelectedPaymentId] = useState<number>(0);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const history = useHistory();

  const getSellerWaitingInvoicePaymentActionList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerWaitingInvoicePaymentActionList(page, take, searchText, order, parseInt(selectedFilterOption.key || "0"));

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

  const addFile = (e) => {
    setInvoiceUrl(e[0].FileUrl);

  }

  const handleShowInvoiceModal = (e) => {
    setSelectedPaymentId(e.PaymentId);
    setShowAddInvoiceModal(true);
  }

  const clearInput = () => {
    setSelectedPaymentId(0);
    setInvoiceDate(new Date());
    setInvoiceNo("");
    setInvoiceUrl("");
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

  const showCancelModal = (item) => {
    context.showModal({
      type: "Question",
      title: "İşlemi İptal Et",
      message: `${item.UserOrderId} sipariş numaralı işlemi iptal etmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.cancelPaymentAction(item.PaymentId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İşlem İptal Edildi",
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

  const getDescription = (e: WaitingInvoiceSellerPaymentsInnerModel) => {
    if (e.AdvertisementIds) {
      return `${e.AdvertisementIds} numaralı reklamlar için fatura`
    }

    if (e.ReceiptId) {
      return `#${e.ReceiptId} numaralı ekstre için ${returnPaymentType(e.PaymentType)} faturası`
    }

    if (e.UserOrderId) {
      return `#${e.UserOrderId} numaralı sipariş için ${returnPaymentType(e.PaymentType)}`
    }

    return `-`

  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Faturalandırılması Gereken Satıcı İşlemleri
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"İşlem Bulunamadı"}
          getDataFunction={getSellerWaitingInvoicePaymentActionList}
          isCustomFilter={true}
          noSearchBar={true}
          customFilter={
            // TODO : @burcu Tasarım düzeltilmeli
            <div className="lg:grid-cols-2 grid">
              <div className="lg:col-span-1">
                <SearchBar
                  iconColor="text-gray-400"
                  className="w-full mb-2 lg:mb-0"
                  isSmall
                  placeholder="Listede Ara..."
                  notButton
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value) }} />
              </div>
              <div className="lg:col-span-1">
                <Dropdown
                  isDropDownOpen={showFilterDropdown}
                  onClick={() => { setShowFilterDropdown(!showFilterDropdown); }}
                  className="lg:w-52 ml-2 text-gray-700 mb-2 lg:mb-0"
                  classNameDropdown="ml-2"
                  label={selectedFilterOption.value}
                  icon
                  iconComponent={<FilterIcon className="icon-sm" />}
                  items={filterOptions}
                  onItemSelected={item => { setSelectedFilterOption(item); }} />
              </div>
            </div>
          }
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72 mr-3 px-3 my-3" design="button-blue-100" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} text="Yeni Fatura Oluştur" onClick={() => history.push('/satici-yeni-fatura-olustur')} />
          }
          header={<div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Fatura Tipi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Satıcı Bilgisi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İşlem Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Tutar
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                KDV Tutarı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Açıklama
              </span>
            </div>
            <div className="lg:col-span-2 text-center">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e: WaitingInvoiceSellerPaymentsInnerModel, i) => {
            return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-1 flex lg:block items-center">
                <p className="p-sm">{returnPaymentType(e.PaymentType)}</p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Satıcı Bilgisi:</span>
                <Link to={`/satici-detay/${e.SellerId}`} className="underline text-blue-400 font-medium text-sm">{e.SellerStoreName}</Link>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlem Tarihi:</span>
                {e.PaymentDateJSTime > 0 ?
                  <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.PaymentDateJSTime} pattern="dd.MM.yyyy HH:mm" />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Tutar:</span>
                <p className="p-sm">
                  <NumberView price={e.PriceWithoutTax} suffix={"TL"} />
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">KDV Tutarı:</span>
                <p className="p-sm">
                  <NumberView price={e.TotalPrice - e.PriceWithoutTax} suffix={"TL"} />
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                <p className="p-sm">
                  <NumberView price={e.TotalPrice} suffix={"TL"} />
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <p className="p-sm">
                  {getDescription(e)}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2 text-center">İşlemler:</span>
                <div className="flex items-center divide-x text-sm gap-x-3">
                  {(e.MustAddReceipt === true) ?
                    <Link to={`/satici-ekstre-odeme-kayitlari/${e.SellerId}`} className="underline text-green-400 font-medium text-sm">
                      <div className="flex items-center text-green-400 font-medium cursor-pointer">
                        <PlusIcon className="icon-sm mr-2" />
                        Ekstre Oluştur
                      </div>
                    </Link>
                    :
                    <div className="flex items-center text-blue-400 font-medium cursor-pointer" onClick={() => handleShowInvoiceModal(e)}>
                      <DownloadIcon className="icon-sm mr-2" />
                      Fatura Yükle
                    </div>
                  }
                  {(e.AdvertisementIds || e.ReceiptId || e.UserOrderId) ? <></> :
                    <div className="flex items-center text-gray-700 font-medium pl-2 cursor-pointer hover:text-red-400 transition-all duration-300" onClick={() => showCancelModal(e)}>
                      <CloseIcon className="icon-sm mr-2" />
                      İşlemi İptal Et
                    </div>}

                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div >
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
    </div >
  )
}
