import React, { useState, useEffect } from "react";
import {
  GridColumnMenuSort,
  GridColumnMenuFilter,
  GridColumnMenuItemGroup,
  GridColumnMenuItem,
  GridColumnMenuItemContent,
  GridColumnMenuCheckboxFilter,
} from "@progress/kendo-react-grid";
import products from "./products.json";

export default function GridColumnMenu(props) {
  const [columns, setColumns] = useState(props.columns);
  const [columnsExpanded, setColumnsExpanded] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);

  let [columnFilter, setColumnFilter] = useState([...columns]);

  const onToggleColumn = (id) => {
    columnFilter = columnFilter.map((column, indx) => {
      if (indx === id) {
        return {
          ...column,
          show: !column.show,
        };
      }
      return column;
    });
    return setColumnFilter(columnFilter);
  };

  const onReset = (event) => {
    event.preventDefault();
    const newColumns = props.columns.map((col) => ({
      ...col,
      show: true,
    }));
    setColumns(newColumns);
    props.onColumnsSubmit(newColumns);

    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };

  const onSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    props.onColumnsSubmit(columns);

    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };

  const onMenuItemClick = () => {
    const value = !columnsExpanded;
    setColumnsExpanded(value);
    setFilterExpanded(value ? false : filterExpanded);
  };

  const onFilterExpandChange = (value) => {
    setFilterExpanded(value);
    setColumnsExpanded(value ? false : columnsExpanded);
  };

  const saveFilteredCol = () => {
    filterColToggle(columnFilter);
  };

  const filterColToggle = (columns) => {
    if (props.onColumnsSubmit) {
      props.onColumnsSubmit(columns);
    }
    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };

  const resetColFilter = () => {
    columnFilter = columnFilter.map((eachCol) => ({
      ...eachCol,
      show: true,
    }));
    setColumnFilter(columnFilter);
    if (props.onColumnsSubmit) {
      props.onColumnsSubmit(columnFilter);
    }
    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };

  useEffect(() => {
    const customColumn = props?.customCol || {};
    const filters = props?.filter?.filters || [];
    const { gridClass, childClass } = props;

    if (filters?.length > 0) {
      const elements = document?.querySelectorAll(
        `${gridClass ? `.${gridClass}` : ""} ${
          childClass ? `> :not(${childClass}) >` : ""
        } .k-grid-header .k-cell-inner`
      );
      const filteredCol = filters?.map((data) => data?.filters?.[0]?.field);
      const availColTitle = filteredCol?.map((data) => {
        if (customColumn[data]) {
          return customColumn[data].title;
        }
        return columns?.find((rec) => rec?.field === data)?.title;
      });
      [...elements]?.forEach((node) => {
        if (availColTitle?.includes(node?.innerText)) {
          node
            ?.querySelector(".k-grid-column-menu.k-grid-filter")
            ?.classList?.add("bg-info");
        } else {
          node
            ?.querySelector(".k-grid-column-menu.k-grid-filter.bg-info")
            ?.classList?.remove("bg-info");
        }
      });
    } else {
      const filteredElement = document?.querySelector(
        `${gridClass ? `.${gridClass}` : ""} ${
          childClass ? `> :not(${childClass}) >` : ""
        } .k-grid-header .k-grid-column-menu.k-grid-filter.bg-info`
      );
      if (filteredElement) {
        filteredElement?.classList?.remove("bg-info");
      }
    }
  }, [columns, props]);

  const oneVisibleColumn = columns.filter((c) => c.show).length === 1;

  return (
    <div>
      {props.showColumnMenuSort && <GridColumnMenuSort {...props} />}
      {props.showColumnMenuFilter && (
        <GridColumnMenuFilter
          {...props}
          onExpandChange={onFilterExpandChange}
          expanded={filterExpanded}
        />
      )}
      {!props?.hideColumns && (
        <GridColumnMenuItemGroup>
          <GridColumnMenuItem
            title="Columns"
            iconClass="k-i-columns"
            onClick={onMenuItemClick}
          />
          <GridColumnMenuItemContent show={columnsExpanded}>
            <div className="k-column-list-wrapper">
              <form onSubmit={onSubmit} onReset={onReset}>
                <div className="k-column-list">
                  {columnFilter.map((column, idx) => (
                    <div key={idx} className="k-column-list-item">
                      {!column.defaultColumn ? (
                        <span>
                          <input
                            id={`column-visiblity-show-${idx}`}
                            className="k-checkbox k-checkbox-md k-rounded-md"
                            type="checkbox"
                            readOnly
                            disabled={column.show && oneVisibleColumn}
                            checked={column.show}
                            onChange={() => {
                              onToggleColumn(idx);
                            }}
                          />
                          <label
                            htmlFor={`column-visiblity-show-${idx}`}
                            className="k-checkbox-label"
                            style={{
                              userSelect: "none",
                            }}
                          >
                            {column.title}
                          </label>
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="k-actions k-hstack k-justify-content-stretch">
                  <button
                    type="reset"
                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                    onClick={resetColFilter}
                  >
                    Reset
                  </button>
                  <button
                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                    onClick={saveFilteredCol}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </GridColumnMenuItemContent>
        </GridColumnMenuItemGroup>
      )}
    </div>
  );
}

export const ColumnMenuCheckboxFilter = (props) => {
  return (
    <div>
      <GridColumnMenuCheckboxFilter
        {...props}
        data={products}
        expanded={true}
      />
    </div>
  );
};
