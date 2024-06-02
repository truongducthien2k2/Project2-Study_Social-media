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

export interface Post {
    userId: string;
    body: string; 
    createdAt: any;
    user?: User;
    postId?: string;
    likes?: Array<string>;
    commentCount?: number; 
     documentUrl?: string;
}8
export interface Document{
    
}
export interface Comment {
    id?: string;
    body: string;
    postId: string;
    createdAt?: any;
    userId: string;
    user?: User;
}