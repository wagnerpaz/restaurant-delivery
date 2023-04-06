import { Button, Checkbox, Input } from "@material-tailwind/react";
import { ComponentProps, useState } from "react";
import { HiPlus } from "react-icons/hi";

import Modal from "/components/Modal";
import removeDiacritics from "/lib/removeDiacritics";
import toPascalCase from "/lib/toPascalCase";
import { IIngredient } from "/models/Ingredients";
import { IStore } from "/models/Store";

interface AddIngredientModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  ingredients: IIngredient[];
  onIngredientsAdd?: (newIngredients: IIngredient[]) => void;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  store,
  ingredients,
  onIngredientsAdd = () => {},
  onOpenChange,
  ...props
}) => {
  const [filter, setFilter] = useState("");
  const [additions, setAdditions] = useState<IIngredient[]>([]);

  const filtered = [...ingredients, ...additions]
    .filter((f) =>
      removeDiacritics(f.name.toLowerCase()).startsWith(
        removeDiacritics(filter.toLowerCase())
      )
    )
    .sort((a, b) => (a.name > b.name ? 1 : -1));

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
        { name: toPascalCase(filter) } as IIngredient,
      ]);
      setFilter("");
    }
  };

  return (
    <Modal {...props} onOpenChange={onOpenChange}>
      <div className="flex flex-row gap-2 mb-2">
        <Input
          containerProps={{ className: "!w-full !min-w-0 max-w-xs" }}
          label="Ingrediente"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button
          className="flex flex-row gap-2 items-center"
          disabled={
            !filter ||
            [...ingredients, ...additions]
              .map((i) => removeDiacritics(i.name).toLowerCase())
              .includes(removeDiacritics(filter).toLowerCase())
          }
          onClick={handleAdd}
        >
          <HiPlus size={18} />
          Adicionar
        </Button>
      </div>
      <ul className="overflow-auto">
        {[...ingredients, ...additions]
          .filter((f) =>
            removeDiacritics(f.name.toLowerCase()).startsWith(
              removeDiacritics(filter.toLowerCase())
            )
          )
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((ingredient) => (
            <li
              className="flex flex-row items-center text-light-high"
              key={ingredient._id}
            >
              <Checkbox
                checked={store.ingredients
                  .map((i) => i._id)
                  .includes(ingredient._id)}
              />
              {ingredient.name}
            </li>
          ))}
      </ul>
      <div className="flex flex-row gap-2 mt-2">
        <Button onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button
          className="flex-1"
          onClick={() => {
            onIngredientsAdd(additions);
            setAdditions([]);
            onOpenChange(false);
          }}
        >
          Salvar
        </Button>
      </div>
    </Modal>
  );
};

export default AddIngredientModal;
