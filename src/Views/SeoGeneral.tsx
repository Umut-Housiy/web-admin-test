import { FunctionComponent, useContext, useEffect, useState } from "react"
import { GeneralSeoUpdate } from "../Components/GeneralSeoUpdate";
import { TabsTitle } from "../Components/TabsTitle";
import { GeneralSeoModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const SeoGeneral: FunctionComponent = () => {

  const tabsLink = [
    { id: 1, name: "Anasayfa" },
    { id: 2, name: "Kurumsal" },
    { id: 3, name: "Blog" },
    { id: 4, name: "Ürünler" },
    { id: 5, name: "Profesyonel Anasayfa" }
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [seoList, setSeoList] = useState<GeneralSeoModel[]>([]);

  useEffect(() => {
    getGeneralSeoList();
  }, []);

  const getGeneralSeoList = async () => {
    setLoading(true);

    const _result = await ApiService.getGeneralSeoList();

    if (_result.succeeded === true) {
      setSeoList(_result.data);
      setLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoading(false); }
      });
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-4 ">Genel SEO</h2>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {
          tabsLink.map((item) => (
            <>
              {
                selectedTabsId === item.id &&
                <GeneralSeoUpdate isLoading={loading} seoList={seoList} pageId={item.id} getGeneralSeoList={getGeneralSeoList} />
              }
            </>
          ))
        }
      </div>
    </div>
  )
}
