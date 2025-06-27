import { FC } from "react";
import { Layout } from "../../components/layout";
import { Admins } from "../../components/Admins";

export const Admin: FC = ({ title }: any) => {
  return (
    <Layout>
      <Admins title={title} />
    </Layout>
  );
};
