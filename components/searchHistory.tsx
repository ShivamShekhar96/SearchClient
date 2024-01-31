"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { getSession } from "next-auth/react";
import { useDebounce } from "use-debounce";

type SearchObject = {
  url: string;
};

const SearchHistory = () => {
  const [searchData, setSearchData] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [sessionToken, setSessionToken] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [inputText, setInputText] = useState<string>("");
  const [query] = useDebounce(inputText, 1000);

  useEffect(() => {
    fetchSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    (async () => {
      const session: any = await getSession();
      const token = session["accessToken"];
      setSessionToken(token);
    })();
  }, []);

  const fetchSearch = async () => {
    if (sessionToken && inputText) {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/search/?query=${inputText}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-key": sessionToken,
          },
        }
      );
      const reqData = response.data["data"].map((t: SearchObject) => {
        return { label: t.url, value: t.url };
      });
      setSearchData(reqData);
      setLoading(false);
    }
  };
  // const fetchSearchData = async () => {
  //   if (sessionToken) {
  //     setLoading(true)
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/searches`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-auth-key": sessionToken,
  //         },
  //       }
  //     );
  //     const reqData = response.data["data"].map((t: SearchObject) => {
  //       return { label: t.url, value: t.url };
  //     });
  //     setSearchData(reqData);
  //     setLoading(false)
  //   }
  // };

  // useEffect(() => {
  //   fetchSearchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sessionToken]);

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
        // noOptionsMessage={async () => {
        //   setLoading(true)
        //   await fetchSearchData();
        //   setLoading(false)
        //   return "";
        // }}
        onInputChange={(e) => {
          setInputText(e);
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
