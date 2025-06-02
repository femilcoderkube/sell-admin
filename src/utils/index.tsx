export interface RoutesProps {
    label: string;
    icon: React.ReactNode | any;
    path: string;
    dark_svg: string;
    white_svg: string;
    component: React.ReactNode;
    auth: boolean;
    isShow: boolean;
    submenu?: SubMenuProps[];
}

export interface SubMenuProps {
    label: string;
    path: string;
    component: React.ReactNode;
    auth: boolean;
    isShow: boolean;
}