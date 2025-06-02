import { FC } from "react";
import { Layout, User } from "../../components";

export const Users: FC = () => {
  return (
    <Layout>
      <div className="Dashborad pt-[5.5rem] pl-[calc(12.5rem_+_1.4rem)] pr-[1.5rem]">
        <User />
      </div>
    </Layout>
  );
};
