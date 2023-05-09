import Select from "react-select";

const ReactSelect = (props) => (
  <Select
    // menuPosition="fixed"
    menuPlacement="auto"
    menuPortalTarget={document.body}
    classNames={{ menuPortal: () => "z-50" }}
    {...props}
  />
);

export default ReactSelect;
