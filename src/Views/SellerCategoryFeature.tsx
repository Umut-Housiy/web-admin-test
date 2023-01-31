import { FunctionComponent, useContext, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { PlusIcon, EditIcon, TrashIcon, ChevronRightIcon, AlertIcon, SubListIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Table } from "../Components/Table";
import { readPageQueryString } from "../Services/Functions";
import { Link } from "react-router-dom";

export const SellerCategoryFeature: FunctionComponent = () => {
  const tableEl = useRef<any>();

  const [featureTypeOptions, setFeatureTypeOptions] = useState<{ key: string, value: string }[]>([
    { key: "1", value: "Tarih Aralığı" },
    { key: "2", value: "Tarih" },
    { key: "3", value: "Çoktan Seçmeli" },
    { key: "4", value: "Sayı" },
    { key: "5", value: "Metin" },
    // { key: "6", value: "Görsel" },
    { key: "7", value: "Çoklu Seçim" }
  ]);

  const sortOptions = [
    { key: "1", value: "A'dan Z'ye" },
    { key: "2", value: "Z'den A'ya" },
    { key: "3", value: "Yeniden eskiye" },
    { key: "4", value: "Eskiden yeniye" }
  ];

  const [selectedFeatureOption, setSelectedFeatureOption] = useState<{ key: string, value: string }>({ key: "0", value: "Özellik Tipi Seçiniz" });

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedFeatureId, setselectedFeatureId] = useState<number>(0)

  const [featureName, setFeatureName] = useState<string>("");

  const [categoryAnswer, setCategoryAnswer] = useState<string>("");

  const [categoryAnswerList, setCategoryAnswerList] = useState<string[]>([]);

  const [warningText, setWarningText] = useState<boolean>(false);

  const [inputsDisabled, setInputsDisabled] = useState<boolean>(false);

  const [showAddNewFeatureModal, setShowAddNewFeatureModal] = useState<boolean>(false);

  const [alias, setAlias] = useState<string>("");

  const handleAddNewFeature = () => {
    setShowAddNewFeatureModal(true);
    setCurrentOpenedFilterButton("");
    setselectedFeatureId(0);
    setFeatureName("");
    setAlias("");
    setSelectedFeatureOption(featureTypeOptions[0]);
    setCategoryAnswerList([]);
    setInputsDisabled(false);
  }

  const handleAddNewFeatureAnswer = () => {
    const _categoryAnswer = categoryAnswer.trim();

    if (categoryAnswerList.includes(_categoryAnswer)) {
      setWarningText(true);
      return
    }
    else if (categoryAnswer === "") {
      setWarningText(false);
      return

    }
    let _categoryAnswerList = categoryAnswerList;
    _categoryAnswerList.push(categoryAnswer);
    setCategoryAnswerList([..._categoryAnswerList]);
    setCategoryAnswer("");
    setWarningText(false);
  }

  const handleDeleteFeatureAnswer = (item) => {
    const _tempAnswerList = categoryAnswerList.filter(i => i !== item);
    setCategoryAnswerList([..._tempAnswerList]);
  }

  const getSellerCategoryElementList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCategoryElementList(page, take, searchText, order);

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

  const createSellerCategoryElement = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createSellerCategoryElement(featureName, Number(selectedFeatureOption.key), alias, categoryAnswerList);

    setProcessLoading(false);
    setShowAddNewFeatureModal(false);

    if (_result.succeeded === true) {

      context.showModal({
        type: "Success",
        title: `Satıcı kategori özelliği başarıyla oluşturuldu`,
        onClose: () => {
          if (tableEl.current) {
            tableEl.current?.reload();
          }
          context.hideModal();
        },
      })
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); },
      })
    }
  }

  const showQuestionModalForDelete = (item) => {
    context.showModal({
      type: "Question",
      title: "Kategori Özelliğini Sil",
      message: `${item.NameWithAlias} isimli kategori özelliğini silmek istediğinize emin misiniz?`,
      onClick: async () => {

        const _result = await ApiService.removeSellerCategoryElement(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: `Satıcı kategori özelliği başarıyla silindi`,
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
            },
          })
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); },
          })
        }
        return true
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const handleEditFeature = (item) => {
    setCurrentOpenedFilterButton("");
    setWarningText(false);
    setselectedFeatureId(item.Id);
    setFeatureName(item.Name);
    setAlias(item.Alias ?? "");
    setSelectedFeatureOption(featureTypeOptions.find(i => i.key === String(item.DataType)) ?? featureTypeOptions[0]);
    {
      item.Options !== undefined && item.Options?.length > 0 &&
        setCategoryAnswerList(item.Options)
    }
    setShowAddNewFeatureModal(true);
  }

  const updateSellerCategoryElement = async () => {

    setProcessLoading(true);

    const _result = await ApiService.updateSellerCategoryElement(selectedFeatureId, featureName, alias, categoryAnswerList)

    setProcessLoading(false);
    setShowAddNewFeatureModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: `Satıcı kategori özelliği başarıyla güncellendi`,
        onClose: () => {
          context.hideModal();
          if (tableEl.current) {
            tableEl.current?.reload();
          }
        },
      })
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); },
      })
    }
  }

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddNewFeatureAnswer();
    }
  }

  return (
    <>
      <div className="content-wrapper">
        <div className="portlet-wrapper">
          <h2 className="border-b border-gray-200 pb-5">Kategori Özellik Listesi</h2>
          <Table
            ref={tableEl}
            emptyListText={"Varyasyon Bulunamadı"}
            getDataFunction={getSellerCategoryElementList}
            addNewButton={
              <Button buttonMd textTiny className="w-72  px-3 mr-3" color="text-blue-400" design="button-blue-100" text="Yeni Özellik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleAddNewFeature(); }} />
            }
            header={
              <div className=" lg:grid-cols-10 px-2 border-b border-t py-6 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-3 flex items-center">
                  <span className="p-sm-gray-400">
                    Özellik Adı
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="p-sm-gray-400">
                    Özellik Tipi
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="p-sm-gray-400">
                    Belirlenen Seçenekler
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="p-sm-gray-400">
                    Kullanıldığı Kategori Sayısı
                  </span>
                </div>
                <div className="lg:col-span-1">
                </div>
              </div>
            }
            renderItem={(e, i) => {
              return <div className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0" key={i} >
                <div className="lg:col-span-3 flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Özellik Adı: </span>
                  <p className="p-sm">
                    {e.NameWithAlias}
                  </p>
                </div>
                <div className="lg:col-span-2 flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Özellik Tipi: </span>
                  <p className="p-sm">
                    {featureTypeOptions.filter(i => i.key === String(e.DataType))[0]?.value ?? "-"}
                  </p>
                </div>
                <div className="lg:col-span-2 flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Belirlenen Seçenekler: </span>
                  <p className="p-sm">
                    {e.Options && e.Options.length > 0 ? e.Options?.length : "-"}
                  </p>
                </div>
                <div className="lg:col-span-2 flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2"> Kullanıldığı Kategori Sayısı: </span>
                  <p className="p-sm">
                    {e.UsedCategoryCount ? e.UsedCategoryCount : "-"}
                  </p>
                </div>
                <div className="lg:col-span-1">
                  <div className="flex text-gray-700 items-center justify-end">
                    <Link to={{ pathname: `/satici-ozellik-kategori-listesi/${e.Id}`, state: { prevTitle: "Kategori Özellik Listesi" } }} >
                      <SubListIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all  mx-1" />
                    </Link>
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all mx-1" onClick={() => { handleEditFeature(e); setInputsDisabled(false) }} />
                    <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all mx-1" onClick={() => showQuestionModalForDelete(e)} />
                    <ChevronRightIcon className="w-5 h-5 border-l hover:text-blue-400 cursor-pointer" onClick={() => { handleEditFeature(e); setInputsDisabled(true) }} />
                  </div>
                </div>
              </div>
            }}
            sortOptions={sortOptions}
            page={Number(readPageQueryString(window.location) ?? "1")}
            setPageQueryString
          />
        </div>
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showAddNewFeatureModal}
        onClose={() => { setShowAddNewFeatureModal(false) }}
        title={selectedFeatureId === 0 ? "Yeni Kategori Özellik Oluştur" : inputsDisabled ? "Kategori Özelliği Detayı" : "Kategori Özelliğini Düzenle"}
        body={
          <div>
            <Label className="mt-4" title="Özellik Adı" withoutDots isRequired />
            <input className={`${inputsDisabled && "bg-gray-100 text-gray-700 font-medium border-gray-200"} form-input`} type="text" placeholder="Özellik Adı" value={featureName} onChange={(e) => setFeatureName(e.target.value)} disabled={inputsDisabled && true} />
            <Label isRequired withoutDots title="Özellik Tipi" className="mt-4" />
            <Dropdown
              isDisabled={selectedFeatureId > 0 ? true : false}
              isDropDownOpen={currentOpenedFilterButton === "featureType"}
              onClick={() => { setCurrentOpenedFilterButton("featureType"); }}
              className="w-full text-sm text-gray-700 focus:border-blue-400"
              classNameDropdown="max-h-52 overflow-y-auto custom-scrollbar"
              label={selectedFeatureOption.value}
              items={featureTypeOptions}
              isSearchable
              onItemSelected={item => { setSelectedFeatureOption(item); setCategoryAnswer(""); setCategoryAnswerList([]) }} />
            {(selectedFeatureOption.key === "3" || selectedFeatureOption.key === "7") &&
              <>
                {inputsDisabled !== true &&
                  <>
                    <Label isRequired withoutDots title="Seçenekler" className="mt-4" />
                    <div className="flex">
                      <input className="form-input" value={categoryAnswer} onChange={(e) => { setCategoryAnswer(e.target.value) }} onKeyDown={(e) => { _handleKeyDown(e); }} />
                      <Button buttonMd design="button-blue-400" text="Ekle" className="px-5 text-sm ml-3" onClick={() => handleAddNewFeatureAnswer()} />
                    </div>
                  </>
                }
                {warningText &&
                  <div className="flex items-center my-3 text-red-400 ">
                    <AlertIcon className="icon-sm mr-2 " />
                    <span className="text-sm font-medium">Aynı isme sahip iki seçenek eklenemez.</span>
                  </div>
                }
                {categoryAnswerList.length > 0 &&
                  <div className="border-t-2 border-gray-200 mt-4 max-h-40 overflow-y-auto custom-scrollbar">
                    <p className="p-sm-gray-700 mt-4 flex justify-between">
                      <span className="w-4/5">Belirlenen Cevaplar</span>
                      <span className={`${inputsDisabled && "hidden"} w-1/5 text-center`}>İşlem</span>
                    </p>
                    {categoryAnswerList.map((item) => (
                      <div className="flex justify-between my-4 items-center w-full p-sm ">
                        <span className="w-4/5">{item}</span>
                        <div className="w-1/5">
                          <TrashIcon className={`${inputsDisabled && "hidden"} icon-sm cursor-pointer mx-auto`} onClick={() => { handleDeleteFeatureAnswer(item) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </>
            }
            <Label isRequired withoutDots title="Alias" className="mt-4" />
            <input disabled={inputsDisabled && true} className={`${inputsDisabled && "bg-gray-100 text-gray-700 font-medium border-gray-200"} form-input`} value={alias} onChange={(e) => { setAlias(e.target.value); }} />
          </div>
        }
        footer={
          <>
            {selectedFeatureId === 0 ?
              <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Oluştur" onClick={() => { createSellerCategoryElement(); }} />
              :
              inputsDisabled ?
                <Button block design="button-blue-400 mt-4" text="Kapat" onClick={() => { setShowAddNewFeatureModal(false); setselectedFeatureId(0) }} />
                :
                <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Kaydet" onClick={() => { updateSellerCategoryElement(); }} />
            }
          </>
        }
      />
    </>
  )
}
