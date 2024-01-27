"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectSearch from "react-select-search";
import { getObjectClassNames } from "@/design/utils";
import Select from "react-select";

type SearchObject = {
  url: string;
};
const classes = getObjectClassNames({
  container: {
    display: "flex",
    width: "100px",
    height: "50px",
  },
});
const SearchHistory = () => {
  const [searchData, setSearchData] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [selectedSearch, setSelectedSearch] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    (async () => {
      const token = "";
      const response = await axios.get(
        "http://localhost:4000/api/v1/searches?user_id=4",
        {
          headers: { "Content-Type": "application/json", "X-Auth-Key": token },
        }
      );
      const reqData = response.data["data"].map((t: SearchObject) => {
        return { label: t.url, value: t.url };
      });
      console.log(reqData);
      setSearchData(reqData);
    })();
  }, []);
  useEffect(() => {
    if (selectedSearch) window.open(selectedSearch, "_blank");
  }, [selectedSearch]);
  const onSelect = (url: string | undefined) => {
    setTimeout(() => {
      if (url) setSelectedSearch(url);
    }, 500);
  };
  return (
    <div
      style={{
        width: 500,
        height: 40,
        display: "flex",
        flexDirection: "column",
        marginTop: 100,
      }}
    >
      {searchData.length > 0 && (
        <Select
          theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              primary25: "hotpink",
              primary: "black",
            },
          })}
          styles={{
            option: (base, state) => ({
              ...base,
              color: "black",
            }),
          }}
          options={searchData}
          onChange={(e) => onSelect(e?.value)}
          isSearchable={true}
          isClearable={true}
          name="Select a search"
        />
      )}
    </div>
  );
};

export default SearchHistory;
