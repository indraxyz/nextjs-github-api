"use client";

import { useEffect, useState } from "react";
import { Input, addToast, Card, CardHeader, CardFooter } from "@heroui/react";
import {
  RiSearchLine,
  RiUser6Fill,
  RiGithubFill,
  RiGitRepositoryLine,
} from "react-icons/ri";

type colorToast =
  | "secondary"
  | "default"
  | "foreground"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | undefined;

const GithubPage = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // _searchUsers("enter");
    _searchUserRepositories();
    _detailUserProfile();
  }, []);

  const _searchUsers = async (k: string) => {
    if (k.toLowerCase() == "enter" && search.length > 2) {
      await fetch(`https://api.github.com/search/users?q=${search}&per_page=5`)
        .then((res) => res.json())
        .then((data) => {
          // USERS default sort ascending
          setUsers(data.items);
          console.log(data.items);
          _toast("Users Search", "Search Success", "secondary");
        });
    } else {
      // notif
      if (k.toLowerCase() == "enter") {
        _toast("invalid", "minimal 3 character", "warning");
      }
    }
  };

  const _toast = (title: string, description: string, color: colorToast) => {
    addToast({
      title,
      description,
      color,
      timeout: 2000,
    });
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
      <div className="w-full sm:w-1/4">
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
      <div className="flex flex-col max-sm:space-y-2 sm:flex-row sm:space-x-2 mt-6">
        <Card className="w-full sm:w-1/3">
          <CardHeader>
            <RiUser6Fill className="text-4xl mr-2" />
            Username
          </CardHeader>
          <CardFooter className="space-x-2">
            <RiGithubFill className="text-xl" />
            <RiGitRepositoryLine className="text-xl" />
          </CardFooter>
          {/* location, blog, bio */}
        </Card>
        <Card className="w-full sm:w-1/3">
          <CardHeader>
            <RiUser6Fill className="text-4xl mr-2" />
            Username
          </CardHeader>
          <CardFooter className="space-x-2">
            <RiGithubFill className="text-xl" />
            <RiGitRepositoryLine className="text-xl" />
          </CardFooter>
        </Card>
        <Card className="w-full sm:w-1/3">
          <CardHeader>
            <RiUser6Fill className="text-4xl mr-2" />
            Username
          </CardHeader>
          <CardFooter className="space-x-2">
            <RiGithubFill className="text-xl" />
            <RiGitRepositoryLine className="text-xl" />
          </CardFooter>
        </Card>
      </div>

      {/* repositories: modal > repo list (listbox) */}
    </div>
  );
};
export default GithubPage;
