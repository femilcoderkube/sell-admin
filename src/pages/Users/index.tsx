import { FC } from "react";

import { User } from "../../components/User";
import { Layout } from "../../components/layout";

export const Users: FC = ({ title }: any) => {
  return (
    <Layout>
      <User title={title} />
    </Layout>
  );
};
