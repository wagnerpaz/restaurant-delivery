import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { HiPlus } from "react-icons/hi";

import Modal from "/components/Modal";
import usePutIngredient from "/hooks/usePutIngredient";
import removeDiacritics from "/lib/removeDiacritics";
import toPascalCase from "/lib/toPascalCase";
import { IIngredient } from "/models/Ingredients";
import { IMenuSection, IStore, IStoreIngredient } from "/models/Store";
import useGetIngredients from "/hooks/useGetIngredients";
import Fieldset from "/components/Fieldset";
import classNames from "classnames";
import isEqual from "lodash.isequal";
import { Button, Checkbox, Input } from "@chakra-ui/react";
import FormControl from "/components/FormControl";
import MoneyDisplay from "/components/MoneyDisplay";
import { RiStore3Fill } from "react-icons/ri";
import { MdStoreMallDirectory } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import EditIngredientDetailModal from "./EditIngredientDetailModal";
import { replaceAt } from "/lib/immutable";

interface AddIngredientModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  ingredients: IIngredient[];
  initialSelection: IIngredientSelection[];
  onStoreChange?: (store: IStore) => void;
  onIngredientsChange?: (ingredients: IIngredient[]) => void;
  onSelectionChange?: (ingredientsSel: IIngredientSelection[]) => void;
}

export interface IIngredientSelection {
  ingredient: IIngredient;
  selected: boolean;
  price?: number;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  store,
  initialSelection,
  ingredients,
  contentClassName,
  onOpenChange,
  onIngredientsChange = () => {},
  onStoreChange = (store: IStore, shouldSave?: boolean) => {},
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

  const [editIngredientDetail, setEditIngredientDetail] =
    useState<IStoreIngredient>();
  const [editIngredientDetailOpen, setEditIngredientDetailOpen] =
    useState(false);
  const [editIngredientDetailTarget, setEditIngredientDetailTarget] =
    useState("");

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

  const storeIngredients = useMemo(() => store.ingredients, [store]);

  useEffect(() => {
    const newIngredientsSel = ingredients.map((ingredient) => ({
      ingredient,
      selected: initialSelection
        .map((is) => is?.ingredient?._id)
        .filter((f) => f)
        .includes(ingredient._id),
      price: initialSelection.find((f) => f.ingredient?._id === ingredient._id)
        ?.price,
    }));
    setIngredientsSel([...newIngredientsSel]);
  }, [initialSelection, ingredients]);

  const handleAdd = async () => {
    const confirmation =
      filtered.length === 0 ||
      confirm(
        `Existem items correspondentes, deseja adicionar "${toPascalCase(
          filter
        )}" realmente?`
      );
    if (confirmation) {
      const serverIngredient = await putIngredient({
        name: toPascalCase(filter),
        store: store._id,
      } as IIngredient);
      onIngredientsChange([...ingredients, serverIngredient]);
      setFilter("");
    }
  };

  const handleSave = async () => {
    const additionIngredients = await putIngredient(
      additions.map((a) => a.ingredient)
    );
    onIngredientsChange([...ingredients, ...additionIngredients]);
    onSelectionChange(
      [...ingredientsSel, ...additions].map((i) => ({
        ...i,
        ingredient: [...ingredients, ...additionIngredients].find(
          (f: IIngredient) => i.ingredient.name === f.name
        ),
      }))
    );
    onStoreChange(store, true);

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
      storeIngredients.map((m) => m.ingredient._id).includes(f.ingredient._id)
    );

  const notInStoreFiltered = filtered
    .filter((f) => !f.selected)
    .filter(
      (f) =>
        !storeIngredients
          .map((m) => m.ingredient._id)
          .includes(f.ingredient._id)
    );

