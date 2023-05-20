import classNames from "classnames";

const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={classNames(
        "ps-4 pe-4 py-2 -mt-[7px] bg-[transparent] rounded-md w-full outline-none border-none",
        className
      )}
      {...props}
    />
  );
};

export default Textarea;
