import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestAtoms = Loadable({
  loader: () => import("./TestAtoms"),
  loading: () => <Loading />
});

const AutoSuggest = Loadable({
  loader: () => import("./AutoSuggest"),
  loading: () => <Loading />
});

const Checkbox = Loadable({
  loader: () => import("./Checkbox"),
  loading: () => <Loading />
});

const LocationOnIcon = Loadable({
  loader: () => import("./icons/LocationOnIcon"),
  loading: () => <Loading />
});
const MapOnIcon = Loadable({
  loader: () => import("./icons/MapOnIcon"),
  loading: () => <Loading />
});
const LocationLabelWithIcon = Loadable({
  loader: () => import("./LocationLabelWithIcon"),
  loading: () => <Loading />
});
const MapLabelWithIcon = Loadable({
  loader: () => import("./MapLabelWithIcon"),
  loading: () => <Loading />
});
const ApplicationNo = Loadable({
  loader: () => import("./ApplicationNo"),
  loading: () => <Loading />
});
export {
  LocationOnIcon,
  LocationLabelWithIcon,
  MapLabelWithIcon,
  MapOnIcon,
  TestAtoms,
  AutoSuggest,
  Checkbox,
  ApplicationNo
};
