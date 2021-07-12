import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
  loading: () => <Loading />
});

const DocumentList = Loadable({
  loader: () => import("./DocumentList"),
  loading: () => <Loading />
});

const UploadSingleFile = Loadable({
  loader: () => import("./UploadSingleFile"),
  loading: () => <Loading />
});

const Footer = Loadable({
  loader: () => import("./Footer"),
  loading: () => <Loading />
});

const ActionDialog = Loadable({
  loader: () => import("./ActionDialog"),
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

const TaskStatusComponents = Loadable({
  loader: () => import("./TaskStatusComponents"),
  loading: () => <Loading />
});

export {
  TestMolecules,
  DocumentList,
  UploadSingleFile,
  Footer,
  ActionDialog,
  TaskDialog,
  Stepper,
  TaskStatusComponents
};
