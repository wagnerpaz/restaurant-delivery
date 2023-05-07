import classNames from "classnames";
import { ComponentProps, useState } from "react";
import { Button, Input } from "@chakra-ui/react";

import Modal from "/components/Modal";
import FormControl from "/components/FormControl";
import { IStore, IStoreIngredient } from "/models/types/Store";

interface EditIngredientDetailModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  ingredientDetail: IStoreIngredient;
  onSave?: (section: IStoreIngredient) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

const EditIngredientDetailModal: React.FC<EditIngredientDetailModalProps> = ({
  store,
  contentClassName,
  ingredientDetail,
  onSave = () => {},
  onCancel,
  onDelete,
  ...props
}) => {
  const [name, setName] = useState(ingredientDetail.ingredient.name);
  const [price, setPrice] = useState(ingredientDetail.price);

  return (
    <Modal
      {...props}
      contentClassName={classNames(
        "!overflow-visible flex flex-col container max-w-lg",
        contentClassName
      )}
    >
      <form className="flex flex-col gap-6 mt-4">
        <FormControl label="Nome">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={ingredientDetail.ingredient.store?._id !== store._id}
          />
        </FormControl>
        <FormControl label="Preço">
          <Input
            type="number"
            value={`${price}`}
            onChange={(e) => setPrice(Math.floor(+e.target.value * 100) / 100)}
          />
        </FormControl>
        <div className="flex-1 flex flex-row gap-2">
          <Button className="w-28" onClick={onDelete}>
            Excluir
          </Button>
          <div className="flex-1" />
          <Button className="w-28" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            className="w-28"
            onClick={() =>
              onSave({
                ...ingredientDetail,
                ingredient: { ...ingredientDetail.ingredient, name },
                price,
              } as IStoreIngredient)
            }
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditIngredientDetailModal;
