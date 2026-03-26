import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/service/auth.service';
import { AuthController } from './auth/controller/auth.controller';

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
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
