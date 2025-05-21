import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {
  AppAbility,
  CaslAbilityFactory,
} from '../../modules/casl/casl-ability.factory';
import { UserService } from '../../domains/user/user.service';
import { PolicyHandler } from '../../models/policy.model';
import { CHECK_POLICIES_KEY } from '../../decorators/check_policy.decorator';
import { User } from '../../domains/user/entities/user.entity';

@Injectable()
export class UpdateRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const policyHandlers =
        this.reflector.get<PolicyHandler[]>(
          CHECK_POLICIES_KEY,
          context.getHandler(),
        ) || [];

      const user = context.switchToHttp().getRequest().user;
      if (!user) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const ability = this.caslAbilityFactory.createForUser(user);

      return policyHandlers.every((handler) =>
        this.execPolicyHandler(handler, ability),
      );
    } catch (error) {
      throw new HttpException(
        error?.message || 'Forbidden',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
