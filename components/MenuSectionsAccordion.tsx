import { ComponentProps } from "react";
import classNames from "classnames";
import { Button } from "@chakra-ui/react";

import { IMenuSection, IStore } from "/models/Store";
import { useRouter } from "next/router";

interface MenuSectionsAccordionProps extends ComponentProps<"nav"> {
  store: IStore;
  onCloseDrawer: () => void;
}

const MenuSectionsAccordion: React.FC<MenuSectionsAccordionProps> = ({
  store,
  onCloseDrawer,
  ...props
}) => {
  const router = useRouter();

  const renderMenuSections = (
    sections: IMenuSection[] = [],
    path: IMenuSection[] = [],
    indexPath: number[] = []
  ): React.ReactNode => {
    return sections.map((section, sectionIndex) => (
      <>
        {section.items.length > 0 && (
          <Button
            key={section.name}
            className={classNames(
              "!rounded-none !justify-start border-b-[1px]",
              {
                "!ml-8": path.length === 1,
              }
            )}
            onClick={() => {
              router.push(
                "#menu-section-" + [...indexPath, sectionIndex].join("-")
              );
              onCloseDrawer();
            }}
          >
            {section.name}
          </Button>
        )}
        {renderMenuSections(
          section.sections || [],
          [...path, section],
          [...indexPath, sectionIndex]
        )}
      </>
    ));
  };

  return (
    <nav className="flex flex-col bg-hero">
      {renderMenuSections(store?.menu?.sections)}
    </nav>
  );
};

export default MenuSectionsAccordion;
