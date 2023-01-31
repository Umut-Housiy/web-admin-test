import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom";

import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const HelpCategoryAdd: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [categoryName, setCategoryName] = useState<string>("");

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [groupList, setGroupList] = useState<{ key: string, value: string }[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [categoryOrder, setCategoryOrder] = useState<number>();

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    getHelpGroupList()
  }, []);

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

  const handleSaveCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createHelpCategory(categoryName, Number(selectedGroup.key), categoryOrder ?? 0, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yeni yardım kategori başarıyla oluşturuldu",
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
        <h2 className="border-b pb-5">Yeni Kategori Oluştur</h2>
        <div className="flex flex-col">
          <div className="w-1/2">
            <Label isRequired withoutDots title="Kategori Adı" className="mt-4" />
            <input className="form-input" value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} />
            <Label withoutDots title="Bağlı Olduğu Grup" isRequired className="mt-4" />
            {loading ?
              <Loading inputSm />
              :
              <Dropdown
                isDropDownOpen={currentOpenedFilterButton === "parentGroup"}
                onClick={() => { setCurrentOpenedFilterButton("parentGroup"); }}
                className="w-full text-black-700 text-sm"
                classNameDropdown="max-h-40 overflow-y-auto custom-scrollbar"
                label={selectedGroup.value}
                items={groupList}
                onItemSelected={item => { setSelectedGroup(item) }} />
            }
            <Label isRequired withoutDots title="Kategori Sıralaması" className="mt-4" />
            <input className="form-input" type="number" value={categoryOrder} onChange={(e) => { setCategoryOrder(parseInt(e.target.value)) }} />
            <div className="flex items-center justify-between my-4">
              <span className="p-sm font-medium text-gray-700">Kategoriyi aktif olarak göster</span>
              <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
            </div>
          </div>
          <Button isLoading={processLoading} textTiny design="button-blue-400 ml-auto w-80" text="Kaydet ve Tamamla" onClick={() => { handleSaveCategory(); }} />
        </div>
      </div>
    </div>

  )
}
