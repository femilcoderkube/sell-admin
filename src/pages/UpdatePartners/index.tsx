import { FC } from "react";
import { Layout } from "../../components";
import { AddPartner } from "../../components/AddPartner/AddPartner";
import { UpdatePartner } from "../../components/UpdatePartner/UpdatePartner";

export const UpdatePartners: FC = () => {
  return (
    <Layout>
      <UpdatePartner />
    </Layout>
  );
};
