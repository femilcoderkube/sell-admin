import React from "react";

import { FC } from "react";
import { Layout } from "../../components/layout";
import ChatDetails from "../../components/League/ChatDetails";

export const ChatDetail: FC = ({ title }: any) => {
  return (
    <Layout>
      <ChatDetails />
    </Layout>
  );
};
