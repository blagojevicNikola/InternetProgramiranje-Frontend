export interface UserInfo
{
    name:string;
    username:string;
    surname:string;
    userPhoneNumber:string|null;
    userLocationId:number;
    userLocationName?:string|null;
}