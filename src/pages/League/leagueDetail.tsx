import { FC } from "react";
import { Layout } from "../../components/layout";
import LeagueDetails from "../../components/League/LeagueDetails";

export const LeagueDetail: FC = ({ title }: any) => {
  return (
    <Layout>
      <LeagueDetails />
    </Layout>
  );
};
