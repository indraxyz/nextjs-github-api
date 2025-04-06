"use client";

import { useEffect, useState } from "react";
import {
  Input,
  addToast,
  Card,
  CardHeader,
  CardFooter,
  Avatar,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Listbox,
  ListboxItem,
  Skeleton,
} from "@heroui/react";
import {
  RiSearchLine,
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

type GithubUser = {
  html_url: string; //ghithub page
  avatar_url: string;
  login: string; //username
  repos_url: string;
  url: string; //user profile
};

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  topics: string[];
  updated_at: string;
};

const _toast = (
  title: string,
  color: colorToast,
  promise: Promise<unknown> | undefined
) => {
  addToast({
    title,
    color,
    timeout: 2000,
    promise: promise,
  });
};

const UsersSkeleton = () => (
  <div className="max-w-[300px] w-full flex items-center gap-3">
    <div>
      <Skeleton className="flex rounded-full w-12 h-12" />
    </div>
    <div className="w-full flex flex-col gap-2">
      <Skeleton className="h-3 w-3/5 rounded-lg" />
      <Skeleton className="h-3 w-4/5 rounded-lg" />
    </div>
  </div>
);

const GithubPage = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState<GithubUser>({
    html_url: "",
    avatar_url: "",
    login: "",
    repos_url: "",
    url: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [repositories, setRepositories] = useState([]);
  const [loadUsers, setLoadUsers] = useState(false);

  useEffect(() => {
    // _searchUsers("enter");
    // _searchUserRepositories();
    // _detailUserProfile();
  }, []);

  const _searchUsers = (k: string) => {
    if (k.toLowerCase() == "enter" && search.length > 2) {
      setLoadUsers(true);
      _toast("Searching users", "primary", apiGetUsers());
    } else {
      if (k.toLowerCase() == "enter") {
        _toast("invalid, minimal 3 character", "warning", undefined);
      }
    }
  };

  const apiGetUsers = async () =>
    await fetch(`https://api.github.com/search/users?q=${search}&per_page=5`)
      .then((res) => {
        // console.log(res);
        if (res.ok) {
          return res.json();
        }
        throw new Error("Something went wrong");
      })
      .then((data) => {
        // USERS default sort ascending
        console.log(data.items);
        setUsers(data.items);
        setLoadUsers(false);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });

  const _searchUserRepositories = async (url: string) => {
    _toast("Searching repositories", "primary", apiGetRepos(url));
  };

  const apiGetRepos = async (url: string) =>
    await fetch(`${url}?sort=updated`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Something went wrong");
      })
      .then((data) => {
        // REPOSITORIES sorting latest updated
        console.log(data);
        setRepositories(data);
        onOpen(); //open modal
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });

  const _modalUserRepo = (user: GithubUser) => {
    setUser(user);
    _searchUserRepositories(user.repos_url);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mt-8">
        {loadUsers ? (
          <UsersSkeleton />
        ) : users.length == 0 ? (
          "Empty Users"
        ) : (
          users.map((user: GithubUser, i) => (
            <div key={i} className="w-full">
              <Card className="transition-shadow duration-300 shadow-md hover:shadow-lg hover:shadow-gray-300">
                <CardHeader>
                  <Avatar src={user.avatar_url} />
                  <span className="text-lg ml-4">{user.login}</span>
                </CardHeader>
                <CardFooter className="space-x-2">
                  <Link href={user.html_url} target="_blank">
                    <RiGithubFill className="text-2xl" />
                  </Link>
                  <Link
                    onPress={() => _modalUserRepo(user)}
                    className="cursor-pointer"
                  >
                    <RiGitRepositoryLine className="text-xl" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* repositories: modal, overflow inside > repo list (listbox) */}
      {/* repo: id, name, html_url, description, topics, updated_at */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        isDismissable={false}
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {user.login}&apos;s Repositories
              </ModalHeader>
              <ModalBody>
                <Listbox aria-label="..." variant="flat" items={repositories}>
                  {(repo: Repo) => (
                    <ListboxItem
                      key={repo.id}
                      description={repo.description}
                      href={repo.html_url}
                      target="_blank"
                    >
                      {repo.name}
                    </ListboxItem>
                  )}
                </Listbox>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default GithubPage;

// ♻️
// components
