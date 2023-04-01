import { ComponentProps } from "react";
import classNames from "classnames";
import { FaShoppingCart } from "react-icons/fa";

import DbImage from "/components/DbImage";
import { IMenuItemCompositionItem, ISidesItem } from "/models/MenuItem";
import Button from "/components/Button";

interface MenuItemProps extends ComponentProps<"div"> {
  name: string;
  mainImageId?: string;
  composition?: IMenuItemCompositionItem[];
  sides?: ISidesItem[];
}

const MenuItem: React.FC<MenuItemProps> = ({
  className,
  children,
  name,
  mainImageId,
  composition,
  sides,
  ...props
}) => {
  return (
    <div
      className={classNames(
        "relative inline-block rounded-bl-2xl rounded-br-2xl rounded-tl-2xl overflow-hidden shadow-md text-dark-500 bg-light-high border-light-high border-4 group",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 right-0 bg-light-high p-2 rounded-bl-2xl z-10">
        <span className="font-bold text-[#036704]">R$20,00</span>
      </div>
      {mainImageId && (
        <DbImage
          className="mb-48 group-hover:opacity-0 transition-all duration-100"
          id={mainImageId}
          alt={`${name} hero image`}
          width={99999}
          height={99999}
        />
      )}
      <div className="absolute bottom-0 h-56 w-full p-4 pb-2 flex flex-col bg-light-high -translate-y-3 rounded-tl-2xl rounded-tr-2xl group-hover:h-full transition-all duration-100">
        <div className="flex flex-row justify-between">
          <h3 className="text-md font-bold">{name}</h3>
          {/* <span className="font-bold text-[#036704]">R$20,00</span> */}
        </div>

        <div className="overflow-hidden group-hover:hidden">
          <ul className="text-xs pt-2 opacity-60">
            {composition
              ?.map((compositionItem) => (
                <li className="inline" key={compositionItem.ingredient.name}>
                  {compositionItem.quantity
                    ? `${compositionItem.quantity}x `
                    : ""}
                  {compositionItem.ingredient.name}
                </li>
              ))
              .flatMap((item) => [item, ", "])
              .slice(0, -1)}
          </ul>
          <ul className="text-sm pt-2 group-hover:hidden">
            <span>Acompanha: </span>
            {sides
              ?.map((side) => (
                <li className="inline" key={side.menuItem.name}>
                  {side.menuItem.name}
                </li>
              ))
              .flatMap((item) => [item, ", "])
              .slice(0, -1)}
          </ul>
        </div>
        <div className="overflow-hidden hidden group-hover:block">
          <ul className="list-disc text-sm pt-2">
            <span className="font-bold">Ingredientes:</span>
            {composition?.map((compositionItem) => (
              <li className="ml-6" key={compositionItem.ingredient.name}>
                {compositionItem.ingredient.name}
              </li>
            ))}
          </ul>
          <ul className="list-disc text-sm pt-2 hidden group-hover:block">
            <span className="font-bold">Acompanha: </span>
            {sides?.map((side) => (
              <li className="ml-6" key={side.menuItem.name}>
                {side.menuItem.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1" />
        <span className="group-hover:hidden text-[darkblue]">
          Mais detalhes
        </span>
        <Button
          className="w-full mt-4 flex flex-row gap-2 items-center justify-center"
          variant="contained"
        >
          <FaShoppingCart className="text-xl" />
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default MenuItem;
