import { ComponentProps, useState } from "react";
import classNames from "classnames";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { Option, Select, Input, Button } from "@material-tailwind/react";

import { IMenuItem, IMenuItemCompositionItem } from "/models/MenuItem";
import Fieldset from "/components/Fieldset";
import { IStore } from "/models/Store";
import { IIngredient } from "/models/Ingredients";

interface EditMenuItemProps extends ComponentProps<"form"> {
  store: IStore;
  menuItem: IMenuItem;
  onMenuItemChange: (newValue: IMenuItem, index: number) => void;
}

const emptyCompositionItem: IMenuItemCompositionItem = {
  ingredient: undefined,
  quantity: 1,
  essential: false,
};

const EditMenuItem: React.FC<EditMenuItemProps> = ({
  className,
  children,
  store,
  menuItem,
  onMenuItemChange,
  ...props
}) => {
  const [edit, setEdit] = useState(menuItem);

  const handleModifyCompositionProp =
    (
      compositionItem: IMenuItemCompositionItem,
      compositionItemIndex: number,
      key: string,
      getter: (value: any) => any
    ) =>
    (value: any) => {
      const slicedComposition = [...edit.composition];
      slicedComposition.splice(compositionItemIndex, 1, {
        ...compositionItem,
        [key]: getter(value),
      });
      console.log(slicedComposition, value);
      setEdit({
        ...edit,
        composition: slicedComposition,
      } as IMenuItem);
    };

  return (
    <form
      className={classNames("flex flex-col gap-4", className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        label="Nome"
        value={edit.name}
        onChange={(e) =>
          setEdit({
            ...edit,
            name: e.target.value,
          } as IMenuItem)
        }
      />
      <Fieldset
        className="flex flex-col gap-2 text-light-high"
        title="Composição"
      >
        {edit.composition.map((compositionItem, compositionItemIndex) => (
          <div
            key={compositionItem.ingredient?.name}
            className="flex flex-row gap-2 items-center"
          >
            <div className="w-full">
              <Select
                className="flex-1 "
                label="Ingrediente"
                value={compositionItem.ingredient?.name}
                onChange={handleModifyCompositionProp(
                  compositionItem,
                  compositionItemIndex,
                  "ingredient",
                  (value) =>
                    store.ingredients.find(
                      (ing) => ing.name === value
                    ) as IIngredient
                )}
              >
                {store.ingredients.map((ingredient) => (
                  <Option key={ingredient.name} value={ingredient.name}>
                    {ingredient.name}
                  </Option>
                ))}
              </Select>
            </div>
            <Input
              type="number"
              label="Qtd."
              value={compositionItem.quantity}
              defaultValue={1}
              onChange={handleModifyCompositionProp(
                compositionItem,
                compositionItemIndex,
                "quantity",
                (e) => e.target.value
              )}
            />
            <Select
              className="flex-1"
              label="Essencial"
              value={`${compositionItem.essential}`}
              onChange={handleModifyCompositionProp(
                compositionItem,
                compositionItemIndex,
                "essential",
                (value) => value == true
              )}
            >
              <Option key={`true`} value={`true`}>
                Sim
              </Option>
              <Option key={`false`} value={`false`}>
                Não
              </Option>
            </Select>
            <div className="flex flex-row">
              <Button className="mr-2 text-light-high" variant="text" size="sm">
                <IoMdCloseCircle size={24} />
              </Button>
              <Button
                className="text-light-high"
                variant="text"
                size="sm"
                onClick={() =>
                  setEdit({
                    ...edit,
                    composition: [
                      ...edit.composition,
                      { ...emptyCompositionItem },
                    ],
                  } as IMenuItem)
                }
              >
                <IoIosAddCircle className="color" size={24} />
              </Button>
            </div>
          </div>
        ))}
        <span className="text-sm">
          Procurou o ingrediente acima e não achou? Registre{" "}
          <span className="text-dark-500 font-bold cursor-pointer">aqui</span>
        </span>
      </Fieldset>
      <Button
        className=""
        onClick={() => {
          onMenuItemChange(edit);
        }}
      >
        Salvar
      </Button>
    </form>
  );
};

EditMenuItem.displayName = "EditMenuItem";

export default EditMenuItem;
