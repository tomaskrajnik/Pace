export enum AuthRoutes {
    Dashboard = '/dashboard',
    UserSettings = '/user',
    Project = '/project',
    Milestone = '/milestone',
    NotFound = '/not-found',
}

export enum NonAuthRoutes {
    Signup = '/',
    Login = '/login',
    Unauthorized = '/unauthorized',
    ResetPassword = '/resetPassword',
}
