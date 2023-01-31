import { FunctionComponent, useState, useContext, useEffect } from "react"
import { useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { Label } from "../Components/Label"
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import { useStateEffect } from "../Components/UseStateEffect";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVICES } from "../Services/Constants";

export const HelpContentAdd: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [helpCategoryLoading, setHelpCategoryLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [groupList, setGroupList] = useState<{ key: string, value: string }[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [categoryList, setCategoryList] = useState<{ key: string, value: string }[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [order, setOrder] = useState<number>();

  const [description, setDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  ClassicEditor.defaultConfig = {
    ...ClassicEditor.defaultConfig,
    mediaEmbed: {
      previewsInData: true
    },
    ckfinder: {
      uploadUrl: `${SERVICES.API_ADMIN_GENERAL_URL}/ck-inner-media`
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    }
  };

  useEffect(() => {
    getHelpGroupList();
  }, [])

  useStateEffect(() => {
    getHelpCategoryList();
  }, [selectedGroup])


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

  const getHelpCategoryList = async () => {
    setHelpCategoryLoading(true);
    setCurrentOpenedFilterButton("");

    const _result = await ApiService.getHelpGroupForDropdown();

    setHelpCategoryLoading(false);

    if (_result.succeeded === true) {
      let _curryArray: { key: string, value: string }[] = []
      _result.data.categoryList.filter(i => i.ParentId === Number(selectedGroup.key)).map((item) => (
        _curryArray.push({
          key: String(item.Id),
          value: item.Title
        })
      ));
      setCategoryList([..._curryArray]);
    }
    else {
      setGroupList([]);
    }
  }

  const handleCreateHelpContent = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createHelpContent(title, Number(selectedCategory.key), order ?? 0, description, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yeni yardım içeriği başarıyla oluşturuldu",
        onClose: () => { context.hideModal(); history.push('/yardim-icerik-listesi'); }
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
        <h2 className="border-b pb-5">Yardım İçeriği Oluştur</h2>
        <div className="flex flex-col">
          <div className="w-1/2">
            <Label isRequired withoutDots title="İçerik Başlığı" className="mt-4" />
            <input className="form-input" value={title} onChange={(e) => { setTitle(e.target.value) }} />
            <Label withoutDots title="Bağlı Olduğu Grup" isRequired className="mt-4" />
            {loading ?
              <Loading inputSm />
              :
              <Dropdown
                isDropDownOpen={currentOpenedFilterButton === "parentGroup"}
                onClick={() => { setCurrentOpenedFilterButton("parentGroup"); }}
                className="w-full text-black-700 text-sm"
                label={selectedGroup.value}
                items={groupList}
                onItemSelected={item => { setSelectedGroup(item) }} />
            }
            <Label withoutDots isRequired title="Kategori" className="mt-4" />
            {helpCategoryLoading ?
              <Loading inputSm />
              :
              <Dropdown
                isDropDownOpen={currentOpenedFilterButton === "category"}
                onClick={() => { setCurrentOpenedFilterButton("category"); }}
                className="w-full text-black-700 text-sm"
                label={selectedCategory.value}
                items={categoryList}
                onItemSelected={item => { setSelectedCategory(item) }} />
            }
            <Label isRequired withoutDots title="Gösterim Sıralaması" className="mt-4" />
            <input className="form-input" type="number" value={order} onChange={(e) => { setOrder(parseInt(e.target.value)) }} />
            <Label isRequired withoutDots title="İçerik Açıklaması" className="mt-4" />
            <CKEditor
              editor={ClassicEditor}
              data={description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setDescription(data);
              }}
            />
            <div className="flex items-center justify-between my-4">
              <span className="p-sm font-medium text-gray-700">Aktif olarak göster</span>
              <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
            </div>
          </div>
          <Button isLoading={processLoading} design="button-blue-400 ml-auto w-80" text="Kaydet ve Tamamla" onClick={() => { handleCreateHelpContent(); }} />

        </div>
      </div>
    </div>
  )
}
