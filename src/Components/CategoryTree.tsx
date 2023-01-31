import React, { FunctionComponent, useEffect, useState } from "react";
import { SellerCategoryGroupListInnerModel, SellerCategoryListInnerModel } from "../Models";
import ApiService from "../Services/ApiService";
import { ChevronRightIcon, MinusIcon, PlusIcon } from "./Icons";
import { Loading } from "./Loading";
import { Image } from "./Image";
import { useStateEffect } from "./UseStateEffect";
import { useHistory } from "react-router";

export interface CategoryModel {
  id: number,
  title: string,
  photo: string,
  childs: CategoryModel[]
}


export const CategoryTree: FunctionComponent = () => {

  const [loading, setLoading] = useState<boolean>(true);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [selectedParentId, setSelectedParentId] = useState<number>(0);

  const [categoriesRaw, setCategoriesRaw] = useState<SellerCategoryListInnerModel[]>([]);

  const [groupsRaw, setGroupsRaw] = useState<SellerCategoryGroupListInnerModel[]>([]);

  const history = useHistory();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoading(true);

    var result = await ApiService.getSellerCategoryList(1, 99999, "", 0);
    const _resultGroup = await ApiService.getSellerCategoryGroupList(1, 99999, "", 0);

    let _tempGroupArray: SellerCategoryGroupListInnerModel[] = []

    _resultGroup.data.Data.map((item) => (
      _tempGroupArray.push(
        {
          Id: item.Id,
          GroupDescription: item.GroupDescription,
          GroupName: item.GroupName,
          IsActive: item.IsActive,
          OrderBy: item.OrderBy,
          PhotoPath: item.PhotoPath,
          GroupCode: item.GroupCode

        } as SellerCategoryGroupListInnerModel
      )
    ))

    if (result.succeeded) {
      const catList = result.data.Data;
      setCategoriesRaw(catList);
      setGroupsRaw(_tempGroupArray.map(x => x));
    }

    setLoading(false);
  }

  const [selectedRemoveList, setSelectedRemoveList] = useState<CategoryModel[]>([]);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])

  const removeIds = (selectedId) => {
    let removedItems = getChild(selectedId);
    setSelectedParentId(selectedId);
    setSelectedRemoveList(removedItems);
  }

  useStateEffect(() => {
    removeIdsFromSelectedList();
  }, [selectedRemoveList])

  const removeIdsFromSelectedList = () => {
    let removedItemIds: number[] = [selectedParentId];

    if (selectedRemoveList.length > 0) {
      JSON.stringify(selectedRemoveList, (key, value) => {
        if (key === 'id') removedItemIds.push(value);
        return value;
      })

    }
    let _newList = selectedCategoryIds?.filter(o1 => !removedItemIds?.some(o2 => o1 === o2));
    setSelectedCategoryIds(_newList);
  }


  const getTree = (i) => {
    var childs = categoriesRaw.filter(x => x.ParentCategory === i).map(x => x);
    var current = categoriesRaw.filter(x => x.Id === i).map(x => x);
    return <div className="" >
      <div className="pl-0">
        <div className="flex items-center justify-start  border-b  py-5">
          {(childs.length && childs.length > 0) ?
            <>
              {selectedCategoryIds.indexOf(i) > -1 ?
                <>
                  {showDropdown === true && <MinusIcon className="w-6 text-gray-700 mr-2 cursor-pointer" onClick={() => { removeIds(i) }} />}
                </>
                :
                <PlusIcon onClick={() => { setSelectedCategoryIds([...selectedCategoryIds, i]); setShowDropdown(true) }} className="icon-md text-gray-700 mr-2 cursor-pointer" />
              }
            </>
            : ""}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center text-gray-700 text-tiny font-medium">
              {(childs.length === 0) ?
                <span className="inline-block mr-7"></span>
                :
                <></>
              }
              <Image src={current[0]?.PhotoPath} className="min-h-14 max-h-14 min-w-14 max-w-14 mr-2 object-contain" />
              {current[0]?.CategoryName}
            </div>
            <ChevronRightIcon className="text-gray-700 w-6 h-6 cursor-pointer" onClick={() => history.push(`/satici-kategori-bilgileri-detay/${current[0].Id}`)} />
          </div>

        </div>

        {showDropdown &&
          <>
            {selectedCategoryIds.indexOf(i) > -1 ?
              <div className="pl-12">
                {childs.length > 0 ? <>
                  {childs.map(x => getTree(x.Id))}
                </> : <>
                </>}
              </div>
              :
              <></>
            }
          </>
        }
      </div>
    </div>
  }

  const getChild = (id: number) => {
    let filteredList = categoriesRaw.filter(x => x.ParentCategory === id);
    let result: CategoryModel[] = [];

    if (filteredList.length) {
      result = filteredList.map(x => {
        return {
          id: x.Id,
          title: x.CategoryName,
          photo: x.PhotoPath,
          childs: getChild(x.Id)
        }
      })
    }
    return result;
  }



  return (
    <div className="relative">
      {loading ? <><Loading inputSm /><Loading inputSm /> <Loading inputSm /> <Loading inputSm />  </> :
        categoriesRaw.filter(x => (x.ParentCategory ?? 0) <= 0).map(x => getTree(x.Id))}
    </div >
  )
}
