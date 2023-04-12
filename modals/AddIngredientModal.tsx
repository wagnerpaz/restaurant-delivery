import { Button, Checkbox, Input } from "@material-tailwind/react";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import { HiPlus } from "react-icons/hi";

import Modal from "/components/Modal";
import usePutIngredient from "/hooks/usePutIngredient";
import removeDiacritics from "/lib/removeDiacritics";
import toPascalCase from "/lib/toPascalCase";
import { IIngredient } from "/models/Ingredients";
import { IStore } from "/models/Store";
import usePutStoreIngredients from "/hooks/usePutStoreIngredients";
import useGetIngredients from "/hooks/useGetIngredients";
import useGetStoreIngredients from "/hooks/useGetStoreIngredients";
import Fieldset from "/components/Fieldset";
import classNames from "classnames";
import isEqual from "lodash.isequal";

interface AddIngredientModalProps extends ComponentProps<typeof Modal> {
  ingredients: IIngredient[];
  initialSelection: IIngredient[];
  onIngredientsChange?: (ingredients: IIngredient[]) => void;
  onSelectionChange?: (ingredientsSel: IIngredientSelection[]) => void;
}

export interface IIngredientSelection {
  ingredient: IIngredient;
  selected: boolean;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  initialSelection,
  ingredients,
  contentClassName,
  onOpenChange,
  onIngredientsChange = () => {},
  onSelectionChange = () => {},
  ...props
}) => {
  const [filter, setFilter] = useState("");
  const [ingredientsSel, setIngredientsSel] = useState<IIngredientSelection[]>(
    []
  );
  const [additions, setAdditions] = useState<IIngredientSelection[]>([]);
  const [loading, setLoading] = useState(false);

  const getIngredients = useGetIngredients();
  const putIngredient = usePutIngredient();

  const sorted = useMemo(
    () =>
      [...ingredientsSel, ...additions].sort((a, b) =>
        a.ingredient.name > b.ingredient.name ? 1 : -1
      ),
    [ingredientsSel, additions]
  );

  const filtered = useMemo(
    () =>
      sorted.filter((f) =>
        removeDiacritics(f.ingredient.name.toLowerCase()).startsWith(
          removeDiacritics(filter.toLowerCase())
        )
      ),
    [sorted, filter]
  );

  useEffect(() => {
    const newIngredientsSel = ingredients.map((ingredient) => ({
      ingredient,
      selected: initialSelection
        .map((is) => is?._id)
        .filter((f) => f)
        .includes(ingredient._id),
    }));
    setIngredientsSel(newIngredientsSel);
  }, [initialSelection, ingredients]);

  const handleAdd = () => {
    const confirmation =
      filtered.length === 0 ||
      confirm(
        `Existem items correspondentes, deseja adicionar "${toPascalCase(
          filter
        )}" realmente?`
      );
    if (confirmation) {
      setAdditions([
        ...additions,
        {
          ingredient: { name: toPascalCase(filter) },
          selected: true,
        } as IIngredientSelection,
      ]);
      setFilter("");
    }
  };

  const handleSave = async () => {
    await putIngredient(additions.map((a) => a.ingredient));
    onIngredientsChange(await getIngredients());
    onSelectionChange(ingredientsSel);

    setAdditions([]);
    onOpenChange(false);
  };

  const handleOpenChange = (newValue: boolean) => {
    if (!newValue) {
      if (
        !isEqual(
          initialSelection,
          ingredientsSel.filter((is) => is.selected).map((is) => is.ingredient)
        )
      ) {
        console.log(
          initialSelection,
          ingredientsSel.filter((is) => is.selected).map((is) => is.ingredient)
        );
        const confirmed = confirm(
          "Você tem alterações não salvas. Deseja sair?"
        );
        if (confirmed) {
          onOpenChange(false);
        }
      } else {
        onOpenChange(false);
      }
    } else {
      onOpenChange(true);
    }
  };

  return (
    <Modal
      {...props}
      contentClassName={classNames(
        "!overflow-visible flex flex-col",
        contentClassName
      )}
      onOpenChange={handleOpenChange}
    >
      <div className="flex flex-row gap-2 mb-2 w-full">
        <Input
          containerProps={{ className: "!flex-1 !min-w-0" }}
          label="Ingrediente"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button
          className="flex flex-row gap-2 items-center"
          disabled={!filter || filtered.length > 0}
          onClick={handleAdd}
        >
          <HiPlus size={18} />
          Adicionar
        </Button>
      </div>
      <div className="flex flex-col gap-4 h-[calc(100%-95px)]">
        <Fieldset
          title="Disponíveis"
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <ul className="h-full">
            {filtered
              .filter((f) => !f.selected)
              .map((sel) => (
                <li
                  className="flex flex-row items-center text-light-high"
                  key={sel.ingredient._id}
                >
                  <Checkbox
                    checked={sel.selected}
                    onChange={(e) =>
                      setIngredientsSel((ingredientsSel) => {
                        return [
                          ...ingredientsSel.filter(
                            (f) => f.ingredient._id !== sel.ingredient._id
                          ),
                          {
                            ingredient: sel.ingredient,
                            selected: e.target.checked,
                          },
                        ];
                      })
                    }
                  />
                  <span className="whitespace-nowrap">
                    {sel.ingredient.name}
                  </span>
                </li>
              ))}
          </ul>
        </Fieldset>
        <Fieldset
          title="Selecionados"
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <ul>
            {ingredientsSel
              .filter((f) => f.selected)
              .map((sel) => (
                <li
                  className="flex flex-row items-center text-light-high"
                  key={sel.ingredient._id}
                >
                  <Checkbox
                    checked={sel.selected}
                    onChange={(e) =>
                      setIngredientsSel((ingredientsSel) => {
                        return [
                          ...ingredientsSel.filter(
                            (f) => f.ingredient._id !== sel.ingredient._id
                          ),
                          {
                            ingredient: sel.ingredient,
                            selected: e.target.checked,
                          },
                        ];
                      })
                    }
                  />
                  <span className="whitespace-nowrap">
                    {sel.ingredient.name}
                  </span>
                </li>
              ))}
          </ul>
        </Fieldset>
      </div>
      <div className="flex flex-row gap-2 mt-2">
        <Button onClick={() => handleOpenChange(false)}>Cancel</Button>
        <Button className="flex-1" onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </Modal>
  );
};

export default AddIngredientModal;
