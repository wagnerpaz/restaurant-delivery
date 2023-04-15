import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import classNames from "classnames";

export default function Example({
  className,
  children,
  value,
  label,
  onChange,
  extractLabel = (value: any) => value,
}) {
  return (
    <Menu as="div" className={classNames("relative inline-block", className)}>
      {label && (
        <label className="inline-block ml-2 mb-1 font-bold">{label}</label>
      )}
      <Menu.Button className="inline-flex w-full gap-x-1.5 rounded-md bg-main-200 px-3 py-2 text-sm text-contrast-high shadow-sm ring-1 ring-inset ring-main-400 hover:bg-main-300">
        <span className="flex-1 text-start">{extractLabel(value)}</span>
        <FaChevronDown
          className="-mr-1 h-5 w-5 text-main-400"
          aria-hidden="true"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-main-200 shadow-lg ring-1 ring-main-400 focus:outline-none">
          <div className="py-1 overflow-auto h-52">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
