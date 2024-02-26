import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService, UserModule, AuthModule, TaskModule } from '@modules';
import { IdentifierMiddleware, RequestLoggerMiddleware } from '@middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './environment/env.development',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    AuthModule,
    TaskModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdentifierMiddleware, RequestLoggerMiddleware).forRoutes('*');
  }
}
