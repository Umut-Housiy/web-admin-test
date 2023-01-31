import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { SellerCategoryListInnerModel } from "../Models";
import ApiService from "../Services/ApiService";
import { DropdownSearchBar } from "./DropdownSearchBar";
import { ChevronRightFill } from "./Icons";
import { Loading } from "./Loading";
import { SearchBar } from "./SearchBar";
import { useStateEffect } from "./UseStateEffect";

export interface CategoryModel {
  id: number,
  title: string,
  childs: CategoryModel[]
}

export interface CategorySelectProPropModel {
  value: number,
  onChange: (e: number) => void,
  onChangeMultiCategory?: (selected: { id: number, name: string }) => void,
  setCategoryDisplayText: (e: string) => void,
  categoryType?: number,
  clear?: boolean
}

export interface CategorySelectProNodePropModel {
  list: CategoryModel[],
  selectedCategoryIds: number[],
  setSelectedCategory: (e: number) => void,
  closeDropdownFunc?: () => void
}


export const CategorySelectProNode: FunctionComponent<CategorySelectProNodePropModel> = (props: CategorySelectProNodePropModel) => {

  const [searchText, setSearchText] = useState<string>("");

  const showingList = props.list.filter(x => !searchText || (x.title.toLocaleLowerCase("tr-tr").indexOf((searchText || "").toLocaleLowerCase("tr-tr")) > -1)).sort((a, b) => (a.title < b.title) ? -1 : ((b.title < a.title) ? 1 : 0)) || [];

  return showingList.length || searchText ? <div className="border-r-2 pr-3">
    <DropdownSearchBar notButton onChange={(e) => {
      setSearchText(e.target.value)
    }} />
    <div className="max-h-48 overflow-auto custom-scrollbar pr-3">
      {showingList.length ? showingList.map((item) => (
        <div className={`flex py-2 border-b border-t items-center justify-between cursor-pointer  `}
          onClick={() => {
            if (item.childs.length <= 0 && props.closeDropdownFunc) {
              props.closeDropdownFunc();
            }

            props.setSelectedCategory(item.id)
          }}
        >
          <span className={`${props.selectedCategoryIds.indexOf(item.id) > -1 ? "text-blue-400" : ""}  text-sm font-medium `}> {item.title}</span>
          {item.childs.length ?
            <>
              {item.childs.length > 0 &&
                <ChevronRightFill className={`${props.selectedCategoryIds.indexOf(item.id) > -1 ? "text-blue-400" : "text-gray-700"} w-2 h-2 `} />
              }
            </> : <></>
          }
        </div>
      )) : <>{
        searchText ? <span className={`text-sm cursor-pointer font-medium `}> Aramanıza uygun kategori bulunamadı</span> : <></>
      }
      </>}
    </div >
  </div > : <></>;
}

