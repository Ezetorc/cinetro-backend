import { INestApplication } from '@nestjs/common'

export function disableHeader (
  app: INestApplication<any>,
  header: string,
): void {
  const expressApp = app.getHttpAdapter().getInstance()

  expressApp.disable(header)
}
