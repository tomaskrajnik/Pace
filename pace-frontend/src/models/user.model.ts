/**
 * class User
 */
export class User {
    public uid: string;
    public email: string;
    public name: string;
    public photoUrl?: string;
    public avatarColor: string;
    public createdAt: number;
    public phoneNumber?: string;
    public emailVerified?: boolean;
    public companyName?: string;
    public jobTitle?: string;
    public projects: string[];

    /**
     * class User constructor
     * @param {any} userConfig
     */
    constructor(userConfig: any) {
        this.uid = userConfig.uid;
        this.email = userConfig.email;
        this.name = userConfig.name;
        this.photoUrl = userConfig.photoUrl;
        this.avatarColor = userConfig.avatarColor;
        this.createdAt = userConfig.createdAt;
        this.phoneNumber = userConfig.phoneNumber;
        this.emailVerified = userConfig.emailVerified;
        this.companyName = userConfig.companyName;
        this.projects = userConfig.projects;
        this.jobTitle = userConfig.jobTitle;
    }
}
