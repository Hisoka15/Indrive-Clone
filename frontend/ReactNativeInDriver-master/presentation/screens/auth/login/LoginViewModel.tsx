import { AuthResponse } from "../../../../domain/models/AuthResponse";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { AuthUseCases } from "../../../../domain/useCases/auth/AuthUseCases";
import { LoginUseCase } from "../../../../domain/useCases/auth/LoginUseCase";
import { UserUseCases } from "../../../../domain/useCases/user/UserUseCases";

export class LoginViewModel {

    private authUseCases: AuthUseCases;
    private userUseCases: UserUseCases;

    constructor({authUseCases, userUseCases}: {authUseCases: AuthUseCases, userUseCases: UserUseCases}) {
        this.authUseCases = authUseCases;
        this.userUseCases = userUseCases;
    }

    async login(email: string, password: string): Promise<AuthResponse | ErrorResponse> {
        return await this.authUseCases.login.execute(email, password);
    }

    async updateNotificationToken(id: number, token: string) {
        return await this.userUseCases.updateNotificationToken.execute(id, token);
    }

}