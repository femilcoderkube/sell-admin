import React from "react";
import { Layout } from "../../components/layout";
import { Team } from "../../components/Team";

export const AllTeams: React.FC = ({ title }: any) => {
  return (
    <Layout>
      <Team title={title} />
    </Layout>
  );
};