export const CategorySelectPro: FunctionComponent<CategorySelectProPropModel> = (props: CategorySelectProPropModel) => {

  const [loading, setLoading] = useState<boolean>(true);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [selectedCategoryTree, setSelectedCategoryTree] = useState<CategoryModel[]>([]);

  const [categoriesRaw, setCategoriesRaw] = useState<SellerCategoryListInnerModel[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  useStateEffect(() => {
    if (selectedCategoryTree.length) {
      props.onChange(selectedCategoryTree[selectedCategoryTree.length - 1]?.id || 0);
    }
    let _text = selectedCategoryTree.length ?
      selectedCategoryTree.map(x => x.title).join(" > ") : "Kategori seçiniz..."
    props.setCategoryDisplayText(_text);

  }, [selectedCategoryTree]);

  const sendCategoryInfo = () => {
    if (selectedCategoryTree.length) {
      let _categoryIdAndNameArray = { id: (selectedCategoryTree[selectedCategoryTree.length - 1]?.id || 0), name: (selectedCategoryTree[selectedCategoryTree.length - 1]?.title || "") }
      props.onChangeMultiCategory?.(_categoryIdAndNameArray);
      props.onChange(selectedCategoryTree[selectedCategoryTree.length - 1]?.id || 0);
      setSelectedCategoryTree([]);
    }
    setShowDropdown(false);
  }

  const getCategories = async () => {
    setLoading(true);

    var _result = await ApiService.getProCategoryList(1, 99999, "", 0);
    let _tempArray: SellerCategoryListInnerModel[] = []
    _result.data.Data.map((item) => (
      _tempArray.push(
        {
          Id: item.Id,
          PhotoPath: item.PhotoPath,
          CategoryName: item.CategoryName,
          CategoryCode: item.CategoryCode,
          ParentName: item.ParentName,
          CategoryOrder: item.CategoryOrder,
          CommissionPercentage: 0,
          CategoryStatus: item.CategoryStatus,
          GroupId: 0,
          ParentCategory: Number(item.ParentCategory)
        }
      )
    ))
    if (_result.succeeded) {
      const catList = _tempArray;
      setCategoriesRaw(catList);
    }

    setLoading(false);
  }

  const getFirstTierCategories = () => {
    const result: CategoryModel[] = categoriesRaw.filter(x => (x.ParentCategory ?? 0) <= 0).map(x => {
      return { id: x.Id, title: x.CategoryName, childs: getChild(x.CategoryName) }
    }) ?? [];

    return result;
  }

  const getParents = (title: string) => {
    let catResult: CategoryModel[] = [];

    const cat = categoriesRaw.find(x => x.CategoryName == title);

    if (cat) {
      if (cat.ParentName) {

        let parents = getParents(cat.ParentName);
        catResult = [...parents, { id: cat.Id, title: cat.CategoryName, childs: getChild(cat.CategoryName) }]
      }
      else {
        catResult = [{ id: cat.Id, title: cat.CategoryName, childs: getChild(cat.CategoryName) }]
      }
    }

    return catResult;
  }

  const getParentsById = (id: number) => {
    let catResult: CategoryModel[] = [];

    const cat = categoriesRaw.find(x => x.Id == id);

    if (cat) {
      if (cat.ParentName) {

        let parents = getParents(cat.ParentName);
        catResult = [...parents, { id: cat.Id, title: cat.CategoryName, childs: getChild(cat.CategoryName) }]
      }
      else {
        catResult = [{ id: cat.Id, title: cat.CategoryName, childs: getChild(cat.CategoryName) }]
      }
    }

    return catResult;
  }

  const getChild = (title: string) => {
    let filteredList = categoriesRaw.filter(x => x.ParentName == title);
    let result: CategoryModel[] = [];

    if (filteredList.length) {
      result = filteredList.map(x => {
        return {
          id: x.Id,
          title: x.CategoryName,
          childs: getChild(x.CategoryName)
        }
      })
    }

    return result;
  }

  const changeSelectedCategory = (e: number) => {
    setSelectedCategoryTree(getParentsById(e));
  }

  const categorySelectNodes = () => {

    let nTiers: ReactElement[] = [];

    if (selectedCategoryTree.length > 0) {

      for (let i = 1; i < selectedCategoryTree.length; i++) {
        nTiers.push(
          <CategorySelectProNode
            key={"catsel-" + i}
            list={selectedCategoryTree[i - 1]?.childs || []}
            selectedCategoryIds={selectedCategoryTree.map(x => x.id) || []}
            setSelectedCategory={changeSelectedCategory}
            closeDropdownFunc={() => { setShowDropdown(false) }}
          ></CategorySelectProNode>
        )
      }

      if (selectedCategoryTree[selectedCategoryTree.length - 1].childs?.length) {
        nTiers.push(
          <CategorySelectProNode
            key={"catsel-" + selectedCategoryTree.length}
            list={selectedCategoryTree[selectedCategoryTree.length - 1].childs}
            selectedCategoryIds={selectedCategoryTree.map(x => x.id) || []}
            setSelectedCategory={changeSelectedCategory}
            closeDropdownFunc={() => { setShowDropdown(false) }}
          ></CategorySelectProNode>
        )
      }
    }

    return <>
      <CategorySelectProNode
        list={getFirstTierCategories()}
        selectedCategoryIds={selectedCategoryTree.map(x => x.id) || []}
        setSelectedCategory={changeSelectedCategory}
        closeDropdownFunc={() => { setShowDropdown(false) }}
      ></CategorySelectProNode>
      {nTiers.map(x => x)}
    </>
  }

  useStateEffect(() => {
    setSelectedCategoryTree(getParentsById(props.value));
  }, [categoriesRaw]);

  useEffect(() => {
    if (props.clear === true) {
      setSelectedCategoryTree([])
    }
  }, [props.clear])

  return (
    <div className="relative mb-4">
      {loading ? <Loading height="h-10" /> : <>
        <div className={`${showDropdown === true ? "border-blue-400 " : "border-gray-300"} transition-all duration-300  cursor-pointer border rounded-lg py-3 text-gray-900 font-medium px-2 w-full text-sm`} onClick={() => { setShowDropdown(!showDropdown) }}>
          <span className="text-sm">
            {categoriesRaw.length ? <>
              {(selectedCategoryTree.length) ? selectedCategoryTree.map(x => x.title).join(" > ")
                : (selectedCategoryTree.length) ?
                  selectedCategoryTree[selectedCategoryTree.length - 1]?.title
                  :
                  "Kategori seçiniz..."}
            </> : <>...</>}
          </span>
        </div>
        {showDropdown &&
          <>
            <div className="fixed inset-0 z-10 " onClick={() => { setShowDropdown(false); }}></div>
            <div className={`absolute top-10 left-0 right-0 border border-blue-400 rounded-b-lg bg-white p-2 z-20 transition-all duration-300`} >
              <div className="w-full grid grid-flow-col gap-3 ">
                {categorySelectNodes()}
              </div>
            </div>
          </>
        }
      </>}
    </div >
  )
}
