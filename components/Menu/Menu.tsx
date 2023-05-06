import { ComponentProps, useMemo } from "react";
import { Accordion } from "@chakra-ui/react";

import { IMenuSection } from "/models/Store";
import { listAllSections } from "/lib/menuSectionUtils";
import MenuSection from "./MenuSection";
import usePutStoreMenuSectionSections from "/hooks/usePutStoreMenuSectionSections";

interface MenuProps extends ComponentProps<"section"> {
  sections: IMenuSection[];
  onChangeSection: (section: IMenuSection) => void;
}

const Menu: React.FC<MenuProps> = ({
  className,
  children,
  sections,
  onChangeSection = () => {},
  ...props
}) => {
  const allSections = useMemo(
    () => listAllSections(sections || []),
    [sections]
  );

  const defaultIndex = useMemo(
    () =>
      allSections
        .map((section, index) => (section.retracted ? null : index))
        .filter((f) => f !== null),
    [allSections]
  );

  return (
    <Accordion allowMultiple defaultIndex={defaultIndex}>
      {allSections.map((section) => (
        <MenuSection key={`${section._id}`} menuSection={section} />
      ))}
    </Accordion>
  );
};

export default Menu;
