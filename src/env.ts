import * as z from 'zod'

import { defineEnvValidationSchema } from 'wasp/env'

export const envValidationSchema =
  z.object({
    REACT_APP_ANALYTICS_ID: z.string({
      required_error: 'REACT_APP_ANALYTICS_ID is required.',
    }),
  });

