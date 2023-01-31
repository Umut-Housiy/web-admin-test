import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
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
import { Loading } from "../Components/Loading";
import { Dropdown } from "../Components/Dropdown";

export const SellerShippingPriceList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const [showCreateSellerShippingPriceModal, setShowCreateSellerShippingPriceModal] = useState<boolean>(false);

  const [selectedContentId, setSelectedContentId] = useState<number>(0);

  const [minDesi, setMinDesi] = useState<number>(0);

  const [maxDesi, setMaxDesi] = useState<number>(0);

  const [shippingPrice, setShippingPrice] = useState<number>(0);

  const [isFreeShipping, setIsFreeShipping] = useState<boolean>(false);

  const [addingLoading, setAddingLoading] = useState<boolean>(false);

  const [warningTextForAdding, setWarningTextForAdding] = useState<boolean>(false);

  const [cargoCampaniesLoading, setCargoCampaniesLoading] = useState<boolean>(false);

  const [cargoCompaniesList, setCargoCompaniesList] = useState<{ key: string, value: string }[]>([]);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedCargoCompany, setSelectedCargoCompany] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const getSellerShippingPriceList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerShippingPriceList(page, take, searchText, order);

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

  useEffect(() => {
    getCargoCompaniesList();
  }, [])

  const getCargoCompaniesList = async () => {
    setCargoCampaniesLoading(true);

    const _result = await ApiService.getCargoCompaniesList(1, 9999, "", 1);

    if (_result.succeeded === true) {
      let _tempObject: { key: string, value: string }[] = [];

      _result.data.Data.map((item) => {
        _tempObject.push({
          key: String(item.Id),
          value: item.Name
        })
      });
      setCargoCompaniesList(_tempObject);
      setCargoCampaniesLoading(false);

    }
    else {
      setCargoCompaniesList([]);
      setCargoCampaniesLoading(false);
    }
  }

  const addSellerShippingPrice = async () => {
    setAddingLoading(true);

    const _result = await ApiService.addSellerShippingPrice(Number(selectedCargoCompany.key), String(minDesi), String(maxDesi), String(shippingPrice), isFreeShipping);

    setShowCreateSellerShippingPriceModal(false);

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
    setMinDesi(item.MinDesi);
    setMaxDesi(item.MaxDesi);
    setShippingPrice(item.CargoPrice);
    setSelectedCargoCompany(cargoCompaniesList.find(i => i.key === String(item.CargoCompanyId)) ?? { key: "0", value: "Seçiniz..." })
    setIsFreeShipping(item.IsFreeShipping);
    setShowCreateSellerShippingPriceModal(true);
    setCurrentOpenedFilterButton("");
  }

  const clearInput = () => {
    setSelectedContentId(0);
    setMinDesi(0);
    setMaxDesi(0);
    setSelectedCargoCompany({ key: "0", value: "Seçiniz..." });
    setShippingPrice(0);
    setIsFreeShipping(false);
    setWarningTextForAdding(false);
    setCurrentOpenedFilterButton("");
  }

  const updateSellerShippingPrice = async () => {
    setAddingLoading(true);

    const _result = await ApiService.updateSellerShippingPrice(selectedContentId, Number(selectedCargoCompany.key), String(minDesi), String(maxDesi), String(shippingPrice), isFreeShipping);

    setShowCreateSellerShippingPriceModal(false);

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
      message: "Kargo fiyatlandırması silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.removeSellerShippingPrice(item.Id);

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
        <h2 className="border-b pb-5">Mağaza Kargo Fiyatlandırması</h2>
        <Table
          ref={tableEl}
          emptyListText={"İçerik Bulunamadı"}
          getDataFunction={getSellerShippingPriceList}
          noSearchBar
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni İçerik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setShowCreateSellerShippingPriceModal(true); clearInput(); }} />}
          header={<div className=" lg:grid-cols-4 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kargo Şirketi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Desi Aralığı
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
                <span className="p-sm-gray-700 lg:hidden mr-2">Kargo Şirketi:</span>
                <p className="p-sm">
                  {e.CargoCompanyName}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Max. Sepet Tutarı:</span>
                <p className="p-sm">
                  {e.MinDesi} - {e.MaxDesi}
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
          showModal={showCreateSellerShippingPriceModal}
          onClose={() => { setShowCreateSellerShippingPriceModal(false); clearInput(); }}
          title={`${selectedContentId > 0 ? "Kargo İşlemi Düzenle" : "Kargo İşlemi Ekle"}`}
          body={
            <>
              <div>
                <Label isRequired title="Kargo Şirketi" withoutDots />

                {cargoCampaniesLoading ? <Loading inputSm />
                  :
                  <Dropdown
                    isDropDownOpen={currentOpenedFilterButton === "categorySelect"}
                    onClick={() => { setCurrentOpenedFilterButton("categorySelect"); }}
                    className="w-full  text-sm "
                    label={selectedCargoCompany.value}
                    items={cargoCompaniesList}
                    onItemSelected={item => { setSelectedCargoCompany(item); setWarningTextForAdding(false); }} />
                }
                <Label isRequired title="Desi Aralığı" withoutDots className="mt-4" />
                <div className="grid lg:grid-cols-2 gap-x-3">
                  <div className="lg:col-span-1">
                    <input className="form-input" placeholder="Min. Desi" type="number" value={minDesi} onChange={(e) => { setMinDesi(parseInt(e.target.value)); setWarningTextForAdding(false); }} />
                  </div>
                  <div className="lg:col-span-1">
                    <input className="form-input" placeholder="Max. Desi" type="number" value={maxDesi} onChange={(e) => { setMaxDesi(parseInt(e.target.value)); setWarningTextForAdding(false); }} />
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
              if (minDesi === 0 || maxDesi === 0 || (!isFreeShipping && shippingPrice === 0) || selectedCargoCompany.key === "0") {
                setWarningTextForAdding(true);
              }
              else if (selectedContentId > 0) {
                updateSellerShippingPrice()
              }
              else {
                addSellerShippingPrice()
              }
            }} />
          }
        />
      </div>
    </div>

  )
}
