import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { DatePicker } from "../Components/DatePicker";
import { Dropdown } from "../Components/Dropdown";
import { AlertIcon, ChevronRightIcon, CloseIcon, TrashIcon } from "../Components/Icons";
import { InfoBoxWithOverlay } from "../Components/InfoBoxWithOverlay";
import { InputWithMask } from "../Components/InputWithMask";
import { Label } from "../Components/Label";
import { SidebarLinks } from "../Components/SiderbarLinks"
import { Dropzone } from "../Components/Dropzone"
import { SERVICES } from "../Services/Constants";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TextArea } from "../Components/TextArea";
import { ToggleButton } from "../Components/ToggleButton";
import { Image } from "../Components/Image";
import { useStateEffect } from "../Components/UseStateEffect";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Button } from "../Components/Button";
import { CategorySelectSeller } from "../Components/CategorySelectSeller";

export const HousiyCampaignCreate: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const sidebarLinks = [
    {
      id: 1,
      title: "1. Kampanya Koşulları",
      active: true,
    },
    {
      id: 2,
      title: "2. Kampanya Bilgileri",
      active: false,
    },
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [processLoading, setProcessLoading] = useState<boolean>(false);

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

  // TABS-1--CAMPAIGN REQUIREMENTS---START
  const campaignTypes = [
    { key: "4", value: "İndirim Kampanyası" },
    { key: "5", value: "X Al Y Öde Kampanyası" },
  ];

  const [selectedCampanyType, setSelectedCampanyType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  //<---category select START--->
  const [categoryId, setCategoryId] = useState<number>(0);

  const [categoryIdList, setCategoryIdList] = useState<number[]>([]);

  const [categoryIdAndName, setCategoryIdAndName] = useState<{ id: number, name: string }>({ id: 0, name: "" });

  const [categoryIdAndNameList, setCategoryIdAndNameList] = useState<{ id: number, name: string }[]>([]);

  const [displayText, setDisplayText] = useState<string>("");

  const [showWarningText, setShowWarningText] = useState<boolean>(false);


  useStateEffect(() => {
    if (categoryIdList.find(i => i === categoryId)) {
      setShowWarningText(true);
    }
    else if (categoryId !== 0) {
      let _tempCategoryIdList: number[] = categoryIdList
      _tempCategoryIdList.push(categoryId);
      setCategoryIdList([..._tempCategoryIdList]);
      setShowWarningText(false);

    }
  }, [categoryId]);

  useStateEffect(() => {
    if (categoryIdAndNameList.find(i => i.id === categoryIdAndName.id)) {
      setShowWarningText(true);
    }
    else if (categoryIdAndName.id !== 0) {
      let _tempCategoryIdAndNameList: { id: number, name: string }[] = categoryIdAndNameList
      _tempCategoryIdAndNameList.push(categoryIdAndName);
      setCategoryIdAndNameList([..._tempCategoryIdAndNameList]);
      setShowWarningText(false);
    }

  }, [categoryIdAndName]);

  const excludeCategory = (categoryId) => {
    const _categoryIdList = categoryIdList.filter(i => i !== categoryId);
    setCategoryIdList([..._categoryIdList]);

    const _tempCategoryIdAndNameList = categoryIdAndNameList.filter(i => i.id !== categoryId);
    setCategoryIdAndNameList([..._tempCategoryIdAndNameList]);
  }


  //<---category select END--->

  const [commissionRate, setCommissionRate] = useState<string>("");//Uygulanacak Komisyon İndirimi (%)

  const [sellerAdvertLimit, setSellerAdvertLimit] = useState<number>(0);//Satıcı Başına Ürün Kotası


  //<---campaignTypes === 4 ---> discount campaign values START--->

  const [mustApplyDiscount, setMustApplyDiscount] = useState<string>("");//Uygulanacak Zorunlu İndirim Yüzdesi

  const [warningTextForDiscountCampaign, setWarningTextForDiscountCampaign] = useState<boolean>(false);

  useStateEffect(() => {
    setWarningTextForDiscountCampaign(false);
  }, [categoryIdList, commissionRate, mustApplyDiscount, sellerAdvertLimit]);

  //<---campaignTypes === 4 ---> discount campaign values END--->

  //<---campaignTypes === 5 ---> buy X pay Y campaign START--->

  const [requiredStockAmount, setRequiredStockAmount] = useState<number>(0);//Satın Alınması Gereken Ürün Adedi

  const [mustPayStockAmount, setMustPayStockAmount] = useState<number>(0);//Müşterinin Ödeyeceği Ürün Adedi

  const [sameBasketReuseCount, setSameBasketReuseCount] = useState<number>(0);//Sipariş Limiti

  const [warningTextForXYCampaign, setWarningTextForXYCampaign] = useState<boolean>(false);

  //<---campaignTypes === 5 ---> buy X pay Y campaign END--->

  useStateEffect(() => {
    setWarningTextForXYCampaign(false);
  }, [categoryIdList, commissionRate, requiredStockAmount, mustPayStockAmount, sameBasketReuseCount, sellerAdvertLimit]);

  // TABS-1--CAMPAIGN REQUIREMENTS---END

  // TABS-2--CAMPAIGN INFORMATION---START

  const [campaignStartDate, setCampaignStartDate] = useState<Date>(new Date());

  const [campaignEndDate, setCampaignEndDate] = useState<Date>(new Date(new Date(campaignStartDate).getTime() + 86400000));

  const [lastAddProductDate, setLastAddProductDate] = useState<Date>(new Date(new Date(campaignStartDate).getTime() + 86400000));

  const [campaignTitle, setCampaignTitle] = useState<string>("");

  const [fileUrl, setFileUrl] = useState<string>("");

  const [campaignDescription, setCampaignDescription] = useState<string>("");

  const [joinInfo, setJoinInfo] = useState<string>("");

  const [hasCountDown, setHasCountDown] = useState<boolean>(false);

  // TABS-2--CAMPAIGN INFORMATION---END

  const changeStep = (stepId) => {
    let el = sidebarLinks.filter(x => x.id === stepId);

    if (el.length) {
      if (el[0].active) {
        setSelectedTabsId(stepId)
      }
    }
  }

  const InfoText = (text: string) => {
    return <div className="flex items-center mb-3">
      <AlertIcon className="icon-sm text-red-400 mr-2" />
      <p className="text-sm">{text}</p>
    </div>
  }

  const addFiles = (e) => {
    let tempData = e[0].FileUrl;
    setFileUrl(tempData);
  }

  const createHousiyCampaign = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createHousiyCampaign(Number(selectedCampanyType.key), categoryIdList, commissionRate, mustApplyDiscount, sellerAdvertLimit ?? 0, requiredStockAmount ?? 0, mustPayStockAmount ?? 0, sameBasketReuseCount ?? 0, campaignStartDate.getTime(), campaignEndDate.getTime(), lastAddProductDate.getTime(), campaignTitle, fileUrl, hasCountDown, campaignDescription, joinInfo);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kampanya oluşturuldu",
        onClose: () => { context.hideModal(); history.push("/housiy-kampanya-listesi"); }
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
        <Link to="/housiy-kampanya-listesi" className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Housiy Kampanya Listesi
          </div>
        </Link>
        <h2 className="pb-5">Yeni Kampanya Oluştur</h2>
        <div className="grid lg:grid-cols-4 border-t">
          <div className="lg:col-span-1 px-3 py-4">
            <SidebarLinks list={sidebarLinks} selectedTabsId={selectedTabsId} onItemSelected={item => { changeStep(item.id ?? 1) }} />
          </div>
          <div className="lg:col-span-3 pl-6 border-l border-gray-200 py-4">
            {selectedTabsId === 1 ?
              <>
                <div className="w-4/5">
                  <Label isRequired withoutDots title="Kampanya Türü" className="mt-4" />
                  <Dropdown
                    isDropDownOpen={currentOpenedFilterButton === "campaignType"}
                    onClick={() => { setCurrentOpenedFilterButton("campaignType"); }}
                    className="w-full text-black-700 text-sm"
                    label={selectedCampanyType.value}
                    items={campaignTypes}
                    onItemSelected={item => { setSelectedCampanyType(item) }} />

                  {selectedCampanyType.key !== "0" &&
                    <>
                      <Label isRequired withoutDots title="Kategori Seçimi" className="mt-4" />
                      <CategorySelectSeller multiChoose value={categoryId} onChange={setCategoryId} onChangeMultiCategory={item => setCategoryIdAndName(item)} setCategoryDisplayText={setDisplayText} />
                      {showWarningText &&
                        <p className="text-red-400 font-medium text-sm my-4">*{categoryIdAndName.name} isimli kategoriyi zaten eklediniz!</p>
                      }
                      {(categoryIdAndNameList.length && categoryIdAndNameList.length > 0) ?
                        categoryIdAndNameList.map((item) => (
                          <div className="inline-flex mr-2 mb-2 py-2 px-3 bg-blue-100 rounded-full text-gray-900 text-sm items-center">
                            {item.name}
                            <CloseIcon className="icon-sm ml-2" onClick={() => excludeCategory(item.id)} />
                          </div>
                        ))
                        : <></>}
                      <Label isRequired withoutDots title="Uygulanacak Komisyon İndirimi (%)" className="mt-4" />
                      {InfoText("Kampanyaya katılımda ilgili kategoriler için uygulanacak komisyon indirimini belirleyin.")}
                      <InputWithMask percentage value={commissionRate} onChange={(e) => { setCommissionRate(e.target.value) }} />

                    </>
                  }
                  {selectedCampanyType.key === "4" ?
                    <>
                      <Label isRequired withoutDots title="Uygulanacak İndirim Yüzdesi" className="mt-4" />
                      {InfoText("Kampanyada seçili ürünler için uygulanacak indirim yüzdesini belirleyin.")}
                      <InputWithMask percentage value={mustApplyDiscount} onChange={(e) => { setMustApplyDiscount(e.target.value) }} />
                    </>
                    : selectedCampanyType.key === "5" &&
                    <>
                      <Label isRequired withoutDots title="Satın Alınması Gereken Ürün Adedi" className="mt-4" />
                      {InfoText("Kampanya uygulanması için sepette bulunması gereken minimum ürün adedini belirleyiniz.")}
                      <input className="form-input" type="number" value={requiredStockAmount} onChange={(e) => { setRequiredStockAmount(parseInt(e.target.value)) }} />
                      <Label isRequired withoutDots title="Müşterinin Ödeyeceği Ürün Adedi" className="mt-4" />
                      {InfoText("Kampanya koşulu olarak ödeme yapılacak ürün adedini belirleyiniz.")}
                      <input className="form-input" type="number" value={mustPayStockAmount} onChange={(e) => { setMustPayStockAmount(parseInt(e.target.value)) }} />
                      <Label isRequired withoutDots title="Sipariş Limiti" className="mt-4" />
                      <div className="flex items-center justify-between">
                        {InfoText("Kampanya koşulu olarak tek seferde bu kampanyanın kaç kere uygulanabileceğini belirleyiniz.")}
                        <InfoBoxWithOverlay text={<span>Sipariş limiti belirlendiğinde kullanıcıların sepette faydanalacağı indirim sayısı kısıtlanır. Örneğin; 5 Al 4 Öde kampanyasında sipariş limiti 3 olarak belirlendiğinde <span className="font-medium">15 ürün için 12 ürün ödenir. </span><span className="underline">Ancak 15’in üzerinde eklenen ürünlerde kampanya uygulanmaz.</span></span>} />
                      </div>
                      <input className="form-input" type="number" value={sameBasketReuseCount} onChange={(e) => { setSameBasketReuseCount(parseInt(e.target.value)) }} />
                    </>
                  }
                  {selectedCampanyType.key !== "0" &&
                    <>
                      <Label isRequired withoutDots title="Satıcı Başına Ürün Kotası" className="mt-4" />
                      {InfoText("Tek bir satıcı için kampanyaya eklenebilecek maximum ürün adedini belirleyin.")}
                      <input className="form-input" type="number" value={sellerAdvertLimit} onChange={(e) => { setSellerAdvertLimit(parseInt(e.target.value)) }} />
                    </>
                  }
                </div>
                {(warningTextForDiscountCampaign === true || warningTextForXYCampaign === true) &&
                  <p className="text-red-400 font-medium text-sm my-4">*Lütfen eksik bilgileri doldurunuz!</p>
                }
                {selectedCampanyType.key !== "0" &&
                  <div className="flex justify-end mt-6">
                    <Button text="Sonraki Adım" design="button button-blue-400 w-2/5 "
                      onClick={() => {
                        if ((selectedCampanyType.key === "4" && (categoryIdList.length === 0 || commissionRate === "" || mustApplyDiscount === "" || sellerAdvertLimit === 0))) {
                          setWarningTextForDiscountCampaign(true);
                        }
                        else if (selectedCampanyType.key === "5" && (categoryIdList.length === 0 || commissionRate === "" || requiredStockAmount === undefined || mustPayStockAmount === undefined || sameBasketReuseCount === undefined || sellerAdvertLimit === undefined)) {
                          setWarningTextForXYCampaign(true);
                        }
                        else {
                          sidebarLinks[1].active = true;
                          setSelectedTabsId(2);
                        }
                      }} />
                  </div>
                }
              </>
              : selectedTabsId === 2 &&
              <>
                <div className="w-2/3">
                  <Label title="Kampanya Başlangıç Tarihi" withoutDots isRequired />
                  <DatePicker
                    isFull
                    value={campaignStartDate}
                    minDate={campaignStartDate}
                    setSelectedDate={(e) => { setCampaignStartDate(e); setCampaignEndDate(e); }}
                  />
                  <Label className="mt-4" title="Kampanya Bitiş Tarihi" withoutDots isRequired />
                  <DatePicker
                    isFull
                    value={campaignEndDate}
                    minDate={new Date(campaignStartDate.getTime() + 86400000)}
                    setSelectedDate={(e) => { setCampaignEndDate(e); }}
                  />
                  <Label className="mt-4" title="Son Ürün Ekleme Tarihi" withoutDots isRequired />
                  <DatePicker
                    isFull
                    value={lastAddProductDate}
                    minDate={new Date(campaignStartDate.getTime() + 86400000)}
                    maxDate={campaignEndDate}
                    setSelectedDate={(e) => { setLastAddProductDate(e); }}
                  />
                  <Label className="mt-4" title="Kampanya Başlığı" withoutDots isRequired />
                  <input className="form-input" type="text" value={campaignTitle} onChange={(e) => { setCampaignTitle(e.target.value) }} />
                  <Label className="mt-4" title="Kampanya Görseli" withoutDots isRequired />
                  <Dropzone
                    accept={["image"]}
                    uploadUrl={SERVICES.API_ADMIN_CAMPAIGN_URL + "/upload-campaign-photo"}
                    addFiles={addFiles}
                    maxFileSizeAsMB={5}
                    maxFileCount={fileUrl === "" ? 1 : 0}
                    fileUploaderCss
                    sizeDescription={"435x252 px"}
                  />
                  {fileUrl !== "" &&
                    <div className="relative inline-block">
                      <Image key={"fileUrl"} src={fileUrl} className="w-full" />
                      <div className="absolute top-2 right-2 p-2 bg-white rounded-lg">
                        <TrashIcon className="icon-sm" onClick={() => setFileUrl("")} />
                      </div>
                    </div>
                  }
                  <Label className="mt-4" title="Kampanya Açıklaması" withoutDots isRequired />
                  <TextArea
                    setText={setCampaignDescription}
                    text={campaignDescription}
                    placeholder=""
                    maxCount={2000}
                  />
                  <Label className="mt-4" title="Katılım Koşul Bilgilendirmesi" withoutDots isRequired />
                  {InfoText("Kampanyaya katılım koşullarının detaylı açıklamasını yazın.")}
                  <CKEditor
                    editor={ClassicEditor}
                    data={joinInfo}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setJoinInfo(data);
                    }}
                  />
                  <div className="flex items-center justify-between my-4">
                    <span className="p-sm font-medium text-gray-700">Geri sayım sayacı çalıştır</span>
                    <ToggleButton onClick={() => { setHasCountDown(!hasCountDown) }} defaultValue={hasCountDown} />
                  </div>

                </div>
                <div className="flex items-center gap-3 justify-end mt-6">
                  <span className="text-sm cursor-pointer flex text-gray-700 font-medium items-center" onClick={() => { setSelectedTabsId(1); setCurrentOpenedFilterButton(""); }}>
                    <ChevronRightIcon className="icon-sm transform -rotate-180 mr-3" />
                    Önceki Adım
                  </span>
                  <Button isLoading={processLoading} text="Tamamla" design="button button-blue-400 w-2/5 " onClick={() => createHousiyCampaign()} />
                </div>
              </>
            }
          </div>

        </div>
      </div>
    </div >
  )
}
