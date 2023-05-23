import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet security
  app.use(helmet());

  // enable cors
  app.enableCors();

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // prisma exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Setup Swagger Documentation// Create Swagger options object
  const options = new DocumentBuilder()
    .setTitle('Disbursement Service 2.0')
    .setDescription(
      'NestJS Service to handle bulk disbursement to MPESA, BANK, PAYBILLS, AIRTIME, BUNDLES',
    )
    .setVersion('1.0')
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, options);

  // Set up Swagger UI route
  SwaggerModule.setup('api/docs', app, document);

  // Create Swagger options object
  await app.listen(process.env.PORT || 3000);

  console.log(`Application Running on: ${await app.getUrl()}`);
  console.log(`Documentation on: ${await app.getUrl()}/api/docs`);
}
bootstrap();
