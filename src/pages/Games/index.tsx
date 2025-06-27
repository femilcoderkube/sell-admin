import { FC } from "react";
import { Layout } from "../../components/layout";
import { Game } from "../../components/Game";

export const Games: FC = ({ title }: any) => {
  return (
    <Layout>
      <Game title={title} />
    </Layout>
  );
};
