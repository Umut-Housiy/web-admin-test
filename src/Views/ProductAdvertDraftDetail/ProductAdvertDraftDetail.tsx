import { FunctionComponent, useContext, useEffect, useState } from "react";
import { ProductDetail } from "./ProductDetail";
import { SellInformation } from "./SellInformation";
import { OtherVariationList } from "./OtherVariationList";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { AlertIcon, ChevronRightIcon, MagnifyGlassIcon } from "../../Components/Icons";
import { Button } from "../../Components/Button";
import { TabsTitle } from "../../Components/TabsTitle";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { CategoryPropertiesListModel, CategoryPropertyValueListModel, CategoryVariationsListModel, CategoryVariationValueListModel, ProductAdvertAdminDraftDetailModel, ProductImageModel, ProductDraftStatus } from "../../Models";
import { useStateEffect } from "../../Components/UseStateEffect";
import { Modal } from "../../Components/Modal";
import { Label } from "../../Components/Label";
import { Loading } from "../../Components/Loading";

interface RouteParams {
  id: string
}

interface AdvertGropDataModel {
  name: string,
  value: string
}

interface LocationModel {
  prevPath: string,
  queryPage: number,
}

export const ProductAdvertDraftDetail: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const location = useLocation<LocationModel>();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const tabsLink = [
    { id: 1, name: "Ürün Detayı", disabled: false },
    { id: 2, name: "Satış Bilgileri", disabled: false },
    { id: 3, name: "Onay Bekleyen Diğer Varyasyonlar", disabled: false },
  ];

  const [advertDetail, setAdvertDetail] = useState<ProductAdvertAdminDraftDetailModel>();

  const [categoryId, setCategoryId] = useState<number>(0);

  const [mediaList, setMediaList] = useState<ProductImageModel[]>([]);

  const [categoryVariations, setCategoryVariations] = useState<CategoryVariationsListModel[]>([]);

  const [selectedVariations, setselectedVariations] = useState<CategoryVariationValueListModel[]>([]);

  const [categoryProperties, setCategoryProperties] = useState<CategoryPropertiesListModel[]>([]);

  const [selectedProperties, setselectedProperties] = useState<CategoryPropertyValueListModel[]>([]);

  const [groupData, setGroupData] = useState<AdvertGropDataModel[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const [rejectTitle, setRejectTitle] = useState<string>("");

  const [rejectReason, setRejectReason] = useState<string>("");

  useEffect(() => {
    getAdvertDraftDetailForAdmin();
  }, []);

  useStateEffect(async () => {
    var result = await ApiService.getCategoryVariations(categoryId);
    if (result.succeeded) {
      setCategoryVariations(result.data);
    }

    var resultProperties = await ApiService.getCategoryProperties(categoryId);
    if (resultProperties.succeeded) {
      setCategoryProperties(resultProperties.data);
    }
  }, [categoryId]);

  const getAdvertDraftDetailForAdmin = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getAdvertDraftDetailForAdmin(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setCategoryId(_result.data.CategoryId);
      setAdvertDetail(_result.data);
      setMediaList(_result.data.Images);
      try { setselectedVariations(JSON.parse(_result.data.Variations) ?? []); } catch { }
      try { setselectedProperties(JSON.parse(_result.data.Properties) ?? []); } catch { }
      try { setGroupData(JSON.parse(_result.data.GroupData) ?? []); } catch { }
      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/onay-bekleyen-ilanlar"); }
      });
    }
  }

  const approveAdvert = async () => {
    setProcessLoading(true);

    const _result = await ApiService.approveProductAndAdvert(Number(params.id ?? "0"));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İlan onaylandı",
        onClose: () => { context.hideModal(); history.push("/onay-bekleyen-ilanlar"); }
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

  const rejectAdvert = async () => {
    setProcessLoading(true);

    const _result = await ApiService.rejectProductAndAdvert(Number(params.id ?? "0"), rejectTitle, rejectReason);

    setProcessLoading(false);
    setShowRejectModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İlan reddedildi",
        onClose: () => { context.hideModal(); history.push("/onay-bekleyen-ilanlar"); }
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

  const handleJsTime = (JsTime) => {
    if (JsTime !== undefined && JsTime !== null && JsTime !== "") {
      var time = new Date(JsTime);
      return time.toLocaleString() ?? "-";
    }
    else {
      return "-";
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={(location.state?.prevPath !== undefined ? (location.state?.queryPage !== 1 ? (location.state?.prevPath + "?sayfa=" + location.state?.queryPage) : location.state?.prevPath) : (advertDetail?.RejectDate ?? 0 > 0 ? "/reddedilen-ilanlar" : "/onay-bekleyen-ilanlar"))} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            {(advertDetail?.Status === ProductDraftStatus.REJECTED) ? "Reddedilen İlanlar" : "Onay Bekleyen İlanlar"}
          </div>
        </Link>
        <h2 >Ürün İlan Bilgisi</h2>
        {loading ?
          <Loading className="mt-5" width="w-full" height="h-20" />
          :
          ((advertDetail?.Status === ProductDraftStatus.REJECTED) ?
            <div className="w-full bg-gray-100 my-5 p-5 flex">
              <div className="text-sm my-auto ">
                <div className="flex">
                  <AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2 font-medium">{`Bu ilan ${handleJsTime(advertDetail?.RejectDate ?? 0)} tarihinde reddedildi`}</span>
                </div>
              </div>
              <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                <Button isLoading={processLoading} buttonSm textTiny className="w-48" design="button-gray-100" text="Red Detayını Gör" onClick={() => { setShowModal(true); }} />
              </div>
            </div>
            :
            ((advertDetail?.Status === ProductDraftStatus.DRAFT) ?
              <>
                {((advertDetail?.ProductId ?? 0) > 0) ?
                  <div className="w-full bg-gray-100 my-5 p-5 flex">
                    <div className="text-sm my-auto ">
                      <div className="flex">
                        <AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2 font-medium">Bu başvuru onayınızı bekliyor</span>
                      </div>
                      <div className="mt-6">Bu ilan daha önceden eklenmiş bir ürün için oluşturulmuştur. Mağazanın bu ürünü satmasına onay vermek için doğrulayınız</div>
                    </div>
                    <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                      <Button isLoading={processLoading} buttonSm textTiny className="w-48 text-blue-400" design="button-blue-100" text="Ürünü İncele" onClick={() => { history.push(`/urun-detay/${advertDetail?.ProductId ?? "0"}`); }} hasIcon icon={<MagnifyGlassIcon className="icon-sm mr-2" />} />
                      <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-blue-400" text="Onayla" onClick={() => { approveAdvert(); }} />
                      <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-gray-100" text="Reddet" onClick={() => { setShowRejectModal(true); }} />
                    </div>
                  </div>
                  :
                  <div className="w-full bg-gray-100 my-5 p-5 flex">
                    <div className="text-sm my-auto ">
                      <div className="flex">
                        <AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2 font-medium">Bu ürünün kataloğa ve satıcının ilan listesine eklenmesi için onayınız bekleniyor</span>
                      </div>
                      <div className="mt-6">Bu ürünü onayladığınızda ürün kataloğuna ve satıcının ilanlarına eklenecektir. Bu nedenle ürünün barkod ve detay bilgilerinin doğru olduğundan emin olunuz</div>
                    </div>
                    <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                      <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-blue-400" text="Onayla" onClick={() => { approveAdvert(); }} />
                      <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-gray-100" text="Reddet" onClick={() => { setShowRejectModal(true); }} />
                    </div>
                  </div>
                }
              </>
              :
              <></>
            ))
        }
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {
          selectedTabsId === 1 ?
            <>
              <ProductDetail loading={loading} advertDetail={advertDetail} mediaList={mediaList} categoryFeatures={categoryProperties} categoryVariations={categoryVariations} advertFeatures={selectedProperties} advertVariations={selectedVariations} groupData={groupData} />
            </>
            :
            selectedTabsId === 2 ?
              <>
                <SellInformation loading={loading} advertDetail={advertDetail} />
              </>
              :
              selectedTabsId === 3 ?
                <>
                  <OtherVariationList DraftId={Number(params.id ?? "0")} />
                </>
                :
                <></>
        }
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showModal}
        onClose={() => { setShowModal(false); }}
        title="Başvuru Red Detayı"
        body={<>
          <div>
            <div className="flex">
              <AlertIcon className="w-4 h-4 text-red-400 my-auto" />
              <div className="text-sm font-medium text-red-400 my-auto ml-2">Bu başvuru Housiy Yöneticileri tarafından reddedildi</div>
            </div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Tarihi</div>
            <div className="text-sm  font-medium mt-2">{handleJsTime(advertDetail?.RejectDate)}</div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Nedeni</div>
            <div className="text-sm  font-medium mt-2">{advertDetail?.RejectTitle}</div>
            <div className="text-type-12-medium text-gray-700 mt-4">Açıklama</div>
            <div className="text-sm  font-medium mt-2">
              {advertDetail?.RejectDescription}
            </div>
          </div>
        </>} />

      <Modal
        modalType="fixedSm"
        showModal={showRejectModal}
        onClose={() => { setShowRejectModal(false); }}
        title="İlan reddet"
        body={
          <div>
            <Label isRequired withoutDots title="Red Tipi" className="mt-4" />
            <input className="form-input" type="text" value={rejectTitle} onChange={(e) => { setRejectTitle(e.target.value); }} />
            <Label isRequired withoutDots title="Red Açıklama" className="mt-4" />
            <textarea className="form-input" rows={3} value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); }} ></textarea>
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { rejectAdvert(); }}></Button>
        }
      />
    </div>
  )
}
