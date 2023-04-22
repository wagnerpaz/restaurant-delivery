import { useNumberInput } from "@chakra-ui/react";
import classNames from "classnames";
import { ComponentProps } from "react";
import DbImage from "/components/DbImage";

import Modal from "/components/Modal";
import MoneyDisplay from "/components/MoneyDisplay";
import NumberInput from "/components/NumberInput";
import { IMenuItem } from "/models/MenuItem";
import { IStore } from "/models/Store";

interface AddStoreModalProps extends ComponentProps<typeof Modal> {
  menuItem: IMenuItem;
}

const OrderMenuItemDetailsModal: React.FC<AddStoreModalProps> = ({
  contentClassName,
  menuItem,
  ...props
}) => {
  const priceNew = menuItem.pricePromotional
    ? menuItem.pricePromotional
    : menuItem.price;
  const priceOld = menuItem.pricePromotional ? menuItem.price : undefined;

  return (
    <Modal
      {...props}
      className="!h-[100vh-var(--header-height)] sm:!h-screen !my-0 !top-[--header-height] sm:top-0"
      backgroundClassName="hidden"
      contentClassName={classNames(
        "flex flex-col container max-w-5xl !h-full !p-0 !rounded-none sm:!rounded-2xl",
        contentClassName
      )}
    >
      <div className="flex flex-col gap-3">
        <DbImage
          className="bg-main-200 !rounded-none sm:!rounded-xl mr-2 w-full h-[200px] object-cover"
          id={menuItem.images?.main}
          width={500}
          height={700}
          alt={`${menuItem.name} hero image`}
        />
        <div className="sticky top-0 bg-main-200 px-4 py-2 border-b-[1px] border-main-a11y-medium z-20 pt-0">
          <h2 className="text-2xl font-bold">{menuItem.name}</h2>
          <span>{menuItem.nameDetail}</span>
          <MoneyDisplay
            className="text-2xl"
            oldValueClassName="text-lg"
            value={priceNew}
            oldValue={priceOld}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 px-4">
          <div className="flex-1">
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
          <div className="flex-1 sm:border-l-[1px] sm:border-main-a11y-medium sm:px-4 mb-[1000px]">
            {menuItem.composition?.length ? (
              <>
                <h3 className="text-xl mb-2">O que deseja retirar?</h3>
                <ul className="text-md">
                  {menuItem.composition?.map((compositionItem) => (
                    <li
                      className="grid grid-cols-2 items-center gap-4"
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
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderMenuItemDetailsModal;
