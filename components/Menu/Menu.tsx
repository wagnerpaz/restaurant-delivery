import { ComponentProps, useMemo, memo, useContext, useState } from "react";
import { Accordion, AccordionItem } from "react-accessible-accordion";
import isEqual from "lodash.isequal";
import { useRouter } from "next/router";

import MenuSection from "./MenuSection";
import { IMenuSection } from "/models/types/MenuSection";
import { StoreContext } from "../Store";
import MenuSectionHeader from "./MenuSectionHeader";
import useDeleteStoreMenuSection from "/hooks/useDeleteStoreMenuSection";
import usePutStoreMenuSectionSections from "/hooks/usePutStoreMenuSectionSections";
import AddMenuSectionModal from "/modals/AddMenuSectionModal";
import { useSession } from "next-auth/react";
import { IUser } from "/models/types/User";
import { replaceAt } from "/lib/immutable";
import useLocalState from "/hooks/useLocalState";
import useGoBackToRoot from "/hooks/useGoBackToRoot";

interface MenuProps extends ComponentProps<"section"> {
  sections: IMenuSection[];
  type: "product" | "ingredient";
  onChangeSection: (section: IMenuSection) => void;
}

const Menu: React.FC<MenuProps> = ({
  className,
  children,
  type,
  onChangeSection = () => {},
  ...props
}) => {
  const { store, menuItemsRenderCount } = useContext(StoreContext);

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const [localSections, setLocalSections] = useLocalState(store.menu.sections);

  const defaultIndex = useMemo(
    () => localSections.map((section) => section._id),
    [localSections]
  );

  const router = useRouter();

  const putMenuSection = usePutStoreMenuSectionSections();

  const editMenuSectionMode = router.query.editMenuSection;
  const editMenuSectionId = router.query.editMenuSectionId;

  const goBackToRoot = useGoBackToRoot();

  const handleAddSection = () => {
    router.push(`/store/${store.slug}?editMenuSection=ADD`, undefined, {
      shallow: true,
    });
  };

  const handleEditSection = (section: IMenuSection) => {
    router.push(
      `/store/${store.slug}?editMenuSection=EDIT&editMenuSectionId=${section._id}`,
      undefined,
      {
        shallow: true,
      }
    );
  };

  if (menuItemsRenderCount) menuItemsRenderCount.current = 0;

  return (
    <>
      <Accordion allowMultipleExpanded preExpanded={defaultIndex}>
        {localSections.map((section) => (
          <MenuSection
            key={`${section._id}`}
            menuSection={section}
            type={type}
            onEditSectionClick={() => handleEditSection(section)}
          />
        ))}
        {/* {menuItemsRenderCount?.current === 0 && !admin && (
        <span className="text-xl w-full h-[calc(100vh-var(--footer-height)-var(--header-height))] flex flex-col items-center justify-center gap-4">
          <MdNoFood size={42} />
          Ops... nenhum produto encontrado!
        </span>
      )} */}
        {admin && (
          <AccordionItem>
            <MenuSectionHeader isNew onAddSectionClick={handleAddSection} />
          </AccordionItem>
        )}
      </Accordion>
      {editMenuSectionMode && (
        <AddMenuSectionModal
          portalTarget={() => null}
          mode={editMenuSectionMode}
          menuSection={localSections.find((f) => f._id === editMenuSectionId)}
          open={editMenuSectionMode}
          onOpenChange={(value) => goBackToRoot(value)}
          onSave={async (value) => {
            try {
              const createdOrUpdated = await putMenuSection(store, value);
              if (!value._id) {
                setLocalSections((localSections) => [
                  ...localSections,
                  createdOrUpdated,
                ]);
              } else {
                setLocalSections((localSections) =>
                  replaceAt(
                    localSections,
                    localSections.findIndex((f) => f._id === value._id),
                    createdOrUpdated
                  )
                );
              }
              goBackToRoot(false);
            } catch (err: any) {
              // toast(defaultToastError(err));
            }
          }}
          onCancel={() => {
            goBackToRoot(false);
          }}
          onDelete={async () => {
            const confirmed = confirm(
              `Você tem certeza que deseja remover a seção "${editNewSectionObject.name}" com todos os seus items?`
            );
          }}
        />
      )}
    </>
  );
};

export default memo(Menu, (prev, next) =>
  isEqual(prev.sections, next.sections)
);
