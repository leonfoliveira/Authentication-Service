import { makeDbRefreshAuthorization } from '@/main/factories/usecases';
import { makeRefreshAuthorizationValidator } from '@/main/factories/validators';
import { ValidationProxy } from '@/main/utils';
import { RefreshAuthorizationController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeRefreshAuthorizationController = (): Controller =>
  new ValidationProxy(
    makeRefreshAuthorizationValidator(),
    new RefreshAuthorizationController(makeDbRefreshAuthorization()),
  );
