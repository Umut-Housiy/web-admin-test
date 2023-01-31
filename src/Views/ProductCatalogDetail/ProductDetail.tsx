import { FunctionComponent } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CoverPhotoIcon } from "../../Components/Icons";
import { Loading } from "../../Components/Loading";
import { CategoryPropertiesListModel, CategoryPropertyValueListModel, CategoryVariationsListModel, CategoryVariationValueListModel, ProductAdminDetailModel, ProductImageModel } from "../../Models"
import { Image } from "../../Components/Image";
import { formatter, fraction } from "../../Services/Functions";

export interface ProductDetailPropModel {
  loading: boolean,
  productDetail?: ProductAdminDetailModel,
  IsEnabled: boolean,
  mediaList: ProductImageModel[],
  categoryVariations: CategoryVariationsListModel[],
  categoryFeatures: CategoryPropertiesListModel[],
  productVariations: CategoryVariationValueListModel[],
  productFeatures: CategoryPropertyValueListModel[],
  groupData: AdvertGropDataModel[],
}

interface AdvertGropDataModel {
  name: string,
  value: string
}

export const ProductDetail: FunctionComponent<ProductDetailPropModel> = (props: ProductDetailPropModel) => {

  const multipleItems6Half = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplaySpeed: 4000,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  }

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  return (
    <>
      <div className="py-4 w-full mt-4">
        <h4 className="mb-4">Ürün Galerisi</h4>
        {props.loading ?
          <div className="grid lg:grid-cols-5 gap-4">
            <Loading width="w-full" height="h-40" />
            <Loading width="w-full" height="h-40" />
            <Loading width="w-full" height="h-40" />
            <Loading width="w-full" height="h-40" />
            <Loading width="w-full" height="h-40" />
          </div>
          :
          props.mediaList.length <= 4 ?
            <div className="grid lg:grid-cols-5">
              {props.mediaList.map((item, index) => (
                <div className="col-span-1 relative" key={"media_" + index}>
                  <img src={item.PhotoUrl} className="w-full pr-3 object-contain h-48" alt="Slider" />
                  {item.IsMainPhoto ?
                    <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                  }
                </div>
              ))}
            </div>
            :
            <Slider {...multipleItems6Half}>
              {props.mediaList.map((item, index) => (
                <div className="relative" key={"media_" + index}>
                  <img src={item.PhotoUrl} className="w-full pr-3 object-contain h-48" alt="Slider" />
                  {item.IsMainPhoto ?
                    <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                  }
                </div>
              ))}
            </Slider>
        }
      </div>
      <div className="py-4 w-full border-t border-gray-300">
        <div className="flex w-full gap-8">
          <div className="lg:w-1/2">
            <h4 className="mb-4">Ürün Bilgileri</h4>
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="min-w-1/3 flex p-sm-gray-700"><span>Ürün Kategorisi</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{props.productDetail?.Category}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="min-w-1/3 flex p-sm-gray-700"><span>Ürün Adı</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{props.productDetail?.ProductName}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="min-w-1/3 flex p-sm-gray-700"><span>Marka</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{props.productDetail?.Brand}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="min-w-1/3 flex p-sm-gray-700"><span>Model No</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{props.productDetail?.ModelNo}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="min-w-1/3 flex p-sm-gray-700"><span>Ön Yazı</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{props.productDetail?.ShortDescription ?? "-"}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="min-w-1/3 flex p-sm-gray-700"><span>Ürün Durumu</span><span className="ml-auto">:</span></div>
                  <div className={`${props.IsEnabled ? "text-green-400" : "text-red-400"} text-sm font-medium ml-2`}>{props.IsEnabled ? "Aktif" : "Pasif"}</div>
                </div>
            }
          </div>
          <div className="lg:w-1/2">
            <h4 className="mb-4">Ürün Varyasyon Seçimleri</h4>
            {
              props.loading ?
                <Loading textMd />
                :
                props.productVariations.map((item, index) => {
                  if (item.DataType === 1) {//DATE_RANGE
                    return (
                      <div className="flex mb-2 items-center" key={"variation_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryVariations.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{handleJsDate(JSON.parse(item.Value).StartDate) + " - " + handleJsDate(JSON.parse(item.Value).EndDate)}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 2) {//DATE
                    return (
                      <div className="flex mb-2 items-center" key={"variation_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryVariations.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{handleJsDate(Number(item.Value))}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 3) {//ONE_CHOICE
                    return (
                      <div className="flex mb-2 items-center" key={"variation_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryVariations.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{props.categoryVariations.find(x => x.Id === item.ElementId)?.Options.find(y => y.Id === Number(item.Value))?.Name}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 4 || item.DataType === 5) {//NUMBER || TEXT
                    return (
                      <div className="flex mb-2 items-center" key={"variation_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryVariations.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{item.Value}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 6) {//MEDIA
                    return (
                      <div className="flex mb-2 items-center" key={"variation_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryVariations.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <Image className="ml-2 w-20 h-20 object-contain" src={item.Value} />
                      </div>
                    )
                  }
                  else if (item.DataType === 7) {//MULTIPLE_CHOICE
                    return (
                      <div className="flex mb-2 items-center" key={"variation_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryVariations.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{JSON.parse(item.Value).Text}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 8) {//PRICE
                    return (
                      <div className="flex mb-2 items-center" key={"variation_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryVariations.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">
                          {Number(item.Value) % 1 === 0 ?
                            <>{fraction.format(Number(item.Value))} TL </>
                            :
                            <>{formatter.format(Number(item.Value))} TL</>
                          }
                        </div>
                      </div>
                    )
                  }
                  else {
                    return (
                      <></>
                    )
                  }
                })
            }
          </div>
        </div>
      </div>
      <div className="py-4 w-full border-t border-gray-300">
        <div className="flex w-full gap-8">
          <div className="lg:w-1/2">
            <h4 className="mb-4">Ürün Özellikleri</h4>
            {
              props.loading ?
                <Loading textMd />
                :
                props.productFeatures.map((item, index) => {//DATE_RANGE
                  if (item.DataType === 1) {
                    return (
                      <div className="flex mb-2 items-center" key={"feature_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryFeatures.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{handleJsDate(JSON.parse(item.Value).StartDate) + " - " + handleJsDate(JSON.parse(item.Value).EndDate)}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 2) {//DATE
                    return (
                      <div className="flex mb-2 items-center" key={"feature_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryFeatures.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{handleJsDate(Number(item.Value))}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 3) {//ONE_CHOICE
                    return (
                      <div className="flex mb-2 items-center" key={"feature_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryFeatures.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{props.categoryFeatures.find(x => x.Id === item.ElementId)?.Options.find(y => y.Id === Number(item.Value))?.Name}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 4 || item.DataType === 5) {//NUMBER || TEXT
                    return (
                      <div className="flex mb-2 items-center" key={"feature_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryFeatures.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{item.Value}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 6) {//MEDIA
                    return (
                      <div className="flex mb-2 items-center" key={"feature_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryFeatures.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <Image className="ml-2 w-20 h-20 object-contain" src={item.Value} />
                      </div>
                    )
                  }
                  else if (item.DataType === 7) {//MULTIPLE_CHOICE
                    return (
                      <div className="flex mb-2 items-center" key={"feature_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryFeatures.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">{JSON.parse(item.Value).Text}</div>
                      </div>
                    )
                  }
                  else if (item.DataType === 8) {//PRICE
                    return (
                      <div className="flex mb-2 items-center" key={"feature_" + index}>
                        <div className="min-w-1/3 flex p-sm-gray-700"><span>{props.categoryFeatures.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                        <div className="text-sm text-gray-900 ml-2">
                          {Number(item.Value) % 1 === 0 ?
                            <>{fraction.format(Number(item.Value))} TL </>
                            :
                            <>{formatter.format(Number(item.Value))} TL</>
                          }
                        </div>
                      </div>
                    )
                  }
                  else {
                    return (
                      <></>
                    )
                  }
                })
            }
          </div>
          <div className="lg:w-1/2">
            {
              props.loading ?
                <Loading inputMd />
                :
                props.groupData.length > 0 &&
                <>
                  <h4 className="mb-4">Takım İçeriği</h4>
                  {
                    props.groupData.map((item, index) => (
                      <>
                        <div className="flex mb-2" key={"group_" + index}>
                          <div className="min-w-1/3 flex p-sm-gray-700"><span>{index + 1 + ". Ürün Adı"}</span><span className="ml-auto">:</span></div>
                          <div className="text-sm text-gray-900 ml-2">{item.name}</div>
                        </div>
                        <div className="flex mb-2">
                          <div className="min-w-1/3 flex p-sm-gray-700"><span>{index + 1 + ". Ürün Ölçüleri"}</span><span className="ml-auto">:</span></div>
                          <div className="text-sm text-gray-900 ml-2">{item.value}</div>
                        </div>
                      </>
                    ))
                  }
                </>
            }
          </div>
        </div>
      </div>
      <div className="py-4 w-full border-t border-gray-300">
        <h4 className="mb-4">Ürün Açıklamaları</h4>
        <div className="flex w-full gap-8">
          {
            props.loading ?
              <Loading inputMd />
              :
              <div dangerouslySetInnerHTML={{ __html: props.productDetail?.Description ?? "" }} className="ck-editor-links text-sm h-48 w-1/2 p-4 overflow-y-auto custom-scrollbar border border-gray-300 rounded-lg" >
              </div>
          }
        </div>
      </div>
    </>
  )
}
