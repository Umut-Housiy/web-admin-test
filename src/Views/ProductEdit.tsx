import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import CoverPhoto from '../Assets/coverPhoto.svg'
import { DynamicInput } from "../Components/DynamicInput";
import { AlertIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ProductGroupDataAdd } from "../Components/ProductGroupDataAdd";
import { useStateEffect } from "../Components/UseStateEffect";
import {
  CategoryPropertiesListModel,
  CategoryPropertyValueListModel,
  CategoryVariationsListModel,
  CategoryVariationValueListModel
} from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVICES } from "../Services/Constants";
import { ProductDropzone } from "../Components/ProductDropzone";
import { CategorySelectSeller } from "../Components/CategorySelectSeller";
import { Dropdown } from "../Components/Dropdown";

interface RouteParams {
  id: string
}

export const ProductEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [images, setImages] = useState<{ name: string, url: string, isMain: boolean }[]>([]);

  const [coverPhoto, setCoverPhoto] = useState<string>(CoverPhoto);

  const [productName, setProductName] = useState<string>("");

  const [barcodeNo, setBarcodeNo] = useState<string>("");

  const [modelNo, setModelNo] = useState<string>("");

  const [groupData, setGroupData] = useState<string>("");

  const [categoryId, setCategoryId] = useState<number>(0);

  const [categoryDisplayText, setCategoryDisplayText] = useState<string>("");

  const [categoryVariations, setCategoryVariations] = useState<CategoryVariationsListModel[]>([]);

  const [selectedVariations, setSelectedVariations] = useState<CategoryVariationValueListModel[]>([]);

  const [categoryProperties, setCategoryProperties] = useState<CategoryPropertiesListModel[]>([]);

  const [selectedProperties, setSelectedProperties] = useState<CategoryPropertyValueListModel[]>([]);

  const [brandOptions, setBrandOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedBrandOption, setSelectedBrandOption] = useState<{ key: string, value: string }>({ key: "0", value: "Marka" });

  const [description, setDescription] = useState<string>("");

  const [coverText, setCoverText] = useState<string>("");

  const [desi, setDesi] = useState<string>("");

  const [selectedTaxValue, setSelectedTaxValue] = useState<{ key: string, value: string }>({ key: "18", value: "%18" });

  const [isChangedCategoryId, setIsChangedCategoryId] = useState<boolean>(false);

  const taxValues = [
    // { key: "0", value: "%0" },
    { key: "1", value: "%1" },
    { key: "8", value: "%8" },
    { key: "18", value: "%18" }
  ];


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
    getBrandList();
  }, []);

  useStateEffect(() => {
    getProductDetailForAdmin();
  }, [brandOptions]);

  const getBrandList = async () => {
    const _result = await ApiService.getBrandList(1, 9999, "", 1);

    if (_result.succeeded) {
      let _tempList: { key: string, value: string }[] = [];
      _result.data.Data.forEach(item => {
        _tempList.push({key: String(item.Id), value: String(item.Name)});
      });
      setBrandOptions(_tempList);
    }
  }

  const [loadingVariation, setLoadingVariation] = useState<boolean>(false);

  useStateEffect(async () => {
    if (isChangedCategoryId) {
      setSelectedVariations([]);
      setSelectedProperties([]);
    }
    setLoadingVariation(true);
    const result = await ApiService.getCategoryVariations(categoryId);
    if (result.succeeded) {
      setCategoryVariations(result.data);
    }

    const resultProperties = await ApiService.getCategoryProperties(categoryId);
    if (resultProperties.succeeded) {
      setCategoryProperties(resultProperties.data);
    }
    setLoadingVariation(false);

    setIsChangedCategoryId(true);
  }, [categoryId]);

  useStateEffect(async () => {
    let _tempSelectedVariations: CategoryVariationValueListModel[] = []
    selectedVariations.forEach((item) => {
      if (categoryVariations.find(i => i.Id === item.ElementId) !== undefined) {
        _tempSelectedVariations.push(item)
      }
    });
    setSelectedVariations(_tempSelectedVariations);
  }, [categoryVariations]);

  useStateEffect(async () => {
    let _tempSelectedProperties: CategoryPropertyValueListModel[] = []
    selectedProperties.forEach((item) => {
      if (categoryProperties.find(i => i.Id === item.ElementId) !== undefined) {
        _tempSelectedProperties.push(item)
      }
    });
    setSelectedProperties(_tempSelectedProperties);
  }, [categoryProperties]);



  const getProductDetailForAdmin = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getProductDetailForAdmin(Number(params.id ?? "0"));

    if (_result.succeeded) {
      setCategoryId(_result.data.CategoryId);
      setProductName(_result.data.ProductName);
      setSelectedBrandOption(brandOptions.find(x => x.key === _result.data.BrandId.toString()) ?? {
        key: "0",
        value: "Marka"
      });
      setBarcodeNo(_result.data.BarcodeNo);
      setModelNo(_result.data.ModelNo);
      setCoverText(_result.data.ShortDescription);
      try {
        setSelectedVariations(JSON.parse(_result.data.Variations) ?? []);
      } catch {
      }
      try {
        setSelectedProperties(JSON.parse(_result.data.Properties) ?? []);
      } catch {
      }
      setGroupData(_result.data.GroupData);
      setDescription(_result.data.Description);
      setDesi(_result.data.Desi?.toString() ?? "");
      setSelectedTaxValue(taxValues.find(x => x.key === String(_result.data.TaxRate)) ?? {key: "18", value: "%18"});
      //
      let _tempList: { name: string, url: string, isMain: boolean }[] = [];
      _result.data.Images.forEach((item) => {
        _tempList.push({name: item.PhotoUrl, url: item.PhotoUrl, isMain: item.IsMainPhoto});
      });
      setImages(_tempList);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/urun-ilan-listesi"); }
      });
    }
  }

  const updateProduct = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProductAndAdvert(
      Number(params.id), //ProductId
      0, //AdvertId
      categoryId, //CategoryId
      productName, //Name
      Number(selectedBrandOption.key), //BrandId
      barcodeNo, //BarcodeNo
      "", //ModelNo
      coverText, //ShortDescription
      0, //ShippingPrepareDay
      true, //ShowProduct
      "", //StockCode
      "", //SalePrice
      "", //MarketPrice
      Number(selectedTaxValue.key), //TaxRate
      0, //Stock
      desi, //Desi
      selectedVariations, //Variations
      selectedProperties, //Properties
      groupData, //GroupData
      description, //Description
      images.map(x => { return { IsMainPhoto: x.isMain, PhotoUrl: x.url } }) //Images
    );

    setProcessLoading(false);

    if (_result.succeeded) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi",
        onClose: () => {
          context.hideModal();
          history.push(`/urun-detay/${Number(params.id)}`);
        }
      });
    } else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => context.hideModal(),
      });
    }
  }

  const setSingleVariation = (elementId: number, dataType: number, value: string) => {

    const element = selectedVariations.find(x => x.ElementId === elementId);
    if (element) {
      let otherElements = selectedVariations.filter(x => x.ElementId !== elementId);
      element.Value = value;

      setSelectedVariations([...otherElements, element]);
    }
    else {
      let nR: CategoryVariationValueListModel = { DataType: dataType, ElementId: elementId, Value: value };
      setSelectedVariations([...selectedVariations, nR]);
    }
  }

  const setSingleProperty = (elementId: number, dataType: number, value: string) => {

    const element = selectedProperties.find(x => x.ElementId === elementId);
    if (element) {
      let otherElements = selectedProperties.filter(x => x.ElementId !== elementId);
      element.Value = value;

      setSelectedProperties([...otherElements, element]);

    }
    else {
      let nR: CategoryPropertyValueListModel = { DataType: dataType, ElementId: elementId, Value: value };
      setSelectedProperties([...selectedProperties, nR]);
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2>Ürün Bilgileri Düzenle</h2>
        <div className="w-full bg-gray-100 my-5 p-5 flex">
          <div className="text-sm my-auto ">
            <div className="flex">
              <AlertIcon className="w-4 h-4 text-red-400"/><span className="ml-2 font-medium">Değişikliklerinizi kaydediniz</span>
            </div>
          </div>
          <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
            <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-blue-400" text="Kaydet"
                    onClick={updateProduct}/>
            <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-gray-100" text="Vazgeç"
                    onClick={() => history.push(`/urun-detay/${Number(params.id)}`)}/>
          </div>
        </div>
        <div className="w-full py-4 border-t border-gray-300">
          {
            loading ?
              <Loading height="h-72" width="w-full" />
              :
              <ProductDropzone images={images} setImages={setImages} setCoverPhoto={setCoverPhoto} />
          }
        </div>
        <div className="w-full flex gap-8 border-t border-gray-300">
          <div className="w-1/2 py-4">
            <h2 className="mb-2">Ürün Bilgileri</h2>
            <Label withoutDots title="Ürün Kategorisi" />
            {
              loading ?
                <Loading inputSm/>
                :
                <CategorySelectSeller value={categoryId} onChange={setCategoryId}
                                      setCategoryDisplayText={setCategoryDisplayText}/>
            }
            <Label withoutDots title="Ürün Adı" />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" value={productName} onChange={(e) => { setProductName(e.target.value); }} />
            }
            <Label className="mt-4" withoutDots title="Marka" />
            {
              loading ?
                <Loading inputSm />
                :
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "brandSelect"}
                  onClick={() => { setCurrentOpenedFilterButton("brandSelect"); }}
                  label={selectedBrandOption.value}
                  items={brandOptions}
                  onItemSelected={item => { setSelectedBrandOption(item); }} />
            }
            <Label className="mt-4" withoutDots title="Barkod No" />
            {
              loading ?
                <Loading inputSm/>
                :
                <input className="form-input" value={barcodeNo}
                       onChange={({target: {value}}) => setBarcodeNo(value)}/>
            }
            <Label className="mt-4" withoutDots title="Model No" />
            {
              loading ?
                <Loading inputSm/>
                :
                <input className="form-input bg-gray-100" value={modelNo}
                       onChange={({target: {value}}) => setModelNo(value)} disabled/>
            }
            <Label className="mt-4" withoutDots title="Desi" />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input " value={desi} onChange={(e) => { setDesi(e.target.value); }} />
            }
            <Label className="mt-4" withoutDots title="Kdv Oranı" />
            {
              loading ?
                <Loading inputSm />
                :
                <Dropdown
                  key="vatValue"
                  isDropDownOpen={currentOpenedFilterButton === "vatValue"}
                  onClick={() => { setCurrentOpenedFilterButton("vatValue"); }}
                  label={selectedTaxValue.value}
                  items={taxValues}
                  onItemSelected={item => { setSelectedTaxValue(item) }} />
            }
            <Label className="mt-4" withoutDots title="Ön Yazı" />
            {
              loading ?
                <Loading inputMd />
                :
                <textarea className="text-sm w-full p-3 text-gray-900 border border-gray-300 rounded-lg outline-none focus:outline-none focus:border-blue-400 transition-colors duration-300 resize-none leading-5"
                  placeholder="Ön Yazı"
                  rows={3} value={coverText} onChange={(e) => { setCoverText(e.target.value); }} />
            }
          </div>
          <div className="w-1/2 py-4">
            <h2 className="-mb-2">Ürün Varyasyon Seçimleri</h2>
            {
              loadingVariation ?
                <div className="mt-4">
                  <Loading inputSm />
                </div>
                :
                categoryVariations.map((item, i) => (
                  <DynamicInput
                    uploadUrl={SERVICES.API_ADMIN_PRODUCT_URL + "/upload-dropzone-image"}
                    dataType={item.DataType}
                    elementId={item.Id}
                    name={item.Name}
                    setDynamicData={setSingleVariation}
                    isRequired={item.IsRequired}
                    key={"v-" + i}
                    data={item.Options.map(x => {
                      return {
                        key: x.Id.toString(),
                        value: x.Name
                      };
                    })}
                    selectedValue={selectedVariations.find(x => x.ElementId === item.Id)?.Value}
                  />
                ))
            }
          </div>
        </div>
        <div className="w-full flex gap-8 border-t border-gray-300">
          <div className="w-1/2 py-4">
            <h2 className="mb-2">Ürün Özellikleri</h2>
            {
              loadingVariation ?
                <Loading inputSm />
                :
                categoryProperties.map((item, i) => (
                  <DynamicInput
                    uploadUrl={SERVICES.API_ADMIN_PRODUCT_URL + "/upload-dropzone-image"}
                    dataType={item.DataType}
                    elementId={item.Id}
                    name={item.Name}
                    setDynamicData={setSingleProperty}
                    isRequired={item.IsRequired}
                    key={"p-" + i}
                    data={item.Options.map(x => {
                      return {
                        key: x.Id.toString(),
                        value: x.Name
                      };
                    })}
                    selectedValue={selectedProperties.find(x => x.ElementId === item.Id)?.Value}
                  />
                ))
            }
          </div>
          <div className="w-1/2 py-4">
            <h2 className="mb-2">Takım İçeriği</h2>
            {
              loading ?
                <Loading inputSm />
                :
                <ProductGroupDataAdd groupData={groupData} setGroupData={setGroupData} />
            }
          </div>
        </div>
        <div className="w-full flex gap-8 border-t border-gray-300">
          <div className="w-1/2 py-4">
            <Label className="mb-2" withoutDots title="Ürün Bilgisi" />
            {
              loading ?
                <Loading inputMd />
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
          </div>
        </div>

        <div className="flex mt-12">
          <Button isLoading={processLoading} textTiny className="ml-auto w-24" text="Vazgeç" color="text-gray-400" onClick={() => { history.push(`/urun-detay/${Number(params.id)}`); }} />
          <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateProduct(); }} />
        </div>
      </div>
    </div>
  )
}
