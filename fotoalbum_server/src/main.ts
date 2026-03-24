import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if(process.env.CORS_ORIGINS) {
    console.log("Using custom CORS origins");
  }
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(",") ?? [
      "http://localhost:3000",
      "https://fotoalbum-frontend.onrender.com"
    ],
    credentials: true
  })
  
  const config = new DocumentBuilder()
    .setTitle('Fotoalbum Server API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Make "/" return the OpenAPI JSON document
  // app.getHttpAdapter().get('/', (req, res) => {
  //   res.json(document);
  // });

  SwaggerModule.setup("/", app, document);

  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
