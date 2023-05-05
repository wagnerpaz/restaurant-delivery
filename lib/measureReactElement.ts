import { useEffect, useMemo, useState } from "react";
import { render, unmountComponentAtNode } from "react-dom";

function useMeasureReactElement(elementsGrouped: any) {
  return useMemo(() => {
    let groupResult = {};
    Object.keys(elementsGrouped).forEach((groupKey) => {
      const group = elementsGrouped[groupKey];

      const groupSizes = [];
      group.forEach((element) => {
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.visibility = "hidden";
        document.body.appendChild(container);

        render(element.render, container, () => {
          const rect = container.getBoundingClientRect();
          groupSizes.push({ width: rect.width, height: rect.height });

          unmountComponentAtNode(container);
          document.body.removeChild(container);
        });
      });
      groupResult = { ...groupResult, [groupKey]: groupSizes };
    });

    return groupResult;
  }, [elementsGrouped]);
}

export default useMeasureReactElement;
