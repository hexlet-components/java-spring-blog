/* eslint-disable @typescript-eslint/no-explicit-any */
import jsonServerProvider from "ra-data-json-server";
import {
  Admin,
  ListGuesser,
  Resource,
  ShowGuesser,
  fetchUtils,
} from "react-admin";

import authProvider from "./authProvider";
import { Dashboard } from "./components/Dashboard";
import { PostCreate, PostEdit, PostList, PostShow } from "./components/posts";

const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("token");
  options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = jsonServerProvider("/api", httpClient);

const App = () => (
  <Admin
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={dataProvider}
    // requireAuth
  >
    <Resource
      name="posts"
      create={PostCreate}
      list={PostList}
      show={PostShow}
      edit={PostEdit}
    />

    <Resource
      name="users"
      // create={CreateGuesser}
      list={ListGuesser}
      show={ShowGuesser}
      // edit={PostEdit}
    />
  </Admin>
);

export default App;
