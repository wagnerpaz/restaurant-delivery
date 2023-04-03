import { ComponentProps, useState } from "react";
import classNames from "classnames";
import NextImage from "next/image";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";

import EditableSection from "/components/EditableSection";
import DbImage from "/components/DbImage";
import Modal from "./Modal";
import { Button, Input } from "@material-tailwind/react";
import { imgPreview } from "/lib/image-crop/imgPreview";
import usePutUpload from "/hooks/usePutUpload";
import mongoose from "mongoose";

interface DbImageEditorProps extends ComponentProps<typeof DbImage> {
  upload: {
    path: string;
    fileKey: string;
  };
}

const DbImageEditor: React.FC<DbImageEditorProps> = ({
  className,
  children,
  id,
  upload,
  ...props
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement>();
  const [image, setImage] = useState<string>(id);
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
        },
        1,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  }

  return (
    <>
      <EditableSection
        className={classNames(className)}
        hideDelete
        onEditClick={() => setModalOpen(true)}
      >
        <DbImage id={id} {...props} />
      </EditableSection>
      <Modal open={modalOpen} onOpenChange={(value) => setModalOpen(value)}>
        <div className="flex flex-col gap-4 h-full">
          <ReactCrop
            className="flex-1 relative"
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1}
            minWidth={300}
            minHeight={300}
          >
            <DbImage
              className="object-contain rounded-sm"
              ref={(ref) => setImageRef(ref as HTMLImageElement)}
              alt="Profile Photo"
              id={image}
              onLoad={onImageLoad}
              fill
            />
          </ReactCrop>

          <div className="flex gap-4">
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
                    //RESIZE TO MAX WIDTH 300
                    canvas.width = 300;
                    canvas.height =
                      (image.naturalHeight / image.naturalWidth) * 300;
                    context2d?.drawImage(
                      image,
                      0,
                      0,
                      canvas.width,
                      canvas.height
                    );
                    setImage(`${canvas.toDataURL("image/png")}`);
                  };
                });
                reader.readAsDataURL((evt.target.files as FileList)[0]);
              }}
            />
            <Button className="block" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>

            <Button
              className="block"
              onClick={() => {
                setLoadingSave(true);
                imgPreview(
                  imageRef as HTMLImageElement,
                  crop as PixelCrop,
                  1,
                  0
                ).then(async (dataUrl) => {
                  await putUpload(
                    upload.path,
                    upload.fileKey,
                    dataUrl,
                    new mongoose.Types.ObjectId(id)
                  );
                  setLoadingSave(false);
                  setModalOpen(false);
                });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DbImageEditor;
