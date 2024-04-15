export interface INavbarData {
    routerLink: string;
    icon?: string;
    Label: string;
    expanded?: boolean;
    items?: INavbarData[];
}