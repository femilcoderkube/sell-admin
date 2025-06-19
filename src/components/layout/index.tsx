import { FC } from "react";
import Header from "../layout/Header";
import { Aside } from "../layout/Aside";
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Aside />
        <div className="Dashborad pt-[6.2rem] pl-[calc(15rem_+_1rem)] pr-[1.5rem]">
          {children}
        </div>
      </main>
    </div>
  );
};
