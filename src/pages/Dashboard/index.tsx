import { FC } from "react";
import { LeagueManagement } from "../../components/League/LeagueManagement";
import { FormInput } from "../../components/ui/FormInput";
import { Layout, League, LeagueSteps, LeagueTable } from "../../components";

export const Dashboard: FC = () => {
  return (
    <Layout>
        {/* <LeagueTable/> */}
        {/* <LeagueSteps /> */}
        <LeagueManagement />
        {/* <FormInput /> */}

    </Layout>
  );
};
