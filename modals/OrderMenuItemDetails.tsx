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
import { ComponentProps, useState } from "react";
import DbImage from "/components/DbImage";
import { FaShoppingCart } from "react-icons/fa";

import Modal from "/components/Modal";
import MoneyDisplay from "/components/MoneyDisplay";
import NumberInput from "/components/NumberInput";
import { IMenuItem } from "/models/MenuItem";
import { IMenuSection, IStore } from "/models/Store";
import { RiExchangeFill } from "react-icons/ri";
import { IoRemoveCircleSharp } from "react-icons/io5";

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
    ingredients: menuItem.composition?.map((i) => ({
      ingredient: i.ingredient,
      newQuantity: i.quantity,
    })),
  });

  const findSectionByIndex = (
    store: IStore,
    sectionIndex: number[]
  ): IMenuSection => {
    let section = store.menu as IMenuSection;
    for (const index of sectionIndex) {
      section = section.sections[index];
    }
    console.log("section", section);
    return section;
  };

  console.log("order", order);

  const ingredientsChange = order.ingredients?.filter(
    (orderIngredient) =>
      orderIngredient.newQuantity !==
      menuItem.composition?.find(
        (f2) => f2.ingredient.name === orderIngredient.ingredient.name
      )?.quantity
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
        className="bg-main-200 !rounded-none w-full h-[200px] object-cover"
        id={menuItem.images?.main}
        width={500}
        height={700}
        alt={`${menuItem.name} hero image`}
      />
      <div className="sticky top-0 bg-main-100 px-4 py-2 z-20 shadow-md mb-3">
        <div className="">
          <h2 className="text-2xl font-bold">{menuItem.name}</h2>
          <span>{menuItem.nameDetail}</span>
          <MoneyDisplay
            className="text-2xl"
            oldValueClassName="text-lg"
            value={priceNew}
            oldValue={priceOld}
          />
        </div>
        {ingredientsChange.length > 0 && (
          <ul className="list-disc flex-1 pl-4">
            <li className="list-item">
              <ul className="text-xs flex-1">
                <span className="font-bold">Remover: </span>
                {ingredientsChange
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
          </ul>
        )}
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
                  <h3 className="text-xl mb-2 flex-1 flex flex-row gap-2 items-center text-start">
                    <IoRemoveCircleSharp size={24} />O que deseja retirar?
                  </h3>{" "}
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <ul className="text-md">
                    {menuItem.composition
                      ?.filter((c) => !c.essential)
                      .map((compositionItem) => (
                        <li
                          className="grid grid-cols-[1fr_max-content] items-center gap-4 border-b-[1px]"
                          key={compositionItem.ingredient.name}
                        >
                          <span className="pb-2">
                            {compositionItem.ingredient.name}
                          </span>
                          <NumberInput
                            value={
                              order?.ingredients?.find(
                                (f) =>
                                  f.ingredient.name ===
                                  compositionItem.ingredient.name
                              )?.newQuantity
                            }
                            onChange={(newValue) => {
                              console.log(
                                "oii",
                                newValue,
                                compositionItem.quantity
                              );
                              setOrder({
                                ...order,
                                ingredients: [
                                  ...(order.ingredients?.filter(
                                    (f) =>
                                      f.ingredient.name !==
                                      compositionItem.ingredient.name
                                  ) || []),
                                  {
                                    ingredient: compositionItem.ingredient,
                                    newQuantity: newValue,
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
            {menuItem.sides
              ?.filter((s) => (s.exchanges?.length || 0) > 0)
              .map((side) => (
                <AccordionItem key={side.menuItem._id}>
                  <AccordionButton>
                    <h3 className="text-xl mb-2 flex-1 flex flex-row gap-2 items-center text-start">
                      <RiExchangeFill size={24} />
                      Trocar {side.menuItem.name} por:
                    </h3>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel className="flex flex-col gap-4">
                    <RadioGroup>
                      <div className="flex flex-row gap-2 items-center justify-between border-b-[1px] border-main-a11y-medium pb-2">
                        <span>Não trocar</span>
                        <Radio className="!border-main-a11y-medium" value="" />
                      </div>
                      {side.exchanges?.map((ex) =>
                        ex.scope === "menu-section" ? (
                          findSectionByIndex(
                            store,
                            ex.menuSectionIndex?.split(",").map((m) => +m) || []
                          )
                            .items.filter(
                              (f) =>
                                !menuItem.sides
                                  ?.map((s) => s.menuItem._id)
                                  .includes(f._id)
                            )
                            .map((sectionMenuItem) => (
                              <div
                                className="flex flex-row gap-2 items-center justify-between [&:not(:last-child)]:border-b-[1px] border-main-a11y-medium py-2"
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
                                        sectionMenuItem.price -
                                          side.menuItem.price,
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
                            ))
                        ) : (
                          <div>Opps</div>
                        )
                      )}
                    </RadioGroup>
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>
      <div className="sticky bottom-0 left-0 right-0 border-t-[1px] border-main-a11y-low p-2 sm:mx-0 bg-main-100 flex flex-row gap-2 justify-between h-18">
        <Button
          className="text-hero flex-1"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
        <Button className="!bg-hero flex-1">
          <FaShoppingCart className="mr-2" />
          Adicionar
        </Button>
      </div>
    </Modal>
  );
};

export default OrderMenuItemDetailsModal;
