import { FC } from "react";
import { Layout } from "../../components/layout";

import { StageLists } from "../../components/StageList";
import { Seeds } from "../../components/Seeds";

export const Seed: FC = ({ title }: any) => {
  return (
    <Layout>
      <Seeds title={title} />
    </Layout>
  );
};
