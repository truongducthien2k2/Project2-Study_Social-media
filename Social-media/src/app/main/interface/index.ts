export interface SlidebarItems{
    lable?: string;
    route?: string;
    icon?: string;
    isActive?: string
}

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    username?: string;
    createdAt: any;
    bio?: string;
}