import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { CheckIcon, MagnifyGlassIcon, PlusIcon, StarIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label"
import { Loading } from "../Components/Loading";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import { useStateEffect } from "../Components/UseStateEffect";
import { BadgeModel, ProModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";


export const ProBadgeAssign: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [badgeList, setBadgeList] = useState<BadgeModel[]>([]);

  const [badgeOptions, setBadgeOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedBadgeOption, setSelectedBadgeOption] = useState<{ key: string, value: string }>({ key: "0", value: "Rozet seçiniz..." })

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);

  const [selectedProList, setSelectedProList] = useState<ProModel[]>([]);

  const [tempselectedProList, setTempSelectedProList] = useState<ProModel[]>([]);

  const [proIdListToApi, setProIdListToApi] = useState<number[]>([]);

  const [proTotalCount, setProTotalCount] = useState<number>(0);

  const [badgeProCount, setBadgeProCount] = useState<number>(0);

  const tableEl = useRef<any>();

  useEffect(() => {
    getBadgeList();
  }, []);

  useStateEffect(() => {
    setCurrentOpenedFilterButton("");
    setTempSelectedProList(JSON.parse(JSON.stringify([])));
    setBadgeProCount(badgeList.find(x => x.Id === Number(selectedBadgeOption.key))?.ProCount ?? 0);
  }, [selectedBadgeOption]);

  useStateEffect(() => {
    assignBadgeToPro();
  }, [proIdListToApi]);


  const getBadgeList = async () => {
    setLoading(true);

    const _result = await ApiService.getBadgeList(1, 9999, "", 1);

    if (_result.succeeded === true) {
      setBadgeList(_result.data.Data);
      let _tempList: { key: string, value: string }[] = [];
      _result.data.Data.forEach((item) => {
        let _tempItem = { key: String(item.Id), value: item.Name };
        _tempList.push(_tempItem);
      });
      setBadgeOptions(JSON.parse(JSON.stringify(_tempList)));
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const getProList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProList(page, take, order, searchText);

    if (_result.succeeded === true) {
      setProTotalCount(_result.data.TotalCount);
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      setShowQuestionModal(false);
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

  const assignBadgeToPro = async () => {
    setProcessLoading(true);

    const _result = await ApiService.assignBadgeToPro(Number(selectedBadgeOption.key), proIdListToApi);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      setSelectedProList(JSON.parse(JSON.stringify([])));
      context.showModal({
        type: "Success",
        title: "Rozet seçili profesyonellere atandı.",
        onClose: () => { context.hideModal(); }
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

  const handleAddTempProSelectList = (item) => {
    let _tempList = tempselectedProList;
    if (_tempList.find(x => x.Id === item) === undefined) {
      _tempList.push(item);
    }
    setTempSelectedProList(JSON.parse(JSON.stringify(_tempList)));
  }

  const handleRemoveTempProSelectlist = (item) => {
    let _tempList = tempselectedProList.filter(x => x.Id !== item.Id);;
    setTempSelectedProList(JSON.parse(JSON.stringify(_tempList)));
  }

  const handleAddSelectedProList = () => {
    const _tempList: ProModel[] = [];
    tempselectedProList.forEach((item) => {
      _tempList.push(item);
    });
    setSelectedProList([...selectedProList, ..._tempList]);
    setTempSelectedProList(JSON.parse(JSON.stringify([])));
    setShowQuestionModal(false);
  }

  const handleRemoveSelectedProList = (item) => {
    const _tempSelectedList = selectedProList.filter(i => i.Id !== item.Id);
    setSelectedProList(JSON.parse(JSON.stringify(_tempSelectedList)));
  }

  const handleAssignProcess = () => {
    if (selectedBadgeOption.key === "0") {
      context.showModal({
        type: "Error",
        message: "Lütfen atanacak rozeti seçiniz.",
        onClose: () => { context.hideModal(); }
      });
    }
    else {
      prepareProIdList();
    }
  }

  const prepareProIdList = () => {
    let _tempList: number[] = [];
    selectedProList.forEach((item) => {
      _tempList.push(item.Id);
    });
    setProIdListToApi(_tempList);
  }



  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Rozet Ata</h2>
        <div className="border-t border-b border-gray-200 pb-5">
          <div className="w-1/2">
            <Label className="mt-4" title="Atanacak Rozet" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "badge"}
                  onClick={() => { setCurrentOpenedFilterButton("badge"); }}
                  className="w-full  text-gray-700 my-2"
                  classNameDropdown=""
                  label={selectedBadgeOption.value}
                  icon
                  items={badgeOptions}
                  onItemSelected={item => { setSelectedBadgeOption(item) }} />
            }
          </div>
        </div>
        <h3 className="mt-5">Rozet Atanacak Profesyoneller</h3>
        <p className="p-sm mt-2">Seçili rozetin atanacağı profesyonelleri seçiniz. Aynı anda birden fazla profesyonele rozet ataması yapabilirsiniz.</p>
        <Button isLoading={processLoading} buttonMd textTiny color="text-blue-400" className="w-52 mt-5 mb-5" design="button-blue-100" text="Profesyonel Seç" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setShowQuestionModal(true); }} />
        <div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Profesyonel Adı
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="p-sm-gray-400">
              Profesyonel Puanı
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="p-sm-gray-400">
              Favoriye Eklenme Sayısı
            </span>
          </div>
          <div className="lg:col-span-2 ">
            <span className="p-sm-gray-400">
              Aktif İş Sayısı
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="p-sm-gray-400">
              Tamamlanan Hizmet Sayısı
            </span>
          </div>
          <div className="lg:col-span-1">
          </div>
        </div>
        {
          selectedProList.length > 0 ?
            selectedProList.map((item, index) => (
              <div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4" key={"tempSelected" + index}>
                <div className="lg:col-span-2 flex items-center">
                  <span className="text-sm text-blue-400 leading-5 font-medium underline">
                    {item.StoreName}
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span>
                    <StarIcon className="h-4 w-4 inline-block mr-2 text-yellow-600" />
                  </span>
                  <span className="text-sm text-yellow-600 leading-5 font-medium text-yellow-600">
                    {item.StoreRate}
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="p-sm">
                    {item.FavoriteCount}
                  </span>
                </div>
                <div className="lg:col-span-2 ">
                  <span className="p-sm">
                    {item.OfferCount}
                  </span>
                </div>
                <div className="lg:col-span-2 ">
                  <span className="p-sm">
                    {item.ServiceCount}
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <div className="text-gray-700 flex gap-2 items-center ">
                    <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all ml-auto" onClick={() => { handleRemoveSelectedProList(item) }} />
                  </div>
                </div>
              </div>
            ))
            :
            <div className="flex-columns">
              <MagnifyGlassIcon className="w-12 h-12 mx-auto my-5 text-blue-400" />
              <div className="text-center text-gray-700 text-sm">Seçili profesyonel yok</div>
            </div>
        }
        {
          selectedProList?.length > 0 &&
          <div className="flex mt-5">
            <Button isLoading={processLoading} textTiny className="w-72 ml-auto" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { handleAssignProcess(); }} />
          </div>
        }
      </div>
      <Modal
        modalType="fixedMd"
        showModal={showQuestionModal}
        onClose={() => { setShowQuestionModal(false); }}
        title="Listeden Profesyonel Ekleme"
        body=
        {
          <div className="">
            <div className="flex">
              <div className="flex ml-auto mt-3 py-3">
                <div className="p-sm-gray-700 w-56 my-auto"   >Profesyonel Seçildi</div>
                <div className="text-sm text-gray-900  mr-2 my-auto">{badgeProCount + selectedProList.length + tempselectedProList.length}/{proTotalCount}</div>
                <Button buttonMd block className="my-auto " design=" button-blue-400 p-2 " text="Seçili Profesyonelleri Ekle" onClick={() => { handleAddSelectedProList(); }} />
              </div>
            </div>
            <Table
              ref={tableEl}
              key={"table1"}
              emptyListText={"Profesyonel Bulunamadı"}
              getDataFunction={getProList}
              header={<div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Profesyonel Adı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Profesyonel Puanı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Favoriye Eklenme Sayısı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Aktif İş Sayısı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Tamamlanan Hizmet Sayısı
                  </span>
                </div>
              </div>}
              renderItem={(e, i) => {
                return <div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4" key={i}>
                  <div className="lg:col-span-1">
                    <span className="p-sm">
                      {e.StoreName}
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-4 h-4 text-yellow-600" />
                      <span className=" text-sm text-yellow-600 ">{e.StoreRate}</span>
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm ">
                      {e.FavoriteCount}
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm ">
                      {e.OfferCount}
                    </span>
                  </div>
                  <div className="lg:col-span-1 flex justify-between ">
                    <span className="p-sm ">
                      {e.ServiceCount}
                    </span>
                    <div className=" flex gap-2 items-center">
                      {
                        (e.BadgeIds?.includes(Number(selectedBadgeOption.key)) || tempselectedProList?.find(x => x.Id === e.Id) !== undefined || selectedProList?.find(x => x.Id === e.Id) !== undefined) ?
                          <Button buttonSm block className="p-6" design="button-blue-400" text="" hasIcon icon={<CheckIcon className="icon-sm" />} onClick={() => { handleRemoveTempProSelectlist(e); }} />
                          :
                          <Button buttonSm block className="p-6" color="text-blue-400" design="button-blue-100" text="Seç" onClick={() => { handleAddTempProSelectList(e); }} />
                      }
                    </div>
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
