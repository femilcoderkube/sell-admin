import { FC } from "react";
import { Layout, Device } from "../../components";

export const Devices: FC = () => {
  return (
    <Layout>
      {/* <div className="Dashborad pt-[5.5rem] pl-[calc(12.5rem_+_1.4rem)] pr-[1.5rem]"> */}
        <Device />
      {/* </div> */}
    </Layout>
  );
};
