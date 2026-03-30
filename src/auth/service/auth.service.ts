import { UserService } from '@/user/service/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
