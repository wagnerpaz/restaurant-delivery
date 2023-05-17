import classNames from "classnames";
import { ComponentProps, useState } from "react";
import { useTranslation } from "next-i18next";

import Modal from "/components/Modal";
import FormControl from "/components/FormControl";
import { IMenuSection } from "/models/types/MenuSection";
import { IMenuItem } from "/models/types/MenuItem";
import Input from "/components/form/Input";
import Button from "/components/form/Button";

import { emptyMenuSection } from "/components/Menu/MenuSection";

interface AddMenuSectionModalProps extends ComponentProps<typeof Modal> {
  menuSection: IMenuItem;
  parentName?: string;
  mode?: "ADD" | "ADD-SUB" | "EDIT";
  onSave?: (section: IMenuSection) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

const AddMenuSecitionModal: React.FC<AddMenuSectionModalProps> = ({
  contentClassName,
  menuSection,
  parentName,
  mode = "EDIT",
  onSave = () => {},
  onCancel,
  onDelete,
  ...props
}) => {
  const [name, setName] = useState(
    mode === "ADD" ? emptyMenuSection.name : menuSection.name
  );

  const { t } = useTranslation();

  return (
    <Modal
      {...props}
      contentClassName={classNames(
        "!overflow-visible flex flex-col container max-w-lg",
        contentClassName
      )}
    >
      <form
        className="flex flex-col gap-6 mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...menuSection, name } as IMenuSection);
        }}
      >
        {mode === "ADD-SUB" && (
          <FormControl label="Caminho Atual">
            <Input value={parentName} disabled />
          </FormControl>
        )}
        <FormControl label={t("input.name")}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </FormControl>
        <div className="flex-1 flex flex-row gap-2">
          {mode === "EDIT" && (
            <Button className="w-28" onClick={onDelete}>
              Excluir
            </Button>
          )}
          <div className="flex-1" />
          <Button className="w-28" variant="outline" onClick={onCancel}>
            {t("button.cancel")}
          </Button>
          <Button type="submit" className="w-28">
            {t("button.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMenuSecitionModal;
