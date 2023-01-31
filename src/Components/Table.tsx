import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  ReactElement,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useHistory } from "react-router";
import { Button } from "./Button";
import { Dropdown } from "./Dropdown";
import { EmptyList } from "./EmptyList";
import { FilterIcon, RefreshIcon } from "./Icons";
import { Loading } from "./Loading";
import { Pagination } from "./PaginationPr";
import { SearchBar } from "./SearchBar";
import { useStateEffect } from "./UseStateEffect";

interface ListModel {
  TotalCount: number;
  Data: any[];
}

interface TableProps {
  sortOptions?: { key: string; value: string }[];
  header: ReactElement;
  renderItem: (e: any, i?: number) => ReactElement;
  addNewButton?: ReactElement;
  getDataFunction: (
    order: number,
    seachText: string,
    page: number,
    take: number
  ) => Promise<ListModel>;
  emptyListText?: string;
  noSortOptions?: boolean;
  noSearchBar?: boolean;
  noRefreshButton?: boolean;
  className?: string;
  noTopPart?: boolean;
  hasOverflowClass?: boolean;
  isCustomFilter?: boolean;
  customFilter?: ReactElement;
  page?: number;
  setPageQueryString?: boolean;
  showFilterOpen?: boolean;
  downloadExcel?: boolean;
  setListExcelData?: (e: any[]) => void;
  getExcelDataFunction?: (
    order: number,
    seachText: string,
    page: number,
    take: number
  ) => Promise<ListModel>;
  setDownloadExcel?: (e: boolean) => void;
  getListData?: Function;
  pageChanged?:Function;
}

interface refProps {
  reload: () => void;
}

export type { refProps };

export const Table: ForwardRefExoticComponent<
  TableProps & RefAttributes<refProps>
