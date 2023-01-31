import { FunctionComponent, useContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { ChevronRightIcon, EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService";
import { autonNumericOptions, formatter, fraction } from "../Services/Functions";
import ReactNumeric from 'react-numeric';
import { ToggleButton } from "../Components/ToggleButton";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const CustomerShippingPriceList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const [showCreateCustomerShippingPriceModal, setShowCreateCustomerShippingPriceModal] = useState<boolean>(false);

  const [selectedContentId, setSelectedContentId] = useState<number>(0);

  const [minPrice, setMinPrice] = useState<number>(0);

  const [maxPrice, setMaxPrice] = useState<number>(0);

  const [shippingPrice, setShippingPrice] = useState<number>(0);

  const [isFreeShipping, setIsFreeShipping] = useState<boolean>(false);

  const [addingLoading, setAddingLoading] = useState<boolean>(false);

  const [warningTextForAdding, setWarningTextForAdding] = useState<boolean>(false);

  const getCustomerShippingPriceList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getCustomerShippingPriceList(page, take, order);

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

  const addCustomerShippingPrice = async () => {
    setAddingLoading(true);

    const _result = await ApiService.addCustomerShippingPrice(String(minPrice), String(maxPrice), String(shippingPrice), isFreeShipping);

    setShowCreateCustomerShippingPriceModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İçerik başarıyla eklendi.",
        onClose: () => {
          context.hideModal();
          tableEl.current?.reload();
          setAddingLoading(false);
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setAddingLoading(false);
        }
      });
    }
  }

  const showModalForUpdate = (item) => {
    setSelectedContentId(item.Id);
    setMinPrice(item.MinPrice);
    setMaxPrice(item.MinPrice);
    setShippingPrice(item.CargoPrice);
    setIsFreeShipping(item.IsFreeShipping);
    setShowCreateCustomerShippingPriceModal(true);
  }

  const clearInput = () => {
    setSelectedContentId(0);
    setMinPrice(0);
    setMaxPrice(0);
    setShippingPrice(0);
    setIsFreeShipping(false);
    setWarningTextForAdding(false);
  }

  const updateCustomerShippingPrice = async () => {
    setAddingLoading(true);

    const _result = await ApiService.updateCustomerShippingPrice(selectedContentId, String(minPrice), String(maxPrice), String(shippingPrice), isFreeShipping);

    setShowCreateCustomerShippingPriceModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İçerik başarıyla güncellendi.",
        onClose: () => {
          context.hideModal();
          tableEl.current?.reload();
          setAddingLoading(false);
          clearInput();
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setAddingLoading(false); clearInput();
        }
      });
    }
  }

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "İçerik Sil",
      message: "Kargo fiyatlandırma silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.removeCustomerShippingPrice(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İçerik silindi.",
            onClose: () => { context.hideModal(); tableEl.current?.reload(); }
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
        <h2 className="border-b pb-5">Müşteri Kargo Fiyatlandırması</h2>
        <Table
          ref={tableEl}
          emptyListText={"İçerik Bulunamadı"}
          getDataFunction={getCustomerShippingPriceList}
          noSearchBar
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni İçerik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setShowCreateCustomerShippingPriceModal(true); clearInput(); }} />}
          header={<div className=" lg:grid-cols-4 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Min. Sepet Tutarı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Max. Sepet Tutarı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kargo Bedeli
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ücretsiz Kargo
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-4 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Min. Sepet Tutarı:</span>
                <p className="p-sm">
                  {e.MinPrice % 1 === 0 ?
                    <>{fraction.format(e.MinPrice)} TL </>
                    :
                    <>{formatter.format(e.MinPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Max. Sepet Tutarı:</span>
                <p className="p-sm">
                  {e.MaxPrice % 1 === 0 ?
                    <>{fraction.format(e.MaxPrice)} TL </>
                    :
                    <>{formatter.format(e.MaxPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kargo Bedeli:</span>
                <p className="p-sm">
                  {e.IsFreeShipping === false ?
                    e.CargoPrice % 1 === 0 ?
                      <>{fraction.format(e.CargoPrice)} TL </>
                      :
                      <>{formatter.format(e.CargoPrice)} TL</>
                    :
                    "-"
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ücretsiz Kargo:</span>
                <div className="flex items-center justify-between">
                  <p className={`${e.IsFreeShipping === true ? "text-blue-400" : "text-gray-900"} font-medium text-sm`}>
                    {e.IsFreeShipping === true ? "Aktif" : "-"}
                  </p>
                  <div className="flex items-center text-gray-700">
                    <EditIcon className="icon-sm cursor-pointer mr-2" onClick={() => showModalForUpdate(e)} />
                    <TrashIcon className="icon-sm cursor-pointer" onClick={() => showDeleteModal(e)} />
                  </div>
                </div>

              </div>
            </div>
          }}
        />

        <Modal
          modalType="fixedSm"
          showModal={showCreateCustomerShippingPriceModal}
          onClose={() => { setShowCreateCustomerShippingPriceModal(false); clearInput(); }}
          title={`${selectedContentId > 0 ? "Kargo İşlemi Düzenle" : "Kargo İşlemi Ekle"}`}
          body={
            <>
              <div>
                <div className="grid lg:grid-cols-2 gap-x-3">
                  <div className="lg:col-span-1">
                    <Label isRequired title="Min. Sepet Tutarı" withoutDots />
                    <ReactNumeric
                      value={minPrice}
                      preDefined={autonNumericOptions.TL}
                      onChange={(e, value: number) => { setMinPrice(value); setWarningTextForAdding(false); }}
                      className="form-input"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <Label isRequired title="Max. Sepet Tutarı" withoutDots />
                    <ReactNumeric
                      value={maxPrice}
                      preDefined={autonNumericOptions.TL}
                      onChange={(e, value: number) => { setMaxPrice(value); setWarningTextForAdding(false); }}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between my-6">
                  <span className="p-sm font-medium text-gray-700">Ücretsiz kargo uygula</span>
                  <ToggleButton onClick={() => { setIsFreeShipping(!isFreeShipping); }} defaultValue={isFreeShipping} />
                </div>
                <Label isRequired title="Kargo Bedeli" withoutDots />
                <ReactNumeric
                  value={shippingPrice}
                  preDefined={autonNumericOptions.TL}
                  onChange={(e, value: number) => { setShippingPrice(value); setWarningTextForAdding(false); }}
                  className="form-input"
                />
                {warningTextForAdding === true &&
                  <div className="font-medium mt-3 text-sm py-1 px-2 bg-red-100 text-red-400">*Lütfen eksik bilgileri doldurun</div>
                }
              </div>
            </>
          }
          footer={
            <Button isLoading={addingLoading} text={selectedContentId > 0 ? "Düzenle" : "Kaydet"} design="button-blue-400 w-full" onClick={() => {
              if (minPrice === 0 || maxPrice === 0 || (!isFreeShipping && shippingPrice === 0)) {
                setWarningTextForAdding(true);
              }
              else if (selectedContentId > 0) {
                updateCustomerShippingPrice()
              }
              else {
                addCustomerShippingPrice()
              }
            }} />
          }
        />
      </div>
    </div>

  )
}
