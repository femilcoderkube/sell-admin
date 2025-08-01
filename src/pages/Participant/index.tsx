import { FC } from "react";
import { Layout } from "../../components/layout";
import { Participants } from "../../components/Participants";

export const Participant: FC = ({ title }: any) => {
  return (
    <Layout>
      <Participants title={title} />
    </Layout>
  );
};
