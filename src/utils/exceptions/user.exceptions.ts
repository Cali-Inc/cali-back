import { ConflictException } from '@nestjs/common';

type IErrors =
  | 'already-exists'
  | 'not-found'
  | 'could-not-update'
  | 'user-not-authorized';

const getErrorMessage = (error: string) => {
  switch (error) {
    case 'not-found': {
      return `User not found`;
    }
    case 'already-exists': {
      return `User already exists`;
    }
    case 'could-not-update': {
      return `User couldn't be updated.`;
    }
    case 'user-not-authorized': {
      return `User not authorized.`;
    }

    default: {
      return 'An error occurred';
    }
  }
};

export class UserExceptions extends ConflictException {
  constructor(readonly error: IErrors) {
    super(getErrorMessage(error));
    this.error = error;
  }
}
