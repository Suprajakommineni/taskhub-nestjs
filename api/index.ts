import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';
import 'mysql2';

const server = express();
let app;

export default async function handler(req, res) {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors();
    await app.init();
  }
  server(req, res);
}
