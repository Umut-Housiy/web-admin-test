import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";

import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import { useStateEffect } from "../Components/UseStateEffect";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

interface RouteParams {
  id: string,
}

export const HelpCategoryDetail: FunctionComponent = () => {

  const params = useParams<RouteParams>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [Id, setId] = useState<number>(Number(params.id));

  const [categoryName, setCategoryName] = useState<string>("");

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [groupList, setGroupList] = useState<{ key: string, value: string }[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [categoryOrder, setCategoryOrder] = useState<number>();

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    getHelpGroupList()
  }, []);

  useStateEffect(() => {
    getHelpCategoryDetail()
  }, [groupList]);

  const getHelpGroupList = async () => {
    setLoading(true);

    const _result = await ApiService.getHelpGroupForDropdown();

    setLoading(false);

    if (_result.succeeded === true) {
      let _curryArray: { key: string, value: string }[] = []
      _result.data.groupList.map((item) => (
        _curryArray.push({
          key: String(item.Id),
          value: item.Title
        })
      ));
      setGroupList([..._curryArray]);
    }
    else {
      setGroupList([]);
    }
  }

  const getHelpCategoryDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getHelpCategoryDetail(Id);

    setLoading(false);

    if (_result.succeeded === true) {
      setCategoryName(_result.data.Title);
      setSelectedGroup(groupList.find(i => i.key === String(_result.data.ParentId)) ?? { key: "0", value: "Seçiniz" });
      setCategoryOrder(_result.data.OrderBy);
      setIsEnabled(_result.data.IsEnabled);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/yardim-kategori-listesi'); }
      });
    }
  }


  const handleUpdateHelpCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateHelpCategory(Id, categoryName, Number(selectedGroup.key), categoryOrder ?? 0, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yardım kategori başarıyla güncellendi",
        onClose: () => { context.hideModal(); history.push('/yardim-kategori-listesi'); }
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
        <h2 className="border-b pb-5">Kategori Bilgilerini Düzenle</h2>
        <div className="flex flex-col">
          <div className="w-1/2">
            <Label isRequired withoutDots title="Kategori Adı" className="mt-4" />
            <input className={`${loading ? "loading-input-sm" : "form-input"}`} value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} />
            <Label isRequired withoutDots title="Bağlı Olduğu Grup" className="mt-4" />
            {loading ?
              <Loading inputSm />
              :
              <Dropdown
                isDropDownOpen={currentOpenedFilterButton === "parentCategory"}
                onClick={() => { setCurrentOpenedFilterButton("parentCategory"); }}
                className="w-full text-black-700 text-sm"
                label={selectedGroup.value}
                items={groupList}
                onItemSelected={item => { setSelectedGroup(item) }} />
            }
            <Label isRequired withoutDots title="Kategori Sıralaması" className="mt-4" />
            <input className={`${loading ? "loading-input-sm" : "form-input"}`} type="number" value={categoryOrder} onChange={(e) => { setCategoryOrder(parseInt(e.target.value)) }} />
            <div className="flex items-center justify-between my-4">
              <span className="p-sm font-medium text-gray-700">Kategoriyi aktif olarak göster</span>
              <ToggleButton loading={loading} onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
            </div>
          </div>
          <div className="flex">
            <Button textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push('/yardim-kategori-listesi') }} />
            <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { handleUpdateHelpCategory() }} />
          </div>
        </div>
      </div>
    </div>

  )
}
