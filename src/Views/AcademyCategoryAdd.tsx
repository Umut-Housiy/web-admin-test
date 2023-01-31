import { FunctionComponent, useContext, useState } from "react"
import { Label } from "../Components/Label"
import { ToggleButton } from "../Components/ToggleButton"
import { Button } from "../Components/Button"
import { useHistory } from "react-router"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import ApiService from "../Services/ApiService"
import { Dropdown } from "../Components/Dropdown"

export const AcademyCategoryAdd: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [processloading, setProcessLoading] = useState<boolean>(false);

  const [orderBy, setOrderBy] = useState<number>(0);

  const [categoryName, setCategoryName] = useState<string>("");

  const [categoryDescription, setCategoryDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const categoryTypeOptions = [
    { key: "1", value: "Satıcı Paneli" },
    { key: "2", value: "Profesyonel Paneli" }
  ];

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedCategoryTypeOption, setSelectedCategoryTypeOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });


  const createAcademyCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createAcademyCategory(orderBy, categoryName, categoryDescription, isEnabled, Number(selectedCategoryTypeOption.key));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kategori oluşturuldu.",
        onClose: () => { context.hideModal(); history.push("/akademi-kategori-listesi"); }
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
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Yeni Kategori Oluştur
        </h2>
        <div className="border-t border-gray-200">
          <Label className="mt-6" title="Kategori Adı" withoutDots isRequired />
          <input className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm " type="text" placeholder="Kategori Adı" value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} />
          <Label className="mt-6" title="Kategori Sıralaması" withoutDots isRequired />
          <input className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm" type="number" placeholder="Kategori Sıralaması" value={orderBy} onChange={(e) => { setOrderBy(Number(e.target.value ?? "0")) }} />
          <Label className="mt-6" title="Gösterim Alanı" withoutDots isRequired />
          <div className="w-1/2">
            <Dropdown
              isDropDownOpen={currentOpenedFilterButton === "typeSelect"}
              onClick={() => { setCurrentOpenedFilterButton("typeSelect"); }}
              className="w-full text-black-700 text-sm border-gray-300"
              label={selectedCategoryTypeOption.value}
              items={categoryTypeOptions}
              onItemSelected={item => { setSelectedCategoryTypeOption(item); }} />
          </div>
          <Label className="mt-6" title="Kategori Açıklaması" withoutDots isRequired />
          <textarea className="text-sm w-1/2 p-3 text-gray-900 border  border-gray-300 rounded-lg focus:outline-none resize-none leading-5"
            placeholder="Kategori detayında görünecek ve kullanıcıları bilgilendirecek bir açıklama yazısı ekleyin."
            rows={3} value={categoryDescription} onChange={(e) => { setCategoryDescription(e.target.value) }} />
          <div className="flex mt-4 w-1/2 align-items-center">
            <div className="text-gray-600 text-sm">Kategoriyi aktif olarak göster</div>
            <div className="ml-auto">
              <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
            </div>
          </div>
          <div className="flex">
            <Button isLoading={processloading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/akademi-kategori-listesi"); }} />
            <Button isLoading={processloading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createAcademyCategory(); }} />
          </div>
        </div>
      </div>
    </div>
  )
}