  return (
    <Modal
      {...props}
      contentClassName={classNames(
        "!overflow-visible !h-full flex flex-col container",
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
        <FormControl className="flex-1 min-w-fit">
          <Input
            ref={filterRef}
            placeholder="Pesquisar.."
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
        </Button>
      </div>
      <div className="h-[calc(100%-95px)] flex flex-col sm:flex-row gap-2 text-sm">
        <div className="h-2/3 sm:h-auto flex-1 flex flex-col-reverse gap-2">
          <Fieldset
            title="Loja"
            className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            {inStoreFiltered.length > 0 && (
              <ul className="flex flex-col gap-2">
                {inStoreFiltered.map((sel) => (
                  <li
                    className="flex flex-row items-center justify-between gap-4 text-main-a11y-high"
                    key={sel.ingredient.name}
                  >
                    <Checkbox
                      className="border-main-300"
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
                              price: store.ingredients.find(
                                (f) => f.ingredient.name === sel.ingredient.name
                              )?.price,
                            },
                          ];
                        });
                      }}
                    />
                    <span className="text-left flex-1">
                      {sel.ingredient.name}
                    </span>
                    <MoneyDisplay
                      debit
                      value={
                        storeIngredients.find(
                          (f) => f.ingredient.name === sel.ingredient.name
                        )?.price
                      }
                    />
                    <a
                      className="cursor-pointer text-link"
                      title="Editar"
                      onClick={() => {
                        setEditIngredientDetail(
                          storeIngredients.find(
                            (f) => f.ingredient.name === sel.ingredient.name
                          )
                        );
                        setEditIngredientDetailOpen(true);
                        setEditIngredientDetailTarget("store");
                      }}
                    >
                      <AiFillEdit size={20} />
                    </a>
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
            title="Biblioteca"
            className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            {notInStoreFiltered.length > 0 && (
              <ul className="flex flex-col gap-2">
                {notInStoreFiltered.map((sel) => (
                  <li
                    className="flex flex-row items-center gap-4 text-main-a11y-high"
                    key={sel.ingredient.name}
                  >
                    <span className="flex-1">{sel.ingredient.name}</span>
                    <a
                      className="cursor-pointer text-link flex flex-row items-center font-bold"
                      title="Adicionar à loja"
                      onClick={(e) => {
                        onStoreChange({
                          ...store,
                          ingredients: [
                            ...store.ingredients,
                            { ingredient: sel.ingredient },
                          ],
                        });
                      }}
                    >
                      +<MdStoreMallDirectory size={20} />
                    </a>
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
          title="Produto"
          className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          {sorted.filter((f) => f.selected).length > 0 && (
            <ul className="flex flex-col gap-2">
              {sorted
                .filter((f) => f.selected)
                .map((sel) => (
                  <li
                    className="flex flex-row items-center gap-4 text-main-a11y-high"
                    key={sel.ingredient.name}
                  >
                    <Checkbox
                      className="!border-main-300"
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
                    <span className="flex-1">{sel.ingredient.name}</span>
                    <MoneyDisplay debit value={sel.price} />
                    <a
                      className="cursor-pointer text-link"
                      title="Editar"
                      onClick={() => {
                        setEditIngredientDetail(sel);
                        setEditIngredientDetailOpen(true);
                        setEditIngredientDetailTarget("product");
                      }}
                    >
                      <AiFillEdit size={20} />
                    </a>
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
      <div className="flex flex-row gap-2 mt-2 justify-end">
        <Button
          className="w-full sm:w-32"
          variant="outline"
          onClick={() => {
            handleOpenChange(false);
            reset();
          }}
        >
          Cancel
        </Button>
        <Button className="w-full sm:w-32" onClick={handleSave}>
          Salvar
        </Button>
      </div>
      {editIngredientDetailOpen && (
        <EditIngredientDetailModal
          store={store}
          ingredientDetail={editIngredientDetail as IStoreIngredient}
          open={editIngredientDetailOpen}
          onOpenChange={() =>
            setEditIngredientDetailOpen(!editIngredientDetailOpen)
          }
          onSave={(newValue) => {
            if (editIngredientDetailTarget === "store") {
              onStoreChange({
                ...store,
                ingredients: [
                  ...store.ingredients.filter(
                    (f) => f.ingredient.name !== newValue.ingredient.name
                  ),
                  newValue,
                ],
              } as IStore);
            } else if (editIngredientDetailTarget === "product") {
              setIngredientsSel([
                ...ingredientsSel.filter(
                  (f) => f.ingredient.name !== newValue.ingredient.name
                ),
                newValue as IIngredientSelection,
              ]);
            }
            setEditIngredientDetailOpen(false);
          }}
          onCancel={() => setEditIngredientDetailOpen(false)}
          onDelete={() => {
            onStoreChange({
              ...store,
              ingredients: [
                ...store.ingredients.filter(
                  (f) =>
                    f.ingredient.name !== editIngredientDetail?.ingredient.name
                ),
              ],
            } as IStore);
            setEditIngredientDetailOpen(false);
          }}
        />
      )}
    </Modal>
  );
};

export default AddIngredientModal;
