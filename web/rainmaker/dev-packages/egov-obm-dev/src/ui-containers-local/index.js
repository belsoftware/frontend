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

const DocumentListContainer = Loadable({
  loader: () => import("./DocumentListContainer"),
  loading: () => <Loading />
});

const AutosuggestContainer = Loadable({
  loader: () => import("./AutosuggestContainer"),
  loading: () => <Loading />
});

const HallHeaderCard = Loadable({
  loader: () => import("./HallHeaderCard"),
  loading: () => <Loading />
});

const DownloadFileContainer = Loadable({
  loader: () => import("./DownloadFileContainer"),
  loading: () => <Loading />
});

const WorkFlowContainer = Loadable({
  loader: () => import("./WorkFlowContainer"),
  loading: () => <Loading />
});

const TaskStatusContainer = Loadable({
  loader: () => import("./TaskStatusContainer"),
  loading: () => <Loading />
});

const TaskStatusComponents = Loadable({
  loader: () => import("./TaskStatusComponents"),
  loading: () => <Loading />
});

const TaskDialog = Loadable({
  loader: () => import("./TaskDialog"),
  loading: () => <Loading />
});

const Stepper = Loadable({
  loader: () => import("./Stepper"),
  loading: () => <Loading />
});

const TableData = Loadable({
  loader: () => import("./TableData"),
  loading: () => <Loading />
});

const Table = Loadable({
  loader: () => import("./Table"),
  loading: () => <Loading />
});

const Filter = Loadable({
  loader: () => import("./Filter"),
  loading: () => <Loading />
});

export {
  TestContainer,
  ListCard,
  ListCard2,
  DocumentListContainer,
  AutosuggestContainer,
  HallHeaderCard,
  DownloadFileContainer,
  WorkFlowContainer,
  TaskStatusContainer,
  Stepper,
  TaskDialog,
  TaskStatusComponents,
  TableData,
  Table,
  Filter
};
