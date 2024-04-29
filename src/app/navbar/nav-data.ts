import {INavbarData} from "./helper";

export const navbarData: INavbarData[] = [
    {
        routerLink : '/sasp/adduser',
        icon: 'group',
        Label: 'Users',
        items: [
            {
                routerLink: '/sasp/userlist',
                Label: 'Users List'
            },
            {
                routerLink: '/sasp/adduser',
                Label: 'Add User'
            }
        ]
    },
    {
        routerLink : '/sasp/adduser',
        icon: 'work',
        Label: 'Organizations',
        items: [
            {
                routerLink: 'sasp/orglist',
                Label: 'Organizations List'
            },
            {
                routerLink: 'sasp/addorg',
                Label: 'Add Organization'
            }
        ]
    },
    {
        routerLink : '/sasp/adduser',
        icon: 'dashboard',
        Label: 'Widgets',
        items: [
            {
                routerLink: 'sasp/widgets',
                Label: 'Dashboard Widget'
            },
            {
                routerLink: 'sasp/widgets_config',
                Label: 'Widgets Configuration'
            }
        ]
    },
    {
        routerLink : '/sasp/adduser',
        icon: 'note_add',
        Label: 'Repository Module',
        
    },
    {
        routerLink : '/sasp/adduser',
        icon: 'business',
        Label: 'Business Directory',
        
    },
    {
        routerLink : '/sasp/adduser',
        icon: 'settings',
        Label: 'Settings',
        
    }

]