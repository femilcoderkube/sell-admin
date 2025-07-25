import { FC } from "react";
import { Layout } from "../../components/layout";

import { StageLists } from "../../components/StageList";

export const StageList: FC = ({ title }: any) => {
  return (
    <Layout>
      <StageLists title={title} />
    </Layout>
  );
};
