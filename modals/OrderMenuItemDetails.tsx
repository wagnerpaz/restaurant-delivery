import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
} from "@chakra-ui/react";
import classNames from "classnames";
import { ComponentProps } from "react";
import DbImage from "/components/DbImage";
import { FaShoppingCart } from "react-icons/fa";

import Modal from "/components/Modal";
import MoneyDisplay from "/components/MoneyDisplay";
import NumberInput from "/components/NumberInput";
import { IMenuItem } from "/models/MenuItem";

interface AddStoreModalProps extends ComponentProps<typeof Modal> {
  menuItem: IMenuItem;
}

const OrderMenuItemDetailsModal: React.FC<AddStoreModalProps> = ({
  contentClassName,
  menuItem,
  onOpenChange,
  ...props
}) => {
  const priceNew = menuItem.pricePromotional
    ? menuItem.pricePromotional
    : menuItem.price;
  const priceOld = menuItem.pricePromotional ? menuItem.price : undefined;

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
      <div className="flex flex-col flex-1">
        <DbImage
          className="bg-main-200 !rounded-none mr-2 w-full h-[200px] object-cover"
          id={menuItem.images?.main}
          width={500}
          height={700}
          alt={`${menuItem.name} hero image`}
        />
        <div className="sticky top-0 bg-main-100 px-4 py-2 z-20 shadow-md mb-3">
          <h2 className="text-2xl font-bold">{menuItem.name}</h2>
          <span>{menuItem.nameDetail}</span>
          <MoneyDisplay
            className="text-2xl"
            oldValueClassName="text-lg"
            value={priceNew}
            oldValue={priceOld}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 px-4 h-full sm:flex-1">
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
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <h3 className="text-xl mb-2 flex-1 text-start">
                    O que deseja retirar?
                  </h3>{" "}
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  {menuItem.composition?.length ? (
                    <>
                      <ul className="text-md">
                        {menuItem.composition?.map((compositionItem) => (
                          <li
                            className="grid grid-cols-[1fr_max-content] items-center gap-4 border-b-[1px]"
                            key={compositionItem.ingredient.name}
                          >
                            <span className="pb-2">
                              {compositionItem.ingredient.name}
                            </span>
                            <NumberInput
                              min={0}
                              max={compositionItem.quantity}
                              defaultValue={compositionItem.quantity}
                            />
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </AccordionPanel>
              </AccordionItem>
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
      </div>
    </Modal>
  );
};

export default OrderMenuItemDetailsModal;
