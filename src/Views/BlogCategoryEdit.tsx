import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

interface RouteParams {
  id: string,
}

export const BlogCategoryEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const history = useHistory();

  const [processloading, setProcessLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [orderBy, setOrderBy] = useState<number>(0);

  const [categoryName, setCategoryName] = useState<string>("");

  const [categoryDescription, setCategoryDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  useEffect(() => {
    getBlogCategory();
  }, []);


  const getBlogCategory = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getBlogCategory(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setOrderBy(_result.data.OrderBy);
      setCategoryName(_result.data.Name);
      setCategoryDescription(_result.data.Description);
      setIsEnabled(_result.data.IsEnabled);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/blog-kategori-listesi"); }
      });
    }
  }

  const updateBlogCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateBlogCategory(Number(params.id ?? "0"), orderBy, categoryName, categoryDescription, isEnabled);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); setProcessLoading(false); history.push("/blog-kategori-listesi"); }
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
            <Label className="mt-6" title="Kategori Açıklaması" withoutDots isRequired />
            {
              loading ?
                <Loading inputMd />
                :
                <textarea className="text-sm w-full p-3 text-gray-900 border  border-gray-300 rounded-lg focus:outline-none resize-none leading-5"
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
            <Button isLoading={processloading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/blog-kategori-listesi"); }} />
            <Button isLoading={processloading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateBlogCategory(); }} />
          </div>
        </div>
      </div>
    </div>
  )
}
