import { FunctionComponent, useCallback, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Button } from "../../Components/Button";
import { CampaignStatusText } from "../../Components/CampaignStatusText";
import { CountDown } from "../../Components/CountDown";
import { DateView } from "../../Components/DateView";
import { ChevronRightIcon, CopyIcon, NewTabIcon, PlusIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table";
import ApiService from "../../Services/ApiService";
import { SITE_URLS } from "../../Services/Constants";
import { readPageQueryString } from "../../Services/Functions";
import { CampaignListInnerModel } from "../../Models";

function AddNewButton() {
  const history = useHistory();
  return (
    <Button buttonMd textTiny color="text-blue-400" className="w-96"
            design="button-blue-100" text="Yeni Kampanya Oluştur"
            hasIcon icon={<PlusIcon className="icon-sm mr-2"/>}
            onClick={() => history.push("/yonetim-kampanyasi-olustur")}
    />
  );
}

function Header() {
  return (
    <div className="lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-5">
        <span className="p-sm-gray-400">
          Kampanya Başlığı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Başlangıç Tarihi
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Bitiş Tarihi
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Kalan Süre
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Seçili Ürün Sayısı
        </span>
      </div>
      <div className="lg:col-span-2">
        <span className="p-sm-gray-400">
          Durum
        </span>
      </div>
    </div>
  );
}

function RenderItem(props: { item: CampaignListInnerModel }) {
  const {item} = props;
  return (
    <div className="lg:grid-cols-11 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
      <div className="lg:col-span-5 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Kampanya Başlığı:</span>
        <p className="p-sm">
          {item.CampaignName}
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center flex items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Başlangıç Tarihi:</span>
        <DateView className="text-sm font-medium" dateNumber={item.StartDateJSTime} pattern="dd/MM/yyyy"/>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Bitiş Tarihi:</span>
        <DateView className="text-sm font-medium" dateNumber={item.EndDateJSTime} pattern="dd/MM/yyyy"/>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Kalan Süre:</span>
        <CountDown startDate={item.StartDateJSTime} endDate={item.EndDateJSTime}/>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Seçili Ürün Sayısı:</span>
        <p className="p-sm">
          {item.AdvertCount}
        </p>
      </div>
      <div className="lg:col-span-2 flex items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
        {!item.Status
          ? <span className="text-sm font-medium text-gray-700">Pasif</span>
          : <CampaignStatusText startDate={item.StartDateJSTime} endDate={item.EndDateJSTime}/>
        }
        <div className="ml-auto flex items-center divide-x">
          <a className="pr-3" target="_blank" href={`${SITE_URLS.SITE_URL}/kampanya/${item.CampaignSeoUrl ?? ""}`}>
            <NewTabIcon className="icon-sm text-blue-400"/>
          </a>
          <Link className={"pl-3 flex items-center"} to={{
            pathname: `/yonetim-kampanyasi-olustur/${item.CampaignId}`,
            state: {queryPage: Number(readPageQueryString(window.location) ?? "1")}
          }}>
            <CopyIcon className="icon-sm text-blue-400 mr-3"/>
          </Link>
          <Link className="pl-3 flex items-center" to={{
            pathname: `/yonetim-kampanyasi-detay/${item.CampaignId}`,
            state: {queryPage: Number(readPageQueryString(window.location) ?? "1")}
          }}>
            <ChevronRightIcon className="icon-md text-gray-700"/>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const ManagementCampaignList: FunctionComponent = () => {
  const tableEl = useRef<any>();

  const getManagementCampaignList = useCallback(async (order: number, searchText: string, page: number, take: number) => {
    const response = await ApiService.getManagementCampaignList(page, take, searchText, order);
    if (response.succeeded) {
      return {
        Data: response.data.Data,
        TotalCount: response.data.TotalCount
      }
    } else {
      return {Data: [], TotalCount: 0}
    }
  }, []);

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Yönetim Kampanyaları</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kampanya Bulunamadı"}
          getDataFunction={getManagementCampaignList}
          addNewButton={<AddNewButton/>}
          header={<Header/>}
          renderItem={(item, index) => (
            <RenderItem item={item} key={`key_${index}`}/>
          )}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>
  )
}
