import React, { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router";

import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { FileUploader } from "../Components/FileUploader";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import { TopCategories } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const ProCategoryAdd: FunctionComponent = () => {
  const categoryTypes = [
    { key: "1", value: "Üst Kategori" },
    { key: "2", value: "Alt Kategori" },
  ];
  const [selectedCategoryType, setSelectedCategoryType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [topCategories, setTopCategories] = useState<{ key: string, value: string }[]>([]);

  const [selectedTopCategory, setSelectedTopCategory] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [categoryName, setCategoryName] = useState<string>("");

  const [categoryOrder, setCategoryOrder] = useState<number>(0);

  const [categoryDescription, setCategoryDescription] = useState<string>("");

  const [categoryStatus, setCategoryStatus] = useState<boolean>(true);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  var file = new File([""], "empty.txt", {
    type: "text/plain",
  });

  const [selectedFile, setSelectedFile] = useState<File>(file);

  useEffect(() => {
    getParentCategories();
  }, [])

  const getParentCategories = async () => {
    setLoading(true);

    const _result = await ApiService.getProCategoryList(1, 9999, "", 0, true);

    if (_result.succeeded) {

      let _curryArray: TopCategories[] = []
      _result.data.Data.map((item) => (
        _curryArray.push({
          key: String(item.Id),
          value: item.CategoryName
        })
      ));
      setTopCategories([..._curryArray]);

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

  const handleSaveCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createProCategory(selectedCategoryType.key === "1" ? true : false, categoryName, categoryOrder, categoryDescription, selectedFile, categoryStatus, Number(selectedTopCategory.key));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yeni kategori başarıyla oluşturuldu",
        onClose: () => { context.hideModal(); history.push('/pro-kategori-listesi'); }
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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="border-b pb-5">Yeni Kategori Oluştur</h2>
        <div className="flex flex-col">
          <div className="w-1/2">
            <Label isRequired withoutDots title="Kategori Tipi" className="mt-4" />
            <Dropdown
              isDropDownOpen={currentOpenedFilterButton === "categoryType"}
              onClick={() => { setCurrentOpenedFilterButton("categoryType"); }}
              className="w-full text-black-700"
              label={selectedCategoryType.value}
              items={categoryTypes}
              onItemSelected={item => { setSelectedCategoryType(item); setSelectedTopCategory({ key: "0", value: "Seçiniz..." }) }} />
            {selectedCategoryType.key === "2" &&
              <>
                <Label isRequired withoutDots title="Üst Kategori" className="mt-4" />
                {loading ?
                  <Loading inputSm />
                  :
                  <Dropdown
                    isDropDownOpen={currentOpenedFilterButton === "topCategory"}
                    onClick={() => { setCurrentOpenedFilterButton("topCategory"); }}
                    className="w-full text-black-700 text-sm"
                    classNameDropdown="max-h-40 overflow-y-auto custom-scrollbar"
                    label={selectedTopCategory.value}
                    items={topCategories}
                    onItemSelected={item => { setSelectedTopCategory(item) }} />
                }
              </>
            }
            <Label isRequired withoutDots title="Kategori Adı" className="mt-4" />
            <input className="form-input" value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} />
            <Label isRequired withoutDots title="Kategori Sıralaması" className="mt-4" />
            <input className="form-input" value={categoryOrder} type="number" onChange={(e) => { setCategoryOrder(parseInt(e.target.value)) }} />
            <Label isRequired withoutDots title="Kategori Görseli" className="mt-4" />
            <FileUploader onFileSelected={item => { setSelectedFile(item) }} sizeDescription={"242x194 px"} warningDescription={"Yüklenen görseller seçili gösterim alanlarına göre otomatik boyutlandırılacaktır."} />
            <Label withoutDots title="Kategori Açıklaması" className="mt-4" />
            <textarea
              onChange={(e) => setCategoryDescription(e.target.value)}
              className="text-sm w-full px-3 py-2 text-black-700 border rounded-lg focus:outline-none resize-none leading-5 mb-1"
              value={categoryDescription}
              rows={3}
            />
            <div className="flex items-center justify-between mb-4">
              <span className="p-sm font-medium text-gray-700">Kategoriyi aktif olarak göster</span>
              <ToggleButton onClick={() => { setCategoryStatus(!categoryStatus) }} defaultValue={categoryStatus} />
            </div>
          </div>
          <Button isLoading={processLoading} textTiny design="button-blue-400 ml-auto w-80" text="Kaydet ve Tamamla" onClick={() => { handleSaveCategory(); }} />

        </div>
      </div>
    </div>
  )
}
