import { ComponentProps, useState } from "react";
import classNames from "classnames";
import mongoose from "mongoose";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";

import DbImage from "/components/DbImage";
import Modal from "/components/Modal";
import { imgPreview } from "/lib/image-crop/imgPreview";
import usePutUpload from "/hooks/usePutUpload";
import { Button, Input } from "@chakra-ui/react";
import FormControl from "/components/FormControl";

interface DbImageEditorProps extends ComponentProps<typeof Modal> {
  upload: {
    path: string;
    id?: string;
    fileKey: string;
  };
  open: boolean;
  onOpenChange: (newEditModalOpen: boolean) => void;
  onUploadIdChange?: (id: string) => void;
  portalTargetEditModal?: () => HTMLElement;
}

const ImageEditorModal: React.FC<DbImageEditorProps> = ({
  className,
  children,
  upload,
  open,
  onOpenChange = () => {},
  onUploadIdChange = () => {},
  portalTargetEditModal,
  ...props
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [cachedImage, setCachedImage] = useState<string>();
  const [loadingSave, setLoadingSave] = useState(false);

  const putUpload = usePutUpload();

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          // You don't need to pass a complete crop into
          // makeAspectCrop or centerCrop.
          unit: "%",
          width: 100,
          height: 100,
        },
        1,
        width,
        height
      ),
      width,
      height
    );

    const reactCrop = document.querySelector(".ReactCrop");

    setCrop(
      convertToPixelCrop(
        crop,
        reactCrop?.clientWidth || 0,
        reactCrop?.clientHeight || 0
      )
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      portalTarget={portalTargetEditModal}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex-1 w-[500px] h-[500px] flex items-center justify-center">
          {cachedImage ? (
            <ReactCrop
              className={classNames("object-contain")}
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={1}
              // minWidth={500}
              // minHeight={500}
              keepSelection
            >
              {/* eslint-disable-next-line @next/next/no-img-element*/}
              <img
                ref={(ref) => setImageRef(ref)}
                className="rounded-sm"
                alt="Profile Photo"
                src={cachedImage}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          ) : (
            <DbImage
              className="rounded-sm"
              alt="Profile photo stored"
              id={upload.id}
              width={999}
              height={999}
            />
          )}
        </div>
        <div className="flex gap-4">
          <FormControl className="flex-1 min-w-fit" label="Arquivo de Imagem">
            <Input
              className="flex-1"
              type="file"
              onChange={function (evt) {
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                  //RECIEVE THE ORIGINAL IMAGE
                  const uploadedImage = reader.result;
                  const canvas = document.createElement("canvas");
                  const context2d = canvas.getContext("2d");
                  const image = new Image();
                  image.src = uploadedImage as string;
                  image.onload = () => {
                    //RESIZE TO MAX WIDTH 500
                    canvas.width = 500;
                    canvas.height =
                      (image.naturalHeight / image.naturalWidth) * 500;
                    // canvas.width = image.naturalWidth;
                    // canvas.height = image.naturalHeight;
                    context2d?.drawImage(
                      image,
                      0,
                      0,
                      canvas.width,
                      canvas.height
                    );
                    setCachedImage(`${canvas.toDataURL("image/png")}`);
                  };
                });
                reader.readAsDataURL((evt.target.files as FileList)[0]);
              }}
            />
          </FormControl>
          <Button className="block" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            className="block"
            onClick={() => {
              if (!cachedImage) {
                onOpenChange(false);
              }

              setLoadingSave(true);
              imgPreview(
                imageRef as HTMLImageElement,
                crop as PixelCrop,
                1,
                0
              ).then(async (dataUrl) => {
                const response = await putUpload(
                  upload.path,
                  upload.fileKey,
                  dataUrl,
                  new mongoose.Types.ObjectId(upload.id)
                );
                setLoadingSave(false);
                onOpenChange(false);
                onUploadIdChange(response.data._id);
              });
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageEditorModal;
