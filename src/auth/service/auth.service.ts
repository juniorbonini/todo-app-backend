import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserResponseDTO } from '@/user/dto/user.dto';
import { UserService } from '@/user/service/user.service';

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

    return new UserResponseDTO(user);
  }
  async login(email: string, password: string): Promise<UserResponseDTO> {
    await this.validateUser(email, password);

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return new UserResponseDTO(user);
  }
}
