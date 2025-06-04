import { FC } from "react";
import { LeagueManagement } from "../../components/League/LeagueManagement";

import { Layout } from "../../components/layout";

export const Dashboard: FC = () => {
  return (
    <Layout>
        <LeagueManagement />
    </Layout>
  );
};
