import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@/user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { MailserviceModule } from './mailservice/mail.module';

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
    TaskModule,
    MailserviceModule,
  ],
  providers: [JwtService],
})
export class AppModule {}
