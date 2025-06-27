import { FC } from "react";
import { Layout } from "../../components/layout";
import UserDetails from "../../components/User/UserDetails";

export const UserDetail: FC = ({ title }: any) => {
  return (
    <Layout>
      <UserDetails />
    </Layout>
  );
};
