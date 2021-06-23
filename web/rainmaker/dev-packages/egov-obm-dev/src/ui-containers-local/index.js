import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const TestContainer = Loadable({
  loader: () => import("./TestContainer"),
  loading: () => <Loading />
});

const ListCard = Loadable({
  loader: () => import("./ListCard"),
  loading: () => <Loading />
});

const ListCard2 = Loadable({
  loader: () => import("./ListCard2"),
  loading: () => <Loading />
});

export {
  TestContainer,
  ListCard,
  ListCard2
};
