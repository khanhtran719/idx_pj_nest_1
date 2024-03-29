import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ChatModule } from './chat/chat.module';
import { FolderModule } from './folder/folder.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { MediaModule } from './media/media.module';

export const modules = [
  AuthModule,
  HashtagModule,
  FolderModule,
  MediaModule,
  BlogModule,
  ChatModule,
];
