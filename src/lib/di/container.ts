import 'reflect-metadata';
import {container} from 'tsyringe';
import {TOKENS} from './tokens';
import {cloudProvider} from '../cloud/init';
import {cacheProvider} from '../cache/init';
import {mailProvider} from '../email/init';
import {notificationProvider} from '../notification/init';
import {UserRepository} from '../../app/user/repository/user.repository';
import {UserService} from '../../app/user/service/user.service';
import {UserController} from '../../app/user/controller/user.controller';
import {PostRepository} from '../../app/post/repository/post.repository';
import {PostService} from '../../app/post/service/post.service';
import {PostController} from '../../app/post/controller/post.controller';
import {CommentRepository} from '../../app/comment/repository/comment.repository';
import {CommentService} from '../../app/comment/service/comment.service';
import {CommentController} from '../../app/comment/controller/comment.controller';
import {AuthService} from '../../app/auth/service/auth.service';
import {AuthController} from '../../app/auth/controller/auth.controller';

container.registerInstance(TOKENS.CloudProvider, cloudProvider);
container.registerInstance(TOKENS.CacheProvider, cacheProvider);
container.registerInstance(TOKENS.MailProvider, mailProvider);
container.registerInstance(TOKENS.NotificationProvider, notificationProvider);

container.registerSingleton<UserRepository>(TOKENS.UserRepository, UserRepository);
container.registerSingleton<PostRepository>(TOKENS.PostRepository, PostRepository);
container.registerSingleton<CommentRepository>(TOKENS.CommentRepository, CommentRepository);

container.registerSingleton<AuthService>(TOKENS.AuthService, AuthService);
container.registerSingleton<UserService>(TOKENS.UserService, UserService);
container.registerSingleton<PostService>(TOKENS.PostService, PostService);
container.registerSingleton<CommentService>(TOKENS.CommentService, CommentService);

container.registerSingleton<AuthController>(TOKENS.AuthController, AuthController);
container.registerSingleton<UserController>(TOKENS.UserController, UserController);
container.registerSingleton<PostController>(TOKENS.PostController, PostController);
container.registerSingleton<CommentController>(TOKENS.CommentController, CommentController);

export default container;
