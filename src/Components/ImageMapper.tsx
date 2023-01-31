import { FunctionComponent, useState, useRef, ReactElement, useEffect } from "react";
import { useStateEffect } from "./UseStateEffect";

export interface ImageMapperPropModel {
  activePinId: number;
  setActivePinId: (e: number) => void
  data?: string, // ilk veri buradan verilmeli. Eğer read only ise veri buradan json olarak gönderilecek
  setData?: (e: string) => void; //
  imageUrl: string;
  newPinExternalData?: object,
  imageMaxHeightInPx: number;
  imageMaxWidthInPx: number;
  activePin?: ReactElement;
  pasivePin?: ReactElement;
  pinMenu?: (pin: ImagePinModel, updatePinsFunc: (pin: ImagePinModel) => void) => ReactElement;
  isReadOnly?: boolean;
  onReadOnlyPinClick?: () => Promise<ImagePinModel | null>;
  pinDivStyle?: (isActive: boolean) => Promise<any>;
  pinClassNames?: string;
  pinMenuClassNames?: string;
  pinMenuDivStyle?: () => Promise<any>;
  containerDivClassNames?: string;
  containerDivStyle?: () => Promise<any>;
  imgClassNames?: string;
  imgStyle?: () => Promise<any>;
}

export interface ImagePinModel {
  id: number;
  imageUrl: string,
  xInPercentage: number;
  yInPercentage: number;
  externalData?: any;
}

export const ImageMapper: FunctionComponent<ImageMapperPropModel> = (props: ImageMapperPropModel) => {

  //#region State Declaration

  const [pins, setPins] = useState<ImagePinModel[]>(() => {
    if (props.data) {
      let initData = [];
      try {
        initData = JSON.parse(props.data);
      } catch { }
      return initData;
    }
    else {
      return [];
    }
  });

  useEffect(() => {
    if (props.data) {
      let initData = [];
      try {
        initData = JSON.parse(props.data);
        setPins(JSON.parse(JSON.stringify(initData)));
      } catch { setPins(JSON.parse(JSON.stringify([]))); }
    }
    else {
      setPins(JSON.parse(JSON.stringify([])));
    }
  }, [props.data]);

  const [divWidth, setDivWidth] = useState<number>(0);

  const [divHeight, setDivHeight] = useState<number>(0);

  const imageElementRef = useRef<HTMLImageElement>(null);

  //#endregion State Declaration

  //#region Effect Declaration

  useStateEffect(() => {
    if (props.setData) {
      props.setData?.(JSON.stringify(pins));
    }
  }, [pins]);

  //#endregion Effect Declaration

  //#region Calculation and data change functions

  const handleLoad = (e) => {

    const maxHeight = props.imageMaxHeightInPx ? props.imageMaxHeightInPx : 99999;
    const maxWidth = props.imageMaxWidthInPx ? props.imageMaxWidthInPx : 99999;

    let newHeight = imageElementRef?.current?.naturalHeight ?? 0;
    let newWidth = imageElementRef?.current?.naturalWidth ?? 0;

    if (newHeight > maxHeight) {
      let decRatio = (100 * maxHeight) / (newHeight ? newHeight : 1);
      newHeight = maxHeight;
      newWidth = (newWidth / 100) * decRatio;
    }

    if (newWidth > maxWidth) {
      let decRatio = (100 * maxWidth) / (newWidth ? newWidth : 1);
      newHeight = (newHeight / 100) * decRatio;
      newWidth = maxWidth
    }

    setDivHeight(newHeight);
    setDivWidth(newWidth);
  }

  const handleImageClick = (e, id?: string, coord?: number[]) => {
    let offset = imageElementRef?.current?.getBoundingClientRect() as DOMRect;

    let clickimgX = e.pageX - (offset.x + window.pageXOffset);
    let clickimgY = e.pageY - (offset.y + window.pageYOffset);

    let xInPercentage = (clickimgX * 100) / (offset.width > 0 ? offset.width : 1);
    let yInPercentage = (clickimgY * 100) / (offset.height > 0 ? offset.height : 1);

    setPins([...pins, { xInPercentage, yInPercentage, id: (new Date()).getTime(), imageUrl: props.imageUrl, externalData: props.newPinExternalData }]);
    closeActivePin();
  };

  const closeActivePin = () => {
    props.setActivePinId(0);
  };

  const updatePinFunc = (e: ImagePinModel) => {
    let currnetPin = pins.filter(x => x.id === e.id);

    if (currnetPin.length) {
      setPins([...(pins.filter(x => x.id !== e.id).map(x => x)), e]);
    }
  }

  //#endregion Calculation and data change functions

  return (
    <>
      <div className={"relative " + (props.containerDivClassNames ?? "")} style={{
        ...(props.containerDivStyle?.() ?? {}),
        height: `${divHeight}px`,
        width: `${divWidth}px`
        // height: `auto`,
        // width: `100%`
      }}>
        <img
          onClick={props.isReadOnly ? () => { closeActivePin(); } : handleImageClick}
          onLoad={handleLoad}
          alt=""
          className={props.imgClassNames}
          src={props.imageUrl}
          ref={imageElementRef}
          style={{
            ...(props.imgStyle?.() ?? {}),
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            width: "100%",
            objectFit: 'contain'
          }}
        />
        {pins.map((pin) =>
          <>
            {
              pin.imageUrl === props.imageUrl &&
              <div
                key={pin.id + "imagePin"}
                onClick={() => {
                  // if (props.isReadOnly) {
                  //   let selectedPin = pins.filter(x => x.id === pin.id);
                  //   if (selectedPin.length)
                  //     return selectedPin[0];
                  //   else
                  //     return null;
                  // }
                  if (props.activePinId > 0 || props.activePinId === pin.id) {
                    closeActivePin();
                  }
                  else {
                    props.setActivePinId(pin.id)
                  }
                }}
                className={"absolute " + (props.pinClassNames ?? "")}
                style={{
                  transform: `translate(-${50}%, -${50}%)`,
                  ...(props.pinDivStyle?.(props.activePinId === pin.id) ?? {}),
                  left: `${pin.xInPercentage}%`,
                  top: `${pin.yInPercentage}% `,
                  zIndex: props.activePinId === pin.id ? 11 : 10
                }}
              >
                {props.activePinId === pin.id ? <>
                  {props.activePin}
                  <div className={"border absolute shadow-lg bg-white " + (props.pinMenuClassNames ?? "")} style={{
                    zIndex: 999,
                    ...(props.pinMenuDivStyle?.() ?? {}),
                    left: `${pin.xInPercentage}%`,
                    top: `${pin.yInPercentage > 60 ? `` : `${pin.yInPercentage}% `} `,
                    bottom: `${pin.yInPercentage > 60 ? `-${pin.yInPercentage}%` : ``} `,
                    transform: `translate(-${((window.innerWidth * (pin.xInPercentage / 100)) / window.innerWidth) * 100}%, ${pin.yInPercentage > 60 ? `-70px` : `25px`} )`,

                  }}>
                    {props.pinMenu && props.pinMenu(pin, updatePinFunc)}
                  </div>
                </> : <>
                  {props.pasivePin}
                </>}
              </div>
            }
          </>
        )}
      </div>
    </>
  );
}
