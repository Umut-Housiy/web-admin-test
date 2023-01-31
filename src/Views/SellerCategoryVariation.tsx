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

export const SellerCategoryVariation: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const variationTypeOptions = [
    { key: "1", value: "Tarih Aralığı" },
    { key: "2", value: "Tarih" },
    { key: "3", value: "Çoktan Seçmeli" },
    { key: "4", value: "Sayı" },
    { key: "5", value: "Metin" },
    // { key: "6", value: "Görsel" },
    { key: "7", value: "Çoklu Seçim" },
  ];

  const sortOptions = [
    { key: "1", value: "A'dan Z'ye" },
    { key: "2", value: "Z'den A'ya" },
    { key: "3", value: "Yeniden eskiye" },
    { key: "4", value: "Eskiden yeniye" }
  ];

  const [selectedVariationOption, setSelectedVariationOption] = useState<{ key: string, value: string }>({ key: "0", value: "Varyasyon Tipi Seçiniz" });

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedVariationId, setSelectedVariationId] = useState<number>(0)

  const [variationName, setVariationName] = useState<string>("");

  const [categoryAnswer, setCategoryAnswer] = useState<string>("");

  const [categoryAnswerList, setCategoryAnswerList] = useState<string[]>([]);

  const [warningText, setWarningText] = useState<boolean>(false);

  const [inputsDisabled, setInputsDisabled] = useState<boolean>(false);

  const [showAddNewVariationModal, setShowAddNewVariationModal] = useState<boolean>(false);

  const [alias, setAlias] = useState<string>("");

  const handleAddNewVariation = () => {
    setShowAddNewVariationModal(true);
    setCurrentOpenedFilterButton("");
    setSelectedVariationId(0);
    setVariationName("");
    setAlias("");
    setSelectedVariationOption(variationTypeOptions[0]);
    setCategoryAnswerList([]);
    setInputsDisabled(false);
  }

  const handleAddNewVariationAnswer = () => {
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

  const handleDeleteVariationAnswer = (item) => {
    const _tempAnswerList = categoryAnswerList.filter(i => i !== item);
    setCategoryAnswerList([..._tempAnswerList]);
  }

  const getSellerCategoryVariationList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCategoryVariationList(page, take, searchText, order);

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

  const createSellerCategoryVariation = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createSellerCategoryVariation(variationName, Number(selectedVariationOption.key), alias, categoryAnswerList)

    setProcessLoading(false);

    setShowAddNewVariationModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: `Satıcı kategori varyasyonu başarıyla oluşturuldu`,
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
    setSelectedVariationId(item.Id);
    context.showModal({
      type: "Question",
      title: "Kategori Varyasyonu Sil",
      message: `${item.Name} isimli kategori varyasyonunu silmek istediğinize emin misiniz?`,
      onClick: async () => {

        const _result = await ApiService.removeSellerCategoryVariation(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: `Satıcı kategori varyasyonu başarıyla silindi`,
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
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const handleEditCategoryVariation = (item) => {
    setCurrentOpenedFilterButton("");
    setWarningText(false);
    setSelectedVariationId(item.Id);
    setVariationName(item.Name);
    setAlias(item.Alias ?? "");
    setSelectedVariationOption(variationTypeOptions.find(i => i.key === String(item.DataType)) ?? variationTypeOptions[0]);
    {
      item.Options !== undefined && item.Options?.length > 0 &&
        setCategoryAnswerList(item.Options)
    }
    setShowAddNewVariationModal(true);
  }

  const updateSellerCategoryVariation = async () => {
    setCategoryAnswer("");
    setProcessLoading(true);

    const _result = await ApiService.updateSellerCategoryVariation(selectedVariationId, variationName, alias, categoryAnswerList)

    setShowAddNewVariationModal(false);
    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: `Satıcı kategori varyasyonu başarıyla güncellendi`,
        onClose: () => {
          context.hideModal();
          if (tableEl.current) {
            tableEl.current.reload();
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
      handleAddNewVariationAnswer();
    }
  }

  return (
    <>
      <div className="content-wrapper">
        <div className="portlet-wrapper">
          <h2 className="border-b border-gray-200 pb-5">Kategori Varyasyon Listesi</h2>
          <Table
            ref={tableEl}
            emptyListText={"Varyasyon Bulunamadı"}
            getDataFunction={getSellerCategoryVariationList}
            addNewButton={
              <Button buttonMd textTiny className="mr-3 w-96" color="text-blue-400" design="button-blue-100" text="Yeni Varyasyon Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleAddNewVariation(); }} />
            }
            header={
              <div className=" lg:grid-cols-10 px-2 border-b border-t py-6 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-3 flex items-center">
                  <span className="p-sm-gray-400">
                    Varyasyon Adı
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="p-sm-gray-400">
                    Varyasyon Tipi
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
                <div className="lg:col-span-1"></div>
              </div>}
            renderItem={(e, i) => {
              return <div className="lg:grid-cols-10 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
                <div className="lg:col-span-3 flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Varyasyon Adı: </span>
                  <p className="p-sm">
                    {e.NameWithAlias}
                  </p>
                </div>
                <div className="lg:col-span-2 flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Varyasyon Tipi: </span>
                  <p className="p-sm">
                    {variationTypeOptions.filter(i => i.key === String(e.DataType))[0]?.value ?? "-"}
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
                    <Link to={{ pathname: `/satici-varyasyon-kategori-listesi/${e.Id}`, state: { prevTitle: "Kategori Varyasyon Listesi" } }} >
                      <SubListIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all  mx-1" />
                    </Link>
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all mx-1" onClick={() => { handleEditCategoryVariation(e); setInputsDisabled(false) }} />
                    <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all mx-1" onClick={() => showQuestionModalForDelete(e)} />
                    <ChevronRightIcon className="w-5 h-5 border-l hover:text-blue-400 cursor-pointer" onClick={() => { handleEditCategoryVariation(e); setInputsDisabled(true) }} />
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
        showModal={showAddNewVariationModal}
        onClose={() => { setShowAddNewVariationModal(false) }}
        title={selectedVariationId === 0 ? "Yeni Kategori Varyasyonu Oluştur" : inputsDisabled ? "Kategori Varyasyon Detayı" : "Kategori Varyasyon Düzenle"}
        body={
          <div>
            <Label className="mt-4" title="Varyasyon Adı" withoutDots isRequired />
            <input className={`${inputsDisabled && "bg-gray-100 text-gray-700 font-medium border-gray-200"} form-input`} type="text" placeholder="Varyasyon Adı" value={variationName} onChange={(e) => setVariationName(e.target.value)} disabled={inputsDisabled && true} />
            <Label isRequired withoutDots title="Varyasyon Tipi" className="mt-4" />
            <Dropdown
              isDisabled={selectedVariationId > 0 ? true : false}
              isDropDownOpen={currentOpenedFilterButton === "featureType"}
              onClick={() => { setCurrentOpenedFilterButton("featureType"); }}
              className="w-full text-sm text-gray-700 focus:border-blue-400"
              classNameDropdown="max-h-52 overflow-y-auto custom-scrollbar"
              label={selectedVariationOption.value}
              items={variationTypeOptions}
              isSearchable
              onItemSelected={item => { setSelectedVariationOption(item); setCategoryAnswer(""); setCategoryAnswerList([]) }} />
            {(selectedVariationOption.key === "3" || selectedVariationOption.key === "7") &&
              <>
                {inputsDisabled !== true &&
                  <>
                    <Label isRequired withoutDots title="Seçenekler" className="mt-4" />
                    <div className="flex">
                      <input className="form-input" value={categoryAnswer} onChange={(e) => { setCategoryAnswer(e.target.value) }} onKeyDown={(e) => { _handleKeyDown(e); }} />
                      <Button isLoading={processLoading} buttonMd design="button-blue-400" text="Ekle" className="px-5 text-sm ml-3" onClick={() => handleAddNewVariationAnswer()} />
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
                  <div className="border-t-2 border-gray-200 mt-4 max-h-40 overflow-auto custom-scrollbar">
                    <p className="p-sm-gray-700 mt-4 flex justify-between">
                      <span className="w-4/5">Belirlenen Cevaplar</span>
                      <span className={`${inputsDisabled && "hidden"} w-1/5 text-right pr-4`}>İşlem</span>
                    </p>
                    {categoryAnswerList.map((item) => (
                      <div className="flex justify-between my-4 items-center w-full p-sm ">
                        <span className="w-4/5">{item}</span>
                        <div className="w-1/5 pr-4">
                          <TrashIcon className={`${inputsDisabled && "hidden"} icon-sm text-gray-700 cursor-pointer ml-auto`} onClick={() => { handleDeleteVariationAnswer(item) }} />
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
            {selectedVariationId === 0 ?
              <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Oluştur" onClick={() => { createSellerCategoryVariation(); }} />
              :
              inputsDisabled ?
                <Button block design="button-blue-400 mt-4" text="Kapat" onClick={() => { setShowAddNewVariationModal(false); setSelectedVariationId(0) }} />
                :
                <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Kaydet" onClick={() => { updateSellerCategoryVariation(); }} />
            }
          </>
        }
      />
    </>
  )
}
