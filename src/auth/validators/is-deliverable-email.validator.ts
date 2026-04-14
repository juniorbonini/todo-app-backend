import { promises as dns } from 'node:dns';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDeliverableEmail', async: true })
export class IsDeliverableEmailValidator
  implements ValidatorConstraintInterface
{
  async validate(email: string) {
    if (!email || typeof email !== 'string') {
      return false;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const domain = normalizedEmail.split('@')[1];

    if (!domain || !domain.includes('.')) {
      return false;
    }

    try {
      const mxRecords = await dns.resolveMx(domain);

      if (mxRecords.length > 0) {
        return true;
      }
    } catch {
      try {
        const [ipv4Records, ipv6Records] = await Promise.allSettled([
          dns.resolve4(domain),
          dns.resolve6(domain),
        ]);

        const hasIpv4 =
          ipv4Records.status === 'fulfilled' && ipv4Records.value.length > 0;
        const hasIpv6 =
          ipv6Records.status === 'fulfilled' && ipv6Records.value.length > 0;

        return hasIpv4 || hasIpv6;
      } catch {
        return false;
      }
    }

    return false;
  }

  defaultMessage() {
    return 'O e-mail informado não pertence a um provedor válido.';
  }
}
