"use client";

import { useEffect, useState } from "react";

const GithubPage = () => {
  useEffect(() => {
    async function _fetchUsers() {
      await fetch("https://api.github.com/search/users?q=indrax&per_page=5")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });

      // set awaiting tasks
      // console.log("run2");
    }

    _fetchUsers();
    // console.log("run1");
  }, []);

  // _searchUsers

  // _searchUserRepositories

  return (
    <div>
      main page
      {/* search form by username*/}
      {/* users (first 5 users): card list*/}
      {/* repositories: modal > repo list (listbox) */}
    </div>
  );
};
export default GithubPage;
