import React, { FunctionComponent, useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ImageProps {
  src: string,
  alt?: string,
  className?: string,
  isAvatar?: boolean
}
export const Image: FunctionComponent<ImageProps> = (props: ImageProps) => {

  const [src, setSrc] = useState<string>(!props.src ? (props.isAvatar ? "https://housiystrg.blob.core.windows.net/sellermedia/avatar.png" : "https://housiystrg.blob.core.windows.net/sellermedia/media.png") : props.src);

  const onError = () => {
    setSrc(props.isAvatar ? "https://housiystrg.blob.core.windows.net/sellermedia/avatar.png" : "https://housiystrg.blob.core.windows.net/sellermedia/media.png");
  }

  return <LazyLoadImage
    src={src}
    onError={onError}
    effect="blur"
    alt={props.alt || ""}
    className={props.className || ""}
  />;

}
