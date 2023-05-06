import { ComponentProps, useMemo, memo } from "react";
import { Accordion } from "@chakra-ui/react";
import isEqual from "lodash.isequal";

import { listAllSections } from "/lib/menuSectionUtils";
import MenuSection from "./MenuSection";
import { IMenuSection } from "/models/types/Store";

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

export default memo(Menu, (prev, next) =>
  isEqual(prev.sections, next.sections)
);
