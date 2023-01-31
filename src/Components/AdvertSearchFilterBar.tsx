import { FunctionComponent, useEffect, useState } from "react";
import { CategorySelectSeller } from "./CategorySelectSeller";
import { Label } from "./Label";
import ReactNumeric from "react-numeric";
import { autonNumericOptions } from "../Services/Functions";
import { useStateEffect } from "./UseStateEffect";
import { Button } from "./Button";
import { InputWithMask } from "./InputWithMask";
import { TrashIcon } from "./Icons";
import { Dropdown } from "./Dropdown";
import ApiService from "../Services/ApiService";
import { Loading } from "./Loading";
import { CampaignListInnerModel, SellerModel } from "../Models";

interface AdvertSearchFilterBarProps {
  setCategoryName?: (e: string) => void;
  setMinPrice?: (e: string) => void;
  setMaxPrice?: (e: string) => void;
  setMinDiscountRate?: (e: string) => void;
  setMaxDiscountRate?: (e: string) => void;
  setCampaignName?: (e: string) => void;
  setApplyClink?: () => void;
  campaign?: boolean;
  seller?: boolean;
  sellerCampaign?: boolean;
  setSellerCampaignIds?: (e: string[]) => void;
  setSellerId?: (e: string) => void;
}

export const AdvertSearchFilterBar: FunctionComponent<
  AdvertSearchFilterBarProps
