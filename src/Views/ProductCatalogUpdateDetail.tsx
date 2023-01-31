import { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { AlertIcon, ChevronRightIcon, CoverPhotoIcon, StarIcon } from "../Components/Icons";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { useStateEffect } from "../Components/UseStateEffect";
import ApiService from "../Services/ApiService";
import { ProductAdminDetailModel, ProductAdminUpdateRequestDetailModel, ProductImageModel, CategoryPropertiesListModel, CategoryVariationsListModel, CategoryVariationValueListModel, CategoryPropertyValueListModel } from "../Models";
import { Loading } from "../Components/Loading";
import { formatter, fraction } from "../Services/Functions";
import Slider from "react-slick";
import { TabsTitle } from "../Components/TabsTitle";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { DateView } from "../Components/DateView";

interface RouteParams {
  id: string
}

interface AdvertGropDataModel {
  name: string,
  value: string
}

interface LocationModel {
  queryPage: number,
}

export const ProductCatalogUpdateDetail: FunctionComponent = () => {

  const tabsLink = [
    { id: 1, name: "Mevcut Ürün Bilgisi" },
    { id: 2, name: "Güncellenen Ürün Bilgisi" },
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [mediaListForProduct, setMediaListForProduct] = useState<ProductImageModel[]>([]);

  const [mediaListForRequest, setMediaListForRequest] = useState<ProductImageModel[]>([]);

  const [categoryIdForProduct, setCategoryIdForProduct] = useState<number>(0);

  const [categoryVariations, setCategoryVariations] = useState<CategoryVariationsListModel[]>([]);

  const [categoryFeatures, setCategoryFeatures] = useState<CategoryPropertiesListModel[]>([]);

  const [productVariations, setProductVariations] = useState<CategoryVariationValueListModel[]>([]);

  const [requestVariations, setRequestVariations] = useState<CategoryVariationValueListModel[]>([]);

  const [productFeatures, setProductFeatures] = useState<CategoryPropertyValueListModel[]>([]);

  const [requestFeatures, setRequestFeatures] = useState<CategoryPropertyValueListModel[]>([]);

  const [groupDataForProduct, setGroupDataForProduct] = useState<AdvertGropDataModel[]>([]);

  const [groupDataForRequest, setGroupDataForRequest] = useState<AdvertGropDataModel[]>([]);

  const [groupDataForProductString, setGroupDataForProductString] = useState<string>("");

  const [groupDataForRequestString, setGroupDataForRequestString] = useState<string>("");

  const [productDetail, setProductDetail] = useState<ProductAdminDetailModel>();

  const [requestDetail, setRequestDetail] = useState<ProductAdminUpdateRequestDetailModel>({} as ProductAdminUpdateRequestDetailModel);

  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const multipleItems6Half = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplaySpeed: 4000,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  }

  useEffect(() => {
    getProductUpdateRequestDetail();
  }, []);

  useStateEffect(async () => {
    const result = await ApiService.getCategoryVariations(categoryIdForProduct);
    if (result.succeeded) {
      setCategoryVariations(result.data);
    }

    const resultProperties = await ApiService.getCategoryProperties(categoryIdForProduct);
    if (resultProperties.succeeded) {
      setCategoryFeatures(resultProperties.data);
    }
  }, [categoryIdForProduct]);


  const getProductUpdateRequestDetail = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getProductUpdateRequestDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      //category
      setCategoryIdForProduct(_result.data?.Product?.CategoryId);
      //media-lists
      setMediaListForProduct(_result.data.Product.Images);
      setMediaListForRequest(_result.data.UpdateRequest.Images);
      //detail
      setProductDetail(_result.data.Product);
      setRequestDetail(_result.data.UpdateRequest);
      //variations
      try { setProductVariations(JSON.parse(_result.data.Product.Variations) ?? []); } catch { }
      try { setRequestVariations(JSON.parse(_result.data.UpdateRequest.Variations) ?? []); } catch { }
      //properties
      try { setProductFeatures(JSON.parse(_result.data.Product.Properties) ?? []); } catch { }
      try { setRequestFeatures(JSON.parse(_result.data.UpdateRequest.Properties) ?? []); } catch { }
      //groupData
      try { setGroupDataForProduct(JSON.parse(_result.data.Product.GroupData) ?? []); } catch { }
      try { setGroupDataForRequest(JSON.parse(_result.data.UpdateRequest.GroupData) ?? []); } catch { }

      setGroupDataForProductString(_result.data.Product.GroupData);
      setGroupDataForRequestString(_result.data.UpdateRequest.GroupData)

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/urun-katalogu-guncelleme-listesi"); }
      });
    }
  }

  const approveProductUpdate = async () => {
    setProcessLoading(true);

    const _result = await ApiService.approveProductUpdate(Number(params.id ?? "0"));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürün güncellemesi onaylandı",
        onClose: () => { context.hideModal(); history.push("/urun-katalogu-guncelleme-listesi"); }
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

  const rejectProductUpdate = async () => {
    setProcessLoading(true);

    const _result = await ApiService.rejectProductUpdate(Number(params.id ?? "0"));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürün güncellemesi reddedildi",
        onClose: () => { context.hideModal(); history.push("/urun-katalogu-guncelleme-listesi"); }
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

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }


  const returnDynamicInputs = (list, type, key) => {
    return list.map((item, index) => {//DATE_RANGE
      if (item.DataType === 1) {
        return (
          <Label loading={loading} flexStart key={key + index}
            title={type.find(x => x.Id === item.ElementId)?.Name ?? ""}
            desc={handleJsDate(JSON.parse(item.Value).StartDate) + " - " + handleJsDate(JSON.parse(item.Value).EndDate)} titleWidth="w-1/3" descWidth="w-2/3" />
        )
      }
      else if (item.DataType === 2) {//DATE
        return (
          <Label loading={loading} flexStart key={key + index}
            title={type.find(x => x.Id === item.ElementId)?.Name ?? ""}
            desc={handleJsDate(Number(item.Value))} titleWidth="w-1/3" descWidth="w-2/3" />
        )
      }
      else if (item.DataType === 3) {//ONE_CHOICE
        return (
          <Label loading={loading} flexStart key={key + index}
            title={type.find(x => x.Id === item.ElementId)?.Name ?? ""}
            desc={type.find(x => x.Id === item.ElementId)?.Options.find(y => y.Id === Number(item.Value))?.Name} titleWidth="w-1/3" descWidth="w-2/3" />
        )
      }
      else if (item.DataType === 4 || item.DataType === 5) {//NUMBER || TEXT
        return (
          <Label loading={loading} flexStart key={key + index}
            title={type.find(x => x.Id === item.ElementId)?.Name ?? ""}
            desc={item.Value} titleWidth="w-1/3" descWidth="w-2/3" />
        )
      }
      else if (item.DataType === 6) {//MEDIA
        return (
          <Label loading={loading} flexStart key={key + index}
            title={type.find(x => x.Id === item.ElementId)?.Name ?? ""}
            desc={<Image className="ml-2 w-20 h-20 object-contain" src={item.Value} />} titleWidth="w-1/3" descWidth="w-2/3" />
        )
      }
      else if (item.DataType === 7) {//MULTIPLE_CHOICE
        return (
          <Label loading={loading} flexStart key={key + index}
            title={type.find(x => x.Id === item.ElementId)?.Name ?? ""}
            desc={JSON.parse(item.Value).Text} titleWidth="w-1/3" descWidth="w-2/3" />
        )
      }
      else if (item.DataType === 8) {//PRICE
        return (
          <Label loading={loading} flexStart key={key + index}
            title={type.find(x => x.Id === item.ElementId)?.Name ?? ""}
            desc={Number(item.Value) % 1 === 0 ?
              <>{fraction.format(Number(item.Value))} TL </>
              :
              <>{formatter.format(Number(item.Value))} TL</>
            }
            titleWidth="w-1/3" descWidth="w-2/3" />
        )
      }
      else {
        return (
          <></>
        )
      }
    })
  }

  const returnDynamicInputsChange = (requestVariationList, categoryVariationList, key, productVariationList) => {
    return productVariationList.map((item, index) => {//DATE_RANGE
      if (item.DataType === 1) {
        const _changedTypeOne = requestVariationList.filter(e => e.DataType === 1 && e.ElementId === item.ElementId)[0];

        if (_changedTypeOne === null || _changedTypeOne === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc="İstek Gönderen Mağaza Tarafından Silinmiş"
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={(item.Value !== _changedTypeOne?.Value) ? (handleJsDate(JSON.parse(_changedTypeOne?.Value).StartDate) + " - " + handleJsDate(JSON.parse(_changedTypeOne?.Value).EndDate)) : "-"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
      }
      else if (item.DataType === 2) {//DATE
        const _changedTypeTwo = requestVariationList.filter(e => e.DataType === 2 && e.ElementId === item.ElementId)[0];

        if (_changedTypeTwo === null || _changedTypeTwo === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc="İstek Gönderen Mağaza Tarafından Silinmiş"
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={(item.Value !== _changedTypeTwo?.Value) ? handleJsDate(Number(_changedTypeTwo?.Value)) : "-"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
      }
      else if (item.DataType === 3) {//ONE_CHOICE
        const _changedTypeThree = requestVariationList.filter(e => e.DataType === 3 && e.ElementId === item.ElementId)[0];

        if (_changedTypeThree === null || _changedTypeThree === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc="İstek Gönderen Mağaza Tarafından Silinmiş"
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={(item.Value !== _changedTypeThree?.Value) ? categoryVariationList.find(x => x.Id === _changedTypeThree?.ElementId)?.Options.find(y => y.Id === Number(_changedTypeThree?.Value))?.Name : "-"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
      }
      else if (item.DataType === 4 || item.DataType === 5) {//NUMBER || TEXT
        const _changedTypeFour = requestVariationList.filter(e => (e.DataType === 4 || e.DataType === 5) && e.ElementId === item.ElementId)[0];

        if (_changedTypeFour === null || _changedTypeFour === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc="İstek Gönderen Mağaza Tarafından Silinmiş"
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={(item.Value !== _changedTypeFour?.Value) ? _changedTypeFour?.Value : "-"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
      }
      else if (item.DataType === 6) {//MEDIA
        const _changedTypeSix = requestVariationList.filter(e => e.DataType === 6 && e.ElementId === item.ElementId)[0];

        if (_changedTypeSix === null || _changedTypeSix === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc="İstek Gönderen Mağaza Tarafından Silinmiş"
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={(item.Value !== _changedTypeSix?.Value) ? <Image className="ml-2 w-20 h-20 object-contain" src={_changedTypeSix?.Value} /> : "-"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
      }
      else if (item.DataType === 7) {//MULTIPLE_CHOICE
        const _changedTypeSeven = requestVariationList.filter(e => e.DataType === 7 && e.ElementId === item.ElementId)[0];

        if (_changedTypeSeven === null || _changedTypeSeven === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc="İstek Gönderen Mağaza Tarafından Silinmiş"
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={(item.Value !== _changedTypeSeven?.Value) ? JSON.parse(_changedTypeSeven?.Value).Text : "-"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
      }
      else if (item.DataType === 8) {//PRICE
        const _changedTypeEight = requestVariationList.filter(e => e.DataType === 8 && e.ElementId === item.ElementId)[0];

        if (_changedTypeEight === null || _changedTypeEight === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc="İstek Gönderen Mağaza Tarafından Silinmiş"
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={(item.Value !== _changedTypeEight?.Value) ? (Number(_changedTypeEight?.Value) % 1 === 0 ?
                <>{fraction.format(Number(_changedTypeEight?.Value))} TL </>
                :
                <>{formatter.format(Number(_changedTypeEight?.Value))} TL</>) : "-"
              }
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
      }
      else {
        return (
          <></>
        )
      }
    })
  }

  const returnDynamicInputsAdd = (requestVariationList, categoryVariationList, key, productVariationList) => {
    return requestVariationList.map((item, index) => {//DATE_RANGE
      if (item.DataType === 1) {
        const _addedTypeOne = productVariationList.filter(e => e.DataType === 1 && e.ElementId === item.ElementId)[0];

        if (_addedTypeOne === null || _addedTypeOne === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={(handleJsDate(JSON.parse(item?.Value).StartDate) + " - " + handleJsDate(JSON.parse(item?.Value).EndDate)) + " (İstek Gönderen Mağaza Tarafından Eklenmiş)"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (<></>)
        }
      }
      else if (item.DataType === 2) {//DATE
        const _addedTypeTwo = productVariationList.filter(e => e.DataType === 2 && e.ElementId === item.ElementId)[0];

        if (_addedTypeTwo === null || _addedTypeTwo === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={handleJsDate(Number(item?.Value)) + " (İstek Gönderen Mağaza Tarafından Eklenmiş)"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (<></>)
        }
      }
      else if (item.DataType === 3) {//ONE_CHOICE
        const _addedTypeThree = productVariationList.filter(e => e.DataType === 3 && e.ElementId === item.ElementId)[0];

        if (_addedTypeThree === null || _addedTypeThree === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={categoryVariationList.find(x => x.Id === item?.ElementId)?.Options.find(y => y.Id === Number(item?.Value))?.Name + " (İstek Gönderen Mağaza Tarafından Eklenmiş)"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (<></>)
        }
      }
      else if (item.DataType === 4 || item.DataType === 5) {//NUMBER || TEXT
        const _addedTypeFour = productVariationList.filter(e => (e.DataType === 4 || e.DataType === 5) && e.ElementId === item.ElementId)[0];

        if (_addedTypeFour === null || _addedTypeFour === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={item?.Value + " (İstek Gönderen Mağaza Tarafından Eklenmiş)"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (<></>)
        }
      }
      else if (item.DataType === 6) {//MEDIA
        const _addedTypeSix = productVariationList.filter(e => e.DataType === 6 && e.ElementId === item.ElementId)[0];

        if (_addedTypeSix === null || _addedTypeSix === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={<Image className="ml-2 w-20 h-20 object-contain" src={item?.Value} /> + " (İstek Gönderen Mağaza Tarafından Eklenmiş)"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (<></>)
        }
      }
      else if (item.DataType === 7) {//MULTIPLE_CHOICE
        const _addedTypeSeven = productVariationList.filter(e => e.DataType === 7 && e.ElementId === item.ElementId)[0];

        if (_addedTypeSeven === null || _addedTypeSeven === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={JSON.parse(item?.Value).Text + " (İstek Gönderen Mağaza Tarafından Eklenmiş)"}
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (<></>)
        }
      }
      else if (item.DataType === 8) {//PRICE
        const _addedTypeEight = productVariationList.filter(e => e.DataType === 8 && e.ElementId === item.ElementId)[0];

        if (_addedTypeEight === null || _addedTypeEight === undefined) {
          return (
            <Label loading={loading} flexStart key={key + index}
              title={categoryVariationList.find(x => x.Id === item.ElementId)?.Name ?? ""}
              desc={(Number(item?.Value) % 1 === 0 ?
                <>{fraction.format(Number(item?.Value))} TL (İstek Gönderen Mağaza Tarafından Eklenmiş)</>
                :
                <>{formatter.format(Number(item?.Value))} TL (İstek Gönderen Mağaza Tarafından Eklenmiş)</>)
              }
              titleWidth="w-1/3" descWidth="w-2/3" />
          )
        }
        else {
          return (<></>)
        }
      }
      else {
        return (
          <></>
        )
      }
    })
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/urun-katalogu-guncelleme-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/urun-katalogu-guncelleme-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Katalog Güncellemesi Bekleyen Ürünler
          </div>
        </Link>
        <h2>Ürün Bilgisi</h2>
        {loading ?
          <Loading className="mt-5" width="w-full" height="h-20" />
          :
          <div className={`${requestDetail.Status === 0 ? "bg-gray-100" : requestDetail.Status === 1 ? "bg-green-100" : "bg-red-100"} w-full my-4 p-4 flex`}>
            <div className={`${requestDetail.Status === 0 ? "text-gray-900" : requestDetail.Status === 1 ? "text-green-400" : "text-red-400"} text-sm my-auto flex font-medium`} >
              <AlertIcon className="w-4 h-4 text-red-400" />
              <span className="ml-2">
                {requestDetail.Status === 0 ? "Bu ürün güncellemeleri onayınızı bekliyor" : requestDetail.Status === 1 ? "Bu ürün güncellemeleri onaylanmıştır" : "Bu ürün güncellemeleri reddedilmiştir"}
              </span>
            </div>
            {requestDetail.Status !== 1 &&
              <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                {requestDetail.Status === 0 ?
                  <>
                    <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-blue-400" text="Onayla" onClick={() => { approveProductUpdate(); }} />
                    <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-gray-100" text="Reddet" onClick={() => { rejectProductUpdate(); }} />
                  </>
                  :
                  <Button isLoading={processLoading} buttonSm className="w-44" design="button-gray-100 text-sm" text="Red Detayını Gör" onClick={() => { setShowRejectModal(true) }} />
                }
              </div>
            }
          </div>
        }

        <h2>Güncelleme Yapan Satıcı</h2>
        <div className="my-4 w-1/2 border boder-gray-300">
          <div className="grid grid-cols-3 p-5 flex items-center border-b border-gray-300">
            <div className="col-span-1 text-sm text-gray-700 font-medium">Satıcı Adı</div>
            <div className="col-span-1 text-sm text-gray-700 font-medium">Satıcı Puanı</div>
            <div className="col-span-1 text-sm text-gray-700 font-medium">Durum</div>
          </div>
          {
            loading ?
              <Loading textMd />
              :
              <>
                <div className="grid grid-cols-3 p-5 flex items-center ">
                  <div className="col-span-1 flex gap-2 items-center ">
                    <Image src={requestDetail.StorePhoto} alt={requestDetail?.StoreName} className="h-10 w-10 rounded-full content-cover" />
                    <div className="col-span-1 text-sm text-gray-900 font-medium">{requestDetail?.StoreName}</div>
                  </div>
                  <div className="col-span-1 flex gap-2 items-center text-yellow-600">
                    <StarIcon className="icon-sm" />
                    <div className="col-span-1 text-sm font-medium">{requestDetail?.StoreRate}</div>
                  </div>
                  <div className="col-span-1 flex gap-2 items-center justify-between">
                    <div className={`${requestDetail?.IsStoreEnable ? "text-green-400" : "text-red-400"} text-sm font-medium`}>{requestDetail?.IsStoreEnable ? "Aktif" : "Pasif"}</div>
                    <ChevronRightIcon className="w-5 h-5 hover:text-blue-400 cursor-pointer" onClick={() => { history.push(`/satici-detay/${requestDetail?.SellerId}`); }} />
                  </div>
                </div>
              </>
          }
        </div>

        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />

        {selectedTabsId === 1 ?

          <div className="w-full">
            <div className="py-4 w-full mt-4">
              <h4 className="mb-4">Ürün Galerisi</h4>
              {loading ?
                <div className="grid lg:grid-cols-5 gap-4">
                  <Loading width="w-full" height="h-40" />
                  <Loading width="w-full" height="h-40" />
                  <Loading width="w-full" height="h-40" />
                  <Loading width="w-full" height="h-40" />
                  <Loading width="w-full" height="h-40" />
                </div>
                :
                mediaListForProduct.length <= 4 ?
                  <div className="grid lg:grid-cols-5">
                    {mediaListForProduct.map((item, index) => (
                      <div className="col-span-1 relative" key={"media_" + index}>
                        <img key={"mediaListForProduct" + index} src={item.PhotoUrl} className="w-full pr-3 object-contain h-48" alt="Slider" />
                        {item.IsMainPhoto ?
                          <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                        }
                      </div>
                    ))}
                  </div>
                  :
                  <Slider {...multipleItems6Half}>
                    {mediaListForProduct.map((item, index) => (
                      <div className="relative" key={"media_" + index}>
                        <img key={"mediaListForProduct_media_" + index} src={item.PhotoUrl} className="w-full pr-3 object-contain h-48" alt="Slider" />
                        {item.IsMainPhoto ?
                          <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                        }
                      </div>
                    ))}
                  </Slider>
              }
            </div>
            <div className="py-4 w-full border-t border-gray-300">
              <div className="flex w-full gap-8">
                <div className="lg:w-1/2">
                  <h4 className="mb-4">Ürün Bilgileri</h4>
                  <Label loading={loading} flexStart title="Ürün Kategorisi" desc={productDetail?.Category} titleWidth="w-1/3" descWidth="w-2/3" />
                  <Label loading={loading} flexStart title="Ürün Adı" desc={productDetail?.ProductName} titleWidth="w-1/3" descWidth="w-2/3" />
                  <Label loading={loading} flexStart title="Marka" desc={productDetail?.Brand} titleWidth="w-1/3" descWidth="w-2/3" />
                  <Label loading={loading} flexStart title="Ön Yazı" desc={productDetail?.ShortDescription ?? "-"} titleWidth="w-1/3" descWidth="w-2/3" />
                </div>
                <div className="lg:w-1/2">
                  <h4 className="mb-4">Ürün Varyasyon Seçimleri</h4>
                  {
                    loading ?
                      <Loading textMd />
                      :
                      returnDynamicInputs(productVariations, categoryVariations, "productVariations_")
                  }
                </div>
              </div>
            </div>
            <div className="py-4 w-full border-t border-gray-300">
              <div className="flex w-full gap-8">
                <div className="lg:w-1/2">
                  <h4 className="mb-4">Ürün Özellikleri</h4>
                  {
                    loading ?
                      <Loading textMd />
                      :
                      returnDynamicInputs(productFeatures, categoryFeatures, "productFeatures_")
                  }
                </div>
                <div className="lg:w-1/2">
                  {
                    loading ?
                      <Loading inputMd />
                      :
                      (groupDataForProduct.length > 0) ?
                        <>
                          <h4 className="mb-4">Takım İçeriği</h4>
                          {
                            groupDataForProduct.map((item, index) => (
                              <>
                                <div className="flex mb-2" key={"group_" + index}>
                                  <div className="w-1/3 flex p-sm-gray-700"><span>{index + 1 + ". Ürün Adı"}</span><span className="ml-auto">:</span></div>
                                  <div className="text-sm text-gray-900 ml-2">{item.name}</div>
                                </div>
                                <div className="flex mb-2">
                                  <div className="w-1/3 flex p-sm-gray-700"><span>{index + 1 + ". Ürün Ölçüleri"}</span><span className="ml-auto">:</span></div>
                                  <div className="text-sm text-gray-900 ml-2">{item.value}</div>
                                </div>
                              </>
                            ))
                          }
                        </>
                        :
                        <></>
                  }
                </div>
              </div>
            </div>
            <div className="py-4 w-full border-t border-gray-300">
              <h4 className="mb-4">Ürün Açıklamaları</h4>
              <div className="flex w-full gap-8">
                {
                  loading ?
                    <Loading inputMd />
                    :
                    <div dangerouslySetInnerHTML={{ __html: productDetail?.Description ?? "" }} className="ck-editor-links text-sm h-48 w-1/2 p-4 overflow-y-auto custom-scrollbar border border-gray-300 rounded-lg" >
                    </div>
                }
              </div>
            </div>
          </div>
          :
          <>
            <div className="w-full">
              {(mediaListForRequest.length > 0) ?
                <div className="py-4 w-full mt-4">
                  <h4 className="mb-4">Ürün Galerisi</h4>
                  {loading ?
                    <div className="grid lg:grid-cols-5 gap-4">
                      <Loading width="w-full" height="h-40" />
                      <Loading width="w-full" height="h-40" />
                      <Loading width="w-full" height="h-40" />
                      <Loading width="w-full" height="h-40" />
                      <Loading width="w-full" height="h-40" />
                    </div>
                    :
                    <>
                      {mediaListForRequest.length <= 4 ?
                        <div className="grid lg:grid-cols-5">
                          {mediaListForRequest.map((item, index) => (
                            <div className="col-span-1 relative" key={"media_" + index}>
                              <img key={"mediaListForRequest_" + index} src={item.PhotoUrl} className="w-full pr-3 object-contain h-48" alt="Slider" />
                              {item.IsMainPhoto ?
                                <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                              }
                            </div>
                          ))}
                        </div>
                        :
                        <Slider {...multipleItems6Half}>
                          {mediaListForRequest.map((item, index) => (
                            <div className="relative" key={"media_" + index}>
                              <img key={"mediaListForRequest_media_" + index} src={item.PhotoUrl} className="w-full pr-3 object-contain h-48" alt="Slider" />
                              {item.IsMainPhoto ?
                                <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                              }
                            </div>
                          ))}
                        </Slider>
                      }
                    </>
                  }
                </div>
                :
                <></>
              }
              <div className={`py-4 w-full border-gray-300 ${(mediaListForRequest.length > 0) ? "border-t" : ""}`}>
                <div className="flex w-full gap-8">
                  <div className="lg:w-1/2">
                    <h4 className="mb-4">Ürün Bilgileri</h4>
                    <Label loading={loading} flexStart title="Ürün Kategorisi" desc={productDetail?.Category !== requestDetail?.Category ? requestDetail?.Category : "-"} titleWidth="w-1/3" descWidth="w-2/3" />
                    <Label loading={loading} flexStart title="Ürün Adı" desc={productDetail?.ProductName !== requestDetail?.ProductName ? requestDetail?.ProductName : "-"} titleWidth="w-1/3" descWidth="w-2/3" />
                    <Label loading={loading} flexStart title="Marka" desc={productDetail?.Brand !== requestDetail?.Brand ? requestDetail?.Brand : "-"} titleWidth="w-1/3" descWidth="w-2/3" />
                    <Label loading={loading} flexStart title="Ön Yazı" desc={productDetail?.ShortDescription !== requestDetail?.ShortDescription ? requestDetail?.ShortDescription : "-"} titleWidth="w-1/3" descWidth="w-2/3" />
                  </div>
                  <div className="lg:w-1/2">
                    <h4 className="mb-4">Ürün Varyasyon Seçimleri</h4>
                    {
                      loading ?
                        <Loading textMd />
                        :
                        (
                          <>
                            {
                              returnDynamicInputsChange(requestVariations, categoryVariations, "requestVariations_", productVariations)
                            }
                            {
                              returnDynamicInputsAdd(requestVariations, categoryVariations, "requestAddVariations_", productVariations)
                            }
                          </>
                        )
                    }
                  </div>
                </div>
              </div>
              <div className="py-4 w-full border-t border-gray-300">
                <div className="flex w-full gap-8">
                  <div className="lg:w-1/2">
                    <h4 className="mb-4">Ürün Özellikleri</h4>
                    {
                      loading ?
                        <Loading textMd />
                        :
                        (
                          <>
                            {
                              returnDynamicInputsChange(requestFeatures, categoryFeatures, "requestFeatures_", productFeatures)
                            }
                            {
                              returnDynamicInputsAdd(requestFeatures, categoryFeatures, "requestAddFeatures_", productFeatures)
                            }
                          </>
                        )
                    }
                  </div>
                  <div className="lg:w-1/2">
                    {
                      loading ?
                        <Loading inputMd />
                        :
                        (groupDataForProductString !== groupDataForRequestString) ?
                          <>
                            <h4 className="mb-4">Takım İçeriği</h4>
                            {(groupDataForRequest.length > 0) ?
                              (
                                groupDataForRequest.map((item, index) => (
                                  <>
                                    <div className="flex mb-2" key={"group_" + index}>
                                      <div className="w-1/3 flex p-sm-gray-700"><span>{index + 1 + ". Ürün Adı"}</span><span className="ml-auto">:</span></div>
                                      <div className="text-sm text-gray-900 ml-2">{item.name}</div>
                                    </div>
                                    <div className="flex mb-2">
                                      <div className="w-1/3 flex p-sm-gray-700"><span>{index + 1 + ". Ürün Ölçüleri"}</span><span className="ml-auto">:</span></div>
                                      <div className="text-sm text-gray-900 ml-2">{item.value}</div>
                                    </div>
                                  </>
                                ))
                              )
                              :
                              <div className="flex mb-2">
                                <div className="w-1/3 flex p-sm-gray-700"><span>Takım içeriği bilgisi silinmiş</span></div>
                              </div>
                            }
                          </>
                          :
                          <>
                            <h4 className="mb-4">Takım İçeriği</h4>
                            <div className="flex mb-2">
                              <div className="w-1/3 flex p-sm-gray-700"><span>-</span></div>
                            </div>
                          </>
                    }
                  </div>
                </div>
              </div>
              <div className="py-4 w-full border-t border-gray-300">
                <h4 className="mb-4">Ürün Açıklamaları</h4>
                <div className="flex w-full gap-8">
                  {
                    loading ?
                      <Loading inputMd />
                      :
                      <div dangerouslySetInnerHTML={{ __html: requestDetail?.Description === productDetail?.Description ? "-" : requestDetail?.Description }} className="ck-editor-links text-sm h-48 w-1/2 p-4 overflow-y-auto custom-scrollbar border border-gray-300 rounded-lg" >
                      </div>
                  }
                </div>
              </div>
            </div>
          </>
        }
      </div>

      <Modal
        modalType="fixedSm"
        showModal={showRejectModal}
        onClose={() => { setShowRejectModal(false); }}
        title="Red Detayı"
        body={
          <div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Tarihi</div>
            <div className="text-sm  font-medium mt-2">
              <DateView className="text-sm font-medium" dateNumber={requestDetail.RejectDateJSTime ?? 0} pattern="dd/MM/yyyy" />
            </div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Nedeni</div>
            <div className="text-sm  font-medium mt-2">{requestDetail.RejectReason}</div>
          </div>
        }
        footer={
          <Button block design="button-blue-400 mt-4 w-full" text="Kapat" onClick={() => { setShowRejectModal(false); }} />
        }
      />
    </div>
  )
}
