"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { getSession } from "next-auth/react";

type SearchObject = {
  url: string;
};

const API_BASE_URL = "http://localhost:4000";

const SearchHistory = () => {
  const [searchData, setSearchData] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const session: any = await getSession();
      setSession(session);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (session) {
        const token = session["accessToken"];
        const response = await axios.get(`${API_BASE_URL}/api/v1/searches`, {
          headers: { "Content-Type": "application/json", "x-auth-key": token },
        });
        const reqData = response.data["data"].map((t: SearchObject) => {
          return { label: t.url, value: t.url };
        });
        setSearchData(reqData);
      }
    })();
  }, [session]);

  const onSelect = (url: string | undefined) => {
    setTimeout(() => {
      if (url) window.open(url, "_blank");
    }, 500);
  };
  return searchData.length > 0 ? (
    <div
      style={{
        width: "30%",
        height: "20%",
        display: "flex",
        flexDirection: "column",
        marginTop: 20,
      }}
    >
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
    </div>
  ) : (
    ""
  );
};

export default SearchHistory;
