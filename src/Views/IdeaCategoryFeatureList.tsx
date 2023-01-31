import { FunctionComponent, useContext, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Modal } from "../Components/Modal";
import { Label } from "../Components/Label";
import ApiService from "../Services/ApiService";
import { Table } from "../Components/Table";

export const IdeaCategoryFeatureList: FunctionComponent = () => {
  const tableEl = useRef<any>();

  const featureTypeOptions = [
    { key: "1", value: "Tarih Aralığı" },
    { key: "2", value: "Tarih" },
    { key: "3", value: "Çoktan Seçmeli" },
    { key: "4", value: "Sayı" },
    { key: "5", value: "Metin" },
    { key: "6", value: "Görsel" },
    { key: "8", value: "Tutar / Ücret" },
    { key: "9", value: "Şehir" }
  ];

  const sortOptions = [
    { key: "1", value: "A'dan Z'ye" },
    { key: "2", value: "Z'den A'ya" },
    { key: "3", value: "Yeniden eskiye" },
    { key: "4", value: "Eskiden yeniye" }
  ];

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedFeatureOption, setSelectedFeatureOption] = useState<{ key: string, value: string }>({ key: "0", value: "Özellik Tipi Seçiniz" });

  const [showEditFeatureModal, setShowEditFeatureModal] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [selectedFeatureId, setSelectedFeatureId] = useState<number>(0);

  const [featureName, setFeatureName] = useState<string>("");

  const [multiSelectOption, setMultiSelectOption] = useState<string>("");

  const [multiSelectOptionList, setMultiSelectOptionList] = useState<string[]>([]);

  const [alias, setAlias] = useState<string>("");

  const getFeatureList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getIdeaCategoryFeatureList(page, take, -1, searchText, order);

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

  const createFeature = async () => {

    setProcessLoading(true);

    const _result = await ApiService.createIdeaCategoryFeature(featureName, Number(selectedFeatureOption.key), multiSelectOptionList, alias);

    setShowEditFeatureModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kategori özelliği oluşturuldu.",
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
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
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }
  }

  const updateFeature = async (Id) => {
    setProcessLoading(true);

    const _result = await ApiService.updateIdeaCategoryFeature(Id, featureName, multiSelectOptionList, alias);

    setProcessLoading(false);
    setShowEditFeatureModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kategori özelliği düzenlendi.",
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

  const handleDeleteFeature = (item) => {
    context.showModal({
      type: "Question",
      title: `Silmek istediğinize emin misiniz? Bu özellik kullanılan fikirlerden kaldırılacak ve fikirlerde bu özellik artık gözükmeyecektir. Onaylıyor musunuz ? `,
      onClose: () => { context.hideModal(); },
      onClick: async () => {

        const _result = await ApiService.deleteIdeaCategoryFeature(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Kategori özelliği silindi.",
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
        return true
      }
    });
  }

  const handleOpenAddFeatureModal = () => {
    setIsEdit(false);
    setFeatureName("");
    setCurrentOpenedFilterButton("");
    setMultiSelectOption("");
    setMultiSelectOptionList([]);
    setSelectedFeatureOption({ key: "0", value: "Özellik Tipi Seçiniz" });
    setShowEditFeatureModal(true);
    setAlias("");
  }

  const handleOpenEditFeatureModal = (item) => {
    setIsEdit(true);
    setSelectedFeatureId(item.Id);
    setFeatureName(item.Name);
    setAlias(item.Alias);
    setMultiSelectOptionList(item.Options ?? []);
    setCurrentOpenedFilterButton("");
    setSelectedFeatureOption(featureTypeOptions.find(x => x.key === (item.DataType ?? 0).toString()) ?? { key: "0", value: "Özellik Tipi Seçiniz" });
    setShowEditFeatureModal(true);
  }

  const handleAddMultiSelectOptionList = () => {
    if (!multiSelectOptionList.includes(multiSelectOption)) {
      setMultiSelectOptionList([...multiSelectOptionList, multiSelectOption]);
      setMultiSelectOption("");
    }
    else {
      setMultiSelectOption("");
    }
  }

  const handleDeleteFromMultiSelectOptionList = (item) => {
    const _tempList = multiSelectOptionList.filter(x => x != item);
    setMultiSelectOptionList(_tempList);
  }

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddMultiSelectOptionList();
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Kategori Özellik Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kategori Bulunamadı"}
          getDataFunction={getFeatureList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72 px-3 mr-3" design="button-blue-100" text="Yeni Özellik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleOpenAddFeatureModal(); }} />
          }
          header={
            <div className=" lg:grid-cols-3 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  Özellik Adı
                </span>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  Özellik Tipi
                </span>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  Belirlenen Seçenekler
                </span>
              </div>
            </div>
          }
          renderItem={(e, i) => {
            return <div className="lg:grid-cols-3 px-2 border-b h-20 border-gray-200 hidden lg:grid flex gap-4 items-center" key={i}>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.NameWithAlias}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {featureTypeOptions.find(x => x.key === (e.DataType ?? 0).toString())?.value}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                <p className="font-medium text-sm">
                  {e.Options !== undefined && e.Options.length > 0 ? e.Options.length : "-"}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => { handleOpenEditFeatureModal(e); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => handleDeleteFeature(e)} />
                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showEditFeatureModal}
        onClose={() => { setShowEditFeatureModal(false); }}
        title="Kategori Özellik Seçenekleri"
        body={
          <div>
            <Label isRequired withoutDots title="Özellik Adı" className="mt-4" />
            <input className="form-input" value={featureName} onChange={(e) => { setFeatureName(e.target.value); }} />
            <Label isRequired withoutDots title="Özellik Tipi" className="mt-4" />
            <Dropdown
              isDropDownOpen={currentOpenedFilterButton === "feature"}
              onClick={() => { setCurrentOpenedFilterButton("feature"); }}
              className="w-full rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm "
              isDisabled={isEdit}
              classNameDropdown="w-full max-h-40 overflow-y-auto custom-scrollbar"
              label={selectedFeatureOption.value}
              icon
              items={featureTypeOptions}
              onItemSelected={item => { setSelectedFeatureOption(item); }} />
            {
              selectedFeatureOption.key === "3" ?
                <>
                  <Label isRequired withoutDots title="Özellik Tipi" className="mt-4" />
                  <div className="flex">
                    <input className="form-input" value={multiSelectOption} onChange={(e) => { setMultiSelectOption(e.target.value); }} onKeyDown={(e) => { _handleKeyDown(e); }} />
                    <Button isLoading={processLoading} buttonMd design="button-blue-400" text="Ekle" className="px-5 text-sm ml-3" onClick={() => { handleAddMultiSelectOptionList(); }} />
                  </div>
                  {multiSelectOptionList != undefined && multiSelectOptionList.length > 0 &&
                    <div className="border-t-2 border-gray-200 mt-4 h-36 max-h-full overflow-y-scroll custom-scrollbar">
                      <p className="p-sm-gray-700 mt-4 flex justify-between">
                        <span>Belirlenen Seçenekler</span>
                        <span className="ml-auto mr-6">İşlem</span>
                      </p>
                      {multiSelectOptionList.map((item) => (
                        <div className="flex justify-between my-4 items-center w-full p-sm ">
                          <span>{item}</span>
                          <div className="ml-auto mr-8">
                            <TrashIcon className="icon-sm cursor-pointer mx-auto" onClick={() => { handleDeleteFromMultiSelectOptionList(item) }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                </>
                :
                <></>
            }
            <Label isRequired withoutDots title="Alias" className="mt-4" />
            <input className="form-input" value={alias} onChange={(e) => { setAlias(e.target.value); }} />
          </div>
        }
        footer={
          isEdit ?
            <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Güncelle" onClick={() => { updateFeature(selectedFeatureId); }} />
            :
            <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Oluştur" onClick={() => { createFeature(); }} />
        }
      />
    </div>
  )
}
