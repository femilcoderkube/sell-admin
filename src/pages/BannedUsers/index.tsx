import { FC } from "react";
import { Layout } from "../../components/layout";
import { BannedUser } from "../../components/BannedUser";

export const BannedUsers: FC = ({ title }: any) => {
  return (
    <Layout>
      <BannedUser title={title} />
    </Layout>
  );
};
