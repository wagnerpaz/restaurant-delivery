import Select from "react-select";

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    paddingTop: 0,
    marginTop: -7,
    backgroundColor: "transparent",
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 99999,
  }),
};

const ReactSelect = (props) => (
  <Select
    styles={customStyles}
    menuPortalTarget={document.body}
    menuPlacement="auto"
    {...props}
  />
);

export default ReactSelect;
