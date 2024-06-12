export interface SlidebarItems {
  lable?: string;
  route?: string;
  icon?: string;
  isActive?: string;
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
  role: 'admin' | 'user'; // Added role property
}

export interface Post {
  userId: string;
  body: string;
  createdAt: any;
  user?: User;
  postId?: string;
  likes?: Array<string>;
  commentCount?: number;
  documentUrls?: string[];
  tags?: string[];
  type?: string; // Added type property for admin-created types
}

export interface Comment {
  id?: string;
  body: string;
  postId: string;
  createdAt?: any;
  userId: string;
  user?: User;
  documentUrls?: string[];
}

export interface Notification {
  id: string;
  message: string;
  userIdTo: string;
  userIdFrom: string;
  target: string;
  type: string;
  seen: boolean;
  createdAt?: any;
}
export interface Report{
      id: string, 
      message: string,
      userIdFrom: string,
      target: string,
      type: string,
      seen: boolean,
      createdAt?: any,
}