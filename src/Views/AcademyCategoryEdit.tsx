import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";


interface RouteParams {
  id: string,
}

export const AcademyCategoryEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const history = useHistory();

  const [processloading, setProcessLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [orderBy, setOrderBy] = useState<number>(0);

  const [categoryName, setCategoryName] = useState<string>("");

  const [categoryDescription, setCategoryDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const categoryTypeOptions = [
    { key: "1", value: "Satıcı Paneli" },
    { key: "2", value: "Profesyonel Paneli" }
  ];

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedCategoryTypeOption, setSelectedCategoryTypeOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  useEffect(() => {
    getAcademyCategory();
  }, []);


  const getAcademyCategory = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getAcademyCategory(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setOrderBy(_result.data.OrderBy);
      setCategoryName(_result.data.Name);
      setCategoryDescription(_result.data.Description);
      setIsEnabled(_result.data.IsEnabled);
      setSelectedCategoryTypeOption(categoryTypeOptions.find(x => x.key === String(_result.data.CategoryType ?? "0")) ?? { key: "0", value: "Seçiniz" });

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/akademi-kategori-listesi"); }
      });
      setLoading(false);
      setProcessLoading(false);
    }
  }

  const updateAcademyCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateAcademyCategory(Number(params.id ?? "0"), orderBy, categoryName, categoryDescription, isEnabled, Number(selectedCategoryTypeOption.key));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
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
          Kategori Düzenle
        </h2>
        <div className="border-t border-gray-200">
          <div className="w-1/2">
            <Label className="mt-6" title="Kategori Adı" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="text" placeholder="Kategori Adı" value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} />
            }
            <Label className="mt-6" title="Kategori Sıralaması" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="number" placeholder="Kategori Sıralaması" value={orderBy} onChange={(e) => { setOrderBy(Number(e.target.value ?? "0")) }} />
            }
            <Label className="mt-6" title="Gösterim Alanı" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "typeSelect"}
                  onClick={() => { setCurrentOpenedFilterButton("typeSelect"); }}
                  isDisabled={true}
                  className="w-full text-black-700 text-sm border-gray-300"
                  label={selectedCategoryTypeOption.value}
                  items={categoryTypeOptions}
                  onItemSelected={item => { setSelectedCategoryTypeOption(item); }} />
            }
            <Label className="mt-6" title="Kategori Açıklaması" withoutDots isRequired />
            {
              loading ?
                <Loading inputMd />
                :
                <textarea className="w-full text-sm  p-3 text-gray-900 border  border-gray-300 rounded-lg focus:outline-none resize-none leading-5"
                  placeholder="Kategori detayında görünecek ve kullanıcıları bilgilendirecek bir açıklama yazısı ekleyin."
                  rows={3} value={categoryDescription} onChange={(e) => { setCategoryDescription(e.target.value) }} />
            }
            <div className="flex mt-4  align-items-center">
              {
                loading ?
                  <Loading textMd />
                  :
                  <>
                    <div className="text-gray-600 text-sm">Kategoriyi aktif olarak göster</div>
                    <div className="ml-auto">
                      <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
                    </div>
                  </>
              }

            </div>

          </div>
          <div className="flex">
            <Button isLoading={processloading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/akademi-kategori-listesi"); }} />
            <Button isLoading={processloading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateAcademyCategory(); }} />
          </div>
        </div>
      </div>
    </div>
  )
}
