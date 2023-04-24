import { ComponentProps } from "react";
import classNames from "classnames";
import { Button } from "@chakra-ui/react";

import { IMenuSection, IStore } from "/models/Store";
import { useRouter } from "next/router";

interface MenuSectionsAccordionProps extends ComponentProps<"nav"> {
  store: IStore;
  onCloseDrawer: () => void;
}

const MenuSectionsTree: React.FC<MenuSectionsAccordionProps> = ({
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
      <div className="w-full" key={section.name}>
        {section.items.length > 0 && (
          <Button
            className={classNames(
              "!rounded-none !justify-start border-b-[1px] w-full",
              {
                "w-[calc(100%-2rem)] !ml-8": path.length === 1,
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
      </div>
    ));
  };

  return (
    <nav className="flex flex-col bg-hero">
      {renderMenuSections(store?.menu?.sections)}
    </nav>
  );
};

export default MenuSectionsTree;
