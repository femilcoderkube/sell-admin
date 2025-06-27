import { FC } from "react";
import { Layout } from "../../components/layout";
import { Device } from "../../components/Device";

export const Devices: FC = ({ title }: any) => {
  return (
    <Layout>
      <Device title={title} />
    </Layout>
  );
};
