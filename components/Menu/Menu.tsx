import { ComponentProps, useMemo, memo, useContext } from "react";
import { Accordion } from "react-accessible-accordion";
import isEqual from "lodash.isequal";

import { listAllSections } from "/lib/menuSectionUtils";
import MenuSection from "./MenuSection";
import { IMenuSection } from "/models/types/Store";
import { StoreContext } from "../Store";
import { useSession } from "next-auth/react";
import { IUser } from "/models/types/User";

interface MenuProps extends ComponentProps<"section"> {
  sections: IMenuSection[];
  type: "product" | "ingredient";
  onChangeSection: (section: IMenuSection) => void;
}

const Menu: React.FC<MenuProps> = ({
  className,
  children,
  type,
  sections,
  onChangeSection = () => {},
  ...props
}) => {
  const { menuItemsRenderCount } = useContext(StoreContext);
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const allSections = useMemo(
    () => listAllSections(sections || []),
    [sections]
  );

  const defaultIndex = useMemo(
    () => allSections.map((section) => section._id),
    [allSections]
  );

  if (menuItemsRenderCount) menuItemsRenderCount.current = 0;

  return (
    <Accordion allowMultipleExpanded preExpanded={defaultIndex}>
      {allSections.map((section) => (
        <MenuSection key={`${section._id}`} menuSection={section} type={type} />
      ))}
      {/* {menuItemsRenderCount?.current === 0 && !admin && (
        <span className="text-xl w-full h-[calc(100vh-var(--footer-height)-var(--header-height))] flex flex-col items-center justify-center gap-4">
          <MdNoFood size={42} />
          Ops... nenhum produto encontrado!
        </span>
      )} */}
    </Accordion>
  );
};

export default memo(Menu, (prev, next) =>
  isEqual(prev.sections, next.sections)
);
