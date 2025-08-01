import { FC } from "react";

import { User } from "../../components/User";
import { Layout } from "../../components/layout";
import { Members } from "../../components/ Members";

export const Participant: FC = ({ title }: any) => {
  return (
    <Layout>
      <Members title={title} />
    </Layout>
  );
};
