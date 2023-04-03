import { ComponentProps } from "react";
import classNames from "classnames";
import { FaShoppingCart } from "react-icons/fa";

import { IMenuItemCompositionItem, ISidesItem } from "/models/MenuItem";
import Button from "/components/Button";
import Image from "next/image";
import DbImageEditor from "../DbImageEditor";

interface MenuItemProps extends ComponentProps<"div"> {
  name: string;
  index: number;
  mainImageId?: string;
  composition?: IMenuItemCompositionItem[];
  sides?: ISidesItem[];
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  className,
  children,
  name,
  index,
  mainImageId,
  composition,
  sides,
  onClick,
  ...props
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col h-full relative rounded-bl-2xl rounded-br-2xl rounded-tl-2xl overflow-hidden shadow-md text-dark-500 bg-light-high border-light-high border-4 group cursor-pointer z-0",
        className
      )}
      {...props}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 bg-light-high p-2 rounded-bl-2xl z-10">
        <span className="font-bold text-[#036704]">R$20,00</span>
      </div>
      {mainImageId ? (
        <DbImageEditor
          id={mainImageId}
          alt={`${name} hero image`}
          upload={{ path: "/store/menu-item", fileKey: "main" }}
          width={99999}
          height={99999}
        />
      ) : (
        <Image
          className="bg-dark-200"
          src="/no-image-icon-4.png"
          alt="no photo"
          width={99999}
          height={99999}
        />
      )}
      <div className="flex-1 relative bottom-0 w-full p-4 mb-14 flex flex-col bg-light-high -translate-y-6 group-hover:-translate-y-12 rounded-tl-2xl rounded-tr-2xl">
        <div className="flex flex-row justify-between">
          <h3 className="text-md font-bold">{name}</h3>
        </div>

        <div className="relative flex-1 pb-2">
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
          {sides?.length ? (
            <ul className="text-sm mt-1">
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
          ) : null}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-[darkblue]">Mais detalhes</span>
        <Button
          className="w-full mt-2 flex flex-row gap-2 items-center justify-center"
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
