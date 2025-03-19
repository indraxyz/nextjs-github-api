"use client";

import { useEffect, useState } from "react";
import { Input, Button, addToast } from "@heroui/react";
import { RiSearchLine } from "react-icons/ri";

const GithubPage = () => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    _searchUsers("enter");
    _searchUserRepositories();
    _detailUserProfile();
  }, []);

  const _searchUsers = async (k: string) => {
    if (k.toLowerCase() == "enter" && search.length > 2) {
      await fetch(`https://api.github.com/search/users?q=${search}&per_page=5`)
        .then((res) => res.json())
        .then((data) => {
          // USERS default sort ascending
          console.log(data.items);
          addToast({
            title: "Search success ",
            description: "desc ...",
            color: "secondary",
          });
        });
    } else {
      // notif
      if (k.toLowerCase() == "enter") {
        addToast({
          title: "Input tidak sesuai",
          description: "rules dari sini ...",
          color: "warning",
        });
      }
    }
  };

  const _searchUserRepositories = async () => {
    await fetch("https://api.github.com/users/indraxyz/repos?sort=updated")
      .then((res) => res.json())
      .then((data) => {
        // REPOSITORIES sorting latest updated
        console.log(data);
      });
  };

  const _detailUserProfile = async () => {
    await fetch("https://api.github.com/users/indraxyz")
      .then((res) => res.json())
      .then((data) => {
        // user public information
        console.log(data);
      });
  };

  return (
    <div className="p-4">
      {/* search form by username*/}
      <div className="w-1/4">
        <Input
          label="Search Github Users"
          labelPlacement="outside"
          placeholder="username"
          startContent={
            <RiSearchLine className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="search"
          onKeyDown={(e) => _searchUsers(e.key)}
          onChange={(v) => setSearch(v.target.value)}
          value={search}
        />
      </div>
      {/* users (first 5 users): card list*/}
      {/* repositories: modal > repo list (listbox) */}
    </div>
  );
};
export default GithubPage;
