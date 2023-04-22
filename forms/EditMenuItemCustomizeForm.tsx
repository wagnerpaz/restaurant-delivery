import Fieldset from "/components/Fieldset";

interface EditMenuItemCompositionFormProps
  extends ComponentProps<typeof Fieldset> {
  ingredients: IIngredient[];
  composition?: IMenuItemCompositionItem[];
  onCompositionChange: (newComposition: IMenuItemCompositionItem[]) => void;
}
