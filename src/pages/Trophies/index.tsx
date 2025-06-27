import { FC } from "react";
import { Layout } from "../../components/layout";
import { Trophie } from "../../components/Trophies";

export const Trophies: FC = ({ title }: any) => {
  return (
    <Layout>
      <Trophie title={title} />
    </Layout>
  );
};
