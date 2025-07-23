import { FC } from "react";
import { Layout } from "../../components/layout";
import { Tournamentes } from "../../components/Tournament";

export const Tournament: FC = ({ title }: any) => {
  return (
    <Layout>
      <Tournamentes title={title} />
    </Layout>
  );
};
