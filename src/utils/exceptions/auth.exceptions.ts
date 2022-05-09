import { UnauthorizedException } from '@nestjs/common';

type IErrors = 'unauthorized' | 'expired';

const getErrorMessage = (error: string) => {
  switch (error) {
    case 'unauthorized': {
      return `User unauthorized.`;
    }
    case 'expired': {
      return `Your token expired.`;
    }
    default: {
      return 'An error occurred';
    }
  }
};

export class AuthExceptions extends UnauthorizedException {
  constructor(readonly error: IErrors) {
    super(getErrorMessage(error));
    this.error = error;
  }
}
