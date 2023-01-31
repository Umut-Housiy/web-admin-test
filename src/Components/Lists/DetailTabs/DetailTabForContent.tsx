import { FunctionComponent, useContext, useEffect, useState } from "react"
import { BlockImagesMediaModel, DynamicListAddingMediaModel, DynamicListMediaModel } from "../../../Models";
import ApiService from "../../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../../Services/SharedContext";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVICES } from "../../../Services/Constants";
import { Loading } from "../../Loading";

export interface DetailTabForContentProps {
  DynamicListId: number,
}

export const DetailTabForContent: FunctionComponent<DetailTabForContentProps> = (props: DetailTabForContentProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [content, setContent] = useState<string>("");

  useEffect(() => {
    getDynamicListItems()
  }, []);

  const getDynamicListItems = async () => {
    setLoading(true);

    const _result = await ApiService.getDynamicListItems(props.DynamicListId, 1, 1, "", 1);

    if (_result.succeeded === true) {
      if (_result.data.Data.length > 0) {
        if (_result.data.Data[0].Media !== undefined) {
          const _tempString = _result.data.Data[0].Media.Description;
          setContent(_tempString)
        }
      }
      setLoading(false);

    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setLoading(false);
        }
      });
    }

  }


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
    <>
      <div className="mt-4">
        {loading ? <Loading card /> :
          <div dangerouslySetInnerHTML={{ __html: content ?? "" }} className="ck-editor-links text-sm" >
          </div>
        }
      </div>

    </>
  )
}
