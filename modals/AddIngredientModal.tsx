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

interface AddIngredientModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  ingredients: IIngredient[];
  onIngredientsChange?: (ingredients: IIngredient[]) => void;
  onStoreIngredientsChange: (ingredients: IIngredient[]) => void;
}

interface IIngredientSelection {
  ingredient: IIngredient;
  selected: boolean;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  store,
  ingredients,
  onOpenChange,
  onIngredientsChange = () => {},
  onStoreIngredientsChange = () => {},
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
  const getStoreIngredients = useGetStoreIngredients();
  const putStoreIngredients = usePutStoreIngredients();

  useEffect(() => {
    setIngredientsSel((ingredientsSel) =>
      ingredients.map((i) => ({
        ingredient: i,
        selected:
          ingredientsSel.find((is) => is.ingredient._id === i._id)?.selected ||
          store.ingredients.map((i) => i._id).includes(i._id),
      }))
    );
  }, [ingredients, store.ingredients]);

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
    await putStoreIngredients(
      store,
      ingredientsSel.filter((is) => is.selected).map((is) => is.ingredient._id)
    );

    onIngredientsChange(await getIngredients());
    onStoreIngredientsChange(await getStoreIngredients(store));

    setAdditions([]);
    onOpenChange(false);
  };

  return (
    <Modal
      {...props}
      contentClassName="!overflow-visible flex flex-col"
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-row gap-2 mb-2">
        <Input
          containerProps={{ className: "!w-full !min-w-0 max-w-xs" }}
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
      <ul className="overflow-auto">
        {filtered.map((sel) => (
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
                    { ingredient: sel.ingredient, selected: e.target.checked },
                  ];
                })
              }
            />
            {sel.ingredient.name}
          </li>
        ))}
      </ul>
      <div className="flex flex-row gap-2 mt-2">
        <Button onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button className="flex-1" onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </Modal>
  );
};

export default AddIngredientModal;
