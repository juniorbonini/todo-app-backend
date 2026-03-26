import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';

const URI =
  'mongodb+srv://todo-app:todoappapplication@todoapp.yle10an.mongodb.net/';

@Module({
  imports: [
    MongooseModule.forRoot(URI, {
      onConnectionCreate: (connection) => {
        console.log('🚀 Servidor conetado com MongoDB com sucesso!');
        return connection;
      },
    }),
    UserModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
