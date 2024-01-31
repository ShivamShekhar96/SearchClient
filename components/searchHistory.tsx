"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { getSession } from "next-auth/react";

type SearchObject = {
  url: string;
};

const SearchHistory = () => {
  const [searchData, setSearchData] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [session, setSession] = useState<any>(null);

  const [loading,setLoading] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      const session: any = await getSession();
      setSession(session);
    })();
  }, []);

  const fetchSearchData = async () => {
    if (session) {
      setLoading(true)
      const token = session["accessToken"];
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/searches`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-key": token,
          },
        }
      );
      const reqData = response.data["data"].map((t: SearchObject) => {
        return { label: t.url, value: t.url };
      });
      setSearchData(reqData);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchSearchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const onSelect = (url: string | undefined) => {
    setTimeout(() => {
      if (url) window.open(url, "_blank");
    }, 100);
  };
  return (
    <div
      style={{
        width: "50%",
        height: "20%",
        display: "flex",
        flexDirection: "column",
        marginTop: "5%",
      }}
    >
      <Select
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary25: "hotpink",
            primary: "grey",
          },
        })}
        styles={{
          option: (base, state) => ({
            ...base,
            color: "black",
          }),
        }}
        noOptionsMessage={async () => {
          setLoading(true)
          await fetchSearchData();
          setLoading(false)
          return "";
        }}
        options={searchData}
        isLoading={loading}
        onChange={(e) => onSelect(e?.value)}
        isSearchable={true}
        isClearable={true}
        name="Select a search"
      />
    </div>
  );
};

export default SearchHistory;
