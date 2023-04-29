import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import classNames from "classnames";
import { ComponentProps, useCallback, useMemo, useState } from "react";
import DbImage from "/components/DbImage";
import { FaShoppingCart } from "react-icons/fa";

import Modal from "/components/Modal";
import MoneyDisplay from "/components/MoneyDisplay";
import NumberInput from "/components/NumberInput";
import { IMenuItem, ISidesItem } from "/models/MenuItem";
import { IMenuSection, IStore } from "/models/Store";
import { RiExchangeFill } from "react-icons/ri";
import { IoAddCircleSharp, IoRemoveCircleSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdPlaylistAddCircle } from "react-icons/md";
import {
  navigateBySectionIndex,
  retriveAllMenuItems,
} from "/lib/menuSectionUtils";

interface AddStoreModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  menuItem: IMenuItem;
}

const OrderMenuItemDetailsModal: React.FC<AddStoreModalProps> = ({
  store,
  contentClassName,
  menuItem,
  onOpenChange,
  ...props
}) => {
  const priceNew = menuItem.pricePromotional
    ? menuItem.pricePromotional
    : menuItem.price;
  const priceOld = menuItem.pricePromotional ? menuItem.price : undefined;

  const [order, setOrder] = useState<any>({
    removals: menuItem.composition?.map((i) => ({
      ingredient: i.ingredient,
      quantity: i.quantity,
    })),
    combo: menuItem.sides?.map((s) => ({
      menuItem: s.menuItem,
      replacement: s.menuItem,
    })),
    additionals: [],
  });

  const removalsChange = useMemo(
    () =>
      order.removals?.filter(
        (orderIngredient: any) =>
          orderIngredient.quantity !==
          menuItem.composition?.find(
            (f2) => f2.ingredient.name === orderIngredient.ingredient.name
          )?.quantity
      ),
    [order, menuItem.composition]
  );

  const additionalsChange = useMemo(
    () =>
      order.additionals?.filter(
        (orderIngredient: any) => orderIngredient.quantity > 0
      ),
    [order]
  );

  const comboChange = useMemo(
    () =>
      order.combo?.filter(
        (comboItem: any) => comboItem.replacement._id !== comboItem.menuItem._id
      ),
    [order]
  );

  const exchangesItemsBySide = (side: ISidesItem, menuItem: IMenuItem) => {
    const result = side.exchanges
      ?.map((ex) =>
        ex.scope === "menu-section"
          ? navigateBySectionIndex(
              store.menu.sections,
              ex.menuSectionIndex?.split(",").map((m) => +m) || []
            ).items
          : null
      )[0]
      .filter(
        (f) => !menuItem.sides?.map((s) => s.menuItem._id).includes(f._id)
      );
    return result;
  };

  const calculedPrice = useMemo(() => {
    return (
      priceNew +
      additionalsChange.reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0
      ) +
      comboChange.reduce(
        (acc, curr) =>
          acc +
          Math.max(
            curr.replacement.price * curr.quantity -
              curr.menuItem.price * curr.quantity,
            0
          ),
        0
      )
    );
  }, [priceNew, additionalsChange, comboChange]);

  const storeIngredients = useMemo(
    () => retriveAllMenuItems(store.menu.sections),
    [store.menu.sections]
  );

  const findCustomization = useCallback(
    (toFoundBy: IMenuItem) =>
      toFoundBy.customizeType === "template"
        ? storeIngredients.find(
            (f) => f._id === toFoundBy.customizeTemplateMenuItem?._id
          )?.additionals
        : toFoundBy.additionals,
    [storeIngredients]
  );

  return (
    <Modal
      {...props}
      onOpenChange={onOpenChange}
      className="!max-w-5xl"
      contentClassName={classNames(
        "flex flex-col container !max-w-5xl !h-full !p-0 relative pb-18",
        contentClassName
      )}
    >
      <DbImage
        className="bg-main-200 !rounded-none w-full sm:h-[300px] object-cover"
        id={menuItem.images?.main}
        width={500}
        height={500}
        alt={`${menuItem.name} hero image`}
      />
      <div className="sticky top-0 bg-main-100 px-4 py-2 z-20 shadow-md mb-3 flex flex-col sm:flex-row sm:items-center">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex-1">
            <div className="flex flex-row flex-wrap gap-2 items-baseline">
              <h2 className="text-2xl font-bold">{menuItem.name}</h2>
              {menuItem.nameDetail && <span>({menuItem.nameDetail})</span>}
            </div>
            <MoneyDisplay
              className="text-2xl"
              oldValueClassName="text-lg"
              value={calculedPrice}
              oldValue={priceOld}
            />
          </div>
          <div
            className="cursor-pointer mt-1 sm:hidden"
            onClick={() => onOpenChange(false)}
          >
            <IoMdClose size={30} />
          </div>
        </div>
        <ul className="flex-1 sm:text-right text-xs sm:pl-4">
          {removalsChange.length > 0 && (
            <li>
              <ul className="flex-1">
                <span className="font-bold">Remover: </span>
                {removalsChange
                  .sort((ig1, ig2) =>
                    ig1.ingredient.name > ig2.ingredient.name ? 1 : -1
                  )
                  .map((ingRemove) => (
                    <li className="inline" key={ingRemove.ingredient.name}>
                      {ingRemove.ingredient.name}
                    </li>
                  ))
                  .flatMap((item) => [item, ", "])
                  .slice(0, -1)}
              </ul>
            </li>
          )}
          {additionalsChange.length > 0 && (
            <li className="list-item">
              <ul className="flex-1">
                <span className="font-bold">Adicionar: </span>
                {additionalsChange
                  .sort((ig1, ig2) =>
                    ig1.ingredient.name > ig2.ingredient.name ? 1 : -1
                  )
                  .map((ingAdd) => (
                    <li className="inline" key={ingAdd.ingredient.name}>
                      {ingAdd.ingredient.name}
                    </li>
                  ))
                  .flatMap((item) => [item, ", "])
                  .slice(0, -1)}
              </ul>
            </li>
          )}
          {comboChange.length > 0 && (
            <li className="list-item">
              <ul className="list-disc">
                {comboChange
                  .sort((ci1, ci2) =>
                    ci1.menuItem.name > ci2.menuItem.name ? 1 : -1
                  )
                  .map((comboItem) => (
                    <li className="list-item " key={comboItem.menuItem._id}>
                      <span className="font-bold">Trocar: </span>
                      {comboItem.quantity && `${comboItem.quantity}x `}
                      {comboItem.menuItem.name} por{" "}
                      {comboItem.quantity && `${comboItem.quantity}x `}
                      {comboItem.replacement.name}
                    </li>
                  ))}
              </ul>
            </li>
          )}
        </ul>

        <div
          className="cursor-pointer mt-1 hidden sm:block"
          onClick={() => onOpenChange(false)}
        >
          <IoMdClose size={30} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 px-4 flex-1">
        <div className="sm:flex-1">
          {menuItem.details?.short && <span>{menuItem.details?.short}</span>}
          {menuItem.details?.long && <span>{menuItem.details?.long}</span>}
          {menuItem.composition?.length ? (
            <ul className="text-xs pt-1 text-main-a11y-medium">
              <span>Ingredientes: </span>
              {menuItem.composition
                ?.map((compositionItem) =>
                  compositionItem.ingredient ? (
                    <li
                      className="inline"
                      key={compositionItem.ingredient.name}
                    >
                      {compositionItem.quantity &&
                      compositionItem.quantity !== 1
                        ? `${compositionItem.quantity}x `
                        : ""}
                      {compositionItem.ingredient.name}
                    </li>
                  ) : null
                )
                .flatMap((item) => [item, ", "])
                .slice(0, -1)}
            </ul>
          ) : null}
        </div>
        <div className="sm:flex-1 sm:border-l-[1px] sm:border-main-a11y-low sm:pl-4">
          <Accordion className="p-0 -mx-4" allowMultiple>
            {menuItem.composition?.filter((c) => !c.essential).length ? (
              <AccordionItem>
                <AccordionButton>
                  <h3 className="text-lg mb-2 flex-1 flex flex-row gap-2 items-center text-start">
                    <IoRemoveCircleSharp size={24} />O que deseja retirar?
                  </h3>{" "}
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <ul className="text-sm">
                    {menuItem.composition
                      ?.filter((c) => !c.essential)
                      .map((compositionItem) => (
                        <li
                          className="grid grid-cols-[1fr_max-content] items-center gap-4 border-b-[1px] py-2"
                          key={compositionItem.ingredient._id}
                        >
                          <span>{compositionItem.ingredient.name}</span>
                          <NumberInput
                            value={
                              order.removals?.find(
                                (f) =>
                                  f.ingredient._id ===
                                  compositionItem.ingredient._id
                              )?.quantity
                            }
                            onChange={(newValue) => {
                              setOrder({
                                ...order,
                                removals: [
                                  ...(order.removals?.filter(
                                    (f) =>
                                      f.ingredient._id !==
                                      compositionItem.ingredient._id
                                  ) || []),
                                  {
                                    ingredient: compositionItem.ingredient,
                                    quantity: newValue,
                                  },
                                ],
                              });
                            }}
                            min={0}
                            max={compositionItem.quantity}
                          />
                        </li>
                      ))}
                  </ul>
                </AccordionPanel>
              </AccordionItem>
            ) : null}
            {findCustomization(menuItem)?.map((additionalsCategory) => (
              <AccordionItem key={additionalsCategory.categoryName}>
                <AccordionButton>
                  <h3 className="text-lg mb-2 w-full text-start flex flex-row items-center gap-2">
                    <MdPlaylistAddCircle size={24} />
                    {additionalsCategory.categoryName}{" "}
                    <span className="text-main-a11y-medium font-normal">
                      (0 de {additionalsCategory.max})
                    </span>
                  </h3>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel className="!pt-0">
                  <ul className="flex-1 text-sm">
                    {additionalsCategory.items?.map((item) => (
                      <li
                        className="flex flex-row items-center justify-between [&:not(:last-child)]:border-b border-main-a11y-low gap-2 py-2"
                        key={item.ingredient.name}
                      >
                        <div className="flex flex-row items-center gap-2">
                          {item.ingredient.images?.main && (
                            <DbImage
                              className="rounded-md"
                              id={item.ingredient.images?.main}
                              width={50}
                              height={50}
                            />
                          )}
                          <div>
                            <span className="flex-1">
                              {item.ingredient.name}
                            </span>
                            <MoneyDisplay
                              className="mr-2"
                              plus
                              zeroInvisible
                              value={item.ingredient.price}
                              promotional={item.ingredient.pricePromotional}
                            />
                          </div>
                        </div>
                        <NumberInput
                          value={
                            order.additionals.find(
                              (f) => f.ingredient.name === item.ingredient.name
                            )?.quantity
                          }
                          min={item.min}
                          max={item.max}
                          onChange={(e) =>
                            setOrder({
                              ...order,
                              additionals: [
                                ...order?.additionals?.filter(
                                  (f) =>
                                    f.ingredient.name !== item.ingredient.name
                                ),
                                {
                                  ...item,
                                  quantity: e,
                                  price: item.ingredient.price,
                                },
                              ],
                            })
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </AccordionPanel>
              </AccordionItem>
            ))}
            {menuItem.sides
              ?.filter((s) => (s.exchanges?.length || 0) > 0)
              .map(
                (side) =>
                  (exchangesItemsBySide(side, menuItem)?.filter(
                    (f) => f._id !== side.menuItem._id
                  ).length || 0) > 0 && (
                    <AccordionItem key={side.menuItem._id}>
                      <AccordionButton>
                        <h3 className="text-lg mb-2 flex-1 flex flex-row gap-2 items-center text-start">
                          <RiExchangeFill size={24} />
                          Trocar {side.menuItem.name} por:
                        </h3>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel className="flex flex-col gap-4">
                        <RadioGroup
                          value={
                            order.combo?.find(
                              (f) => side.menuItem._id === f.menuItem._id
                            ).replacement._id
                          }
                          onChange={(e) =>
                            setOrder({
                              ...order,
                              combo: [
                                ...order.combo.filter(
                                  (ci) => ci.menuItem?._id !== side.menuItem._id
                                ),
                                {
                                  menuItem: side.menuItem,
                                  quantity: side.quantity,
                                  replacement: exchangesItemsBySide(
                                    side,
                                    menuItem
                                  ).find((f) => f._id === e),
                                },
                              ],
                            })
                          }
                        >
                          <div className="flex flex-row gap-2 items-center justify-between border-b-[1px] border-main-a11y-low pb-2">
                            <span>Não trocar</span>
                            <Radio
                              className="!border-main-a11y-medium"
                              value={side.menuItem._id}
                            />
                          </div>
                          {exchangesItemsBySide(side, menuItem).map(
                            (sectionMenuItem) => (
                              <div
                                className="flex flex-row gap-2 items-center justify-between [&:not(:last-child)]:border-b-[1px] border-main-a11y-low py-2"
                                key={sectionMenuItem._id}
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <DbImage
                                    className="rounded-md"
                                    id={sectionMenuItem.images?.main}
                                    width={50}
                                    height={50}
                                  />
                                  <div className="flex flex-col gap-0">
                                    {sectionMenuItem.name}
                                    <MoneyDisplay
                                      plus
                                      value={Math.max(
                                        (sectionMenuItem.price -
                                          side.menuItem.price) *
                                          side.quantity,
                                        0
                                      )}
                                    />
                                  </div>
                                </div>
                                <Radio
                                  className="!border-main-a11y-medium"
                                  value={sectionMenuItem._id}
                                />
                              </div>
                            )
                          )}
                        </RadioGroup>
                      </AccordionPanel>
                    </AccordionItem>
                  )
              )}
          </Accordion>
        </div>
      </div>
      <div className="sticky bottom-0 left-0 right-0 border-t-[1px] border-main-a11y-low p-2 sm:mx-0 bg-main-100 flex flex-row gap-2 justify-between h-18">
        <NumberInput full />
        <Button className="!bg-hero flex-1" isDisabled={calculedPrice <= 0}>
          <FaShoppingCart className="mr-2" />
          Adicionar
        </Button>
      </div>
    </Modal>
  );
};

export default OrderMenuItemDetailsModal;
