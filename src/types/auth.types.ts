export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    token:string;
    user:{
        needPasswordChange: boolean;
        email: string;
        name: string;
        role: string;
        image: string;
        status: string;
        isDeleted: boolean;
        emailVerified: boolean;
    }
}