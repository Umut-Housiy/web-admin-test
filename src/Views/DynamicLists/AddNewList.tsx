import { FunctionComponent, useContext, useState } from "react";
import { useHistory } from "react-router";
import { Button } from "../../Components/Button";
import { Dropdown } from "../../Components/Dropdown";
import { ChevronRightIcon } from "../../Components/Icons";
import { Label } from "../../Components/Label";
import { AddNewListTab1, Tab1DataModel } from "../../Components/Lists/AddNewListTab1";
import { Tabs2ForBlockImages } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForBlockImages";
import { Tabs2ForBlogs } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForBlogs";
import { Tabs2ForContent } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForContent";
import { Tabs2ForIdeaCategories } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForIdeaCategories";
import { Tabs2ForIdeas } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForIdeas";
import { Tabs2ForProductCategories } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForProductCategories";
import { Tabs2ForProductIdea } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForProductIdea";
import { Tabs2ForProducts } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForProducts";
import { Tabs2ForProfesionalCategories } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForProfessionalCategories";
import { Tabs2ForProfessionals } from "../../Components/Lists/AddNewListTab2.tsx/Tabs2ForProfessionals";
import { AddNewListTab3 } from "../../Components/Lists/AddNewListTab3";
import { SidebarLinks } from "../../Components/SiderbarLinks";
import { useStateEffect } from "../../Components/UseStateEffect";
import { AdvertSearchResult, BlockImagesModel, BlogModel, IdeaCategoryInnerModel, ItemModel, PlacementModel, ProCategoryListInnerModel, ProjectModel, ProModel, SellerCategoryListInnerModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";


export const AddNewList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const sidebarLinks = [
    {
      id: 1,
      title: "1. Liste Bilgileri",
      active: true
    },
    {
      id: 2,
      title: "2. Liste İçeriği",
      active: false
    },
    {
      id: 3,
      title: "3. Liste Yerleşimi",
      active: false
    },

  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const changeStep = (stepId) => {
    let el = sidebarLinks.filter(x => x.id === stepId);

    if (el.length) {
      if (el[0].active) {
        setSelectedTabsId(stepId)
      }
    }
  }

  const listTypes = [
    { key: "1", value: "Ürün" },
    { key: "2", value: "Kategori (Ürün)" },
    { key: "3", value: "Profesyonel" },
    { key: "4", value: "Kategori (Profesyonel)" },
    { key: "5", value: "Fikir" },
    { key: "9", value: "Kategori (Fikir)" },
    { key: "6", value: "Ürün-Fikir" },
    { key: "7", value: "Blog" },
    { key: "8", value: "Blok Görsel" },
    { key: "10", value: "İçerik" },
  ]

  const [selectedListType, setSelectedListType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [tabs1Data, setTabs1Data] = useState<Tab1DataModel>({
    shownType: 0,
    listTitle: "",
    buttonTitle: "",
    buttonLink: "",
    description: "",
    canSellerPromote: false,
    oneDayPrice: "",
    threeDayPrice: "",
    sevenDayPrice: "",
    fourteenDayPrice: "",
  });

  useStateEffect(() => {
    if (selectedTabsId === 2) {
      setSelectedTabsId(2);
      sidebarLinks[1].active = true;
      setCurrentOpenedFilterButton("");
    }
  }, [selectedTabsId]);

  const [selectedAdvertList, setSelectedAdvertList] = useState<AdvertSearchResult[]>([]);

  const [selectedAdvertCategoryList, setSelectedAdvertCategoryList] = useState<SellerCategoryListInnerModel[]>([]);

  const [selectedProList, setSelectedProList] = useState<ProModel[]>([]);

  const [selectedProCategoryList, setSelectedProCategoryList] = useState<ProCategoryListInnerModel[]>([]);

  const [selectedIdeaList, setSelectedIdeaList] = useState<ProjectModel[]>([]);

  const [selectedIdeaCategoryList, setSelectedIdeaCategoryList] = useState<IdeaCategoryInnerModel[]>([]);

  const [selectedMainProductForProductIdea, setSelectedMainProductForProductIdea] = useState<AdvertSearchResult>(
    {
      advertId: "",
      productId: 0,
      productName: "",
      category: [],
      hasStock: false,
      isFreeShipping: false,
      categoryId: 0,
      sellerName: "",
      mainPhoto: "",
      rateCount: 0,
      rate: 0,
      price: 0,
      marketPrice: 0,
      discountedPrice: 0,
      discountRate: 0,
      seoUrl: "",
      discountStartDate: 0,
      discountEndDate: 0,
      campaignType: 0,
      isSponsored: false,
      barcodeNo: "",//fe
      stockCount: 0,//fe
      buyboxPrice: 0,//fe
      isEnabled: false,//fe
    }
  );

  const [selectedIdeaListForProductIdea, setSelectedIdeaListForProductIdea] = useState<ProjectModel[]>([]);

  const [selectedBlogList, setSelectedBlogList] = useState<BlogModel[]>([]);

  const [blockImages, setBlockImages] = useState<BlockImagesModel[]>([]);

  const [content, setContent] = useState<string>("");

  const [selectedItemListToApi, setSelectedItemListToApi] = useState<ItemModel[]>([]);

  const [placementList, setPlacementList] = useState<PlacementModel[]>([]);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const returnTabs2 = () => {
    switch (Number(selectedListType.key)) {
      case 1: return <Tabs2ForProducts setSelectedAdvertListToApi={setSelectedItemListToApi} setSelectedAdvertList={setSelectedAdvertList} selectedAdvertList={selectedAdvertList} />
      case 2: return <Tabs2ForProductCategories setSelectedAdvertCategoryListToApi={setSelectedItemListToApi} setSelectedAdvertCategoryList={setSelectedAdvertCategoryList} selectedAdvertCategoryList={selectedAdvertCategoryList} />
      case 3: return <Tabs2ForProfessionals setSelectedProListToApi={setSelectedItemListToApi} setSelectedProList={setSelectedProList} selectedProList={selectedProList} />
      case 4: return <Tabs2ForProfesionalCategories setSelectedCategoryListToApi={setSelectedItemListToApi} setSelectedCategoryList={setSelectedProCategoryList} selectedCategoryList={selectedProCategoryList} />
      case 5: return <Tabs2ForIdeas setSelectedListToApi={setSelectedItemListToApi} setSelectedList={setSelectedIdeaList} selectedList={selectedIdeaList} />
      case 9: return <Tabs2ForIdeaCategories setSelectedCategoryListToApi={setSelectedItemListToApi} setSelectedCategoryList={setSelectedIdeaCategoryList} selectedCategoryList={selectedIdeaCategoryList} />
      case 6: return <Tabs2ForProductIdea setSelectedListToApi={setSelectedItemListToApi} setSelectedIdeaList={setSelectedIdeaListForProductIdea} selectedIdeaList={selectedIdeaListForProductIdea} setSelectedMainProduct={setSelectedMainProductForProductIdea} selectedMainProduct={selectedMainProductForProductIdea} />
      case 7: return <Tabs2ForBlogs setSelectedListToApi={setSelectedItemListToApi} setSelectedList={setSelectedBlogList} selectedList={selectedBlogList} />
      case 8: return <Tabs2ForBlockImages shownType={tabs1Data.shownType} setSelectedListToApi={setSelectedItemListToApi} setSelectedItem={setBlockImages} blockImages={blockImages} />
      case 10: return <Tabs2ForContent setSelectedListToApi={setSelectedItemListToApi} setContent={setContent} content={content} />
    }
  }

  useStateEffect(() => {
    setSelectedItemListToApi([]);
    setSelectedAdvertList([]);
    setSelectedAdvertCategoryList([]);
    setSelectedProList([]);
    setSelectedIdeaList([]);
    setPlacementList([]);
    setSelectedIdeaCategoryList([]);
    setSelectedIdeaListForProductIdea([]);
    setSelectedMainProductForProductIdea({
      advertId: "",
      productId: 0,
      productName: "",
      category: [],
      hasStock: false,
      isFreeShipping: false,
      categoryId: 0,
      sellerName: "",
      mainPhoto: "",
      rateCount: 0,
      rate: 0,
      price: 0,
      marketPrice: 0,
      discountedPrice: 0,
      discountRate: 0,
      seoUrl: "",
      discountStartDate: 0,
      discountEndDate: 0,
      campaignType: 0,
      isSponsored: false,
      barcodeNo: "",//fe
      stockCount: 0,//fe
      buyboxPrice: 0,//fe
      isEnabled: false,//fe
    });
    setSelectedBlogList([]);
    setBlockImages([]);
  }, [selectedListType.key]);

  const createDynamicList = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createDynamicList(Number(selectedListType.key), tabs1Data.shownType, tabs1Data.listTitle ?? "", tabs1Data.buttonTitle ?? "", tabs1Data.buttonLink ?? "", tabs1Data.description ?? "", tabs1Data.canSellerPromote ?? false,
      tabs1Data.oneDayPrice, tabs1Data.threeDayPrice, tabs1Data.sevenDayPrice, tabs1Data.fourteenDayPrice, selectedItemListToApi, placementList);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Liste başarıyla oluşturuldu",
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
          history.push('/olusturulan-listeler')
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
        }
      });
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-5">Yeni Liste Oluştur</h2>
        <div className="grid lg:grid-cols-4 border-t">
          <div className="lg:col-span-1 px-3 py-4">
            <SidebarLinks list={sidebarLinks} selectedTabsId={selectedTabsId} onItemSelected={item => { changeStep(item.id ?? 1) }} />
          </div>
          <div className="lg:col-span-3 pl-4 border-l pt-4">
            {selectedTabsId === 1 ?
              <div className="full">
                <div className="w-2/3">
                  <Label title="Oluşturulacak Liste Türü" withoutDots isRequired />
                  <Dropdown
                    key="selectedListType"
                    isDropDownOpen={currentOpenedFilterButton === "selectedListType"}
                    onClick={() => { setCurrentOpenedFilterButton("selectedListType"); }}
                    className="w-full text-black-700 text-sm"
                    label={selectedListType.value}
                    items={listTypes}
                    onItemSelected={item => { setSelectedListType(item); }} />
                </div>
                {selectedListType.key !== "0" &&
                  <AddNewListTab1 selectedListType={Number(selectedListType.key)} tabs1Data={tabs1Data} setTabs1Data={setTabs1Data} setChangeStep={setSelectedTabsId} />
                }
              </div>
              : selectedTabsId === 2 ?
                <>
                  {returnTabs2()}
                  {selectedItemListToApi.length > 0 ?
                    <div className="flex items-center gap-3 justify-end mt-6">
                      <span className="text-sm cursor-pointer flex text-gray-700 font-medium items-center" onClick={() => setSelectedTabsId(1)}>
                        <ChevronRightIcon className="icon-sm transform -rotate-180 mr-3" />
                        Önceki Adım
                      </span>
                      {Number(selectedListType.key) !== 6 ?
                        <Button text="Sonraki Adım" design="button button-blue-400 w-72 " onClick={() => {
                          setSelectedTabsId(3)
                          sidebarLinks[2].active = true;
                        }} />
                        :

                        (selectedItemListToApi.filter(i => i.IsIdeaMainProduct === true).length > 0 && selectedItemListToApi.length > 1) ?
                          <Button text="Sonraki Adım" design="button button-blue-400 w-72 " onClick={() => {
                            setSelectedTabsId(3)
                            sidebarLinks[2].active = true;
                          }} />
                          :
                          <></>
                      }
                    </div>
                    :
                    <></>}
                </>
                : selectedTabsId === 3 &&
                <>
                  <AddNewListTab3 setPlacementListToApi={setPlacementList} placementList={placementList} />
                  <div className="flex items-center gap-3 justify-end mt-6">
                    <span className="text-sm cursor-pointer flex text-gray-700 font-medium items-center" onClick={() => setSelectedTabsId(2)}>
                      <ChevronRightIcon className="icon-sm transform -rotate-180 mr-3" />
                      Önceki Adım
                    </span>
                    <Button isLoading={processLoading} text="Kaydet ve Tamamla" design={`${placementList.length === 0 ? "pointer-events-none" : ""} button-blue-400  w-72 `}
                      onClick={() => { placementList.length > 0 && createDynamicList() }} />
                  </div>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
