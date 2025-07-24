import { FC } from "react";
import { Layout } from "../../components/layout";
import { Stages } from "../../components/Stage";

export const Stage: FC = ({ title }: any) => {
  return (
    <Layout>
      <Stages title={title} />
    </Layout>
  );
};
