import { FC } from "react";
import { Layout } from "../../components/layout";
import { League } from "../../components/League";

export const NafesLeague: FC = ({ title }: any) => {
  return (
    <Layout>
      <League title={title} />
    </Layout>
  );
};