> = (props: AdvertSearchFilterBarProps) => {
  const [categoryId, setCategoryId] = useState<number>(0);

  const [categoryDisplaytext, setCategoryDisplaytext] = useState<string>("");

  const [categoryName, setCategoryName] = useState<string>("");

  const [minPrice, setMinPrice] = useState<number>(0);

  const [maxPrice, setMaxPrice] = useState<number>(0);

  const [minDiscountRate, setMinDiscountRate] = useState<string>("0");

  const [maxDiscountRate, setMaxDiscountRate] = useState<string>("0");

  //#region campaign filters
  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] =
    useState<string>("");

  const campaignOptions = [
    { key: "1", value: "Housiy Kampanyası" },
    { key: "2", value: "Mağaza Kampanyası" },
  ];

  const [selectedCampaignOption, setSelectedCampaignOption] = useState({
    key: "0",
    value: "Seçiniz...",
  });

  const [loadingActiveCampaignList, setLoadingActiveCampaignList] =
    useState<boolean>(false);
  const [sellerList, setSellerList] = useState<SellerModel[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<any>({
    key: "0",
    value: "Seçiniz",
  });
  const [selectedSellerForCampign, setSelectedSellerForCampaign] =
    useState<any>({
      key: "0",
      value: "Seçiniz..",
    });

  const [activeCampaignList, setActiveCampaignList] = useState<
    { key: string; value: string }[]
  >([]);
  const [sellerLoading, setSellerLoading] = useState<boolean>(true);
  const [sellerSearchString, setSellerSearchString] = useState<string>("");

  useState<boolean>(true);
  const [sellerListForCampaign, setSellerListforCampaign] = useState<
    SellerModel[]
  >([]);
  const [searchTextForSellerForCampaign, setSearchTextForSellerForCampaign] =
    useState<string>("");
  const [sellerCampaigns, setSellerCampaigns] = useState<
    CampaignListInnerModel[]
  >([]);
  const [searchTextForSellerCampaign, setSearchTextForCampaign] =
    useState<string>("");
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<any[]>([]);

  useState<string>("");

  const setStateForSellerCampaigns = async () => {
    let _campaignListModel = await ApiService.getSellerCampaignBySellerId(
      selectedSellerForCampign.key,
      1,
      undefined,
      searchTextForSellerCampaign
    );
    if (_campaignListModel.succeeded) {
      setSellerCampaigns(_campaignListModel?.data.Data ?? []);
    }
  };

  useStateEffect(() => {
    if (selectedSellerForCampign.key != "0") {
      setStateForSellerCampaigns();
    }
  }, [selectedSellerForCampign, searchTextForSellerCampaign]);
  const [selectedActiveCampaign, setSelectedActiveCampaign] = useState({
    key: "0",
    value: "Seçiniz...",
  });
  useStateEffect(() => {
    if (props.setSellerCampaignIds != undefined)
      props.setSellerCampaignIds(
        selectedCampaignIds.map((x) => x.key.toString())
      );
  }, [selectedCampaignIds]);

  const setSellerState = async () => {
    let _sellerResponseModel = await ApiService.getSellerApprovedList(
      0,
      5,
      sellerSearchString,
      0
    );
    setSellerList(_sellerResponseModel.data.Data ?? []);
  };

  const setStateSellerListforCampaign = async () => {
    let _sellerResponseModel = await ApiService.getSellerApprovedList(
      0,
      10,
      searchTextForSellerForCampaign,
      0
    );

    setSellerListforCampaign(_sellerResponseModel.data.Data ?? []);
  };

  //#endregion campaign filters

  useEffect(() => {
    setSellerLoading(true);
    setSellerState();
    setSellerLoading(false);
    if (props.sellerCampaign) {
      setStateSellerListforCampaign();
    }
  }, []);
  useStateEffect(() => {
    setStateSellerListforCampaign();
  }, [searchTextForSellerForCampaign]);
  useStateEffect(() => {
    setSellerState();
  }, [sellerSearchString]);
  useStateEffect(() => {
    props.setCategoryName?.(categoryName);
  }, [categoryName]);

  useStateEffect(() => {
    props.setMinPrice?.(String(minPrice));
  }, [minPrice]);

  useStateEffect(() => {
    props.setMaxPrice?.(String(maxPrice));
  }, [maxPrice]);

  useStateEffect(() => {
    props.setMinDiscountRate?.(minDiscountRate.replace("%", ""));
  }, [minDiscountRate]);

  useStateEffect(() => {
    props.setMaxDiscountRate?.(maxDiscountRate.replace("%", ""));
  }, [maxDiscountRate]);

  useStateEffect(() => {
    if (selectedActiveCampaign.key === "0") {
      props.setCampaignName?.("");
    } else {
      props.setCampaignName?.(selectedActiveCampaign.value);
    }
  }, [selectedActiveCampaign]);

  useStateEffect(() => {
    if (selectedCampaignOption.key === "1") {
      getActiveCampaignList();
    }
  }, [selectedCampaignOption]);

  const getActiveCampaignList = async () => {
    setLoadingActiveCampaignList(true);

    const _result = await ApiService.getActiveCampaignList();

    if (_result.succeeded === true) {
      let tempArray: { key: string; value: string }[] = [];

      _result.data.forEach((item) => {
        tempArray.push({
          key: String(item.CampaignId),
          value: item.CampaignName,
        });
      });
      setActiveCampaignList(tempArray);
      setLoadingActiveCampaignList(false);
    } else {
      setActiveCampaignList([]);
      setLoadingActiveCampaignList(false);
    }
  };

  const returnCampaignDiscountFilter = () => {
    return (
      <>
        <div className="flex items-center justify-between">
          <Label title="Kampanya İndirim Oranına Göre Filtrele" withoutDots />
          {(minDiscountRate !== "0" || maxDiscountRate !== "0") && (
            <TrashIcon
              className="icon-sm cursor-pointer text-gray-700"
              onClick={() => {
                setMinDiscountRate("0");
                setMaxDiscountRate("0");
              }}
            />
          )}
        </div>
        <div className="flex gap-x-2">
          <div className="flex-1 flex w-full gap-x-2">
            <InputWithMask
              percentage
              value={minDiscountRate}
              onChange={(e) => {
                setMinDiscountRate(e.target.value);
              }}
            />
            <InputWithMask
              percentage
              value={maxDiscountRate}
              onChange={(e) => {
                setMaxDiscountRate(e.target.value);
              }}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="lg:grid grid-cols-2 gap-3 ">
        <div className="lg:col-span-1">
          {props.campaign ? (
            <>
              <div className="flex items-center justify-between">
                <Label title="Kampanya Tipine Göre Filtrele" withoutDots />
                {selectedCampaignOption.key !== "0" && (
                  <TrashIcon
                    className="icon-sm cursor-pointer text-gray-700 hover:text-gray-900 transition-all"
                    onClick={() => {
                      setSelectedCampaignOption({
                        key: "0",
                        value: "Seçiniz...",
                      });
                      setSelectedActiveCampaign({
                        key: "0",
                        value: "Seçiniz...",
                      });
                      setMinDiscountRate("0");
                      setMaxDiscountRate("0");
                    }}
                  />
                )}
              </div>
              <Dropdown
                isDropDownOpen={currentOpenedFilterButton === "campaignSelect"}
                onClick={() => {
                  setCurrentOpenedFilterButton("campaignSelect");
                }}
                className="w-full text-black-700 text-sm"
                label={selectedCampaignOption.value}
                items={campaignOptions}
                onItemSelected={(item) => {
                  setSelectedCampaignOption(item);
                  setSelectedActiveCampaign({ key: "0", value: "Seçiniz..." });
                  setMinDiscountRate("0");
                  setMaxDiscountRate("0");
                }}
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Label title="Fiyat Aralığına Göre Filtrele" withoutDots />
                {(minPrice !== 0 || maxPrice !== 0) && (
                  <TrashIcon
                    className="icon-sm cursor-pointer text-gray-700 hover:text-gray-900 transition-all"
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(0);
                    }}
                  />
                )}
              </div>
              <div className="flex gap-x-2">
                <ReactNumeric
                  value={minPrice}
                  preDefined={autonNumericOptions.TL}
                  onChange={(e, value: number) => {
                    setMinPrice(value);
                  }}
                  className={"form-input"}
                />
                <ReactNumeric
                  value={maxPrice}
                  preDefined={autonNumericOptions.TL}
                  onChange={(e, value: number) => {
                    setMaxPrice(value);
                  }}
                  className={"form-input"}
                />
              </div>
            </>
          )}
        </div>
        <div className="lg:col-span-1 gap-x-2">
          {props.campaign === true && selectedCampaignOption.key === "1" ? (
            <>
              <div className="flex items-center justify-between">
                <Label title="Kampanya Adına Göre Filtrele" withoutDots />
                {selectedActiveCampaign.key !== "0" && (
                  <TrashIcon
                    className="icon-sm cursor-pointer text-gray-700"
                    onClick={() => {
                      setSelectedActiveCampaign({
                        key: "0",
                        value: "Seçiniz...",
                      });
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-x-2 w-full">
                <div className="flex-1">
                  <Dropdown
                    loading={loadingActiveCampaignList}
                    isDropDownOpen={
                      currentOpenedFilterButton === "activeCampaignList"
                    }
                    onClick={() => {
                      setCurrentOpenedFilterButton("activeCampaignList");
                    }}
                    className="w-full text-black-700 text-sm"
                    label={selectedActiveCampaign.value}
                    items={activeCampaignList}
                    onItemSelected={(item) => {
                      setSelectedActiveCampaign(item);
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            props.campaign === true &&
            selectedCampaignOption.key === "2" && (
              <>{returnCampaignDiscountFilter()}</>
            )
          )}
          {props.campaign !== true && <>{returnCampaignDiscountFilter()}</>}
        </div>
        {props.seller ? (
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <Label title="Mağazaya göre filtrele" withoutDots></Label>
              {selectedSeller.key !== "0" && (
                <TrashIcon
                  className="icon-sm cursor-pointer text-gray-700"
                  onClick={() => {
                    setSelectedSeller({
                      key: "0",
                      value: "Seçiniz..",
                    });

                    if (props.seller && props.setSellerId != undefined)
                      props.setSellerId("");
                  }}
                ></TrashIcon>
              )}
            </div>
            {!sellerLoading ? (
              <>
                <Dropdown
                  items={
                    sellerList.map((x) => {
                      return {
                        key: x.Id.toString(),
                        value: x.StoreName,
                      };
                    }) ?? []
                  }
                  onItemSelected={(selected) => {
                    setSelectedSeller(selected);
                    if (props.seller && props.setSellerId != undefined)
                      props.setSellerId(selected.key);
                  }}
                  onSearch={(s) => {
                    setSellerSearchString(s);
                  }}
                  loading={sellerLoading}
                  label={selectedSeller.value}
                  isSearchable
                ></Dropdown>
              </>
            ) : (
              <>
                <Loading inputSm></Loading>
              </>
            )}
          </div>
        ) : (
          <></>
        )}

        {props.sellerCampaign ? (
          <>
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between">
                <Label
                  title="Mağaza kampanyasına göre filtrele"
                  withoutDots
                ></Label>
                {selectedSellerForCampign.key != "0" && (
                  <TrashIcon
                    className="icon-sm cursor-pointer text-gray-700"
                    onClick={() => {
                      setSelectedSellerForCampaign({
                        key: "0",
                        value: "Seçiniz",
                      });
                      setSelectedCampaignIds([]);
                      if (
                        props.sellerCampaign &&
                        props.setSellerCampaignIds != undefined
                      ) {
                        props.setSellerCampaignIds([]);
                      }
                    }}
                  />
                )}
              </div>

              <Dropdown
                items={sellerListForCampaign.map((x) => {
                  return {
                    key: x.Id.toString(),
                    value: x.StoreName,
                  };
                })}
                isSearchable
                label={selectedSellerForCampign.value}
                onSearch={(text) => {
                  setSearchTextForSellerForCampaign(text);
                }}
                onItemSelected={(selectedItem) => {
                  if (selectedItem.key != selectedSellerForCampign.key)
                    setSelectedCampaignIds([]);
                  setSelectedSellerForCampaign(selectedItem);
                }}
              ></Dropdown>
            </div>
            {selectedSellerForCampign.key != "0" ? (
              <>
                <div className="lg:col-span-1">
                  <Label title="Kampanyaları seçiniz" withoutDots></Label>
                  <Dropdown
                    items={sellerCampaigns.map((x) => {
                      return {
                        key: x.CampaignId.toString(),
                        value: x.CampaignName,
                      };
                    })}
                    label={selectedCampaignIds.map((x) => x.value).join(" - ")}
                    isSearchable
                    isMultiSelect
                    onItemSelected={(selected) => {
                      if (
                        !selectedCampaignIds.find((x) => x.key == selected.key)
                      ) {
                        setSelectedCampaignIds([
                          ...selectedCampaignIds,
                          selected,
                        ]);
                      } else {
                        let filteredList = selectedCampaignIds.filter(
                          (x) => x.key != selected.key
                        );
                        setSelectedCampaignIds([...filteredList]);
                      }
                    }}
                    onSearch={(sear) => {
                      setSearchTextForCampaign(sear);
                    }}
                  ></Dropdown>
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        <div className="lg:col-span-2">
          <Label title="Kategoriye Göre Filtrele" withoutDots />
          <div className="flex justify-between w-full flex-1 gap-x-3">
            <CategorySelectSeller
              isFull
              isClearable
              value={categoryId}
              setCategoryName={setCategoryName}
              onChange={setCategoryId}
              setCategoryDisplayText={setCategoryDisplaytext}
            ></CategorySelectSeller>
            <Button
              buttonLg
              design={`${
                loadingActiveCampaignList === true ? "mb-2.5" : ""
              } bg-gray-700 hover:bg-gray-900 text-white w-28 mb-4`}
              onClick={props.setApplyClink}
              text="Uygula"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
