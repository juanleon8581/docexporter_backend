import express, { Router } from "express";
import compression from "compression";
import { ErrorMiddleware } from "@/middleware/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@/config/swagger";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    //* Middlewares
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    this.app.use(compression());

    //* Swagger UI
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    //* Routes
    this.app.use(this.routes);

    //* Error Middleware
    this.app.use(ErrorMiddleware.handleError);

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
      console.log(
        `Swagger UI available at http://localhost:${this.port}/api-docs`
      );
    });
  }
}
