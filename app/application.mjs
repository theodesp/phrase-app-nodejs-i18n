export class Application {
  constructor({ server }) {
    this.server = server;
  }

  async start() {
    await this.server.start();
  }
}
