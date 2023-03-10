import { FunctionComponent, useContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { Button } from "../../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { formatter, fraction } from "../../Services/Functions";
import { Modal } from "../../Components/Modal";
import { Label } from "../../Components/Label";
import ReactNumeric from 'react-numeric';
import { autonNumericOptions } from "../../Services/Functions";
import { ToggleButton } from "../../Components/ToggleButton";

export const CargoPricesCustomer: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [modalId, setModalId] = useState<number>(0);

  const [minPrice, setMinPrice] = useState<number>(0);

  const [maxPrice, setMaxPrice] = useState<number>(0);

  const [isFreeShipping, setIsFreeShipping] = useState<boolean>(false);

  const [cargoPrice, setCargoPrice] = useState<number>(0);

  const getCustomerCargoPricesList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getCustomerCargoPricesList(page, take, searchText, order);

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

  const createCustomerCargoPrice = async () => {
    setShowEditModal(false);

    const _result = await ApiService.createCustomerCargoPrice(String(minPrice), String(maxPrice), String(cargoPrice), isFreeShipping);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "????erik kaydedildi.",
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
  }

  const updateCustomerCargoPrice = async () => {
    setShowEditModal(false);

    const _result = await ApiService.updateCustomerCargoPrice(modalId, String(minPrice), String(maxPrice), String(cargoPrice), isFreeShipping);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "De??i??iklikler kaydedildi.",
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
  }

  const deleteCustomerCargoPrice = (item) => {
    context.showModal({
      type: "Question",
      title: "????erik Sil",
      message: "????erik silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteCustomerCargoPrice(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "????erik silindi",
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

  const handleOpenCreateModal = () => {
    setModalId(0);
    setMinPrice(0);
    setMaxPrice(0);
    setIsFreeShipping(false);
    setCargoPrice(0);
    setShowEditModal(true);
  }

  const handleOpenEditModal = (item) => {
    setModalId(item.Id);
    setMinPrice(item.MinPrice);
    setMaxPrice(item.MaxPrice);
    setIsFreeShipping(item.IsFreeShipping);
    setCargoPrice(item.CargoPrice);
    setShowEditModal(true);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">M????teri Kargo Fiyatland??rmas??</h2>
        <Table
          ref={tableEl}
          emptyListText={"????erik Bulunamad??"}
          getDataFunction={getCustomerCargoPricesList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-80" design="button-blue-100" text="Yeni ????erik Olu??tur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleOpenCreateModal(); }} />}
          header={<div className=" lg:grid-cols-4 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Min. Sepet Tutar??
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Max. Sepet Tutar??
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kargo Bedeli
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                ??cretsiz Kargo
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-4 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.MinPrice % 1 === 0 ?
                    <>{fraction.format(e.MinPrice)} TL </>
                    :
                    <>{formatter.format(e.MinPrice)} TL</>}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.MaxPrice % 1 === 0 ?
                    <>{fraction.format(e.MaxPrice)} TL </>
                    :
                    <>{formatter.format(e.MaxPrice)} TL</>}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CargoPrice % 1 === 0 ?
                    <>{fraction.format(e.CargoPrice)} TL </>
                    :
                    <>{formatter.format(e.CargoPrice)} TL</>}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                {
                  e.IsFreeShipping ?
                    <p className="text-green-400 font-medium text-sm">
                      Aktif
                    </p>
                    :
                    <p className="p-sm">
                      -
                    </p>
                }
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenEditModal(e); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { deleteCustomerCargoPrice(e); }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showEditModal}
        onClose={() => { setShowEditModal(false); }}
        title={modalId > 0 ? "Kargo ????lemi Detay??" : "Kargo ????lemi Ekle"}
        body={
          <>
            <div className="flex gap-4 items-center">
              <div className="w-1/2">
                <Label title="Min. Sepet Tutar??" withoutDots isRequired />
                <ReactNumeric
                  value={minPrice}
                  preDefined={autonNumericOptions.TL}
                  onChange={(e, value: number) => { setMinPrice(value) }}
                  className={"form-input"}
                />
              </div>
              <div className="w-1/2">
                <Label title="Max. Sepet Tutar??" withoutDots isRequired />
                <ReactNumeric
                  value={maxPrice}
                  preDefined={autonNumericOptions.TL}
                  onChange={(e, value: number) => { setMaxPrice(value) }}
                  className={"form-input"}
                />
              </div>
            </div>
            <div className="my-4 flex items-center justify-between">
              <div className="text-sm text-black-400 font-medium">??cretsiz Kargo uygula</div>
              <ToggleButton onClick={() => { setIsFreeShipping(!isFreeShipping) }} defaultValue={isFreeShipping} />
            </div>
            <Label title="Kargo Bedeli" withoutDots isRequired />
            <ReactNumeric
              value={cargoPrice}
              preDefined={autonNumericOptions.TL}
              onChange={(e, value: number) => { !isFreeShipping && setCargoPrice(value); }}
              className={`form-input ${isFreeShipping ? "bg-gray-100 pointer-events-none" : ""}`}
            />
          </>
        }
        footer={
          modalId > 0 ?
            <Button className="w-full" design="button-blue-400" text="Kaydet" onClick={() => { updateCustomerCargoPrice(); }} />
            :
            <Button className="w-full" design="button-blue-400" text="Kaydet" onClick={() => { createCustomerCargoPrice(); }} />
        }
      />
    </div>
  )
}
