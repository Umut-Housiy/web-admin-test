import { FunctionComponent, useRef, useState, useContext } from "react";

import { BlogModel, ItemModel } from "../../../Models";
import ApiService from "../../../Services/ApiService";
import {
  SharedContext,
  SharedContextProviderValueModel,
} from "../../../Services/SharedContext";
import { Button } from "../../Button";
import { CheckIcon, PlusIcon, TrashIcon } from "../../Icons";
import { Modal } from "../../Modal";
import { Table } from "../../Table";
import { useStateEffect } from "../../UseStateEffect";
import { Image } from "../../Image";

export interface Tabs2ForBlogsProps {
  setSelectedListToApi: (e: ItemModel[]) => void;
  setSelectedList: (e: BlogModel[]) => void;
  selectedList: BlogModel[];
}

export const Tabs2ForBlogs: FunctionComponent<Tabs2ForBlogsProps> = (
  props: Tabs2ForBlogsProps
) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const take = 20;

  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedTempList, setSelectedTempList] = useState<BlogModel[]>(
    props.selectedList ?? []
  );

  const [selectedList, setSelectedList] = useState<BlogModel[]>(
    props.selectedList ?? []
  );

  const [selectedListToApi, setSelectedListToApi] = useState<ItemModel[]>([]);

  const [allPageData, setAllPageData] = useState<BlogModel[]>([]);
  const [isAllPageDataSelected, setIsAllPageDataSelected] =
    useState<boolean>(false);

  const getDataFromChild = (data) => {
    setAllPageData(data);
  };
  const selectAll = () => {
    if (allPageData != undefined) {
      let unSelectedList = allPageData.filter(
        (x) => !selectedTempList.find((y) => y.Id == x.Id) && x.IsEnabled
      );
      setSelectedTempList([...selectedTempList, ...unSelectedList]);
      setIsAllPageDataSelected(true);
    }
  };

  const deSelectAll = () => {
    if (allPageData != undefined) {
      let selectedList = selectedTempList.filter(
        (x) => !allPageData.find((y) => y.Id == x.Id)
      );
      setSelectedTempList([...selectedList]);
      setIsAllPageDataSelected(false);
    }
  };

  const checkAllPageIsSelected = (checkModel?: BlogModel[]) => {
    if (checkModel == undefined) {
      for (let i = 0; i < allPageData.length; i++) {
        if (!selectedTempList.filter(x=>x.IsEnabled).find((x) => x.Id == allPageData[i].Id)) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
      setIsAllPageDataSelected(true);
      return;
    } else {
      for (let i = 0; i < checkModel.length; i++) {
        if (!selectedTempList.filter(x=>x.IsEnabled).find((x) => x.Id == checkModel[i].Id)) {
          setIsAllPageDataSelected(false);
          return;
        }
        setIsAllPageDataSelected(true);
        return;
      }
    }
  };

  const getBlogList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    const _result = await ApiService.getBlogList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount,
      };
    } else {
      setShowModal(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
        },
      });
      return {
        Data: [],
        TotalCount: 0,
      };
    }
  };

  const handleAddTempList = (idea) => {
    if (selectedTempList.find((i) => i.Id === idea.Id)) {
      let _currentArray = selectedTempList.filter((i) => i.Id !== idea.Id);
      setSelectedTempList(_currentArray);
      setIsAllPageDataSelected(false);
    } else {
      setSelectedTempList([...selectedTempList, idea]);
      checkAllPageIsSelected([...selectedTempList,idea]);
    }
  };

  const removeSelectedList = (e) => {
    let _currentArray = selectedList.filter((i) => i.Id !== e.Id);
    setSelectedTempList(_currentArray);
    setSelectedList(_currentArray);
  };

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedList]);

  const blogList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    return {
      Data: selectedList.slice((page - 1) * take, page * take),
      TotalCount: selectedList.length,
    };
  };

  useStateEffect(() => {
    let _currentArray: ItemModel[] = [];
    selectedList.map((item) =>
      _currentArray.push({
        ItemId: item.Id,
        PhotoUrl: "",
        RedirectUrl: "",
        Title: "",
        Description: "",
        IsIdeaMainProduct: false,
      })
    );
    setSelectedListToApi(_currentArray);
  }, [selectedList]);

  useStateEffect(() => {
    props.setSelectedListToApi(selectedListToApi);
    props.setSelectedList(selectedList);
  }, [selectedListToApi]);

  const returnHeader = () => {
    return (
      <div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Kapak Görseli</span>
        </div>
        <div className="lg:col-span-3">
          <span className="p-sm-gray-400">Blog Adı</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Kategori</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Blog Yazarı</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Durum</span>
        </div>
      </div>
    );
  };

  const returnBody = (e) => {
    return (
      <>
        <div className="lg:col-span-2 flex lg:block items-center flex items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Kapak Görseli:</span>
          <Image
            src={e.PhotoUrl}
            className="min-w-14 max-w-14 max-h-14 min-h-14 mr-2 object-contain  "
          />
        </div>
        <div className="lg:col-span-3 flex lg:block items-center flex items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Blog Adı:</span>
          <p className="text-black-700 text-sm">{e.Title}</p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Kategori:</span>
          <p className="text-black-700 text-sm">{e.CategoryName}</p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Blog Yazarı:</span>
          <p className="text-black-700 text-sm">{e.AuthorName}</p>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
          <p
            className={`${
              e.IsEnabled === true ? "text-green-400" : "text-red-400"
            } font-medium text-sm`}
          >
            {e.IsEnabled === true ? "Aktif" : "Pasif"}
          </p>
        </div>
      </>
    );
  };
  return (
    <div>
      <h4 className="mb-4">Öne Çıkarılacak Blog Listesi</h4>
      <Button
        textTiny
        text="Blog Seç"
        hasIcon
        icon={<PlusIcon className="icon-sm mr-2 " />}
        design="button-blue-100 text-blue-400 w-60 mb-4"
        onClick={() => setShowModal(true)}
      />
      <Table
        ref={tableEl}
        key={"table2"}
        emptyListText={"Blog Bulunamadı"}
        getDataFunction={blogList}
        header={returnHeader()}
        renderItem={(e, i) => {
          return (
            <div
              key={"list" + i}
              className="lg:grid-cols-11 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
            >
              {returnBody(e)}
              <div className="lg:col-span-1">
                <TrashIcon
                  className="icon-sm mr-2"
                  onClick={() => removeSelectedList(e)}
                />
              </div>
            </div>
          );
        }}
        noRefreshButton
      />

      <Modal
        modalType="fixedMd"
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTempList(selectedList);
        }}
        title="Listeden Blog Ekleme"
        body={
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700">
                <span className="text-gray-900 font-medium">
                  {selectedTempList.length} / 200
                </span>{" "}
                Blog Seçildi
              </div>
              <Button
                buttonMd
                text="Seçili Blogları Ekle"
                design="button-blue-400 w-60"
                onClick={() => {
                  setSelectedList(selectedTempList);
                  setShowModal(false);
                }}
              />
            </div>
            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Blog Bulunamadı"}
              getDataFunction={getBlogList}
              getListData={getDataFromChild}
              pageChanged={checkAllPageIsSelected}
              header={
                <div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Kapak Görseli</span>
                  </div>
                  <div className="lg:col-span-3">
                    <span className="p-sm-gray-400">Blog Adı</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Kategori</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Blog Yazarı</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Durum</span>
                  </div>
                  <div className="lg:col-span-1">
                    <Button
                      onClick={
                        isAllPageDataSelected
                          ? () => deSelectAll()
                          : () => selectAll()
                      }
                      design={
                        isAllPageDataSelected
                          ? "button-blue-400 text-white"
                          : "button-blue-100 text-blue-400"
                      }
                      text={
                        isAllPageDataSelected ? "Seçimi kaldır" : "Tümünü Seç"
                      }
                    ></Button>
                  </div>
                </div>
              }
              renderItem={(e, i) => {
                return (
                  <div
                    key={"list" + i}
                    className="lg:grid-cols-11 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
                  >
                    {returnBody(e)}
                    {e.IsEnabled === true && (
                      <div className="lg:col-span-1">
                        <Button
                          buttonSm
                          className="p-6"
                          hasIcon
                          icon={
                            selectedTempList.find((i) => i.Id === e.Id) ? (
                              <CheckIcon className="icon-sm" />
                            ) : (
                              <></>
                            )
                          }
                          design={
                            selectedTempList.find((i) => i.Id === e.Id)
                              ? "button-blue-400 text-white"
                              : "button-blue-100 text-blue-400"
                          }
                          text={
                            selectedTempList.find((i) => i.Id === e.Id)
                              ? ""
                              : "Seç"
                          }
                          onClick={() => {
                            handleAddTempList(e);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              }}
              noRefreshButton
            />
          </div>
        }
      />
    </div>
  );
};