> = forwardRef<refProps, TableProps>(
  (props: TableProps, ref: ForwardedRef<refProps>) => {
    useImperativeHandle(ref, () => ({ reload: refreshData }));

    const sortOptionsDefault = [
      { key: "1", value: "Yeniden Eskiye" },
      { key: "2", value: "Eskiden Yeniye" },
    ];

    const history = useHistory();

    const [selectedSortOption, setSelectedSortOption] = useState<{
      key: string;
      value: string;
    }>((props.sortOptions || sortOptionsDefault)[0]);

    const [page, setPage] = useState<number>(props.page || 1);

    const [isShowCustomFilter, setIsShowCustomFilter] = useState<boolean>(
      props.showFilterOpen ?? false
    );

    const [listData, setListData] = useState<any[]>([]);

    const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);

    const take = 20;

    const [totalCount, setTotalCount] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(true);

    const [searchText, setSearchText] = useState<string>("");

    const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout>(
      setTimeout(() => {}, 2000)
    );

    useEffect(() => {
      refreshData();
    }, []);

    useStateEffect(() => {
      if (props.setPageQueryString === true) {
        history.push({
          pathname: history.location.pathname,
          search: "?sayfa=" + page,
        });
      }
      refreshData();
    }, [page]);

    useStateEffect(() => {
      clearTimeout(refreshTimer);
      setRefreshTimer(
        setTimeout(() => {
          if (page === 1) {
            refreshData();
          } else {
            setPage(1);
          }
        }, 2000)
      );
    }, [searchText]);

    useStateEffect(() => {
      setShowSortDropdown(false);
      refreshData();
    }, [selectedSortOption]);

    const refreshData = () => {
      if (props.downloadExcel === true) {
        props
          .getExcelDataFunction?.(
            Number(selectedSortOption?.key || 0),
            searchText,
            1,
            9999999
          )
          .then((e) => {
            props.setListExcelData?.(e.Data);
            props.setDownloadExcel?.(false);
          });
      } else {
        setLoading(true);
        props
          .getDataFunction(
            Number(selectedSortOption?.key || 0),
            searchText,
            page,
            take
          )
          .then((e) => {
            setListData(e.Data);
            setTotalCount(e.TotalCount);
            if(props.getListData!=undefined){
              props.getListData(e.Data)
              if(props.pageChanged!=undefined)
                props.pageChanged(e.Data);
            }
            setLoading(false);
          });
      }
    };

    return (
      <div>
        {props.noTopPart === true ? (
          <></>
        ) : (
          <div className="grid lg:grid-cols-12 flex items-center border-t border-gray-200">
            <div className="lg:col-span-5 mr-auto flex items-center gap-4 w-full">
              {props.addNewButton}
              <Pagination
                noMargin
                loading={loading}
                page={page}
                setPage={setPage}
                totalCount={totalCount}
                take={take}
              />
            </div>
            <div className="lg:col-span-7 lg:my-6">
              <div className="flex items-center lg:flex-row flex-col  justify-end">
                <>
                  {props.noSearchBar ? (
                    <></>
                  ) : (
                    <SearchBar
                      iconColor="text-gray-400"
                      className="w-full mb-2 lg:mb-0"
                      isSmall
                      placeholder="Listede Ara..."
                      notButton
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                      }}
                    />
                  )}
                  {props.isCustomFilter ? (
                    <>
                      <div
                        className={`${
                          isShowCustomFilter
                            ? `text-blue-400 bg-blue-100 border-blue-200`
                            : `text-gray-700`
                        } transform transition-all duration-300 font-medium flex items-center text-sm border p-2.5 rounded-lg cursor-pointer w-52`}
                        onClick={() =>
                          setIsShowCustomFilter(!isShowCustomFilter)
                        }
                      >
                        <FilterIcon className="icon-md mr-2" />
                        {isShowCustomFilter
                          ? "Sırala & Filtrele"
                          : "Sırala & Filtrele"}
                      </div>
                    </>
                  ) : (
                    <>
                      {props.noSortOptions === true ? (
                        <> </>
                      ) : (
                        <>
                          {(listData || []).length &&
                          (listData || []).length > 1 ? (
                            <>
                              <Dropdown
                                isDropDownOpen={showSortDropdown}
                                onClick={() => {
                                  setShowSortDropdown(!showSortDropdown);
                                }}
                                className="lg:w-52 ml-2 text-gray-700 mb-2 lg:mb-0"
                                classNameDropdown="ml-2"
                                label={selectedSortOption.value}
                                icon
                                iconComponent={
                                  <FilterIcon className="icon-sm" />
                                }
                                items={props.sortOptions || sortOptionsDefault}
                                onItemSelected={(item) => {
                                  setSelectedSortOption(item);
                                }}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
                {props.noRefreshButton ? (
                  <></>
                ) : (
                  <div
                    className="text-blue-400 flex items-center text-sm font-medium px-4 cursor-pointer"
                    onClick={() => refreshData()}
                  >
                    <RefreshIcon className="icon-md mr-2" />
                    Yenile
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {isShowCustomFilter ? (
          <>
            <div className={`w-full `}>{props.customFilter}</div>
            <div className={`flex justify-end mb-4 gap-x-3 mt-4`}>
              <Button
                buttonSm
                text="Gizle"
                design="button-gray-100 w-32"
                onClick={() => {
                  setIsShowCustomFilter(false);
                }}
              />
              <Button
                buttonSm
                text="Filtreyi Uygula"
                design="button-blue-400  w-32"
                onClick={() => {
                  refreshData();
                }}
              />
            </div>
          </>
        ) : (
          <></>
        )}
        <div
          className={`${
            props.hasOverflowClass
              ? "w-full overflow-x-auto custom-scrollbar"
              : ""
          }`}
        >
          {props.header}
          {loading ? (
            <>
              <div className="mt-3">
                <Loading inputMd />
              </div>
              <div className="mt-3">
                <Loading inputMd />
              </div>
              <div className="mt-3">
                <Loading inputMd />
              </div>
              <div className="mt-3">
                <Loading inputMd />
              </div>
              <div className="mt-3">
                <Loading inputMd />
              </div>
              <div className="mt-3">
                <Loading inputMd />
              </div>
              <div className="mt-3">
                <Loading inputMd />
              </div>
              <div className="mt-3">
                <Loading inputMd />
              </div>
              <div className="mt-3">
                <Loading inputMd />
              </div>
            </>
          ) : (
            <>
              {(listData || []).length ? (
                <>
                  {listData.map((e, i) => {
                    return props.renderItem(e, i);
                  })}
                </>
              ) : (
                <>
                  <div className="m-20">
                    <EmptyList text={props.emptyListText || "Liste Boş"} />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);
