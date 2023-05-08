import classNames from "classnames";

const Button = ({ className, children, ...props }) => {
  return (
    <button className={classNames("p-2", className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
