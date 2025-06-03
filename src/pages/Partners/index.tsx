import { FC } from "react";
import { Layout, Partner } from "../../components";
import { PartnersTable } from "../../components/Partners/PartnersTable";

export const Partners: FC = () => {
  return (
    <Layout>      
        <Partner />
    </Layout>
  );
};
