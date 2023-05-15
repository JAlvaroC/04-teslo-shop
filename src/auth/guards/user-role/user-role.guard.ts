import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      // 'roles',
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) {
      throw new BadRequestException('User not found');
    }

    console.log({ validRoles }); // [ 'admin', 'super-user' ]
    console.log('UserRoleGuard');
    console.log({ userRoles: user.roles });

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.fullName} need a valida role: [${validRoles}]`,
    );
    // throw new BadRequestException('hola mundo');
    // return true; // false botara que no pudoe ntrar al recurso
  }
}
