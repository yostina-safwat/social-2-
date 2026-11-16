import {ICloudProvider} from "../../../pkg/cloud/cloud.interface";
import {cloudProvider} from "../../../lib/cloud/init";
import userRepository, {UserRepository} from "../repository/user.repository";
import {AppError} from "../../../lib/error/error";
import {userNotExist} from "../errors";

class UserService {
    private readonly cloudProvider: ICloudProvider = cloudProvider;
    private readonly userRepository: UserRepository = userRepository;

    uploadProfilePicture = async (file: Express.Multer.File, userId: string): Promise<void> => {
        const user = await this.userRepository.getOne({_id: userId});
        if (!user) throw userNotExist;
        // replace the old picture if there is one
        if (user.profilePicturePath) {
            await this.cloudProvider.deleteFile(user.profilePicturePath);
        }
        const key = await this.cloudProvider.uploadFile(file, `users/${userId}`);
        await this.userRepository.update({_id: userId}, {profilePicturePath: key});
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

export default new UserService();
