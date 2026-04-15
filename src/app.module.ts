/* eslint-disable @typescript-eslint/no-floating-promises */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';
import { TaskModule } from './task/task.module';

const URI =
  'mongodb+srv://todo-app:todoappapplication@todoapp.yle10an.mongodb.net/';

const EMAIL_API_KEY = 're_T1cCUA1d_7mx6onfD4vNq5YsVyDh9UZVK';

console.log('A URL é?', EMAIL_API_KEY);

const resend = new Resend(EMAIL_API_KEY);

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'la.boninijunior@gmail.com',
  subject: 'Meu segundo e-mail enviado com sucesso!',
  html: '<p>Parabéns por enviar seu <strong>segundo e-mail</strong></p>',
});

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
  ],
  providers: [JwtService],
})
export class AppModule {}
