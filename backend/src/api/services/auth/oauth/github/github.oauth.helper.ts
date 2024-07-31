import { JwtService } from "../../jwt/jwt.service";
import { UserRepository } from "../../user/user.repository";
import { ILoginResponse } from "../../user/ILoginResponse";
import { destructureGitHubUser } from "../../../../../utils/destructure";
import { AppError } from "../../user/AppError";
import { prisma } from "../../../../../utils/prisma"

export class GitHubAuthHelper {
    private userRepository: UserRepository;
    private jwtService: JwtService;

    constructor(userRepository: UserRepository, jwtService: JwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    async handleGitHubLogin(profile: any, accessToken: string): Promise<ILoginResponse | null> {
        const { id, email, name, image, type } = destructureGitHubUser(profile);

        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            if (existingUser.provider !== 'github') {
                throw new AppError("Email already in use with a different provider");
            }

            const token = this.jwtService.generateToken(existingUser.id);

            return {
                user: {
                    email: existingUser.email,
                    name: existingUser.name,
                    role: existingUser.role,
                    image: existingUser.image,
                },
                token: token,
            };
        }

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                image: image,
                provider: 'github',
                emailVerified: new Date(Date.now()),
                isTwoFactorEnabled: false,
            }
        })

        const account = await prisma.account.create({
            data: {
                provider: 'github',
                providerAccountId: id,
                type: type,
                access_token: accessToken,
                userId: newUser.id
            }
        })

        const token = this.jwtService.generateToken(newUser.id);

        return {
            user: {
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image,
            },
            token: token,
        };
    }
}
