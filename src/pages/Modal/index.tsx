import { FC } from "react";

import { Layout } from "../../components/layout";
import { NotificationPopup } from "../../components/NotificationPopup";

export const Modal: FC = ({ title }: any) => {
  return (
    <Layout>
      <NotificationPopup title={title} />
    </Layout>
  );
};
