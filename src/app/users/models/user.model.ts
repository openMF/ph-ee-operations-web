export interface User {
    actionType: string;
    createdAt: string;
    email: string;
    firstName: string;
    userid: string | null;
    lastName: string;
    mobileNo: string;
    roles: string[];
    status: string;
    fspId: string | null;
    govtId: string | null;
    updatedAt: string;
    userType: string;
    username: string;
  }
  
  export interface UserType {
    name: string;
    FSPId?: string[];
    GovtId?: string[];
  }
  
  export interface Role {
    id: number;
    name: string;
  }