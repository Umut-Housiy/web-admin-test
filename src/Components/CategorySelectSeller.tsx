import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { SellerCategoryGroupListInnerModel, SellerCategoryListInnerModel } from "../Models";
import ApiService from "../Services/ApiService";
import { DropdownSearchBar } from "./DropdownSearchBar";
import { ChevronRightFill, CloseIcon } from "./Icons";
import { Loading } from "./Loading";
import { useStateEffect } from "./UseStateEffect";

export interface CategoryModel {
  id: number,
  title: string,
  childs: CategoryModel[]
}

export interface CategorySelectSellerPropModel {
  value: number,
  onChange: (e: number) => void,
  onChangeMultiCategory?: (selected: { id: number, name: string }) => void,
  setCategoryDisplayText: (e: string) => void,
  multiChoose?: boolean,
  categoryType?: number,
  setCategoryName?: (e: string) => void,
  isClearable?: boolean,
  isFull?: boolean
}

export interface CategorySelectSellerNodePropModel {
  list: CategoryModel[],
  selectedCategoryIds: number[],
  setSelectedCategory: (e: number) => void,
  closeDropdownFunc?: () => void
}


export const CategorySelectSellerNode: FunctionComponent<CategorySelectSellerNodePropModel> = (props: CategorySelectSellerNodePropModel) => {

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

export const CategorySelectSeller: FunctionComponent<CategorySelectSellerPropModel> = (props: CategorySelectSellerPropModel) => {

  const [loading, setLoading] = useState<boolean>(true);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [selectedCategoryTree, setSelectedCategoryTree] = useState<CategoryModel[]>([]);

  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);

  const [categoriesRaw, setCategoriesRaw] = useState<SellerCategoryListInnerModel[]>([]);

  const [groupsRaw, setGroupsRaw] = useState<SellerCategoryGroupListInnerModel[]>([]);


  useEffect(() => {
    getCategories();
  }, []);

  useStateEffect(() => {
    if (props.multiChoose !== true) {
      if (selectedCategoryTree.length) {
        props.onChange(selectedCategoryTree[selectedCategoryTree.length - 1]?.id || 0);
        props.setCategoryName?.(selectedCategoryTree[selectedCategoryTree.length - 1]?.title || "")
      }
      let _text = selectedCategoryTree.length ?
        selectedCategoryTree.map(x => x.title).join(" > ") : "Kategori seçiniz..."
      props.setCategoryDisplayText(_text);
    }
  }, [selectedCategoryTree]);

  const sendCategoryInfo = () => {
    if (selectedCategoryTree.length) {
      let _categoryIdAndNameArray = { id: (selectedCategoryTree[selectedCategoryTree.length - 1]?.id || 0), name: (selectedCategoryTree[selectedCategoryTree.length - 1]?.title || "") }
      props.onChangeMultiCategory?.(_categoryIdAndNameArray);
      props.onChange(selectedCategoryTree[selectedCategoryTree.length - 1]?.id || 0);
      props.setCategoryName?.(selectedCategoryTree[selectedCategoryTree.length - 1]?.title || "")
      setSelectedCategoryTree([]);
    }
    setShowDropdown(false);
  }

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

  const getFirstTierCategories = () => {
    const result: CategoryModel[] = categoriesRaw.filter(x => (x.ParentCategory ?? 0) <= 0 && x.CategoryStatus === true && x.GroupId === selectedGroupId).map(x => {
      return { id: x.Id, title: x.CategoryName, childs: getChild(x.CategoryName) }
    }) ?? [];

    return result;
  }


  const getCategoryGroups = () => {
    const result: CategoryModel[] = groupsRaw.map(x => {
      return { id: x.Id, title: x.GroupName, childs: [] }
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

  const changeSelectedGroup = (e: number) => {
    setSelectedGroupId(e);
    setSelectedCategoryTree([]);
  }

  const categorySelectNodes = () => {

    let nTiers: ReactElement[] = [];

    if (selectedCategoryTree.length > 0) {

      for (let i = 1; i < selectedCategoryTree.length; i++) {
        nTiers.push(
          <CategorySelectSellerNode
            key={"catsel-" + i}
            list={selectedCategoryTree[i - 1]?.childs || []}
            selectedCategoryIds={selectedCategoryTree.map(x => x.id) || []}
            setSelectedCategory={changeSelectedCategory}
            closeDropdownFunc={() => { props.multiChoose !== true && setShowDropdown(false) }}
          ></CategorySelectSellerNode>
        )
      }

      if (selectedCategoryTree[selectedCategoryTree.length - 1].childs?.length) {
        nTiers.push(
          <CategorySelectSellerNode
            key={"catsel-" + selectedCategoryTree.length}
            list={selectedCategoryTree[selectedCategoryTree.length - 1].childs}
            selectedCategoryIds={selectedCategoryTree.map(x => x.id) || []}
            setSelectedCategory={changeSelectedCategory}
            closeDropdownFunc={() => { props.multiChoose !== true && setShowDropdown(false) }}
          ></CategorySelectSellerNode>
        )
      }
    }

    return selectedGroupId > 0 ? <>
      <CategorySelectSellerNode
        list={getCategoryGroups()}
        selectedCategoryIds={[selectedGroupId]}
        setSelectedCategory={changeSelectedGroup}
        closeDropdownFunc={() => { }}
      ></CategorySelectSellerNode>
      <CategorySelectSellerNode
        list={getFirstTierCategories()}
        selectedCategoryIds={selectedCategoryTree.map(x => x.id) || []}
        setSelectedCategory={changeSelectedCategory}
        closeDropdownFunc={() => { setShowDropdown(false) }}
      ></CategorySelectSellerNode>
      {nTiers.map(x => x)}
    </> : <>
      <CategorySelectSellerNode
        list={getCategoryGroups()}
        selectedCategoryIds={[selectedGroupId]}
        setSelectedCategory={changeSelectedGroup}
        closeDropdownFunc={() => { }}
      ></CategorySelectSellerNode>
    </>
  }
  useStateEffect(() => {
    const selectedCategories = getParentsById(props.value);

    setSelectedCategoryTree(selectedCategories);

    if (selectedCategories && selectedCategories.length) {
      const selectedtieroneCategory = categoriesRaw.filter(x => x.Id === selectedCategories[0].id);
      if (selectedtieroneCategory && selectedtieroneCategory.length) {
        setSelectedGroupId(selectedtieroneCategory[0].GroupId);
      }
    }
  }, [categoriesRaw]);

  return (
    <div className={`relative mb-4 ${props.isFull ? "flex-1" : ""}`}>

      {loading ? <Loading height="h-10" /> : <>
        <div className={`${showDropdown === true ? "border-blue-400 " : "border-gray-300"} transition-all duration-300  cursor-pointer border rounded-lg py-3 text-gray-900 font-medium px-2 w-full text-sm`} onClick={() => { setShowDropdown(!showDropdown) }}>
          <span className="text-sm">

            {categoriesRaw.length ? <>
              {(selectedCategoryTree.length && props.multiChoose !== true) ? selectedCategoryTree.map(x => x.title).join(" > ")
                : (selectedCategoryTree.length && props.multiChoose === true) ?
                  selectedCategoryTree[selectedCategoryTree.length - 1]?.title
                  :
                  "Kategori seçiniz..."}
            </> : <>...</>}
          </span>

        </div>
        {(props.isClearable && selectedCategoryTree.length > 0) && <CloseIcon className=" absolute right-1 top-1/2 transform -translate-y-1/2 bg-white icon-md text-gray-700 hover:text-gray-900 transition-all duration-300 cursor-pointer z-40" onClick={() => {
          props.onChange(0);
          props.setCategoryDisplayText("");
          setSelectedCategoryTree([]);
          props.setCategoryName?.("");
        }} />}

        {showDropdown &&
          <>
            <div className="fixed inset-0 z-10 " onClick={() => { setShowDropdown(false); }}></div>
            <div className={`${props.multiChoose && selectedCategoryTree && selectedCategoryTree.length ? "pb-16 " : ""} absolute top-10 left-0  border border-blue-400 rounded-b-lg bg-white p-2 z-20 transition-all duration-300`} >
              <div className="w-full grid grid-flow-col gap-3 ">
                {categorySelectNodes()}
              </div>
              {(props.multiChoose && selectedCategoryTree && selectedCategoryTree.length) ? <>
                <div className="absolute bottom-2 rounded-md cursor-pointer py-3  right-2 left-2 button-blue-400 text-sm  text-center" onClick={() => sendCategoryInfo()}>Seçimi Ekle</div>
              </> : <></>
              }
            </div>
          </>
        }
      </>}
    </div >
  )
}
