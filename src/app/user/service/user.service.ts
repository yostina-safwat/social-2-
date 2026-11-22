import {inject, injectable} from "tsyringe";
import {TOKENS} from "../../../lib/di/tokens";
import {ICloudProvider} from "../../../pkg/cloud/cloud.interface";
import {UserRepository} from "../repository/user.repository";
import {AppError} from "../../../lib/error/error";
import {userNotExist} from "../errors";
import {PresignedUrlDto} from "../dto/user.dto";

@injectable()
export class UserService {
    constructor(
        @inject(TOKENS.UserRepository) private readonly userRepository: UserRepository,
        @inject(TOKENS.CloudProvider) private readonly cloudProvider: ICloudProvider
    ) {
    }

    uploadProfilePicture = async (file: Express.Multer.File, userId: string): Promise<void> => {
        const user = await this.userRepository.getOne({_id: userId});
        if (!user) throw userNotExist;
        if (user.profilePicturePath) {
            await this.cloudProvider.deleteFile(user.profilePicturePath);
        }
        const key = await this.cloudProvider.uploadFile(file, `users/${userId}`);
        await this.userRepository.update({_id: userId}, {profilePicturePath: key});
    }

    generatePresignedUrl = async (dto: PresignedUrlDto, userId: string): Promise<string> => {
        const user = await this.userRepository.getOne({_id: userId});
        if (!user) throw userNotExist;
        return this.cloudProvider.generatePresignedUrl(
            {mimetype: dto.contentType, originalname: dto.fileName},
            `users/${userId}`
        );
    }

    deleteProfilePicture = async (userId: string): Promise<void> => {
        const user = await this.userRepository.getOne({_id: userId});
        if (!user?.profilePicturePath) {
            throw new AppError('Profile Pic not found', 404);
        }
        await this.cloudProvider.deleteFile(user.profilePicturePath);
        await this.userRepository.update({_id: userId}, {$unset: {profilePicturePath: 1}});
    }
}
