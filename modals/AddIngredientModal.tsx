import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { HiPlus } from "react-icons/hi";

import Modal from "/components/Modal";
import usePutIngredient from "/hooks/usePutIngredient";
import removeDiacritics from "/lib/removeDiacritics";
import toPascalCase from "/lib/toPascalCase";
import { IIngredient } from "/models/Ingredients";
import { IMenuSection, IStore } from "/models/Store";
import useGetIngredients from "/hooks/useGetIngredients";
import Fieldset from "/components/Fieldset";
import classNames from "classnames";
import isEqual from "lodash.isequal";
import { Button, Checkbox, Input } from "@chakra-ui/react";
import FormControl from "/components/FormControl";

interface AddIngredientModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
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
  store,
  initialSelection,
  ingredients,
  contentClassName,
  onOpenChange,
  onIngredientsChange = () => {},
  onSelectionChange = () => {},
  ...props
}) => {
  const filterRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("");
  const [ingredientsSel, setIngredientsSel] = useState<IIngredientSelection[]>(
    []
  );
  const [additions, setAdditions] = useState<IIngredientSelection[]>([]);
  const [loading, setLoading] = useState(false);

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

  const storeIngredients = useMemo(() => {
    const ingredients: IIngredient[] = [];
    function traverseSections(sections: IMenuSection[]) {
      for (const section of sections) {
        for (const item of section.items) {
          const compositionIngredients = item.composition.map(
            (c) => c.ingredient
          );
          if (compositionIngredients.length > 0) {
            ingredients.push(...compositionIngredients);
          }
        }
        if (section.sections) {
          traverseSections(section.sections);
        }
      }
    }
    traverseSections(store.menu.sections);

    //@ts-ignore
    return [...new Set(ingredients)].filter((el) => el);
  }, [store]);

  useEffect(() => {
    const newIngredientsSel = ingredients.map((ingredient) => ({
      ingredient,
      selected: initialSelection
        .map((is) => is?._id)
        .filter((f) => f)
        .includes(ingredient._id),
    }));
    setIngredientsSel([...newIngredientsSel]);
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
    const additionIngredients = await putIngredient(
      additions.map((a) => a.ingredient)
    );
    console.log("additionIngredients", additionIngredients);
    onIngredientsChange([...ingredients, ...additionIngredients]);
    onSelectionChange(
      [...ingredientsSel, ...additions].map((i) => ({
        ...i,
        ingredient: [...ingredients, ...additionIngredients].find(
          (f: IIngredient) => i.ingredient.name === f.name
        ),
      }))
    );

    setAdditions([]);
    onOpenChange(false);
  };

  function reset() {
    setIngredientsSel((is) => is.map((m) => ({ ...m, selected: false })));
    setAdditions([]);
    setFilter("");
  }

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

  const inStoreFiltered = filtered
    .filter((f) => !f.selected)
    .filter((f) =>
      storeIngredients.map((m) => m._id).includes(f.ingredient._id)
    );

  const notInStoreFiltered = filtered
    .filter((f) => !f.selected)
    .filter(
      (f) => !storeIngredients.map((m) => m._id).includes(f.ingredient._id)
    );

  return (
    <Modal
      {...props}
      contentClassName={classNames(
        "!overflow-visible flex flex-col container",
        contentClassName
      )}
      onOpenChange={handleOpenChange}
      onEsc={(e) => {
        e.stopPropagation();
        setFilter("");
        filterRef.current?.focus();
      }}
    >
      <div className="flex flex-row gap-2 mb-2 w-full">
        <FormControl className="flex-1 min-w-fit" label="Ingrediente">
          <Input
            ref={filterRef}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </FormControl>
        <Button
          className="flex flex-row gap-2 items-center"
          disabled={!filter || filtered.length > 0}
          onClick={handleAdd}
        >
          <HiPlus size={18} />
          Adicionar
        </Button>
      </div>
      <div className="h-[calc(100%-95px)] flex flex-col sm:flex-row gap-2">
        <div className="flex-1 contents sm:flex flex-col gap-2">
          <Fieldset
            title="Usados na sua loja"
            className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            {inStoreFiltered.length > 0 && (
              <ul className="flex flex-col gap-2">
                {inStoreFiltered.map((sel) => (
                  <li
                    className="flex flex-row items-center gap-4 text-main-a11y-high"
                    key={sel.ingredient.name}
                  >
                    <Checkbox
                      checked={sel.selected}
                      onChange={(e) => {
                        filterRef.current?.focus();
                        setIngredientsSel((ingredientsSel) => {
                          return [
                            ...ingredientsSel.filter(
                              (f) => f.ingredient.name !== sel.ingredient.name
                            ),
                            {
                              ingredient: sel.ingredient,
                              selected: e.target.checked,
                            },
                          ];
                        });
                      }}
                    />
                    <span className="whitespace-nowrap">
                      {sel.ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {inStoreFiltered.length === 0 && !filter && (
              <div className="w-full h-full flex items-center justify-center">
                Nenhum ingrediente
              </div>
            )}
            {inStoreFiltered.length === 0 && filter && (
              <div className="w-full h-full flex items-center justify-center">
                Nenhum ingrediente encontrado com este filtro.
              </div>
            )}
          </Fieldset>
          <Fieldset
            title="Nunca usados"
            className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            {notInStoreFiltered.length > 0 && (
              <ul className="flex flex-col gap-2">
                {notInStoreFiltered.map((sel) => (
                  <li
                    className="flex flex-row items-center gap-4 text-main-a11y-high"
                    key={sel.ingredient.name}
                  >
                    <Checkbox
                      checked={sel.selected}
                      onChange={(e) => {
                        filterRef.current?.focus();
                        setIngredientsSel((ingredientsSel) => {
                          return [
                            ...ingredientsSel.filter(
                              (f) => f.ingredient.name !== sel.ingredient.name
                            ),
                            {
                              ingredient: sel.ingredient,
                              selected: e.target.checked,
                            },
                          ];
                        });
                      }}
                    />
                    <span className="whitespace-nowrap">
                      {sel.ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {notInStoreFiltered.length === 0 && !filter && (
              <div className="w-full h-full flex items-center justify-center">
                Nenhum ingrediente
              </div>
            )}
            {notInStoreFiltered.length === 0 && filter && (
              <div className="w-full h-full flex items-center justify-center">
                Nenhum ingrediente encontrado com este filtro.
              </div>
            )}
          </Fieldset>
        </div>

        <Fieldset
          title="Selecionados"
          className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          {[...ingredientsSel, ...additions].filter((f) => f.selected).length >
            0 && (
            <ul className="flex flex-col gap-2">
              {[...ingredientsSel, ...additions]
                .filter((f) => f.selected)
                .map((sel) => (
                  <li
                    className="flex flex-row items-center gap-4 text-main-a11y-high"
                    key={sel.ingredient.name}
                  >
                    <Checkbox
                      defaultChecked
                      onChange={(e) => {
                        filterRef.current?.focus();
                        setIngredientsSel((ingredientsSel) => {
                          return [
                            ...ingredientsSel.filter(
                              (f) => f.ingredient.name !== sel.ingredient.name
                            ),
                            {
                              ingredient: sel.ingredient,
                              selected: e.target.checked,
                            },
                          ];
                        });
                      }}
                    />
                    <span className="whitespace-nowrap">
                      {sel.ingredient.name}
                    </span>
                  </li>
                ))}
            </ul>
          )}
          {[...ingredientsSel, ...additions].filter((f) => f.selected)
            .length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              Selecione alguns ingredientes para compor seu prato
            </div>
          )}
        </Fieldset>
      </div>
      <div className="flex flex-row gap-2 mt-2">
        <Button
          onClick={() => {
            handleOpenChange(false);
            reset();
          }}
        >
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </Modal>
  );
};

export default AddIngredientModal;
