import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seed/seeder.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // console.log(__dirname)
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:3001",
      "https://fotoalbum-server.onrender.com"
    ], //any origin allowed
    credentials: true
  });

  const seederService = app.get(SeederService);
  await seederService.seed();

  const config = new DocumentBuilder()
    .setTitle('Auth service API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Make "/" return the OpenAPI JSON document
  app.getHttpAdapter().get('/', (req, res) => {
    res.json(document);
  });

  await app.listen(process.env.PORT ?? 8888, "0.0.0.0");
}
bootstrap();
