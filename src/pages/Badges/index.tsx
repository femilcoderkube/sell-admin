import { FC } from "react";
import { Layout } from "../../components/layout";
import { Badge } from "../../components/Badge";

export const Badges: FC = ({ title }: any) => {
  return (
    <Layout>
      <Badge title={title} />
    </Layout>
  );
};
