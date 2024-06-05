"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import Card from "@/components/card/Card";
import styles from "./search.module.css";
import Search from "@/components/search/Search";
const getData = async (url) => {

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
 
};

const Page =() => {

  const query=useSearchParams();

  const key=query?query.get("key"):null;

  const {data,isLoading}=useSWR(`https://blogify-nine-phi.vercel.app/api/search?key=${key}`,getData)
   
 if(data?.length)
  {
    return  <div>
     <Search/>
    <div className={styles.posts}>
    {data?.map((item) => (
      <Card item={item} key={item._id} />
    ))}
  </div></div>;

}
else{

    return (<div> <Search/>
    <div>nothing found</div></div>)
}

};

export default Page;
