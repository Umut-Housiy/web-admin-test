import { FunctionComponent, useState } from "react";

import { ItemModel } from "../../../Models";
import { useStateEffect } from "../../UseStateEffect";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVICES } from "../../../Services/Constants";

export interface Tabs2ForContentProps {
  setSelectedListToApi: (e: ItemModel[]) => void,
  setContent: (e: string) => void,
  content: string
}

export const Tabs2ForContent: FunctionComponent<Tabs2ForContentProps> = (props: Tabs2ForContentProps) => {

  const [content, setContent] = useState<string>(props.content ?? "");

  const [selectedListToApi, setSelectedListToApi] = useState<ItemModel[]>([]);


  useStateEffect(() => {
    let _currentArray: ItemModel[] = []
    _currentArray.push({
      ItemId: 0,
      PhotoUrl: "",
      RedirectUrl: "",
      Title: "",
      Description: content,
      IsIdeaMainProduct: false
    })
    setSelectedListToApi(_currentArray);
  }, [content]);


  useStateEffect(() => {
    props.setSelectedListToApi(selectedListToApi);
    props.setContent(content)
  }, [selectedListToApi]);


  ClassicEditor.defaultConfig = {
    ...ClassicEditor.defaultConfig,
    ckfinder: {
      uploadUrl: `${SERVICES.API_ADMIN_GENERAL_URL}/ck-inner-media`
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    }
  };


  return (
    <div>
      <h4 className="mb-4">Öne Çıkarılacak İçerik Listesi</h4>
      <CKEditor
        editor={ClassicEditor}
        data={content}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
        }}
      />


    </div>
  )
}
