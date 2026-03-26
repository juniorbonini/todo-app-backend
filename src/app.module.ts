import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';

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
  controllers: [],
  providers: [],
})
export class AppModule {}
