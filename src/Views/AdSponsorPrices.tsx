import { FunctionComponent, useContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { Button } from "../Components/Button";

import { ChevronRightIcon, EditIcon, PlusIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService";
import { autonNumericOptions, formatter, fraction } from "../Services/Functions";
import ReactNumeric from 'react-numeric';
import { AdvertisementSponsorPriceListInnerModel } from "../Models";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Dropdown } from "../Components/Dropdown";

export const AdSponsorPrices: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const history = useHistory();

  const [showAddNewPriceModal, setShowAddNewPriceModal] = useState<boolean>(false);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const adTypes = [
    { key: "5", value: "Başlıkta Öne Çıkart (Header Sponsored)" },
    { key: "4", value: "Kategoride Öne Çıkart (Satıcı)" },
    { key: "2", value: "Kategoride Öne Çıkart (Profesyonel)" }
  ]

  const [selectedAdType, setSelectedAdType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  const [dayCount, setDayCount] = useState<number>(0);

  const [adPrice, setAdPrice] = useState<number>(0);

  const [selectedId, setSelectedId] = useState<number>(0);

  const [priceList, setPriceList] = useState<AdvertisementSponsorPriceListInnerModel[]>([]);

  const [processLoading, setProcessLoading] = useState<boolean>(false);


  const getAdSponsorPriceList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAdSponsorPriceList(page, take, searchText, order);

    if (_result.succeeded === true) {
      setPriceList(_result.data.Data)
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

  const clearData = () => {

    setSelectedAdType({ key: "0", value: "Seçiniz" });
    setDayCount(0);
    setAdPrice(0);
    setSelectedId(0);
    setCurrentOpenedFilterButton("");
  }


  const handleModal = (e) => {
    let type = adTypes.find(i => i.value === e.Type) ?? { key: "0", value: "Seçiniz" }
    setSelectedAdType(type);
    setDayCount(e.DayCount);
    setAdPrice(e.Price);
    setSelectedId(e.AdvertisementPriceId);
    setShowAddNewPriceModal(true);
  }

  const createPrice = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createAdSponsorPrice(Number(selectedAdType.key), dayCount, String(adPrice));

    setShowAddNewPriceModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İçerik Eklendi",
        onClose: () => {
          context.hideModal();
          tableEl.current?.reload();
          clearData();
          setProcessLoading(false);
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }

  }

  const updateSponsorPrice = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSponsorPrice(selectedId, Number(selectedAdType.key), dayCount, String(adPrice));

    setShowAddNewPriceModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İçerik Güncellendi",
        onClose: () => {
          context.hideModal();
          tableEl.current?.reload();
          clearData();
          setProcessLoading(false);
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }

  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Reklam Sponsorluk Ücretleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"Fiyat Bulunamadı"}
          getDataFunction={getAdSponsorPriceList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni İçerik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setShowAddNewPriceModal(true); clearData(); }} />}
          header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-3 flex items-center">
              <span className="p-sm-gray-400">
                Reklam Türü
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Reklam Süresi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Reklam Ücreti
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Türü:</span>
                <p className="p-sm">
                  {e.Type === "" ? "-" : e.Type}
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Süresi:</span>
                <p className="p-sm">
                  {e.DayCount === "" ? "-" : e.DayCount}
                </p>
              </div>


              <div className="lg:col-span-1 flex justify-between items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Ücreti:</span>
                <div className="flex items-center justify-between w-full ">
                  <p className="text-sm text-black-400 font-medium">
                    {e.Price % 1 === 0 ?
                      <>{fraction.format(e.Price)} TL </>
                      :
                      <>{formatter.format(e.Price)} TL</>
                    }
                  </p>
                  <EditIcon className="icon-md text-gray-700 hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleModal(e) }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showAddNewPriceModal}
        onClose={() => { setShowAddNewPriceModal(false); clearData(); }}
        title="Listeden Profesyonel Ekleme"
        body=
        {
          <>
            <Label title="Reklam Türü" isRequired withoutDots />
            <Dropdown
              isDropDownOpen={currentOpenedFilterButton === "brandSelect"}
              onClick={() => { setCurrentOpenedFilterButton("brandSelect"); }}
              label={selectedAdType.value}
              items={adTypes}
              onItemSelected={item => { setSelectedAdType(item); }} />
            <Label title="Reklam Süresi" isRequired withoutDots className="mt-4" />
            <input className="form-input" type="number" min="0" value={dayCount} onChange={(e) => { setDayCount(Number(e.target.value)); }} />
            <Label title="Reklam Ücreti" isRequired withoutDots className="mt-4" />
            <ReactNumeric
              value={adPrice}
              preDefined={autonNumericOptions.TL}
              onChange={(e, value: number) => { setAdPrice(value) }}
              className={"form-input"}
            />
          </>
        }
        footer={
          <Button text="Kaydet" design="button-blue-400 w-full mt-4" onClick={() => {
            selectedId > 0 ? updateSponsorPrice() : createPrice();
          }} />
        }
      />
    </div>
  )
}
