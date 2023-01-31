import { FunctionComponent, useState, useContext, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { Label } from "../Components/Label"
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import { useStateEffect } from "../Components/UseStateEffect";
import { GroupCategoryListModelForSelect } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVICES } from "../Services/Constants";


interface RouteParams {
  id: string,
}

export const HelpContentDetail: FunctionComponent = () => {
  const params = useParams<RouteParams>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [Id, setId] = useState<number>(Number(params.id));

  const [title, setTitle] = useState<string>("");

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [groupCategoryList, setGroupCategoryList] = useState<GroupCategoryListModelForSelect>({ groupList: [], categoryList: [] })

  const [groupList, setGroupList] = useState<{ key: string, value: string }[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [categoryList, setCategoryList] = useState<{ key: string, value: string, groupId?: number }[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<{ key: string, value: string, groupId?: number }>({ key: "0", value: "Seçiniz...", groupId: 0 });

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
    getHelpContentDetail();
  }, [groupList])

  useEffect(() => {
    getCategoryList();
  }, [selectedGroup])

  const getHelpGroupList = async () => {
    setLoading(true);

    const _result = await ApiService.getHelpGroupForDropdown();


    if (_result.succeeded === true) {

      let _curryArrayCategory: { key: string, value: string, groupId: number }[] = []
      _result.data.categoryList.map((item) => (
        _curryArrayCategory.push({
          key: String(item.Id),
          value: item.Title,
          groupId: item.ParentId
        })
      ));
      setCategoryList([..._curryArrayCategory]);

      groupCategoryList.categoryList = _curryArrayCategory

      let _curryArrayGroup: { key: string, value: string }[] = []
      _result.data.groupList.map((item) => (
        _curryArrayGroup.push({
          key: String(item.Id),
          value: item.Title
        })
      ));
      setGroupList([..._curryArrayGroup]);

      groupCategoryList.groupList = _curryArrayGroup

      setLoading(false);
    }
    else {
      setGroupList([]);
      setLoading(false);
    }
  }

  const getHelpContentDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getHelpContentDetail(Id);

    if (_result.succeeded === true) {
      setTitle(_result.data.Title);
      setSelectedGroup(groupList.find(i => i.key === String(_result.data.GroupId)) ?? { key: "0", value: "Seçiniz" });
      setCategoryList(categoryList.filter(i => i.groupId === _result.data.GroupId))
      setSelectedCategory(categoryList.find(i => i.key === String(_result.data.CategoryId)) ?? { key: "0", value: "Seçiniz", groupId: 0 });
      setOrder(_result.data.OrderBy);
      setDescription(_result.data.Description ?? "");

      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/yardim-icerik-listesi'); }
      });
    }
  }

  const handleUpdateHelpContent = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateHelpContent(Id, title, Number(selectedCategory.key), order ?? 0, description, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yardım içeriği başarıyla güncellendi",
        onClose: () => { context.hideModal(); }
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

  const getCategoryList = () => (
    setSelectedCategory({ key: "0", value: "seçiniz", groupId: 0 }),
    setCategoryList(groupCategoryList.categoryList.filter(i => i.groupId === Number(selectedGroup.key)))
  )

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="border-b pb-5">Yardım İçeriğini Düzenle</h2>
        <div className="flex flex-col">
          <div className="w-1/2">
            <Label isRequired withoutDots title="İçerik Başlığı" className="mt-4" />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" value={title} onChange={(e) => { setTitle(e.target.value) }} />
            }
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
                onItemSelected={item => { setSelectedGroup(item); }} />
            }
            <Label withoutDots isRequired title="Kategori" className="mt-4" />
            {loading ?
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
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="number" value={order} onChange={(e) => { setOrder(parseInt(e.target.value)) }} />
            }
            <Label isRequired withoutDots title="İçerik Açıklaması" className="mt-4" />
            {loading ? <Loading inputMd />
              :
              <CKEditor
                editor={ClassicEditor}
                data={description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
              />
            }
            <div className="flex items-center justify-between my-4">
              <span className="p-sm font-medium text-gray-700">Aktif olarak göster</span>
              <ToggleButton loading={loading} onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
            </div>
          </div>
          <div className="flex">
            <Button textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push('/yardim-icerik-listesi'); }} />
            <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { handleUpdateHelpContent() }} />
          </div>
        </div>
      </div>
    </div>
  )
}
