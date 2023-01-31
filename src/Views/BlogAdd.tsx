import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { FileUploader } from "../Components/FileUploader";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVICES } from "../Services/Constants";

export const BlogAdd: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processloading, setProcessLoading] = useState<boolean>(false);

  const [blogTitle, setBlogTitle] = useState<string>("");

  const [blogDescription, setBlogDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [authorOptions, setAutohorOptions] = useState<{ key: string, value: string }[]>([{ key: "0", value: "Yazar" }]);

  const [selectedAuthorOption, setSelectedAuthorOption] = useState<{ key: string, value: string }>({ key: "0", value: "Yazar" });

  const [categoryOptions, setCategoryOptions] = useState<{ key: string, value: string }[]>([{ key: "0", value: "Kategori" }]);

  const [selectedCategoryOption, setSelectedCategoryOption] = useState<{ key: string, value: string }>({ key: "0", value: "Kategori" });

  const [seoTitle, setSeoTitle] = useState<string>("");

  const [seoDescription, setSeoDescription] = useState<string>("");


  ClassicEditor.defaultConfig = {
    ...ClassicEditor.defaultConfig,
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
    getBlogAuthorList();
    getBlogCategoryList();
  }, []);

  useEffect(() => {
    setCurrentOpenedFilterButton("");
  }, [selectedAuthorOption, selectedCategoryOption]);

  const getBlogAuthorList = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getBlogAuthorList(1, 9999, "", 1);

    setLoading(false);
    setProcessLoading(false);

    if (_result.succeeded === true) {
      let _tempList = [{ key: "0", value: "Yazar" }];
      _result.data.Data.forEach((item) => {
        let _tempItem = { key: String(item.Id), value: item.Name };
        _tempList.push(_tempItem);
      });
      setAutohorOptions(JSON.parse(JSON.stringify(_tempList)));
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const getBlogCategoryList = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getBlogCategoryListForDdl();

    setLoading(false);
    setProcessLoading(false);

    if (_result.succeeded === true) {
      let _tempList = [{ key: "0", value: "Kategori" }];
      _result.data.Data.forEach((item) => {
        let _tempItem = { key: String(item.Id), value: item.Name };
        _tempList.push(_tempItem);
      });
      setCategoryOptions(JSON.parse(JSON.stringify(_tempList)));
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const createBlog = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createBlog(blogTitle, Number(selectedAuthorOption.key ?? "0"), Number(selectedCategoryOption.key ?? "0"), blogDescription, isEnabled, selectedFile, seoTitle, seoDescription);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Blog oluşturuldu.",
        onClose: () => { context.hideModal(); setProcessLoading(false); history.push("/blog-listesi"); }
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
          Yeni Blog Oluştur
        </h2>
        <div className="border-t border-gray-200">
          <Label className="mt-6" title="Blog Başlığı" withoutDots isRequired />
          <input className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm" type="text" placeholder="Blog Başlığı" value={blogTitle} onChange={(e) => { setBlogTitle(e.target.value); }} />
          <Label className="mt-6" title="Blog Kapak Görseli" withoutDots isRequired />
          <div className="w-1/2">
            <FileUploader onFileSelected={item => { setSelectedFile(item) }} sizeDescription={"412x247 px"} />
          </div>
          <Label className="mt-6" title="Blog Yazarı" withoutDots />
          <div className="w-1/2">
            {
              loading ?
                <Loading inputSm />
                :
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "authorSelect"}
                  onClick={() => { setCurrentOpenedFilterButton("authorSelect"); }}
                  className="w-full text-black-700 text-sm border-gray-300"
                  classNameDropdown="max-h-40 overflow-y-auto custom-scrollbar"
                  label={selectedAuthorOption.value}
                  items={authorOptions}
                  onItemSelected={item => { setSelectedAuthorOption(item); }} />
            }
          </div>
          <Label className="mt-6" title="Kategori" withoutDots isRequired />
          <div className="w-1/2">
            {
              loading ?
                <Loading inputSm />
                :
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "categorySelect"}
                  onClick={() => { setCurrentOpenedFilterButton("categorySelect"); }}
                  className="w-full text-black-700 text-sm border-gray-300"
                  classNameDropdown="max-h-40 overflow-y-auto custom-scrollbar"
                  label={selectedCategoryOption.value}
                  items={categoryOptions}
                  onItemSelected={item => { setSelectedCategoryOption(item); }} />
            }
          </div>
          <Label className="mt-6" title="SEO Başlığı" withoutDots isRequired />
          <input className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm" type="text" placeholder="SEO Başlığı" value={seoTitle} onChange={(e) => { setSeoTitle(e.target.value); }} />
          <Label className="mt-6" title="SEO Açıklaması" withoutDots isRequired />
          <input className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm" type="text" placeholder="SEO Başlığı" value={seoDescription} onChange={(e) => { setSeoDescription(e.target.value); }} />
          <Label className="mt-6" title="İçerik Açıklaması" withoutDots isRequired />
          <div className="w-1/2" >
            <CKEditor
              editor={ClassicEditor}
              data={blogDescription}
              onChange={(event, editor) => {
                const data = editor.getData();
                setBlogDescription(data);
              }}
            />
          </div>

          <div className="flex mt-4 w-1/2 align-items-center">
            <div className="text-gray-600 text-sm">Aktif olarak göster</div>
            <div className="ml-auto">
              <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
            </div>
          </div>
          <div className="flex">
            <Button isLoading={processloading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/blog-listesi") }} />
            <Button isLoading={processloading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createBlog(); }} />
          </div>
        </div>
      </div>
    </div>
  )
}
